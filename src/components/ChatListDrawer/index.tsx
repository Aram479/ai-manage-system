import styles from "./index.less";
import { CodeOutlined, CommentOutlined } from "@ant-design/icons";
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
        <CodeOutlined onClick={() => setIsCMDList(true)} />
      </div>
      <Drawer
        title="已执行对话命令"
        open={isCMDList}
        width={480}
        destroyOnClose={true}
        maskClosable={false}
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
