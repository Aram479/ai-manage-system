import { useKeepAlive } from "@/hooks/useKeepAlive";
import AgentByRoleTabs from "@/components/AgentByRoleTabs";
import styles from "./index.less";

const MainPage = () => {
  return (
    <div className={`${styles.mainPage}`}>
      <AgentByRoleTabs />
    </div>
  );
};

export default useKeepAlive(MainPage, MainPage.name);
