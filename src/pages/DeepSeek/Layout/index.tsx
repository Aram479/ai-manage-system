import ConverMenu from "@/component/DeepSeek/ConverMenu";
import { Outlet } from "@umijs/max";
import { Layout } from "antd";
import React from "react";

const { Sider, Content } = Layout;
const DeepSeekLayout = () => {
  return (
    <div>
      <Layout>
        <Layout>
          <Sider width={240} style={{
            height: '100vh',
            background: '#fff'
          }}>
            <ConverMenu />
          </Sider>
          <Content>
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </div>
  );
};

export default DeepSeekLayout;
