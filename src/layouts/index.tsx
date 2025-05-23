import { Layout } from "antd";
import MenuCmp from "./components/MenuCmp";
import { Outlet } from "@umijs/max";
import HeaderCmp from "./components/HeaderCmp";
import styles from "./index.less";
import Assistant from "@/components/Assistant";
import { useGlobalChatEvent } from "@/hooks/useGlobalChatEvent";
const { Header, Sider, Content } = Layout;

const Layouts = () => {
  useGlobalChatEvent();

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
          <Content>
            <Outlet />
          </Content>
        </Layout>
      </Layout>
      <Assistant />
    </div>
  );
};

export default Layouts;
