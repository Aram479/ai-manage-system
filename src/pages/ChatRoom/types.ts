// 消息类型定义
export interface Message {
  id: string;
  content: string;
  sender: 'me' | 'other';
  timestamp: string;
}

// 聊天项类型定义
export interface ChatItem {
  id: string;
  name: string;
  avatar?: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
  messages: Message[];
}

// 聊天列表组件Props
export interface ChatListProps {
  chatList?: ChatItem[];
  selectedChatId: string | null;
  onSelectChat: (chatId: string) => void;
  onSearch: (keyword: string) => void;
  searchKeyword: string;
}

// 聊天对话组件Props
export interface ChatConversationProps {
  chat: ChatItem;
  onSendMessage: (content: string) => void;
}