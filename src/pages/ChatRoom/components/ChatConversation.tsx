import React, { useState, useRef, useEffect, useCallback } from "react";
import { Input, Avatar, InputRef, Button } from "antd";
import { SendOutlined } from "@ant-design/icons";
import { ChatConversationProps } from "../types";
import dayjs from "dayjs";
import styles from "./ChatConversation.less";

const { TextArea } = Input;

const ChatConversation: React.FC<ChatConversationProps> = ({
  chat,
  onSendMessage,
  isConnected
}) => {
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<InputRef>(null);

  // 自动滚动到最新消息
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // 当消息列表变化时，滚动到底部
  useEffect(() => {
    scrollToBottom();
  }, [chat.messages, scrollToBottom]);

  // 格式化消息时间
  const formatMessageTime = useCallback((timestamp: string) => {
    return dayjs(timestamp).format("HH:mm");
  }, []);

  // 生成日期分隔符
  const renderDateSeparator = useCallback((message: any, index: number) => {
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
  }, [chat.messages]);

  // 处理发送消息
  const handleSend = useCallback(() => {
    if (message.trim() && isConnected && onSendMessage && chat?.id) {
      onSendMessage(message.trim(), chat.id);
      setMessage("");
      // 发送后自动聚焦回输入框
      messageInputRef.current?.focus();
    }
  }, [message, isConnected, onSendMessage, chat?.id]);

  // 处理按键事件，支持回车发送
  const handleKeyPress = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // 按下Ctrl+Enter或Cmd+Enter换行，单独Enter发送
    if (e.key === "Enter" && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  // 渲染单个消息行
  const renderMessageRow = useCallback((msg: any, index: number) => {
    return (
      <React.Fragment key={msg?.id || `msg-${index}`}>
        {renderDateSeparator(msg, index)}
        <div
          className={`${styles.messageRow} ${msg.sender === "me" ? styles.myMessage : styles.otherMessage}`}
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
            className={`${styles.messageContent} ${msg.sender === "me" ? styles.myMessageContent : styles.otherMessageContent}`}
          >
            <div className={styles.messageText}>{msg.content}</div>
            <div className={styles.messageTime}>
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
  }, [chat, renderDateSeparator, formatMessageTime]);

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
          </span>
        </div>
      </div>
      {/* 消息列表 */}
      <div className={styles.messagesContainer}>
        {chat.messages && Array.isArray(chat.messages) && chat.messages.length > 0 ? (
          chat.messages.map((msg, index) => renderMessageRow(msg, index))
        ) : (
          <div className={styles.emptyMessage}>
            暂无消息，开始聊天吧！
          </div>
        )}
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
          disabled={!message.trim() || !isConnected}
          icon={<SendOutlined />}
          onClick={handleSend}
        />
      </div>
    </div>
  );
};

export default ChatConversation;
