import { useEffect, useMemo, useState } from "react";
import { Checkbox, Col, Form, Input, Modal, ModalProps, Row } from "antd";
import { Rule } from "antd/es/form";

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
      phone: [{ required: true }],
      status: [],
    }),
    [data]
  );

  const handleConfirm = async () => {
    await form.validateFields();
    const formData = form.getFieldsValue(true);
    const newFormData = {
      ...formData,
      userName: formData.userName,
      phone: formData.phone,
      status: Number(!!formData.status),
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
              <Form.Item name="phone" label="手机号" rules={formRules.phone}>
                <Input placeholder="请输入" allowClear />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="status" label="状态" rules={formRules.status}>
                <Checkbox
                  defaultChecked={!!data.status}
                  onChange={(e) => {
                    form.setFieldValue("status", Number(e.target.checked));
                  }}
                >
                  启用
                </Checkbox>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default CreateUserModal;
