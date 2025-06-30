import { useModel, useSelectedRoutes } from "@umijs/max";
import { useEffect, useState } from "react";
import routes from "../../config/routes";
import { UserList } from "@/services/api/userApi/mockData";
const user = () => {
  const [menuList, setMenuList] = useState<any[]>([]);
  const [userMenus, setUserMenus] = useState<Extract<typeof routes, any[]>>(
    routes || []
  );
  const [userList, setUserList] = useState<IUserList[]>([]);

  return {
    menuList,
    userMenus,
    userList,
    setUserList,
  };
};
export default user;
