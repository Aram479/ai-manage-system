import styles from "./index.less";
import { InsertRowRightOutlined } from "@ant-design/icons";
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
        <InsertRowRightOutlined onClick={() => setIsCMDList(true)} />
      </div>
      <Drawer
        title="命令列表"
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
