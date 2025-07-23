import { useEffect, useMemo, useState } from "react";
import {
  Checkbox,
  Col,
  Form,
  Input,
  Modal,
  ModalProps,
  Row,
  Select,
} from "antd";
import { Rule } from "antd/es/form";
import { RoleOptions } from "@/constant/options";
import { useChatEvent } from "@/hooks/useChatEvent";
import { TOrderManageTools } from "@/tools/orderManageTools";
import {
  TUserManageTools,
  UserManageToolsEvents,
} from "@/tools/userManageTools";
import dayjs from "dayjs";

interface ICreateUserModal extends ModalProps {
  open?: boolean;
  title?: string;
  data?: any;
  onOk?: (data?: any) => void;
  onCancel?: (data?: any) => void;
}

const CreateUserModal = (props: ICreateUserModal) => {
  const { data = {}, title, open, onOk, onCancel, ...modalProps } = props;
  const [form] = Form.useForm();
  const formRules: Record<string, Rule[]> = useMemo(
    () => ({
      userName: [{ required: true }],
      role: [{ required: true }],
      phone: [{ required: true }],
    }),
    [data]
  );

  const handleConfirm = async () => {
    await form.validateFields();
    const formData = form.getFieldsValue(true);
    onOk?.(formData);
  };
  const handleCancel = () => {
    onCancel?.(false);
    form.resetFields();
  };

  useEffect(() => {
    form.setFieldsValue(data);
  }, [data]);

  useChatEvent<TUserManageTools>((event) => {
    if (event.name === UserManageToolsEvents.Create_User) {
      const chatData = event.data;
      const createTime = chatData?.createTime;
      form.setFieldsValue({
        ...chatData,
        createTime: createTime ? dayjs(createTime) : undefined,
      });
    }
  });

  return (
    <div className="catalogModal">
      <Modal
        title={"用户"}
        open={open}
        maskClosable={false}
        cancelButtonProps={{ loading: false }}
        okButtonProps={{ loading: false }}
        width={800}
        destroyOnClose
        onOk={handleConfirm}
        onCancel={handleCancel}
        {...modalProps}
      >
        <Form layout="vertical" form={form} preserve={false}>
          <Row gutter={24}>
            <Col span={24}>
              <Form.Item
                name="userName"
                label="用户名称"
                rules={formRules.userName}
              >
                <Input placeholder={"请输入"} allowClear />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="role" label="角色" rules={formRules.role}>
                <Select placeholder="请选择" allowClear options={RoleOptions} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="phone" label="手机号" rules={formRules.phone}>
                <Input placeholder="请输入" allowClear />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="status" label="状态" valuePropName="checked">
                <Checkbox>启用</Checkbox>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default CreateUserModal;
