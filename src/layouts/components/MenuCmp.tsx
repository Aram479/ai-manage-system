import { Menu, MenuProps } from "antd";
import {
  history,
  useRouteData,
  useRouteProps,
  useSelectedRoutes,
} from "@umijs/max";
import styles from "./index.less";
import { useEffect, useMemo } from "react";
import _ from "lodash";

interface IMenuCmp extends MenuProps {}

const MenuCmp = (props: IMenuCmp) => {
  const routes = useSelectedRoutes();
  const currentRoute = useRouteProps();
  // 查找routes下System的子route
  const systemRoutes = _.find(routes, {
    route: {
      name: "System",
    },
  })?.route.children;
  const selectedKeys = useMemo(() => currentRoute.path, [currentRoute.path]);
  const items = useMemo(() => {
    return systemRoutes?.map((item) => ({
      key: item.path,
      label: item?.meta?.title,
      children: item.children,
    }));
  }, [systemRoutes]);

  const handleMenuItemChange: MenuProps["onSelect"] = (menuItem) => {
    history.push(menuItem.key);
  };

  return (
    <div className={styles.menuCmp}>
      <Menu
        defaultSelectedKeys={["/Home"]}
        mode="inline"
        style={{ border: "none", height: "100%" }}
        onSelect={handleMenuItemChange}
        items={items}
        selectedKeys={[selectedKeys]}
        // defaultOpenKeys={[defaultOpenKeys]}
        inlineIndent={14}
      />
    </div>
  );
};

export default MenuCmp;
