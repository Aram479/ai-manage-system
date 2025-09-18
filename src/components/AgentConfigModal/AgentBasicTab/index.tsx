import { forwardRef, Ref, useImperativeHandle, useMemo } from "react";
import { Col, Form, Input, Row } from "antd";
import { Rule } from "antd/es/form";

interface IAgentBasicTab {
  basicTabData?: any;
}

const AgentBasicTab = (props: IAgentBasicTab, ref: Ref<IAgentBasicTabRef>) => {
  const { basicTabData } = props;
  const [form] = Form.useForm<IAgentBasicTabFormData>();

  const formRules = useMemo<Record<string, Rule[]>>(
    () => ({
      qwenApiKey: [{ message: "请输入", required: true, whitespace: true }],
      defaultMessage: [{ required: false }],
    }),
    [basicTabData]
  );

  useImperativeHandle(ref, () => ({
    form,
  }));
  return (
    <div>
      <Form layout="vertical" form={form} preserve={false}>
        <Row gutter={24}>
          <Col span={24}>
            <Form.Item
              name="qwenApiKey"
              label="通义千问ApiKey"
              rules={formRules.qwenApiKey}
            >
              <Input placeholder="示例: sk-9q123q4e4r2..." allowClear />
            </Form.Item>
            <Form.Item
              name="defaultMessage"
              label="默认展示信息"
              rules={formRules.defaultMessage}
            >
              <Input placeholder="欢迎进入Veloce系统，你可以尝试输入“当前系统有哪些功能”" allowClear />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default forwardRef(AgentBasicTab);
