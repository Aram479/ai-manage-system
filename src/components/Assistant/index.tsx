import { ChromeOutlined } from "@ant-design/icons";
import { Popover } from "antd";
import _ from "lodash";
import ChatCmp from "./ChatCmp";
import styles from "./index.less";
import DifyChatCmp from "./DifyChatCmp";

const Assistant = () => {
  return (
    <div className={styles.assistant}>
      <Popover
        placement="leftTop"
        trigger={["click"]}
        content={<DifyChatCmp />}
        classNames={{
          body: styles.popoverContent,
        }}
      >
        <ChromeOutlined
          style={{
            fontSize: 40,
          }}
        />
      </Popover>
    </div>
  );
};

export default Assistant;
