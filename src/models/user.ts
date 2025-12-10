import { useEffect, useState } from "react";
import { history, useRequest } from "@umijs/max";
import { message } from "antd";
import {
  loginApi,
  registerApi,
  getUserInfoApi,
  updateUserInfoApi,
  updateUserPasswordApi,
} from "@/services/api/loginApi";
import localCache from "@/utils/cache";
import routes from "../../config/routes";

const user = () => {
  const token = localCache.getItem("token");
  const default_userInfo = localCache.getItem("userInfo");
  const [userInfo, setUserInfo] = useState<IUserInfo>(default_userInfo);
  const [menuList, setMenuList] = useState<any[]>([]);
  const [userMenus, setUserMenus] = useState<Extract<typeof routes, any[]>>(
    routes || []
  );
  const [userList, setUserList] = useState<IUserList[]>([]);

  const registerReq = useRequest(registerApi, {
    manual: true,
    onSuccess: () => {
      message.success("注册成功");
      history.push("/Login");
    },
  });

  const loginReq = useRequest(loginApi, {
    manual: true,
    onSuccess: (res) => {
      const token = res.token;
      localCache.setItem("token", token);
      message.success("欢迎进入Veloce智能管理系统", 3);
      // 跳转到首页
      history.push("/");
    },
  });

  const getUserInfoReq = useRequest(getUserInfoApi, {
    manual: true,
    onSuccess: (userData) => {
      setUserInfo(userData);
    },
  });

  const updateUserInfoReq = useRequest(updateUserInfoApi, {
    manual: true,
    onSuccess: () => {
      getUserInfoReq.run();
      message.success("更新成功");
    },
  });

  const logoutAction = () => {
    localCache.removeItem("chatList")
    localCache.removeItem("token");
    history.push("/Login");
  };

  useEffect(() => {
    if (token) {
      getUserInfoReq.run();
    }
  }, [token]);

  return {
    userInfo,
    menuList,
    userMenus,
    userList,
    setUserList,
    setUserInfo,
    loginReq,
    registerReq,
    logoutAction,
    updateUserInfoReq,
  };
};
export default user;
