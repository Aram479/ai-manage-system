import { useState } from "react";
import { useChatEvent } from "@/hooks/useChatEvent";
import { MainToolsEvents, TMainTools } from "@/tools/mainTools";
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
    <div className={`${styles.mainPage} dap-main-content`}>
      <div style={{ fontSize: "18px", fontWeight: "bold", marginBottom: 8 }}>
        请输入：根据系统菜单，生成一个表格，并可以跳转到对应菜单页面，并以新窗口展示
      </div>
      <div
        className={styles.contentBox}
        dangerouslySetInnerHTML={{
          __html: `<style>${style}</style><div class="${styles.codeBox}">${html}</div>`,
        }}
      />
    </div>
  );
};

export default MainPage;
