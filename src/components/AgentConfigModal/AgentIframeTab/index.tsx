import { forwardRef, Ref, useImperativeHandle, useMemo } from "react";
import { Checkbox, Col, Form, Input, Row } from "antd";
import { Rule } from "antd/es/form";

interface IAgentIframeTab {
  iframeTabData?: any;
}

const AgentIframeTab = (
  props: IAgentIframeTab,
  ref: Ref<IAgentIframeTabRef>
) => {
  const { iframeTabData } = props;
  const [form] = Form.useForm<IAgentIframeTabFormData>();

  const formRules = useMemo<Record<string, Rule[]>>(
    () => ({
      projectDomain: [
        {
          required: false,
          whitespace: true,
          validator: (_rule, value) => {
            const regex = /^https?:\/\/.+/i;
            const isDomain = regex.test(value);
            if (!value?.trim()) {
              return Promise.reject("请输入");
            }
            if (!isDomain) {
              return Promise.reject("请输入正确的地址");
            }
            return Promise.resolve();
          },
        },
      ],
      isDataTransfer: [{ message: "请勾选", required: false }],
    }),
    [iframeTabData]
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
              name="projectDomain"
              label="项目地址"
              rules={formRules.projectDomain}
            >
              <Input placeholder="示例：https://www.baidu.com/" allowClear />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="isDataTransfer"
              label="是否数据交互"
              rules={formRules.isDataTransfer}
              valuePropName="checked"
            >
              <Checkbox>启用</Checkbox>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default forwardRef(AgentIframeTab);
