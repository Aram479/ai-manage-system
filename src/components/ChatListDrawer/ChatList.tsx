import { useModel } from "@umijs/max";
import styles from "./index.less";
import { CopyOutlined, PlayCircleOutlined } from "@ant-design/icons";
import { Empty, message, Tooltip } from "antd";
import _ from "lodash";
import ClipboardUtil from "@/utils/clipboardUtil";
import { ToolsNameMap } from "@/constant/common";

const ChatList = () => {
  const { eventList, setCommandExecutor } = useModel("chat");

  return (
    <div className={styles.chatList}>
      {eventList.current.length ? (
        eventList.current?.map((item, index) => (
          <div key={index} className={styles.chatItemBox}>
            <div className={styles.cmdName}>{ToolsNameMap.get(item.name)}：</div>
            <div className={styles.cmdText}>{item.jsonString}</div>
            <div className={styles.cmdOperBox}>
              <div className={styles.leftBox}>
                <div>执行次数: {item.exNumber}</div>
              </div>
              <div className={`${styles.rightBox} messageFooterBox`}>
                <Tooltip title="重新执行命令">
                  <PlayCircleOutlined
                    onClick={_.throttle(() => {
                      setCommandExecutor(item.jsonString);
                    }, 300)}
                  />
                </Tooltip>

                <CopyOutlined
                  onClick={_.throttle(() => {
                    ClipboardUtil.writeText(item.jsonString);
                    message.success({
                      key: "copy",
                      content: "复制成功",
                    });
                  }, 300)}
                />
              </div>
            </div>
          </div>
        ))
      ) : (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )}
    </div>
  );
};

export default ChatList;
