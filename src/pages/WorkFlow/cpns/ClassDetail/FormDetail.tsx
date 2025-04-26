import { Position, useNodeId, useReactFlow } from "@xyflow/react";
import { Button, Col, Form, Row, Input } from "antd";
import { Rule } from "antd/es/form";
import { FormItemProps } from "antd/lib";
import { DOMAttributes, useEffect, useState } from "react";

type TFormData = {
  message?: number;
};

interface IStartDetailProps {
  data?: any;
  onCancel?: (data?: any) => void;
  onConfirm?: (data?: any) => void;
}
const { TextArea } = Input;

const FormDetail = (props: IStartDetailProps) => {
  const { data, onCancel, onConfirm } = props;
  const nodeId = useNodeId();
  const { updateNode, updateNodeData, getNodeConnections, getNode } =
    useReactFlow();
  const currentNodeData = getNode(nodeId!);
  const [form] = Form.useForm<TFormData>();
  const [formItemProps, setFormItemProps] = useState<
    Record<keyof TFormData, FormItemProps>
  >({
    message: {
      name: "message",
      label: "消息",
      rules: [{ required: false }],
    },
  });

  const sourceHandleAction: (
    handleId?: string
  ) => Record<keyof TFormData, DOMAttributes<any>> = (handleId) => {
    const formValues = form.getFieldsValue();
    return {
      message: {
        onClick: () => {
          const connectionsByHandle = getNodeConnections({
            nodeId: nodeId!,
            handleId,
            type: "source",
          });
          connectionsByHandle.forEach((item) => {
            updateNodeData(item.target, {
              isStart: true,
            });
          });
        },
      },
      startDate: {},
    };
  };

  const updateAction = async () => {
    const values = await form.validateFields();
    const newValues = {
      ...values,
    };
    const valuesToKeys = Object.keys(newValues) as Array<keyof TFormData>;
    const handleList = valuesToKeys
      .filter((key) => newValues[key])
      .map((key, index) => {
        const handleId = `${nodeId}-${key}`;
        const handleItem: BaseNodeProps["list"][number] = {
          id: values[key],
          label: formItemProps[key].label as string,
          value: newValues[key],
          handles: [
            {
              id: `${handleId}-${Position.Right}`,
              type: "source",
              position: Position.Right,
              isConnectable: true,
            },
            {
              id: `${handleId}-${Position.Left}`,
              type: "target",
              position: Position.Left,
              isConnectable: true,
            },
          ],
          ...sourceHandleAction(`${handleId}-${Position.Right}`)[key],
        };
        return handleItem;
      });

    const newList = (
      (currentNodeData?.data.list as BaseNodeProps["list"]) ?? []
    )?.concat(handleList);

    updateNodeData(nodeId!, {
      ...newValues,
      list: newList,
    });
  };

  const handleConfirm = async () => {
    const values = await form.validateFields();
    const newValues = {
      ...values,
    };
    updateAction();
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
            <Form.Item {...formItemProps.message}>
              <TextArea rows={4} placeholder="请输入对话内容" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <div className="form-btn-box">
        <Button onClick={onCancel}>取消</Button>
        <Button type="primary" onClick={handleConfirm}>
          确定
        </Button>
      </div>
    </>
  );
};

export default FormDetail;
