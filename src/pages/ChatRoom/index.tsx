import { useState, useCallback, useEffect, useMemo } from "react";
import { Button, Flex, Layout } from "antd";
import { ChatConversationProps, ChatItem, Message } from "./types";
import { mockChatData } from "./mockData";
import { useSocket } from "@/hooks/useSocket";
import ChatList from "./components/ChatList";
import ChatConversation from "./components/ChatConversation";
import styles from "./index.less";

const { Sider, Content } = Layout;

const ChatRoom = () => {
  // 当前用户ID (实际应用中应从认证系统获取)
  const currentUserId = `user_${window.location.port}`;
  const [chatList, setChatList] = useState<ChatItem[]>(mockChatData);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [searchKeyword, setSearchKeyword] = useState("");

  // WebSocket连接管理
  const { isConnected, on, emit, reconnect } = useSocket("/", {
    autoConnect: true,
    connectionOptions: {
      // 可选：添加认证、路径等
      // auth: { token: 'your-jwt' },
      // path: '/socket.io',
    },
  });

  // 获取当前选中的聊天
  const selectedChat = chatList?.find((chat) => chat.id === selectedChatId);

  // 处理接收到的新消息
  const handleReceiveMessage = useCallback(
    (message: Message) => {
      if (message.receiverId !== currentUserId) return;
      // 找到对应的聊天项
      const targetChatId = message.senderId || "unknown";

      // 创建接收到的消息
      const receivedMessage: Message = {
        ...message,
        sender: "other", // 标记为对方发送的
      };

      setChatList((prev = []) => {
        // 检查是否已存在该聊天
        const existingChatIndex = prev.findIndex(
          (chat) => chat.id === targetChatId
        );

        if (existingChatIndex >= 0) {
          // 更新现有聊天
          const updatedChats = [...prev];
          updatedChats[existingChatIndex] = {
            ...updatedChats[existingChatIndex],
            messages: [
              ...updatedChats[existingChatIndex].messages,
              receivedMessage,
            ],
            lastMessage: receivedMessage.content,
            lastMessageTime: new Date().toISOString(),
            // 如果不是当前选中的聊天，则增加未读数
            unreadCount:
              updatedChats[existingChatIndex].id === selectedChatId
                ? updatedChats[existingChatIndex].unreadCount
                : updatedChats[existingChatIndex].unreadCount + 1,
          };
          return updatedChats;
        } else {
          // 创建新聊天 (实际应用中应该从服务器获取用户信息)
          const newChat: ChatItem = {
            id: targetChatId,
            name: `用户${targetChatId}`,
            avatar: `https://randomuser.me/api/portraits/${
              Math.random() > 0.5 ? "men" : "women"
            }/${Math.floor(Math.random() * 100)}.jpg`,
            lastMessage: receivedMessage.content,
            lastMessageTime: new Date().toISOString(),
            unreadCount: 1,
            messages: [receivedMessage],
          };
          return [newChat, ...prev];
        }
      });
    },
    [currentUserId, selectedChatId]
  );

  // 监听来自其他用户的消息
  useEffect(() => {
    const unsubscribe = on("receive_message", handleReceiveMessage);
    return unsubscribe;
  }, [on, handleReceiveMessage]);

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
  const handleSendMessage = useCallback<ChatConversationProps["onSendMessage"]>(
    (data) => {
      const { content, chatId, agent } = data;
      if (!content.trim() || !chatId || !isConnected) return;

      const now = new Date();
      const newMessage: Message = {
        id: `msg-${Date.now()}`,
        content: content.trim(),
        sender: "me",
        timestamp: now.toISOString(),
        senderId: currentUserId,
        receiverId: chatId,
        agent,
      };

      // 通过WebSocket发送消息
      emit("send_message", newMessage);

      // 更新本地状态
      setChatList((prev = []) =>
        prev.map((chat) => {
          if (chat.id === chatId) {
            return {
              ...chat,
              messages: [...chat.messages, newMessage],
              lastMessage: newMessage.content,
              lastMessageTime: now.toISOString(),
            };
          }
          return chat;
        })
      );
    },
    [isConnected, currentUserId, emit]
  );

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
        width={250}
        theme="light"
        className={styles.sider}
        breakpoint="lg"
        collapsedWidth={0}
      >
        <Flex vertical>
          <div style={{ overflowY: "auto" }}>
            <ChatList
              chatList={filteredChatList}
              selectedChatId={selectedChatId}
              onSelectChat={handleSelectChat}
              onSearch={setSearchKeyword}
              searchKeyword={searchKeyword}
            />
          </div>
          <div className={styles.connectionStatus}>
            <Flex
              align="center"
              justify="space-between"
              style={{ width: "100%" }}
            >
              <div>WebSocket状态:</div>
              <Flex vertical gap={2}>
                <div>{isConnected ? "🟢 已连接" : "🔴 未连接"}</div>
                {!isConnected && (
                  <Button type="primary" size="small" onClick={reconnect}>
                    重新连接
                  </Button>
                )}
              </Flex>
            </Flex>
          </div>
        </Flex>
      </Sider>
      <Content className={styles.content}>
        {selectedChat ? (
          <ChatConversation
            chat={selectedChat}
            onSendMessage={handleSendMessage}
            isConnected={isConnected}
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
