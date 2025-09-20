import _ from "lodash";
import AgentByRoleTabs from "@/components/AgentByRoleTabs";
import styles from "./index.less";

const Assistant = () => {
  return (
    <div className={styles.assistant}>
      <AgentByRoleTabs />
    </div>
  );
};

export default Assistant;
