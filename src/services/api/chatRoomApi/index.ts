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

// 获取好友申请列表
export const getFriendReuestListApi = (options?: { [key: string]: any }) => {
  return request<ApiTypes.TFriendRequestList[]>(
    "/api/chatroom/getFriendRequestList",
    {
      method: "GET",
      ...(options || {}),
    }
  );
};

// 获取好友(联系人)列表
export const getFriendListApi = (options?: { [key: string]: any }) => {
  return request<ApiTypes.TFriendList[]>("/api/chatroom/getFriendList", {
    method: "GET",
    ...(options || {}),
  });
};

// 接收/拒绝好友请求
export const friendAgreeOrRefuseApi = (
  body: any,
  options?: { [key: string]: any }
) => {
  return request("/api/chatroom/handleFriendRequest", {
    method: "POST",
    data: body,
    ...(options || {}),
  });
};

// 获取用户聊天列表
export const getUserChatListApi = (options?: { [key: string]: any }) => {
  return request<ApiTypes.TUserChatList[]>("/api/chatroom/userChatList", {
    method: "GET",
    ...(options || {}),
  });
};

// 聊天列表新增聊天
export const addUserChatByChatListApi = (
  body: { friendUserId: string },
  options?: { [key: string]: any }
) => {
  return request<any>("/api/chatroom/addUserChatByChatList", {
    method: "POST",
    data: body,
    ...(options || {}),
  });
};

// 聊天列表删除聊天
export const removeUserChatByChatListApi = (
  body: { sessionId: string },
  options?: { [key: string]: any }
) => {
  return request<any>("/api/chatroom/removeUserChatByChatList", {
    method: "POST",
    data: body,
    ...(options || {}),
  });
};

// 获取聊天内容列表
export const getConversationListApi = (
  body: { userId: string },
  options?: { [key: string]: any }
) => {
  return request<ApiTypes.TConversationList[]>(
    `/api/chatroom/conversationList/${body.userId}`,
    {
      method: "GET",
      ...(options || {}),
    }
  );
};
