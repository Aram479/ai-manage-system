import { useState } from "react";
import styles from "./index.less";
import { useChatEvent } from "@/hooks/useChatEvent";
import { BaseToolsEvents, TBaseTools } from "@/tools/baseTools";

const HeaderCmp = () => {
  const [title, setTile] = useState("欢迎来到Ant Design X Chat 系统");

  useChatEvent<TBaseTools>((event) => {
    if (event.name === BaseToolsEvents.Update_System_Title) {
      if (event.title) setTile(event.title);
    }
  });
  return (
    <div className={styles.headerCmp}>
      <div className={styles.title}>
        <div dangerouslySetInnerHTML={{ __html: title }}></div>
      </div>
    </div>
  );
};

export default HeaderCmp;
