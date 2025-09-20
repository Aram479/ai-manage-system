import { useState } from "react";
import { useChatEvent } from "@/hooks/useChatEvent";
import { MainToolsEvents, TMainTools } from "@/tools/mainTools";
import { useKeepAlive } from "@/hooks/useKeepAlive";
import AgentByRoleTabs from "@/components/AgentByRoleTabs";
import styles from "./index.less";

const MainPage = () => {
  const [style, setStyle] = useState("");
  const [html, setHtml] = useState("");
  useChatEvent<TMainTools>((event) => {
    if (event.name === MainToolsEvents.Create_Component) {
      if (event.style) setStyle(event.style);
      if (event.html) setHtml(event.html);
    }
  });

  return (
    <div className={`${styles.mainPage}`}>
      <AgentByRoleTabs />
    </div>
  );
};

export default useKeepAlive(MainPage, MainPage.name);
