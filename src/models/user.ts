import { useEffect, useState } from "react";
import { history, useRequest } from "@umijs/max";
import { message } from "antd";
import {
  loginApi,
  registerApi,
  getUserInfoApi,
  updateUserInfoApi,
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
    onSuccess: (res) => {
      history.push("/login");
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

  const updateUserAction = (userData: typeof userInfo) => {
    updateUserInfoReq.run(userData);
  };

  // 注册功能
  const registerAction = async (registerData: IRegisterData) => {
    registerReq.run(registerData);
  };

  // 登录功能
  const loginAction = async (loginData: ILoginData) => {
    loginReq.run(loginData);
  };

  const logoutAction = () => {
    localCache.removeItem("userInfo");
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
    loginAction,
    registerAction,
    logoutAction,
    updateUserAction,
  };
};
export default user;
