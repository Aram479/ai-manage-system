import { Link, useModel } from "@umijs/max";
import { Button, Col, Flex, Form, Input, Row, message } from "antd";
import { Rule } from "antd/es/form";
import { LockOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import Logo from "@/asset/png/logo.png";
import styles from "./index.less";

const RegisterPage = () => {
  const { registerReq } = useModel("user");
  const [form] = Form.useForm<IRegisterData>();

  // 注册表单规则
  const registerRules: Record<keyof IRegisterData, Rule[]> = {
    username: [{ required: true, message: "请输入用户名" }],
    password: [
      { required: true, message: "请输入密码" },
      { min: 6, message: "密码长度不能少于6个字符" },
    ],
    confirmPassword: [
      { required: true, message: "请确认密码" },
      ({ getFieldValue }) => ({
        validator(_, value) {
          if (!value || getFieldValue("password") === value) {
            return Promise.resolve();
          }
          return Promise.reject(new Error("两次输入密码不一致"));
        },
      }),
    ],
    email: [
      { required: true, message: "请输入邮箱" },
      { type: "email", message: "请输入有效的邮箱地址" },
    ],
  };

  const handleRegister = async () => {
    const values = await form.validateFields();
    const { confirmPassword, ...registerData } = values;
    registerReq.run(registerData as any);
  };

  return (
    <div className={styles.registerContainer}>
      <div className={styles.registerCard}>
        <Flex vertical align="center" justify="center">
          {/* Logo */}
          <Flex className={styles.logo} align="center" justify="center">
            <img src={Logo} alt="Logo" />
          </Flex>
          <h2 className={styles.title}>创建新账号</h2>
          <p className={styles.subtitle}>加入我们，开启智能之旅</p>
        </Flex>

        <Form layout="vertical" form={form} className={styles.form}>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="username"
                label="用户名"
                rules={registerRules.username}
                className={styles.formItem}
              >
                <Input
                  prefix={<UserOutlined className={styles.inputIcon} />}
                  placeholder="请输入用户名"
                  className={styles.input}
                />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                name="email"
                label="邮箱"
                rules={registerRules.email}
                className={styles.formItem}
              >
                <Input
                  prefix={<MailOutlined className={styles.inputIcon} />}
                  placeholder="请输入邮箱地址"
                  className={styles.input}
                />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                name="password"
                label="密码"
                rules={registerRules.password}
                className={styles.formItem}
              >
                <Input.Password
                  prefix={<LockOutlined className={styles.inputIcon} />}
                  placeholder="密码长度不能少于6个字符"
                  className={styles.input}
                  visibilityToggle
                />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                name="confirmPassword"
                label="确认密码"
                rules={registerRules.confirmPassword}
                className={styles.formItem}
              >
                <Input.Password
                  prefix={<LockOutlined className={styles.inputIcon} />}
                  placeholder="请再次输入密码"
                  className={styles.input}
                  visibilityToggle
                />
              </Form.Item>
            </Col>
          </Row>

          <Button
            type="primary"
            htmlType="submit"
            onClick={handleRegister}
            className={styles.registerButton}
          >
            注册
          </Button>

          <div className={styles.loginLink}>
            <span>已有账号？</span>
            <Link to="/Login">立即登录</Link>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default RegisterPage;
