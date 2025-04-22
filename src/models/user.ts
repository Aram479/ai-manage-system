import { useModel, useSelectedRoutes } from "@umijs/max";
import { useState } from "react";
import routes from "../../config/routes";
const user = () => {
  const [menuList, setMenuList] = useState<any[]>([]);
  const [userMenus, setUserMenus] = useState<Extract<typeof routes, any[]>>(
    routes || []
  );
  return {
    menuList,
    userMenus,
  };
};
export default user;
