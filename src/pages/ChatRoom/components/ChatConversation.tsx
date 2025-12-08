import React, { useState, useRef, useEffect, useMemo } from "react";
import { useModel, useRequest } from "@umijs/max";
import { Avatar, Button, Flex, Tag, message as AntdMessage } from "antd";
import dayjs from "dayjs";
import _ from "lodash";
import { ChatConversationProps, Message } from "../types";
import useQwenXChat, { IUseQwenXChat } from "@/hooks/useQwenXChat";
import {
  AgentRoleProvider,
  useAgentRoleContext,
} from "@/context/AgentRoleContext";
import { JSONContent } from "@tiptap/core";
import {
  splitHtmlByImagesPreserveBlocks,
  extractUniqueImageNodes,
  replaceImageSrcByTitle,
} from "@/utils";
import { uploadChatImageById } from "@/services/api/uploadApi";
import MarkDownCmp from "@/components/MarkDownCmp";
import TipTapEditor from "@/components/TipTapEditor";
import styles from "./ChatConversation.less";

const ChatConversation: React.FC<ChatConversationProps> = ({
  chat,
  onSendMessage,
  isConnected,
}) => {
  const { confirmRole, updateSelectRole, updateConfirmRole } =
    useAgentRoleContext();
  const { userInfo } = useModel("user");
  const [message, setMessage] = useState("");
  const [htmlMessage, setHtmlMessage] = useState("");
  const [jsonMessage, setJSONMessage] = useState<JSONContent>();
  const [otherMessages, setOtherMessages] = useState<Message[]>();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<IEditorRef>(null);
  const isAgentChat = useMemo(() => confirmRole?.title, [confirmRole?.key]);

  const defaultRequestConfig: IUseQwenXChat = {
    agentRole: confirmRole,
    requestBody: {
      stream: true,
      // max_tokens: 2048,
      // temperature: 0.5, // 默认为1.0，降低它以获得更集中、简洁的回答
      // top_p: 0.9, // 调整此值也可能影响简洁性
      model: "qwq-plus",
      // stop: ["停止", "stop", "cancel"], // 遇到停止词时，将中断流式调用
      enable_search: true,
      // tool_choice: 'auto',
    },
    onSuccess: (messageData, _l, _i, agentRole): any => {
      const content = messageData.chatContent || "";
      onSendMessage({
        content,
        htmlContent: content,
        chatId: chat.id,
        agent: agentRole,
      });
    },
  };

  // 通义千问
  const Ai_Qwen = useQwenXChat(defaultRequestConfig);

  const uploadChatImage = useRequest(uploadChatImageById, {
    manual: true,
  });
  // 自动滚动到最新消息
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView();
  };

  // 格式化消息时间
  const formatMessageTime = (timestamp: string) => {
    return dayjs(timestamp).format("HH:mm");
  };

  // 生成日期分隔符
  const renderDateSeparator = (message: any, index: number) => {
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
  };

  // 处理发送消息
  const handleSend = async (msg?: string) => {
    const sendMessage = (msg || message).trim();
    let sendHtmlMseeage = htmlMessage.trim();

    if (sendHtmlMseeage) {
      if (isConnected && chat?.id) {
        const imgFileList = await extractUniqueImageNodes(jsonMessage);
        // 上传输入框内的图片
        for (let item of imgFileList) {
          await uploadChatImage
            .run({
              image: item.file,
              userId: userInfo.userId,
              chatId: chat.id,
            })
            .then((res) => {
              const newHtmlMseeage = replaceImageSrcByTitle(htmlMessage, {
                name: item.file.name,
                url: res.fullUrl,
              });
              sendHtmlMseeage = newHtmlMseeage;
              URL.revokeObjectURL(item.src);
            });
        }
        const splitMessage = splitHtmlByImagesPreserveBlocks(sendHtmlMseeage);
        splitMessage.forEach((message) => {
          onSendMessage?.({
            htmlContent: message as string,
            content: sendMessage,
            chatId: chat.id,
          });
        });

        setMessage("");
        setHtmlMessage("");
        setJSONMessage({});
        // 发送后自动聚焦回输入框
        editorRef.current?.editor?.commands.focus();
        editorRef.current?.editor?.commands.clearContent();
        // 延迟滚动到底部
        setTimeout(() => {
          scrollToBottom();
        }, 0);
      }
    } else {
      AntdMessage.warning({
        key: "noContent",
        content: "消息不能为空",
        duration: 3,
      });
      setMessage("");
      setHtmlMessage(" ");
      setJSONMessage({});
    }
  };

  const handleResetAgent = () => {
    updateSelectRole?.();
    updateConfirmRole?.();
  };

  // 处理按键事件，支持回车发送
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // 按下Ctrl+Enter或Cmd+Enter换行，单独Enter发送
    if (e.key === "Enter" && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // 渲染单个消息行
  const renderMessageRow = (msg: Message, index: number) => {
    return (
      <React.Fragment key={`${msg?.id}-${index}` || `msg-${index}`}>
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
            {/* AI标识 */}
            {msg.agent?.title && (
              <div
                style={{
                  marginBottom: 2,
                  textAlign: msg.sender === "me" ? "right" : "left",
                }}
              >
                <Tag color="#8985f6">
                  {msg.sender === "me" ? msg.agent?.title : "AI助手"}
                </Tag>
              </div>
            )}
            {msg.content?.trim() && (
              <>
                {~msg.htmlContent!.indexOf("img") &&
                !~msg.htmlContent!.indexOf("emoji") ? (
                  <div className={styles.messageImg}>
                    <MarkDownCmp
                      theme="onDark"
                      content={String(msg.htmlContent)}
                    />
                  </div>
                ) : (
                  <div className={styles.messageText}>
                    <MarkDownCmp
                      theme="onDark"
                      content={String(msg.htmlContent)}
                      copyCode={false}
                    />
                  </div>
                )}
              </>
            )}

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
            <Avatar className={styles.messageAvatar} src={userInfo?.avatar}>
              我
            </Avatar>
          )}
        </div>
      </React.Fragment>
    );
  };

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
  }, [chat.messages]);

  // 监听对方发送消息
  useEffect(() => {
    const otherLast = _.findLast(otherMessages);
    const otherLastMessage = otherLast?.content;
    if (otherLastMessage) {
      if (isAgentChat) {
        Ai_Qwen.onCancel();
        Ai_Qwen.onRequest(otherLastMessage);
      }
    }
  }, [otherMessages]);

  useEffect(() => {
    handleResetAgent?.();
    scrollToBottom();
  }, []);

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
            <Tag color="#8985f6" closeIcon={true} onClose={handleResetAgent}>
              {confirmRole?.title}
            </Tag>
          </div>
        )}

        {/* 输入框 */}
        <Flex vertical align="end" gap={10} onKeyDown={handleKeyPress}>
          <TipTapEditor
            ref={editorRef}
            value={htmlMessage}
            maxLength={500}
            showMaxLength={false}
            onChange={({ text, html, json }) => {
              setMessage(text);
              setHtmlMessage(html);
              setJSONMessage(json);
            }}
            payload={{ userId: userInfo?.userId, chatId: chat.id }}
          />
          <Button
            type="primary"
            disabled={!htmlMessage.trim() || !isConnected}
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
