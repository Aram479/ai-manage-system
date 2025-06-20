import { Menu, MenuProps } from "antd";
import { history, useRouteProps, useSelectedRoutes } from "@umijs/max";
import styles from "./index.less";
import React, { useMemo } from "react";
import _ from "lodash";
import Icon from "@ant-design/icons";
import routes from "@/../config/routes";

interface IMenuCmp extends MenuProps {}
const MenuCmp = (props: IMenuCmp) => {
  const currentRoute = useRouteProps();
  // 查找routes下System的子route
  const systemRoutes = _.find(routes, { name: "System" })?.routes;
  const selectedKeys = useMemo(() => currentRoute.path, [currentRoute.path]);
  const items = useMemo(() => {
    return systemRoutes
      ?.filter((item) => item?.name)
      .map((item) => {
        const icon = item.meta?.icon;
        const iconNode = icon
          ? React.createElement(Icon, {
              component: icon,
              style: { fontSize: "1.4em" },
            })
          : undefined;
        return {
          key: item.path,
          label: item?.meta?.title,
          children: item.routes,
          icon: iconNode,
        };
      });
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
