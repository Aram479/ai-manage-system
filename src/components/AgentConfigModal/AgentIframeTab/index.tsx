import { forwardRef, Ref, useImperativeHandle, useMemo, useState } from "react";
import { useModel } from "@umijs/max";
import { Button, Checkbox, Col, Flex, Form, Input, Row } from "antd";
import { Rule } from "antd/es/form";
import _ from "lodash";

interface IAgentIframeTab {
  iframeTabData?: any;
}

const AgentIframeTab = (
  props: IAgentIframeTab,
  ref: Ref<IAgentIframeTabRef>
) => {
  const { iframeTabData } = props;
  const { agentConfig, setAgentConfigAction } = useModel("agent");
  const [form] = Form.useForm<IAgentIframeTabFormData>();
  const [isApply, setIsApply] = useState(false);
  const formRules = useMemo<Record<string, Rule[]>>(
    () => ({
      projectDomain: [
        {
          validator: (_rule, value) => {
            const regex = /^https?:\/\/.+/i;
            const isDomain = regex.test(value);
            const inputValue = value?.trim();
            if (inputValue && !isDomain) {
              return Promise.reject("请输入正确的地址");
            }
            return Promise.resolve();
          },
        },
      ],
      isDataTransfer: [],
    }),
    [iframeTabData]
  );

  const handleFormValuesChange = () => {
    setIsApply(true);
  };

  const handleApply = async () => {
    const formData = await form.validateFields();
    const iframeConfig = agentConfig.current?.iframe;
    setIsApply(false);
    setAgentConfigAction({
      ...agentConfig.current,
      iframe: {
        ...iframeConfig,
        ...formData,
      },
    });
  };

  useImperativeHandle(ref, () => ({
    form,
  }));

  return (
    <div>
      <Form
        layout="vertical"
        form={form}
        preserve={false}
        onValuesChange={handleFormValuesChange}
      >
        <Row gutter={24}>
          <Col span={24}>
            <Form.Item
              name="projectDomain"
              label="项目地址"
              rules={formRules.projectDomain}
              getValueFromEvent={(e) => _.trim(e.target.value)}
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
      <Flex gap={8} justify="right">
        <Button disabled={!isApply} onClick={handleApply}>
          应用
        </Button>
      </Flex>
    </div>
  );
};

export default forwardRef(AgentIframeTab);
