import { useModel } from "@umijs/max";
import { Button, Col, Flex, Form, Input, Row } from "antd";
import { Rule } from "antd/es/form";
import Logo from "@/asset/png/logo.png";
import styles from "./index.less";

const LoginPage = () => {
  const { loginAction } = useModel("user");
  const [form] = Form.useForm<IUserInfo>();
  const formRules: Record<keyof Omit<ILoginData, "userId">, Rule[]> = {
    username: [{ required: true }],
    password: [{ required: true }],
  };

  const handleLogin = async () => {
    const values = await form.validateFields();
    loginAction(values);
  };

  return (
    <Flex className={styles.loginPage} align="center" justify="center">
      <Flex
        vertical
        align="center"
        justify="center"
        style={{ width: 385, height: 500 }}
      >
        {/* Logo */}
        <img className={styles.logo} src={Logo} />
        <Form layout="vertical" form={form}>
          <Row>
            <Col span={24}>
              <Form.Item
                name="username"
                label="用户名"
                rules={formRules.username}
              >
                <Input placeholder="用户名/手机号" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="password"
                label="密码"
                rules={formRules.password}
              >
                <Input.Password placeholder="密码" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <Flex vertical style={{ width: "100%" }}>
          <Button
            type="primary"
            style={{ width: "100%" }}
            onClick={handleLogin}
          >
            登录
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default LoginPage;
