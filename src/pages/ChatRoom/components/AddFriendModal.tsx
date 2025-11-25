import { useEffect, useMemo } from "react";
import {  Col, Form, Input, Modal, ModalProps, Row } from "antd";
import { Rule } from "antd/es/form";
import { ChatItem } from "../types";

interface IAddFriendModal extends ModalProps {
  open?: boolean;
  title?: string;
  data?: any;
  onOk?: (data?: any) => void;
  onCancel?: (data?: any) => void;
}

const AddFriendModal = (props: IAddFriendModal) => {
  const { data = {}, title, open, onOk, onCancel, ...modalProps } = props;
  const [form] = Form.useForm<ChatItem>();
  const formRules: Record<string, Rule[]> = useMemo(
    () => ({
      id: [{ required: true }],
      name: [{ required: true }],
    }),
    [data]
  );

  const handleConfirm = async () => {
    const formData = await form.validateFields();
    const newFormData = {
      ...formData,
      avatar: `https://randomuser.me/api/portraits/men/${
        Math.floor(Math.random() * 30) + 1
      }.jpg`,
      lastMessage: "",
      lastMessageTime: "",
      unreadCount: 0,
      messages: [],
    };
    onOk?.(newFormData);
  };
  const handleCancel = () => {
    onCancel?.(false);
    form.resetFields();
  };

  useEffect(() => {
    form.setFieldsValue(data);
  }, [data]);

  return (
    <div className="catalogModal">
      <Modal
        title="添加朋友"
        open={open}
        maskClosable={false}
        cancelButtonProps={{ loading: false }}
        okButtonProps={{ loading: false }}
        width={400}
        destroyOnClose
        onOk={handleConfirm}
        onCancel={handleCancel}
        {...modalProps}
      >
        <Form layout="vertical" form={form} preserve={false}>
          <Row gutter={24}>
            <Col span={24}>
              <Form.Item name="id" label="用户ID" rules={formRules.id}>
                <Input placeholder={"请输入"} allowClear />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="name" label="用户名称" rules={formRules.name}>
                <Input placeholder={"请输入"} allowClear />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default AddFriendModal;
