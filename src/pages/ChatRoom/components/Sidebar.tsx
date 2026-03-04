import React from "react";
import { Flex, Menu, MenuProps } from "antd";
import { MessageOutlined, UserOutlined, TeamOutlined } from "@ant-design/icons";
import { SidebarProps } from "../types";
import styles from "./Sidebar.less";

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const menuItems: MenuProps["items"] = [
    {
      key: "chat",
      label: (
        <Flex vertical gap={5} align="center">
          <MessageOutlined />
          <div className={styles.menuLabelText}>聊天</div>
        </Flex>
      ),
      className: styles.menuLabel,
      onClick: () => onTabChange("chat"),
    },
    {
      key: "friend",
      label: (
        <Flex vertical gap={5} align="center">
          <UserOutlined />
          <div className={styles.menuLabelText}>好友</div>
        </Flex>
      ),
      className: styles.menuLabel,
      onClick: () => onTabChange("friend"),
    },
  ];

  return (
    <div className={styles.container}>
      <Menu
        mode="vertical"
        selectedKeys={[activeTab]}
        items={menuItems}
        className={styles.menu}
      />
    </div>
  );
};

export default Sidebar;
