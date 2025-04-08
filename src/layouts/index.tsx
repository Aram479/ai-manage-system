import { Layout } from "antd";
import MenuCmp from "./components/MenuCmp";
import { Outlet } from "@umijs/max";
import HeaderCmp from "./components/HeaderCmp";
import styles from "./index.less";
const { Header, Sider, Content } = Layout;

const Layouts = () => {
  return (
    <div className={styles.layouts}>
      <Layout className={styles["ant-layout"]}>
        <Header className={styles["ant-header"]}>
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
    </div>
  );
};

export default Layouts;
