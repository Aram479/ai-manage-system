import { useModel } from "@umijs/max";
import styles from "./index.less";
import { CopyOutlined, PlayCircleOutlined } from "@ant-design/icons";
import { Empty, message, Tooltip } from "antd";
import _ from "lodash";
import { copy } from "@/utils";
import { ToolsNameMap } from "@/constant/common";
import MarkDownCmp from "../MarkDownCmp";

const ChatList = () => {
  const { eventList, setCommandExecutor, setToolCommandExecutor } =
    useModel("chat");

  return (
    <div className={styles.chatList}>
      {eventList.current.length ? (
        eventList.current?.map((item, index) => (
          <div key={index} className={styles.chatItemBox}>
            <div className={styles.cmdName}>
              {ToolsNameMap.get(item.name)}：
            </div>
            <div className={styles.cmdText}>
              <MarkDownCmp
                theme="onDark"
                copyCode={false}
                content={`\`\`\`js\n${JSON.stringify(
                  JSON.parse(item.jsonString),
                  null,
                  2
                )}\n\`\`\``}
              />
            </div>
            <div className={styles.cmdOperBox}>
              <div className={styles.leftBox}>
                <div>执行次数: {item.exNumber}</div>
              </div>
              <div className={`${styles.rightBox} messageFooterBox`}>
                <Tooltip title="重新执行命令">
                  <PlayCircleOutlined
                    onClick={_.throttle(() => {
                      setCommandExecutor(item.jsonString);
                      setToolCommandExecutor(item.jsonString, true);
                    }, 300)}
                  />
                </Tooltip>

                <CopyOutlined
                  onClick={_.throttle(() => {
                    copy(JSON.stringify(JSON.parse(item.jsonString), null, 2));
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
