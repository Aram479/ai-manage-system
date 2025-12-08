import { useState, useCallback, useEffect } from "react";
import { Button, Flex, Layout } from "antd";
import { useModel } from "@umijs/max";
import { ChatConversationProps, ChatItem, Message } from "./types";
import { useSocket } from "@/hooks/useSocket";
import { useNotification } from "@/hooks/useNotification";
import ChatList from "./components/ChatList";
import ChatConversation from "./components/ChatConversation";

import _ from "lodash";
import styles from "./index.less";
import localCache from "@/utils/cache";

const { Sider, Content } = Layout;

const ChatRoom = () => {
  const { notify } = useNotification();

  const { userInfo } = useModel("user");
  // 当前用户ID (实际应用中应从认证系统获取)
  const [chatList, setChatList] = useState<ChatItem[]>(
    localCache.getItem("chatList") || []
  );
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isCollapse, setIsCollapse] = useState(false);
  // WebSocket连接管理
  const { isConnected, on, emit, reconnect } = useSocket(
    process.env.SOCKET_BASE_URL || "/",
    {
      autoConnect: true,
      connectionOptions: {
        // 可选：添加认证、路径等
        // auth: { token: 'your-jwt' },
        // path: '/socket.io',
      },
    }
  );

  // 获取当前选中的聊天
  const selectedChat = chatList?.find((chat) => chat.id === selectedChatId);

  // 处理接收到的新消息
  const handleReceiveMessage = useCallback(
    (message: Message) => {
      if (message.receiverId !== userInfo.userId) return;
      // 找到对应的聊天项
      const targetChatId = message.senderId || "unknown";

      // 创建接收到的消息
      const receivedMessage: Message = {
        ...message,
        sender: "other", // 标记为对方发送的
      };
      // 浏览器通知
      notify(message);
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
            name: message.name,
            avatar: message.avatar,
          };
          return updatedChats;
        } else {
          // 创建新聊天 (实际应用中应该从服务器获取用户信息)
          const newChat: ChatItem = {
            id: targetChatId,
            name: message.name,
            avatar: message.avatar,
            lastMessage: receivedMessage.content,
            lastMessageTime: new Date().toISOString(),
            unreadCount: 1,
            messages: [receivedMessage],
          };
          return [newChat, ...prev];
        }
      });
    },
    [userInfo.userId, selectedChatId]
  );

  // useTitleFlash(hasNotification, "你有未读消息");
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
      const { content, htmlContent, chatId, agent } = data;
      if (!htmlContent || !chatId || !isConnected) return;

      const now = new Date();
      const newMessage: Message = {
        id: `msg-${Date.now()}`,
        name: userInfo.username,
        avatar: userInfo.avatar ?? userInfo.username.charAt(0),
        content: content,
        htmlContent: htmlContent,
        sender: "me",
        timestamp: now.toISOString(),
        senderId: userInfo.userId,
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
    [isConnected, userInfo, emit]
  );

  // 添加朋友
  const handleAddFriend = (formValues: ChatItem) => {
    const newChatList = _.uniqBy([...chatList, formValues], "id");

    setChatList(newChatList);
  };

  // 删除朋友
  const handleRemoveFriend = (chat: ChatItem) => {
    // 删除对应item项
    const newChatList = _.reject(chatList, { id: chat.id });
    setChatList(newChatList);
  };
  // 处理搜索
  const filteredChatList = chatList?.filter(
    (chat) =>
      chat.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      chat.messages.some((msg) =>
        msg.content.toLowerCase().includes(searchKeyword.toLowerCase())
      )
  );

  useEffect(() => {
    localCache.setItem("chatList", chatList);
  }, [chatList]);

  return (
    <div className={styles.container}>
      <Layout className={styles.layout}>
        <Sider
          width={250}
          theme="light"
          className={styles.sider}
          breakpoint="lg"
          collapsedWidth={0}
          onCollapse={(collapse) => setIsCollapse(collapse)}
        >
          <Flex vertical>
            <div style={{ overflowY: "auto" }}>
              <ChatList
                chatList={filteredChatList}
                searchKeyword={searchKeyword}
                selectedChatId={selectedChatId}
                onSelectChat={handleSelectChat}
                onSearch={setSearchKeyword}
                onAddConfirm={handleAddFriend}
                onRemove={handleRemoveFriend}
              />
            </div>
            {!isCollapse && (
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
            )}
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
    </div>
  );
};

export default ChatRoom;
