import styles from "./index.less";
import { CodeOutlined, CommentOutlined, InboxOutlined } from "@ant-design/icons";
import { Drawer } from "antd";
import _ from "lodash";
import { useState } from "react";
import ChatList from "./ChatList";

const ChatListDrawer = () => {
  const [isCMDList, setIsCMDList] = useState(false);
  const handleCMDDrawerClose = () => {
    setIsCMDList(false);
  };

  return (
    <div className={styles.chatListDrawer}>
      <div className={styles.drawIcon}>
        <InboxOutlined onClick={() => setIsCMDList(true)} style={{ fontSize: 22 }} />
      </div>
      <Drawer
        title="已执行对话命令"
        open={isCMDList}
        width={400}
        destroyOnClose={true}
        styles={{
          body: {
            background: "#f5f5f5",
          },
        }}
        onClose={handleCMDDrawerClose}
      >
        <ChatList />
      </Drawer>
    </div>
  );
};

export default ChatListDrawer;
