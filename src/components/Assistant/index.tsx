import { Popover } from "antd";
import _ from "lodash";
import LogoWhite from "@/asset/png/logoWhite.png";
import AgentByRoleTabs from "../AgentByRoleTabs";
import styles from "./index.less";

const Assistant = () => {
  return (
    <div className={styles.assistant}>
      <Popover
        placement="leftTop"
        trigger={["click"]}
        content={<AgentByRoleTabs />}
        arrow={false}
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
