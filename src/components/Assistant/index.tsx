import { Popover } from "antd";
import _ from "lodash";
import ChatCmp from "./ChatCmp";
import styles from "./index.less";
import LogoWhite from "@/asset/png/logoWhite.png";

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
        <div className={styles.agentImage}>
          <img src={LogoWhite} />
        </div>
      </Popover>
    </div>
  );
};

export default Assistant;
