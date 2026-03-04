import { Form, Input, Modal, message, ModalProps } from "antd";
import { LockOutlined } from "@ant-design/icons";
import { Rule } from "antd/es/form";
import styles from "./index.less";
import { useEffect } from "react";

interface IEditPasswordModal extends ModalProps {
  data?: any;
  onOk?: (data?: any) => void;
  onCancel?: (data?: any) => void;
}

const EditPasswordModal: React.FC<IEditPasswordModal> = ({
  title = "修改密码",
  open,
  onOk,
  onCancel,
  ...modalProps
}) => {
  const [form] = Form.useForm();

  // 验证规则
  const formRules: Record<keyof TFormEditPsd, Rule[]> = {
    oldPassword: [{ required: true, message: "请输入旧密码" }],
    newPassword: [
      { required: true, message: "请输入新密码" },
      { min: 6, message: "新密码长度不能少于6个字符" },
    ],
    confirmPassword: [
      { required: true, message: "请确认新密码" },
      ({ getFieldValue }) => ({
        validator(_, value) {
          if (!value || getFieldValue("newPassword") === value) {
            return Promise.resolve();
          }
          return Promise.reject(new Error("两次输入密码不一致"));
        },
      }),
    ],
  };

  // 处理表单提交
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const { confirmPassword, ...passwordData } = values;
      onOk?.(passwordData);
    } catch (error) {
      message.error("表单验证失败，请检查输入");
    } finally {
    }
  };

  // 处理取消
  const handleCancel = () => {
    form.resetFields();
    onCancel?.();
  };

  // 模态框打开时初始化表单数据
  useEffect(() => {
    if (open) {
      form.resetFields();
    }
  }, [open]);

  return (
    <Modal
      title={title}
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      destroyOnClose
      width={500}
      className={styles.editPasswordModal}
      {...modalProps}
    >
      <Form form={form} layout="vertical" className={styles.form}>
        {/* 旧密码 */}
        <Form.Item
          name="oldPassword"
          label="旧密码"
          rules={formRules.oldPassword}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="请输入旧密码"
          />
        </Form.Item>

        {/* 新密码 */}
        <Form.Item
          name="newPassword"
          label="新密码"
          rules={formRules.newPassword}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="请输入新密码（不少于6个字符）"
          />
        </Form.Item>

        {/* 确认新密码 */}
        <Form.Item
          name="confirmPassword"
          label="确认新密码"
          rules={formRules.confirmPassword}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="请再次输入新密码"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditPasswordModal;
