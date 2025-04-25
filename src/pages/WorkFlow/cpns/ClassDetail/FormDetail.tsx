import { Button, Col, Form, Row, Input } from "antd";
import { Rule } from "antd/es/form";
import { useEffect } from "react";

interface IStartDetailProps {
  data?: any;
  onCancel?: (data?: any) => void;
  onConfirm?: (data?: any) => void;
}
const { TextArea } = Input;

const FormDetail = (props: IStartDetailProps) => {
  const { data, onCancel, onConfirm } = props;
  const [form] = Form.useForm();
  const formRules: Record<string, Rule[]> = {
    message: [{ required: false }],
  };

  const handleConfirm = async () => {
    const values = await form.validateFields();
    const newValues = {
      ...values,
    };
    onConfirm?.(newValues);
  };

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        ...data,
      });
    }
  }, [data]);

  return (
    <>
      <Form name="form_in_modal" layout="vertical" form={form}>
        <Row gutter={24}>
          <Col span={24}>
            <Form.Item name="message" label="消息" rules={formRules.message}>
              <TextArea rows={4} placeholder="请输入对话内容" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <div className="form-btn-box">
        <Button type="primary" onClick={handleConfirm}>
          确定
        </Button>
      </div>
    </>
  );
};

export default FormDetail;
