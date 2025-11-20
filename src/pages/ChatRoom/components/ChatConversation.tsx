import React, { useState, useRef, useEffect } from "react";
import { Input, Avatar, InputRef, Button } from "antd";
import { SendOutlined } from "@ant-design/icons";
import { useSocket } from "@/hooks/useSocket";
import { ChatConversationProps } from "../types";
import dayjs from "dayjs";
import styles from "./ChatConversation.less";

const { TextArea } = Input;

const ChatConversation: React.FC<ChatConversationProps> = ({
  chat,
  onSendMessage,
}) => {
  const { isConnected, on, emit, reconnect } = useSocket("/", {
    autoConnect: true,
    connectionOptions: {
      // 可选：添加认证、路径等
      // auth: { token: 'your-jwt' },
      // path: '/socket.io',
    },
  });
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<InputRef>(null);

  // 自动滚动到最新消息
  const scrollToBottom = () => {
    // scrollIntoView({ behavior: 'smooth' }); 缓入
    messagesEndRef.current?.scrollIntoView();
  };

  // 当消息列表变化时，滚动到底部
  useEffect(() => {
    scrollToBottom();
  }, [chat.messages, scrollToBottom]);

  // 监听服务器广播的消息
  useEffect(() => {
    const unsubscribe = on("message", (msg: string) => {
      // onSendMessage(msg);
    });

    return () => {
      unsubscribe(); // 组件卸载时取消监听
    };
  }, [on]);

  // 处理发送消息
  const handleSend = () => {
    if (message.trim() && isConnected) {
      emit("message", message);
      onSendMessage(message);
      setMessage("");
      // 发送后自动聚焦回输入框
      messageInputRef.current?.focus();
    }
  };

  // 处理按键事件，支持回车发送
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // 按下Ctrl+Enter或Cmd+Enter换行，单独Enter发送
    if (e.key === "Enter" && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // 格式化消息时间
  const formatMessageTime = (timestamp: string) => {
    return dayjs(timestamp).format("HH:mm");
  };

  // 生成日期分隔符
  const renderDateSeparator = (message: any, index: number) => {
    const currentDate = dayjs(message.timestamp).format("YYYY-MM-DD");
    const prevDate =
      index > 0
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

  return (
    <div className={styles.container}>
      {/* 聊天头部 */}
      <div className={styles.header}>
        <div className={styles.headerInfo}>
          <Avatar src={chat.avatar} alt={chat.name}>
            {chat.name.charAt(0)}
          </Avatar>
          <span className={styles.headerTitle}>
            {chat.name}
            <p>状态: {isConnected ? "🟢 已连接" : "🔴 未连接"}</p>
            {!isConnected && (
              <button onClick={reconnect} style={{ marginBottom: "10px" }}>
                重新连接
              </button>
            )}
          </span>
        </div>
      </div>
      {/* 消息列表 */}
      <div className={styles.messagesContainer}>
        {chat.messages.map((msg, index) => (
          <React.Fragment key={msg.id}>
            {renderDateSeparator(msg, index)}
            <div
              className={`${styles.messageRow} ${
                msg.sender === "me" ? styles.myMessage : styles.otherMessage
              }`}
            >
              {msg.sender === "other" && (
                <Avatar
                  src={chat.avatar}
                  alt={chat.name}
                  className={styles.messageAvatar}
                >
                  {chat.name.charAt(0)}
                </Avatar>
              )}
              <div
                className={`${styles.messageContent} ${
                  msg.sender === "me"
                    ? styles.myMessageContent
                    : styles.otherMessageContent
                }`}
              >
                <div className={styles.messageText}>{msg.content}</div>
                <div className={styles.messageTime}>
                  {formatMessageTime(msg.timestamp)}
                </div>
              </div>
              {msg.sender === "me" && (
                <Avatar className={styles.messageAvatar}>我</Avatar>
              )}
            </div>
          </React.Fragment>
        ))}
        <div ref={messagesEndRef} />
      </div>
      {/* 消息输入框 */}
      <div className={styles.inputContainer}>
        <TextArea
          ref={messageInputRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="输入消息...(回车发送，Ctrl+Enter换行)"
          autoSize={{ minRows: 4 }}
          className={styles.textArea}
        />
        <Button
          type="primary"
          shape="circle"
          disabled={!message.trim()}
          icon={<SendOutlined />}
          onClick={handleSend}
        />
      </div>
    </div>
  );
};

export default ChatConversation;
