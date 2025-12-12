import { useEffect, useMemo } from "react";
import { Col, Form, Input, Modal, ModalProps, Row } from "antd";
import { Rule } from "antd/es/form";

type TFormData = Omit<TAddFriendData, "userId">;
interface IAddFriendModal extends ModalProps {
  open?: boolean;
  title?: string;
  data?: Partial<ApiTypes.TChatRoomUserList>;
  onOk?: (data?: any) => void;
  onCancel?: (data?: any) => void;
}

const AddFriendModal = (props: IAddFriendModal) => {
  const { data = {}, title, open, onOk, onCancel, ...modalProps } = props;
  const [form] = Form.useForm<TFormData>();
  const formRules: Record<string, Rule[]> = useMemo(
    () => ({
      friendMessage: [{ required: false }],
      remarkName: [{ required: true }],
    }),
    [data]
  );

  const handleConfirm = async () => {
    const formData = await form.validateFields();
    const newFormData = {
      ...formData,
      userId: data.userId!,
    };
    onOk?.(newFormData);
  };
  const handleCancel = () => {
    onCancel?.(false);
    form.resetFields();
  };

  // 模态框打开时初始化表单数据
  useEffect(() => {
    if (open) {
      form.setFieldsValue({
        remarkName: data.username,
      });
    }
  }, [open, data]);

  return (
    <Modal
      title="好友申请"
      open={open}
      maskClosable={false}
      width={400}
      destroyOnClose
      onOk={handleConfirm}
      onCancel={handleCancel}
      {...modalProps}
    >
      <Form layout="vertical" form={form} preserve={false}>
        <Row gutter={24}>
          <Col span={24}>
            <Form.Item
              name="friendMessage"
              label="添加好友申请"
              rules={formRules.friendMessage}
            >
              <Input.TextArea placeholder="请输入" rows={3} allowClear />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="remarkName"
              label="备注"
              rules={formRules.remarkName}
            >
              <Input placeholder="请输入" allowClear />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default AddFriendModal;
