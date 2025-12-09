import { request } from "@umijs/max";

// 搜索添加朋友列表
export const getAddFriendList = (
  body: { search: string },
  options?: { [key: string]: any }
) => {
  return request<ApiTypes.TChatRoomUserList[]>("/api/chatroom/getUserList", {
    method: "GET",
    params: body,
    ...(options || {}),
  });
};

// 发送好友请求
export const sendAddFriendApi = (
  body: TAddFriendData,
  options?: { [key: string]: any }
) => {
  return request<ApiTypes.TChatRoomUserList[]>(
    "/api/chatroom/sendFriendRequest",
    {
      method: "POST",
      data: body,
      ...(options || {}),
    }
  );
};
