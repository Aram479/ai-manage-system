import { useState } from "react";

const user = () => {
  const [menuList, setMenuList] = useState<any[]>([]);
  const [userMenus, setUserMenus] = useState<any[]>([]);
  return {
    menuList,
    userMenus,
  };
};
export default user;
