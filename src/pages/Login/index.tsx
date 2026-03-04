import { Link, useModel } from "@umijs/max";
import { Button, Col, Flex, Form, Input, Row } from "antd";
import { Rule } from "antd/es/form";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import Logo from "@/asset/png/logo.png";
import styles from "./index.less";

const LoginPage = () => {
  const { loginReq } = useModel("user");
  const [form] = Form.useForm<ILoginData>();

  // 登录表单规则
  const loginRules: Record<keyof Omit<ILoginData, "userId">, Rule[]> = {
    username: [{ required: true, message: "请输入用户名" }],
    password: [{ required: true, message: "请输入密码" }],
    email: [],
  };

  const handleLogin = async () => {
    const values = await form.validateFields();
    loginReq.run(values);
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <Flex vertical align="center" justify="center">
          {/* Logo */}
          <Flex className={styles.logo} align="center" justify="center">
            <img src={Logo} alt="Logo" />
          </Flex>
          <h2 className={styles.title}>Veloce智能未来</h2>
          <p className={styles.subtitle}>欢迎回来，请登录您的账号</p>
        </Flex>

        <Form layout="vertical" form={form} className={styles.form}>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="username"
                label="用户名"
                rules={loginRules.username}
                className={styles.formItem}
              >
                <Input
                  prefix={<UserOutlined className={styles.inputIcon} />}
                  placeholder="请输入用户名或邮箱"
                  className={styles.input}
                />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                name="password"
                label="密码"
                rules={loginRules.password}
                className={styles.formItem}
              >
                <Input.Password
                  prefix={<LockOutlined className={styles.inputIcon} />}
                  placeholder="请输入密码"
                  className={styles.input}
                  visibilityToggle
                />
              </Form.Item>
            </Col>

            {/* 忘记密码链接 */}
            <Col span={24}>
              <div className={styles.forgotPassword}>
                <a href="#">忘记密码？</a>
              </div>
            </Col>
          </Row>

          <Button
            type="primary"
            htmlType="submit"
            onClick={handleLogin}
            className={styles.loginButton}
          >
            登录
          </Button>

          <div className={styles.registerLink}>
            <span>还没有账号？</span>
            <Link to="/register">立即注册</Link>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;
