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
  };
}

