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
  };
}
