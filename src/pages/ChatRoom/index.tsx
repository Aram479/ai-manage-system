import { useState, useCallback, useEffect, useRef } from "react";
import { Button, Flex, Layout, message, Tooltip } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import { history, useModel, useRequest } from "@umijs/max";
import {
  ChatConversationProps,
  ChatItem,
  Message,
  FriendRequest,
} from "./types";
import { useSocket } from "@/hooks/useSocket";
import { useNotification } from "@/hooks/useNotification";
import {
  addUserChatByChatListApi,
  friendAgreeOrRefuseApi,
  getConversationListApi,
  getFriendListApi,
  getFriendReuestListApi,
  getUserChatListApi,
  removeUserChatByChatListApi,
} from "@/services/api/chatRoomApi";
import localCache from "@/utils/cache";
import ChatList from "./components/ChatList";
import ChatConversation, {
  IChatConversationRef,
} from "./components/ChatConversation";
import Sidebar from "./components/Sidebar";
import FriendList from "./components/FriendList";
import UserAvatarDetail from "./components/UserAvatarDetail";
import _ from "lodash";
import styles from "./index.less";

const { Sider, Content } = Layout;

const ChatRoom = () => {
  const { notify } = useNotification();
  const { userInfo } = useModel("user");
  const conversationRef = useRef<IChatConversationRef>(null);
  const [chatList, setChatList] = useState<ChatItem[]>(
    localCache.getItem("chatList") || []
  );
  const [selectedChat, setSelectedChat] = useState<ChatItem>();
  const [searchKeyword, setSearchKeyword] = useState("");
  // 侧边栏激活标签
  const [activeTab, setActiveTab] = useState<"chat" | "friend">("chat");
  // 好友列表数据
  const [friendRequests, setFriendRequests] = useState<
    ApiTypes.TFriendRequestList[]
  >([]);
  const [friends, setFriends] = useState<ApiTypes.TFriendList[]>([]);

  const addUserChatByChatListReq = useRequest(addUserChatByChatListApi, {
    manual: true,
    onSuccess: () => {
      getUserChatListReq.run();
    },
  });

  const removeUserChatByChatListReq = useRequest(removeUserChatByChatListApi, {
    manual: true,
    onSuccess: () => {
      getUserChatListReq.run();
    },
  });

  const getUserChatListReq = useRequest(getUserChatListApi, {
    manual: true,
    onSuccess: (res) => {
      setChatList(res);
    },
  });

  const getFriendReuestListReq = useRequest(getFriendReuestListApi, {
    manual: true,
    onSuccess: (res) => {
      setFriendRequests(res);
    },
  });

  const getFriendLisReq = useRequest(getFriendListApi, {
    manual: true,
    onSuccess: (res) => {
      setFriends(res);
    },
  });

  const friendAgreeOrRefuseReq = useRequest(
    (request: { id: string; action: "accept" | "reject" }) => {
      const reqData = {
        requestId: request.id,
        action: request.action,
      };
      return friendAgreeOrRefuseApi(reqData);
    },
    {
      manual: true,
      onSuccess: () => {
        message.success(`已处理申请`);
        getFriendReuestListReq.run();
        getFriendLisReq.run();
      },
    }
  );

  const handleAcceptRequest = (request: FriendRequest) => {
    friendAgreeOrRefuseReq.run({ id: request.id, action: "accept" });
  };

  const handleRejectRequest = (request: FriendRequest) => {
    friendAgreeOrRefuseReq.run({ id: request.id, action: "reject" });
  };

  // 处理选择好友
  const handleSelectContact = (friend: (typeof friends)[number]) => {
    addUserChatByChatListReq.run({ friendUserId: friend.userId });
    setSelectedChat({
      id: friend.id,
      avatar: friend.avatar,
      lastMessage: "",
      lastMessageTime: "",
      name: friend.username,
      userId: friend.userId,
      messages: [],
      unreadCount: 0,
    });
    // 切换到聊天标签
    setActiveTab("chat");
  };
  // WebSocket连接管理
  const { isConnected, on, emit, reconnect } = useSocket(
    process.env.SOCKET_BASE_URL || "/",
    {
      user: userInfo,
      autoConnect: true,
      connectionOptions: {
        // 可选：添加认证、路径等
        // auth: { token: 'your-jwt' },
        // path: '/socket.io',
      },
    }
  );

  // 处理选择聊天
  const handleSelectChat = (chatItem: ChatItem) => {
    const chatIndex = chatList.findIndex(
      (item) => item.userId === chatItem.userId
    );
    const updateItem = {
      ...chatItem,
      unreadCount: 0,
    };
    chatList[chatIndex] = updateItem;
    setChatList([...chatList]);
    setSelectedChat({
      ...chatItem,
      unreadCount: 0,
    });
  };

  // 处理接收到的新消息
  const handleReceiveMessage = (message: Message) => {
    if (message.receiverUserId !== userInfo.userId) return;
    const { senderUserId } = message;
    // 创建接收到的消息
    const receivedMessage: Message = {
      ...message,
      sender: "other", // 标记为对方发送的
    };
    // 浏览器通知
    // notify(message);
    const currentChatIndex = chatList.findIndex(
      (item) => item.userId === senderUserId
    );
    const currentChatItem = chatList[currentChatIndex];
    if (currentChatIndex >= 0) {
      const updateChat = {
        ...currentChatItem,
        messages: [receivedMessage],
        lastMessage: receivedMessage.content,
        lastMessageTime: new Date().toISOString(),
        unreadCount:
          currentChatItem.userId === selectedChat?.userId
            ? currentChatItem.unreadCount
            : currentChatItem.unreadCount + 1,
        name: message.name,
        avatar: message.avatar,
      };
      chatList[currentChatIndex] = updateChat;
      setChatList([...chatList]);
    } else {
      // 创建新聊天 (实际应用中应该从服务器获取用户信息)
      const newChat: ChatItem = {
        id: senderUserId || "",
        userId: message.userId,
        name: message.name,
        avatar: message.avatar,
        lastMessage: receivedMessage.content,
        lastMessageTime: new Date().toISOString(),
        unreadCount: 1,
        messages: [receivedMessage],
      };
      setChatList([newChat, ...chatList]);
    }
    if (selectedChat?.userId === senderUserId) {
      conversationRef.current?.updateConversation(receivedMessage);
    }
  };

  // 处理发送消息
  const handleSendMessage: ChatConversationProps["onSendMessage"] = (data) => {
    const { content, htmlContent, userId, agent } = data;
    if (!htmlContent || !userId || !isConnected) return;

    const now = new Date();
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      userId: userInfo.userId,
      name: userInfo.username,
      avatar: userInfo.avatar ?? userInfo.username.charAt(0),
      content: content,
      htmlContent: htmlContent,
      sender: "me",
      timestamp: now.toISOString(),
      senderUserId: userInfo.userId,
      receiverUserId: userId,
      agent,
    };
    // 通过WebSocket发送消息
    emit("send_message", newMessage);
    const currentChatIndex = chatList.findIndex(
      (item) => item.userId === selectedChat?.userId
    );
    const newSelectedChat = {
      ...selectedChat!,
      messages: [newMessage],
      lastMessage: newMessage.content,
      lastMessageTime: now.toISOString(),
    };
    if (currentChatIndex >= 0) {
      chatList[currentChatIndex] = { ...newSelectedChat };
    }
    setChatList(chatList);
    setSelectedChat({ ...newSelectedChat });
    conversationRef.current?.updateConversation(newMessage);
  };

  // 添加朋友
  const handleAddFriend = (formValues: ChatItem) => {
    const newChatList = _.uniqBy([...chatList, formValues], "id");

    setChatList({ ...newChatList });
  };

  // 删除朋友
  const handleRemoveFriend = (chat: ChatItem) => {
    removeUserChatByChatListReq.run({ sessionId: chat.id });
    // // 删除对应item项
    // const newChatList = _.reject(chatList, { id: chat.id });
    // setChatList([...newChatList]);
  };
  // 处理搜索
  const filteredChatList = chatList?.filter(
    (chat) =>
      chat.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      chat.messages.some((msg) =>
        msg.content.toLowerCase().includes(searchKeyword.toLowerCase())
      )
  );

  // 模拟数据，实际应用中应从接口获取
  useEffect(() => {
    getUserChatListReq.run();
    getFriendReuestListReq.run();
    getFriendLisReq.run();
  }, []);

  // 监听来自其他用户的消息
  useEffect(() => {
    const unsubscribe = on("receive_message", handleReceiveMessage);
    return unsubscribe;
  }, [on, handleReceiveMessage]);

  // 好友请求socket
  useEffect(() => {
    const unsubscribe = on("friend_request_notification", (notification) => {
      const { fromUser } = notification;
      getFriendReuestListReq.run();
      // 显示通知
      message.info(`您收到了来自${fromUser.username}的好友请求`);
    });

    return unsubscribe;
  }, [on]);

  useEffect(() => {
    // 好友接受socket
    const unsubscribe = on("friend_request_accepted_notification", () => {
      getFriendLisReq.run();
    });
    return unsubscribe;
  }, [on]);

  return (
    <div className={styles.container}>
      <Layout className={styles.layout}>
        {/* 左侧导航侧边栏 */}
        <Sider
          width={80}
          theme="light"
          className={styles.leftSider}
          collapsible={false}
        >
          <Flex
            vertical
            align="center"
            justify="center"
            style={{ height: "100%" }}
          >
            <Flex flex={1}>
              <UserAvatarDetail />
            </Flex>
            {/* 聊天、好友 */}
            <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
            <Flex vertical align="center" justify="end" style={{ flexGrow: 1 }}>
              <Tooltip title="返回首页">
                <Button
                  type="text"
                  icon={<HomeOutlined />}
                  onClick={() => {
                    history.push("/");
                  }}
                />
              </Tooltip>
            </Flex>
          </Flex>
        </Sider>
        {/* 中间聊天/好友列表 */}
        <Sider
          width={250}
          theme="light"
          className={styles.middleSider}
          collapsible={false}
        >
          <Flex vertical>
            <div style={{ overflowY: "auto", flex: 1 }}>
              {activeTab === "chat" ? (
                <ChatList
                  chatList={filteredChatList}
                  searchKeyword={searchKeyword}
                  selectedChatId={selectedChat?.userId || ""}
                  onSelectChat={handleSelectChat}
                  onSearch={setSearchKeyword}
                  onAddConfirm={handleAddFriend}
                  onRemove={handleRemoveFriend}
                />
              ) : (
                <FriendList
                  friendRequests={friendRequests}
                  contacts={friends}
                  onAcceptRequest={handleAcceptRequest}
                  onRejectRequest={handleRejectRequest}
                  onSelectContact={handleSelectContact}
                />
              )}
            </div>
            {activeTab === "chat" && (
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

        {/* 右侧聊天内容 */}
        <Content className={styles.content}>
          {selectedChat ? (
            <ChatConversation
              ref={conversationRef}
              chat={selectedChat}
              onSendMessage={handleSendMessage}
              isConnected={isConnected}
            />
          ) : (
            <div className={styles.emptyContainer}>
              {activeTab === "chat" ? (
                <h2>选择一个聊天开始对话</h2>
              ) : (
                <h2>选择一个好友开始聊天</h2>
              )}
            </div>
          )}
        </Content>
      </Layout>
    </div>
  );
};

export default ChatRoom;
