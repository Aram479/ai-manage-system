import { request } from "@umijs/max";

// 注册
export const registerApi = (body: any, options?: { [key: string]: any }) => {
  return request<any>("/api/user/register", {
    method: "POST",
    data: body,
    ...(options || {}),
  });
};

// 登录
export const loginApi = (body: any, options?: { [key: string]: any }) => {
  return request<any>("/api/user/login", {
    method: "POST",
    data: body,
    ...(options || {}),
  });
};

// 获取用户信息
export const getUserInfoApi = (options?: { [key: string]: any }) => {
  return request<IUserInfo>("/api/user/userInfo", {
    method: "GET",
    ...(options || {}),
  });
};

// 更新用户信息
export const updateUserInfoApi = (
  body: any,
  options?: { [key: string]: any }
) => {
  return request<IUserInfo>("/api/user/update", {
    method: "PUT",
    data: body,
    ...(options || {}),
  });
};

// 更新用户密码
export const updateUserPasswordApi = (
  body: any,
  options?: { [key: string]: any }
) => {
  return request("/api/user/changePassword", {
    method: "PUT",
    data: body,
    ...(options || {}),
  });
};
