import { Layout } from "antd";
import { Outlet } from "@umijs/max";
import { AliveScope } from "react-activation";
import { useGlobalChatEvent } from "@/hooks/useGlobalChatEvent";
import MenuCmp from "./components/MenuCmp";
import HeaderCmp from "./components/HeaderCmp";
import Assistant from "@/components/Assistant";
import styles from "./index.less";
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
            <AliveScope>
              <Outlet />
            </AliveScope>
          </Content>
        </Layout>
      </Layout>
      <Assistant />
    </div>
  );
};

export default Layouts;
