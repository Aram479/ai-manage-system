import React, { useState } from "react";
import { Input, Avatar, Flex, Button, Tooltip, Modal, Form, message } from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { ChatItem, ChatListProps } from "../types";
import styles from "./ChatList.less";
import AddFriendModal from "./AddFriendModal";

const { Search } = Input;

const ChatList: React.FC<ChatListProps> = ({
  chatList = [],
  selectedChatId,
  onSelectChat,
  onSearch,
  onAddConfirm,
  searchKeyword,
}) => {
  const [addFriendOpen, setAddFriendOpen] = useState(false);
  // 格式化时间显示
  const formatTime = (timestamp: string) => {
    const messageTime = dayjs(timestamp);
    const now = dayjs();

    if (now.isSame(messageTime, "day")) {
      return messageTime.format("HH:mm");
    } else if (now.subtract(1, "day").isSame(messageTime, "day")) {
      return "昨天";
    } else if (now.isSame(messageTime, "week")) {
      return messageTime.format("dddd");
    } else {
      return messageTime.format("MM-DD");
    }
  };

  // 截断消息内容
  const truncateMessage = (content: string, maxLength = 30) => {
    return content.length > maxLength
      ? `${content.substring(0, maxLength)}...`
      : content;
  };

  const handleAddFriend = (formValues: ChatItem) => {
    const isInclude = chatList?.find(item => formValues.id === item.id)
    if(isInclude) return message.error('已添加朋友')
    onAddConfirm?.(formValues);
    setAddFriendOpen(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.searchContainer}>
        <Flex gap={5}>
          <Search
            placeholder="搜索聊天"
            allowClear
            prefix={<SearchOutlined />}
            value={searchKeyword}
            onChange={(e) => onSearch(e.target.value)}
            className={styles.searchInput}
          />
          <Tooltip title="添加朋友">
            <Button
              icon={<PlusOutlined />}
              onClick={() => setAddFriendOpen(true)}
            />
          </Tooltip>
        </Flex>
      </div>
      <div className={styles.chatListContainer}>
        {chatList.map((chat) => {
          // 获取最后一条消息的时间
          const lastMessage = chat.messages?.[chat.messages?.length - 1];
          const lastMessageTime = lastMessage
            ? formatTime(lastMessage.timestamp)
            : "";
          const lastMessageContent = lastMessage
            ? truncateMessage(lastMessage.content)
            : "";

          return (
            <div
              key={chat.id}
              className={`${styles.chatItem} ${
                selectedChatId === chat.id ? styles.selected : ""
              }`}
              onClick={() => onSelectChat(chat.id)}
            >
              <div className={styles.avatarContainer}>
                <Avatar src={chat.avatar} alt={chat.name}>
                  {chat.name.charAt(0)}
                </Avatar>
                {chat.unreadCount > 0 && (
                  <div className={styles.unreadBadge}>{chat.unreadCount}</div>
                )}
              </div>
              <div className={styles.chatInfo}>
                <div className={styles.chatHeader}>
                  <span className={styles.chatName}>{chat.name}</span>
                  <span className={styles.messageTime}>{lastMessageTime}</span>
                </div>
                <div className={styles.lastMessage}>{lastMessageContent}</div>
              </div>
            </div>
          );
        })}
        {chatList.length === 0 && (
          <div className={styles.emptyList}>没有找到匹配的聊天</div>
        )}
      </div>
      <AddFriendModal
        open={addFriendOpen}
        onOk={handleAddFriend}
        onCancel={setAddFriendOpen}
      />
    </div>
  );
};

export default ChatList;
