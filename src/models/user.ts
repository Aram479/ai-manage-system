import { useState } from "react";
import { history } from "@umijs/max";
import { v4 as uuidv4 } from "uuid";
import { generateMockToken } from "@/utils";
import localCache from "@/utils/cache";
import routes from "../../config/routes";
const user = () => {
  const default_userInfo = localCache.getItem("userInfo");
  const [userInfo, setUserInfo] = useState<IUserInfo>(default_userInfo);
  const [menuList, setMenuList] = useState<any[]>([]);
  const [userMenus, setUserMenus] = useState<Extract<typeof routes, any[]>>(
    routes || []
  );
  const [userList, setUserList] = useState<IUserList[]>([]);

  const updateUserAction = (userData: typeof userInfo) => {
    localCache.setItem("userInfo", userData);
    setUserInfo(userData);
  };
  const loginAction = (userInfo: ILoginData) => {
    const newUserInfo = {
      ...userInfo,
      userId: uuidv4(),
    };
    localCache.setItem("userInfo", newUserInfo);
    localCache.setItem("token", generateMockToken(newUserInfo));
    history.push("/");
    setUserInfo(newUserInfo);
  };

  const logoutAction = () => {
    localCache.removeItem("userInfo");
    localCache.removeItem("token");
    history.push("/Login");
  };
  return {
    userInfo,
    menuList,
    userMenus,
    userList,
    setUserList,
    setUserInfo,
    loginAction,
    logoutAction,
    updateUserAction,
  };
};
export default user;
