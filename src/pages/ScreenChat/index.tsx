import _ from "lodash";
import ChatCmp from "@/components/Assistant/ChatCmp";
import styles from "./index.less";

const Assistant = () => {
  return (
    <div className={styles.assistant}>
      <ChatCmp />
    </div>
  );
};

export default Assistant;
