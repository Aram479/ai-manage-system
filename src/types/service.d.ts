declare namespace ApiTypes {
  type IUpload = {
    filename: string;
    originalName: string;
    size: number;
    mimeType: string;
    url: string;
    fullUrl: string;
  };
  type TEditPsd = {
    oldPassword: string;
    newPassword: string;
  };

  type TChatRoomUserList = {
    id: string;
    userId: string;
    username: string;
    avatar: string;
    status: number;
  };

  type TFriendRequestList = {
    id: string;
    userId: string;
    username: string;
    avatar: string;
    message: string;
    status: "pending" | "accepted" | "rejected";
    createdAt: string;
  };

  type TFriendList = {
    id: string;
    userId: string;
    username: string;
    avatar: string;
    isFriend?: boolean
  };

  type TUserChatList = {
    id: string;
    userId: string;
    name: string;
    avatar?: string;
    lastMessage?: string;
    lastMessageTime?: string;
    unreadCount: number;
    isFriend?: boolean;
    messages: TConversationList[];
  };

  type TConversationList = {
    id: string;
    userId: string;
    name: string;
    avatar?: string;
    content: string;
    htmlContent?: string;
    sender: "me" | "other";
    senderUserId?: string; // 发送者ID
    receiverUserId?: string; // 接收者ID
    timestamp: string;
    agent?: IAgentCategoryRole;
  };
}
