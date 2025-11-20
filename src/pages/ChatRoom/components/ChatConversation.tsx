import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { Input, Avatar, InputRef, Button, Flex, Tag } from "antd";
import dayjs from "dayjs";
import _ from "lodash";
import { ChatConversationProps, Message } from "../types";
import useQwenXChat from "@/hooks/useQwenXChat";
import Actions, { IActionsProps } from "@/components/Actions";
import CategoryOper from "@/components/AgentOpeartion/CategoryOper";
import SettingOper from "@/components/AgentOpeartion/SettingOper";
import styles from "./ChatConversation.less";
import {
  AgentRoleProvider,
  useAgentRoleContext,
} from "@/context/AgentRoleContext";
import { CloseCircleOutlined } from "@ant-design/icons";

const { TextArea } = Input;

const ChatConversation: React.FC<ChatConversationProps> = ({
  chat,
  onSendMessage,
  isConnected,
}) => {
  const { confirmRole, updateSelectRole, updateConfirmRole } =
    useAgentRoleContext();
  const [message, setMessage] = useState("");
  const [otherMessages, setOtherMessages] = useState<Message[]>();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<InputRef>(null);
  const isAgentChat = useMemo(() => confirmRole?.title, [confirmRole?.key]);
  const actionItems: IActionsProps<TChatList[number]>["items"] = [
    {
      key: "agent",
      icon: (
        <CategoryOper
          buttonProps={{ type: "text", style: { background: "none" } }}
        />
      ),
    },
    // {
    //   key: "setting",
    //   icon: <SettingOper />,
    // },
  ];
  // 自动滚动到最新消息
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const defaultRequestConfig = useMemo(() => {
    return {
      agentRole: confirmRole,
      requestBody: {
        stream: false,
        // max_tokens: 2048,
        // temperature: 0.5, // 默认为1.0，降低它以获得更集中、简洁的回答
        // top_p: 0.9, // 调整此值也可能影响简洁性
        model: "qwen-max-latest",
        // stop: ["停止", "stop", "cancel"], // 遇到停止词时，将中断流式调用
        enable_search: true,
        // tool_choice: 'auto',
      },
      onSuccess: (messageData: TResultStream): any => {
        const content = messageData.chatContent || "";
        handleSend(content);
      },
    };
  }, [confirmRole]);

  // 通义千问
  const Ai_Qwen = useQwenXChat(defaultRequestConfig);

  // 当消息列表变化时，滚动到底部
  useEffect(() => {
    const newOtherMessages = chat.messages.filter(
      (item) => item.sender === "other"
    );
    if (newOtherMessages.length) {
      setOtherMessages((prev) => {
        // 对方发送消息则更新，否则不更新
        if (prev?.length !== newOtherMessages.length) {
          return newOtherMessages;
        }
        return otherMessages;
      });
    }
    scrollToBottom();
  }, [chat.messages, scrollToBottom]);

  // 监听对方发送消息
  useEffect(() => {
    const otherLastMessage = _.findLast(otherMessages)?.content;
    if (otherLastMessage) {
      if (isAgentChat) {
        Ai_Qwen.onRequest(otherLastMessage);
      }
    }
  }, [otherMessages]);

  useEffect(() => {
    updateConfirmRole?.();
  }, []);

  // 格式化消息时间
  const formatMessageTime = useCallback((timestamp: string) => {
    return dayjs(timestamp).format("HH:mm");
  }, []);

  // 生成日期分隔符
  const renderDateSeparator = useCallback(
    (message: any, index: number) => {
      if (!chat.messages || !Array.isArray(chat.messages)) return null;

      const currentDate = dayjs(message.timestamp).format("YYYY-MM-DD");
      const prevDate =
        index > 0 && chat.messages[index - 1]
          ? dayjs(chat.messages[index - 1].timestamp).format("YYYY-MM-DD")
          : "";

      if (currentDate !== prevDate) {
        const date = dayjs(message.timestamp);
        const now = dayjs();
        let displayDate = "";

        if (date.isSame(now, "day")) {
          displayDate = "今天";
        } else if (date.isSame(now.subtract(1, "day"), "day")) {
          displayDate = "昨天";
        } else if (date.isSame(now, "year")) {
          displayDate = date.format("MM月DD日");
        } else {
          displayDate = date.format("YYYY年MM月DD日");
        }

        return (
          <div key={`date-${index}`} className={styles.dateSeparator}>
            {displayDate}
          </div>
        );
      }
      return null;
    },
    [chat.messages]
  );

  // 处理发送消息
  const handleSend = useCallback(
    (msg?: string) => {
      const sendMessage = msg || message;
      if (sendMessage.trim() && isConnected && onSendMessage && chat?.id) {
        onSendMessage(sendMessage.trim(), chat.id);
        setMessage("");
        // 发送后自动聚焦回输入框
        messageInputRef.current?.focus();
      }
    },
    [message, isConnected, onSendMessage, chat?.id]
  );

  const handleCancelAgent = () => {
    updateSelectRole?.();
    updateConfirmRole?.();
  };

  // 处理按键事件，支持回车发送
  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      // 按下Ctrl+Enter或Cmd+Enter换行，单独Enter发送
      if (e.key === "Enter" && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  // 渲染单个消息行
  const renderMessageRow = useCallback(
    (msg: any, index: number) => {
      return (
        <React.Fragment key={msg?.id || `msg-${index}`}>
          {renderDateSeparator(msg, index)}
          <div
            className={`${styles.messageRow} ${
              msg.sender === "me" ? styles.myMessage : styles.otherMessage
            }`}
          >
            {/* 对方回答的 */}
            {msg.sender === "other" && (
              <Avatar
                src={chat.avatar}
                alt={chat.name}
                className={styles.messageAvatar}
              >
                {chat.name.charAt(0)}
              </Avatar>
            )}
            {/* 消息内容 */}
            <div
              className={`${styles.messageContent} ${
                msg.sender === "me"
                  ? styles.myMessageContent
                  : styles.otherMessageContent
              }`}
            >
              <div className={styles.messageText}>{msg.content}</div>
              <div
                className={
                  msg.sender === "me"
                    ? styles.messageTimeRight
                    : styles.messageTimeLeft
                }
              >
                {msg.timestamp && formatMessageTime(msg.timestamp)}
              </div>
            </div>
            {/* 我的头像 */}
            {msg.sender === "me" && (
              <Avatar className={styles.messageAvatar}>我</Avatar>
            )}
          </div>
        </React.Fragment>
      );
    },
    [chat, renderDateSeparator, formatMessageTime]
  );

  return (
    <div className={styles.container}>
      {/* 聊天头部 */}
      <div className={styles.header}>
        <div className={styles.headerInfo}>
          <Avatar src={chat.avatar} alt={chat.name}>
            {chat.name.charAt(0)}
          </Avatar>
          <span className={styles.headerTitle}>{chat.name}</span>
        </div>
      </div>
      {/* 消息列表 */}
      <div className={styles.messagesContainer}>
        {chat.messages &&
        Array.isArray(chat.messages) &&
        chat.messages.length > 0 ? (
          chat.messages.map((msg, index) => renderMessageRow(msg, index))
        ) : (
          <div className={styles.emptyMessage}>暂无消息，开始聊天吧！</div>
        )}
        <div ref={messagesEndRef} />
      </div>
      {/* 消息内容 */}
      <Flex className={styles.inputContainer} vertical gap={5} justify="start">
        {/* 当前选择的智能体 */}
        {confirmRole?.key && (
          <div>
            <Tag color="#8985f6" closeIcon={true} onClose={handleCancelAgent}>
              {confirmRole?.title}
            </Tag>
          </div>
        )}

        {/* 功能 */}
        <Actions className={styles.chatActionsBox} items={actionItems} />
        {/* 输入框 */}
        <Flex align="end" gap={10}>
          <TextArea
            ref={messageInputRef}
            className={styles.textArea}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="输入消息...(回车发送，Ctrl+Enter换行)"
            autoSize={{ minRows: 4 }}
          />
          <Button
            type="primary"
            disabled={!message.trim() || !isConnected}
            onClick={() => handleSend()}
          >
            发送
          </Button>
        </Flex>
      </Flex>
    </div>
  );
};

const ChatConversationProvider = (props: ChatConversationProps) => {
  return (
    <AgentRoleProvider>
      <ChatConversation {...props} />
    </AgentRoleProvider>
  );
};
export default ChatConversationProvider;
