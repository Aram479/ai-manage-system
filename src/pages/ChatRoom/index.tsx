import { useState } from "react";
import { Layout } from "antd";
import ChatList from "./components/ChatList";
import ChatConversation from "./components/ChatConversation";
import { ChatItem, Message } from "./types";
import { mockChatData } from "./mockData";
import styles from "./index.less";

const { Sider, Content } = Layout;

const ChatRoom = () => {
  const [chatList, setChatList] = useState<ChatItem[]>(mockChatData);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [searchKeyword, setSearchKeyword] = useState("");

  // 获取当前选中的聊天
  const selectedChat = chatList?.find((chat) => chat.id === selectedChatId);

  // 处理选择聊天
  const handleSelectChat = (chatId: string) => {
    setSelectedChatId(chatId);
    // 更新聊天的未读状态
    setChatList((prev = []) =>
      prev.map((chat) =>
        chat.id === chatId ? { ...chat, unreadCount: 0 } : chat
      )
    );
  };

  // 处理发送消息
  const handleSendMessage = (content: string) => {
    if (!selectedChatId || !content.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: content.trim(),
      sender: "me",
      timestamp: new Date().toISOString(),
    };

    setChatList((prev = []) =>
      prev.map((chat) =>
        chat.id === selectedChatId
          ? { ...chat, messages: [...chat.messages, newMessage] }
          : chat
      )
    );
  };

  // 处理搜索
  const filteredChatList = chatList?.filter(
    (chat) =>
      chat.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      chat.messages.some((msg) =>
        msg.content.toLowerCase().includes(searchKeyword.toLowerCase())
      )
  );

  return (
    <Layout className={styles.container}>
      <Sider
        width={320}
        theme="light"
        className={styles.sider}
        breakpoint="lg"
        collapsedWidth={0}
      >
        <ChatList
          chatList={filteredChatList}
          selectedChatId={selectedChatId}
          onSelectChat={handleSelectChat}
          onSearch={setSearchKeyword}
          searchKeyword={searchKeyword}
        />
      </Sider>
      <Content className={styles.content}>
        {selectedChat ? (
          <ChatConversation
            chat={selectedChat}
            onSendMessage={handleSendMessage}
          />
        ) : (
          <div className={styles.emptyContainer}>
            <h2>选择一个聊天开始对话</h2>
          </div>
        )}
      </Content>
    </Layout>
  );
};

export default ChatRoom;
