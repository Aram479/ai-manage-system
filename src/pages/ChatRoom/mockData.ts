import { ChatItem } from './types';

// 生成模拟聊天数据
export const mockChatData: ChatItem[] = [
  {
    id: '1',
    name: '张三',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    lastMessage: '你好，最近怎么样？',
    lastMessageTime: '10:23',
    unreadCount: 2,
    messages: [
      {
        id: '1',
        content: '嗨，好久不见了！',
        sender: 'other',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: '2',
        content: '是啊，最近工作很忙',
        sender: 'me',
        timestamp: new Date(Date.now() - 3500000).toISOString(),
      },
      {
        id: '3',
        content: '你好，最近怎么样？',
        sender: 'other',
        timestamp: new Date(Date.now() - 3400000).toISOString(),
      },
      {
        id: '4',
        content: '我们周末一起吃个饭吧',
        sender: 'other',
        timestamp: new Date(Date.now() - 3300000).toISOString(),
      },
    ],
  },
  {
    id: '2',
    name: '李四',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    lastMessage: '项目进展顺利吗？',
    lastMessageTime: '昨天',
    unreadCount: 0,
    messages: [
      {
        id: '1',
        content: '项目进展顺利吗？',
        sender: 'other',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: '2',
        content: '还不错，我们已经完成了第一阶段',
        sender: 'me',
        timestamp: new Date(Date.now() - 86300000).toISOString(),
      },
    ],
  },
  {
    id: '3',
    name: '王五',
    avatar: 'https://randomuser.me/api/portraits/men/67.jpg',
    lastMessage: '明天的会议记得参加',
    lastMessageTime: '周三',
    unreadCount: 1,
    messages: [
      {
        id: '1',
        content: '明天的会议记得参加',
        sender: 'other',
        timestamp: new Date(Date.now() - 172800000).toISOString(),
      },
    ],
  },
  {
    id: '4',
    name: '赵六',
    avatar: 'https://randomuser.me/api/portraits/women/22.jpg',
    lastMessage: '谢谢你的帮助！',
    lastMessageTime: '上周',
    unreadCount: 0,
    messages: [
      {
        id: '1',
        content: '能帮我看一下这个问题吗？',
        sender: 'other',
        timestamp: new Date(Date.now() - 604800000).toISOString(),
      },
      {
        id: '2',
        content: '没问题，我看一下',
        sender: 'me',
        timestamp: new Date(Date.now() - 604700000).toISOString(),
      },
      {
        id: '3',
        content: '谢谢你的帮助！',
        sender: 'other',
        timestamp: new Date(Date.now() - 604600000).toISOString(),
      },
    ],
  },
];