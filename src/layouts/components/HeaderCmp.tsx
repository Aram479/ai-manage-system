import { useState } from "react";
import { history, useModel } from "@umijs/max";
import { Avatar, Dropdown, MenuProps, message } from "antd";
import { GithubOutlined, UserOutlined } from "@ant-design/icons";
import { useChatEvent } from "@/hooks/useChatEvent";
import { BaseToolsEvents, TBaseTools } from "@/tools/baseTools";
import { copy } from "@/utils";
import ChatListDrawer from "@/components/ChatListDrawer";
import Logo from "@/asset/png/logo.png";
import styles from "./index.less";

const HeaderCmp = () => {
  const { userInfo, logoutAction } = useModel("user");
  const [title, setTile] = useState("Veloce智能管理系统");

  const avatarItems: MenuProps["items"] = [
    {
      key: "copyUserId",
      label: "复制ID",
      onClick: () => {
        copy(userInfo?.userId ?? "");
        message.success({
          key: "copy",
          content: "复制成功",
        });
      },
    },
    {
      key: "logout",
      label: "退出登录",
      onClick: () => {
        logoutAction();
      },
    },
  ];
  const handleTitle = () => {
    history.push("/Main");
  };

  const handleGitee = () => {
    window.open(
      "https://gitee.com/clzhloafl/my-ai-project/tree/ai-main/",
      "_blank"
    );
  };

  const handleGitHunb = () => {
    window.open(
      "https://github.com/Aram479/ai-manage-system/tree/ai-main",
      "_blank"
    );
  };

  useChatEvent<TBaseTools>((event) => {
    if (event.name === BaseToolsEvents.Update_System_Title) {
      if (event.title) setTile(event.title);
    }
  });

  return (
    <div className={styles.headerCmp}>
      <div className={styles.title} onClick={handleTitle}>
        <img className={styles.headerLogo} src={Logo} />
        <div dangerouslySetInnerHTML={{ __html: title }}></div>
      </div>
      <div className={styles.operation}>
        <Dropdown menu={{ items: avatarItems }}>
          <Avatar icon={<UserOutlined />} />
        </Dropdown>

        <ChatListDrawer />
        <div
          style={{ cursor: "pointer", fontWeight: "bold", fontSize: 17 }}
          onClick={handleGitee}
        >
          Gitee
        </div>
        <GithubOutlined onClick={handleGitHunb} />
      </div>
    </div>
  );
};

export default HeaderCmp;
