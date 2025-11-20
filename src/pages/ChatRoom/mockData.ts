import { ChatItem } from "./types";

const otherId = `user_${window.location.port === "6789" ? "6790" : "6789"}`;
const avatarNo = window.location.port === "6789" ? 32 : 33
// 生成模拟聊天数据
export const mockChatData: ChatItem[] = [
  {
    id: otherId,
    name: otherId,
    avatar: `https://randomuser.me/api/portraits/men/${avatarNo}.jpg`,
    lastMessage: "你好，最近怎么样？",
    lastMessageTime: "10:23",
    unreadCount: 0,
    messages: [],
  },
];
