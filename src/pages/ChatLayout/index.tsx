import Assistant from "@/component/Assistant";
import ConverMenu from "@/component/ConverMenu";
import { Outlet } from "@umijs/max";
import { Layout } from "antd";

const { Sider, Content } = Layout;
const ChatLayout = () => {
  return (
    <div>
      <Layout>
        <Sider
          width={240}
          style={{
            height: "100vh",
            background: "#fff",
          }}
        >
          <ConverMenu />
        </Sider>
        <Content>
          <Outlet />
        </Content>
      </Layout>
    </div>
  );
};

export default ChatLayout;
