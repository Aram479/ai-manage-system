import React, { useState } from "react";
import { Input, Avatar, Flex, Button, Tooltip, message, Dropdown } from "antd";
import { useModel } from "@umijs/max";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { ChatItem, ChatListProps, Message } from "../types";
import dayjs from "dayjs";
import AddFriendModal from "./AddFriendModal";
import styles from "./ChatList.less";
import MarkDownCmp from "@/components/MarkDownCmp";

const { Search } = Input;

const ChatList: React.FC<ChatListProps> = ({
  chatList = [],
  selectedChatId,
  onSelectChat,
  onSearch,
  onAddConfirm,
  onRemove,
  searchKeyword,
}) => {
  const { userInfo } = useModel("user");
  const [addFriendOpen, setAddFriendOpen] = useState(false);
  const chatActionItems = [
    {
      key: "delete",
      label: "删除",
      danger: true,
      onClick: (info: any, chat: ChatItem) => {
        onRemove?.(chat);
      },
    },
  ];
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
  const truncateMessage = (message: Message) => {
    const htmlMessageContent = message.htmlContent;
    const isImg = htmlMessageContent && ~htmlMessageContent.indexOf("img");
    const isEmoji = htmlMessageContent && ~htmlMessageContent.indexOf("emoji");
    if (isImg && !isEmoji) {
      return `[图片]`;
    } else {
      return htmlMessageContent?.replace(/(<p[^>]*>.*?)(<br\s*\/?>.*)/gi, '$1...');
    }
  };

  const handleAddFriend = (formValues: ChatItem) => {
    if (formValues.id === userInfo.userId) {
      return message.error("不允许添加自己为好友");
    }
    const isInclude = chatList?.find((item) => formValues.id === item.id);
    if (isInclude) return message.error("已添加朋友");
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
            ? truncateMessage(lastMessage)
            : "";

          return (
            <Dropdown
              key={chat.id}
              menu={{
                items: chatActionItems.map((item) => ({
                  ...item,
                  onClick: (info) => item.onClick(info, chat),
                })),
              }}
              trigger={["contextMenu"]}
              destroyPopupOnHide
            >
              <div
                className={`${styles.chatItem} ${
                  selectedChatId === chat.id ? styles.selected : ""
                }`}
                onClick={() => onSelectChat(chat.id)}
              >
                <div className={styles.avatarContainer}>
                  <Avatar
                    shape="square"
                    size={40}
                    src={chat.avatar}
                    alt={chat.name}
                  >
                    {chat.name.charAt(0)}
                  </Avatar>
                  {chat.unreadCount > 0 && (
                    <div className={styles.unreadBadge}>{chat.unreadCount}</div>
                  )}
                </div>
                <div className={styles.chatInfo}>
                  <div className={styles.chatHeader}>
                    <span className={styles.chatName}>{chat.name}</span>
                    <span className={styles.messageTime}>
                      {lastMessageTime}
                    </span>
                  </div>
                  <div className={`${styles.lastMessage} singeLine`}>
                    <MarkDownCmp
                      className={styles.lastMarkDownMessage}
                      content={lastMessageContent || ""}
                    />
                  </div>
                </div>
              </div>
            </Dropdown>
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
