import _ from "lodash";
import { Popover } from "antd";

import styles from "./index.less";
import ChatCmp from "./ChatCmp";
import { ChromeOutlined } from "@ant-design/icons";

const Assistant = () => {
  return (
    <div className={styles.assistant}>
      <Popover
        placement="leftTop"
        trigger={["click"]}
        content={<ChatCmp />}
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
