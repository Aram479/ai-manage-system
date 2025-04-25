import { Button, Col, DatePicker, Form, InputNumber, Row } from "antd";
import { Rule } from "antd/es/form";
import dayjs from "dayjs";
import { useEffect } from "react";
import { start } from "repl";

interface IStartDetailProps {
  open?: boolean;
  title?: string;
  data?: any;
  onConfirm?: (data?: any) => void;
  onCancel?: (data?: any) => void;
}

const StartDetail = (props: IStartDetailProps) => {
  const { open, title, data, onConfirm, onCancel } = props;
  const [form] = Form.useForm();
  const formRules: Record<string, Rule[]> = {
    startTime: [{ required: false }],
    startDate: [{ required: false }],
  };

  const handleSearch = async () => {
    const values = await form.validateFields();
    const newValues = {
      ...values,
      startDate:
        values.startDate &&
        dayjs(values.startDate).format("YYYY-MM-DD HH:mm:ss"),
    };
    onConfirm?.(newValues);
  };

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        ...data,
        startDate:
          data?.startDate && dayjs(data?.startDate, "YYYY-MM-DD HH:mm:ss"),
      });
    }
  }, [data]);
  return (
    <>
      {open && (
        <div className="workflow-popover" title={title}>
          <Form name="form_in_modal" layout="vertical" form={form}>
            <Row gutter={24}>
              <Col span={24}>
                <Form.Item
                  name="startTime"
                  label="开始时间"
                  rules={formRules.startTime}
                >
                  <InputNumber
                    controls={false}
                    style={{ width: "100%" }}
                    suffix={<div style={{ color: "#00000040" }}>s</div>}
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="startDate"
                  label="开始日期"
                  rules={formRules.startDate}
                >
                  <DatePicker style={{ width: "100%" }} />
                </Form.Item>
              </Col>
            </Row>
          </Form>
          <div className="form-btn-box">
            <Button onClick={onCancel}>取消</Button>
            <Button type="primary" onClick={handleSearch}>
              确定
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default StartDetail;
