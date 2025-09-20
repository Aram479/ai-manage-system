import { useMemo } from "react";
import { Layout } from "antd";
import { Outlet, useLocation } from "@umijs/max";
import { AliveScope } from "react-activation";
import { useGlobalChatEvent } from "@/hooks/useGlobalChatEvent";
import MenuCmp from "./components/MenuCmp";
import HeaderCmp from "./components/HeaderCmp";
import Assistant from "@/components/Assistant";
import styles from "./index.less";
const { Header, Sider, Content } = Layout;

const agentBlackRoute = ["/Main", "/Chats/AutoChat", "/ScreenChat"];
const Layouts = () => {
  useGlobalChatEvent();
  const location = useLocation();
  const isAssistant = useMemo(
    () => !agentBlackRoute.includes(location.pathname),
    [location.pathname]
  );
  return (
    <div className={styles.layouts}>
      <Layout className={styles["ant-layout"]}>
        <Header className={styles["layout-header"]}>
          <HeaderCmp />
        </Header>
        <Layout>
          <Sider theme="light">
            <MenuCmp />
          </Sider>
          <Content className={styles.content}>
            <AliveScope>
              <Outlet />
            </AliveScope>
          </Content>
        </Layout>
      </Layout>
      <div style={{ display: isAssistant ? "block" : "none" }}>
        <Assistant />
      </div>
    </div>
  );
};

export default Layouts;
