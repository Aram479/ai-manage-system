import { useState } from "react";
import styles from "./index.less";
import { useChatEvent } from "@/hooks/useChatEvent";
import { BaseToolsEvents, TBaseTools } from "@/tools/baseTools";
import { history } from "@umijs/max";
import Logo from "@/asset/png/logo.png";

const HeaderCmp = () => {
  const [title, setTile] = useState("Veloce智能管理系统");

  const handleTitle = () => {
    history.push("/Main");
  };

  useChatEvent<TBaseTools>((event) => {
    if (event.name === BaseToolsEvents.Update_System_Title) {
      if (event.title) setTile(event.title);
    }
  });
  return (
    <div className={styles.headerCmp}>
      <div className={styles.title} onClick={handleTitle}>
        <img
          className={styles.headerLogo}
          src={Logo}
        />
        <div dangerouslySetInnerHTML={{ __html: title }}></div>
      </div>
    </div>
  );
};

export default HeaderCmp;
