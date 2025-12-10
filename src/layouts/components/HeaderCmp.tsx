import { useState } from "react";
import { history, useModel, useRequest } from "@umijs/max";
import { Avatar, Dropdown, Flex, MenuProps, message } from "antd";
import { GithubOutlined, UserOutlined } from "@ant-design/icons";
import { useChatEvent } from "@/hooks/useChatEvent";
import { BaseToolsEvents, TBaseTools } from "@/tools/baseTools";
import { copy } from "@/utils";
import { updateUserPasswordApi } from "@/services/api/loginApi";
import UserInfoModal from "./UserInfoModal";
import EditPasswordModal from "./EditPasswordModal";
import ChatListDrawer from "@/components/ChatListDrawer";
import Gitee from "@/asset/png/giteeIcon.png";
import Logo from "@/asset/png/logo.png";
import styles from "./index.less";

const HeaderCmp = () => {
  const { userInfo, logoutAction } = useModel("user");
  const isAdmin = userInfo.username === "admin";
  const [title, setTile] = useState("Veloce智能管理系统");
  const [userInfoOpen, setUserInfoOpen] = useState(false);
  const [editPasswordOpen, setEditPasswordOpen] = useState(false);

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
      key: "userInfo",
      label: "用户信息",
      onClick: () => {
        setUserInfoOpen(true);
      },
    },
    {
      key: "editPassword",
      label: "修改密码",
      onClick: () => {
        setEditPasswordOpen(true);
      },
      disabled: isAdmin,
    },
    {
      key: "logout",
      label: "退出登录",
      danger: true,
      onClick: () => {
        logoutAction();
      },
    },
  ];

  const projectUrlItem: MenuProps["items"] = [
    {
      key: "github",
      label: "GitHub",
      icon: <GithubOutlined style={{ fontSize: 18 }} />,
      onClick: () => {
        window.open(
          "https://github.com/Aram479/ai-manage-system/tree/ai-main",
          "_blank"
        );
      },
    },
    {
      key: "gitee",
      label: "Gitee",
      icon: <img src={Gitee} style={{ width: 20 }} />,
      onClick: () => {
        window.open(
          "https://gitee.com/clzhloafl/my-ai-project/tree/ai-main/",
          "_blank"
        );
      },
    },
  ];

  const updateUserPasswordReq = useRequest(updateUserPasswordApi, {
    manual: true,
    onSuccess: () => {
      message.success("密码修改成功");
      setEditPasswordOpen(false);
    },
  });

  const handleTitle = () => {
    history.push("/");
  };

  useChatEvent<TBaseTools>((event) => {
    if (event.name === BaseToolsEvents.Update_System_Title) {
      if (event.title) setTile(event.title);
    }
  });

  return (
    <div className={styles.headerCmp}>
      <Flex align="center" justify="space-between">
        <div className={styles.title} onClick={handleTitle}>
          <img className={styles.headerLogo} src={Logo} />
          <div dangerouslySetInnerHTML={{ __html: title }}></div>
        </div>
        <div className={styles.operation}>
          <ChatListDrawer />
          <Dropdown menu={{ items: avatarItems }} placement="bottom">
            <Avatar
              src={userInfo?.avatar}
              size={32}
              style={{ cursor: "pointer" }}
            >
              {userInfo?.username?.charAt(0)}
            </Avatar>
          </Dropdown>
          <Dropdown menu={{ items: projectUrlItem }} placement="bottom">
            <div style={{ cursor: "pointer" }}>项目地址</div>
          </Dropdown>
        </div>
      </Flex>
      <UserInfoModal
        open={userInfoOpen}
        onOk={() => setUserInfoOpen(false)}
        onCancel={setUserInfoOpen}
      />
      <EditPasswordModal
        open={editPasswordOpen}
        confirmLoading={updateUserPasswordReq.loading}
        onOk={(passwordData) => {
          updateUserPasswordReq.run(passwordData);
        }}
        onCancel={setEditPasswordOpen}
      />
    </div>
  );
};

export default HeaderCmp;
