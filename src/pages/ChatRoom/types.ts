// 消息类型定义
export interface Message {
  id: string;
  userId?: string;
  name: string;
  avatar?: string;
  content: string;
  htmlContent?: string;
  sender: "me" | "other";
  senderId?: string; // 发送者ID
  receiverId?: string; // 接收者ID
  timestamp: string;
  agent?: IAgentCategoryRole;
}

// 聊天项类型定义
export interface ChatItem {
  id: string;
  userId?: string;
  name: string;
  avatar?: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
  messages: Message[];
}

// 好友申请类型定义
export interface FriendRequest {
  id: string;
  userId: string;
  username: string;
  avatar?: string;
  message?: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
}

// 聊天列表组件Props
export interface ChatListProps {
  chatList?: ChatItem[];
  selectedChatId: string | null;
  onSelectChat: (chatId: string) => void;
  onSearch: (keyword: string) => void;
  onAddConfirm: (friend: ChatItem) => void;
  onRemove: (chat: ChatItem) => void;
  searchKeyword: string;
}

// 聊天对话组件Props
export interface ChatConversationProps {
  chat: ChatItem;
  onSendMessage: (data: {
    content: string;
    htmlContent?: string;
    chatId: string;
    agent?: Message["agent"];
  }) => void;
  isConnected: boolean;
}

// 侧边栏组件Props
export interface SidebarProps {
  activeTab: "chat" | "friend";
  onTabChange: (tab: "chat" | "friend") => void;
}

// 好友列表组件Props
export interface FriendListProps {
  friendRequests?: FriendRequest[];
  contacts?: ApiTypes.TFriendList[];
  onAcceptRequest?: (request: FriendRequest) => void;
  onRejectRequest?: (request: FriendRequest) => void;
  onSelectContact?: (friend: ApiTypes.TFriendList) => void;
}
