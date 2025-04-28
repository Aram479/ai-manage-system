import { Node, Position, useNodeId, useReactFlow } from "@xyflow/react";
import { Button, Col, Form, Row, Input } from "antd";
import { Rule } from "antd/es/form";
import { FormItemProps } from "antd/lib";
import { DOMAttributes, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

type TFormData = {
  message?: string;
};

interface IStartDetailProps {
  onCancel?: (data?: any) => void;
  onConfirm?: (data?: any) => void;
}
const { TextArea } = Input;

const FormDetail = (props: IStartDetailProps) => {
  const { onCancel, onConfirm } = props;
  const { updateNode, updateNodeData, getNodeConnections, getNode } =
    useReactFlow<Node<Partial<BaseNodeProps>>>();
  const nodeId = useNodeId();
  const currentNode = getNode(nodeId!);
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
  const resetAction = () => {
    updateNodeData(nodeId!, {
      formData: undefined,
    });
    form.resetFields();
  };

  const sourceHandleAction: (info: {
    handleId?: string;
    message?: string;
  }) => Record<keyof TFormData, DOMAttributes<any>> = ({
    handleId,
    message,
  }) => {
    return {
      message: {
        onClick: (clickItem) => {
          // 必须重新定义，否则数据拿不到最新的
          const changeCurrentNode = getNode(nodeId!);
          const connectionsByHandle = getNodeConnections({
            nodeId: nodeId!,
            handleId,
            type: "source",
          });

          const nodeDataList =
            (changeCurrentNode?.data.list as BaseNodeProps["list"]) ?? [];
          const executeItem = nodeDataList.find(
            (item) => item.id === clickItem.id
          );
          if (executeItem) {
            executeItem.isStart = true;
          }
          connectionsByHandle.forEach((item) => {
            updateNodeData(item.source, {
              execute: executeItem,
            });
          });
        },
      },
    };
  };

  const createAction = async () => {
    const values = await form.validateFields();
    const newValues = {
      ...values,
    };
    // const handleId = `${nodeId}-${formItemProps.message.name}`;
    const itemId = uuidv4();
    const rightId = uuidv4();
    const leftId = uuidv4();
    const handleItem: BaseNodeProps["list"][number] = {
      id: itemId,
      label: formItemProps.message.label as string,
      value: newValues.message,
      isStart: false,
      handles: [
        {
          id: rightId, // `${handleId}-${Position.Right}`
          type: "source",
          position: Position.Right,
        },
        {
          id: leftId, // `${handleId}-${Position.Left}`
          type: "target",
          position: Position.Left,
        },
      ],
      ...sourceHandleAction({
        handleId: rightId,
        message: newValues.message,
      })["message"],
    };
    const nodeDataList =
      (currentNode?.data.list as BaseNodeProps["list"]) ?? [];
    const newList = [...nodeDataList, handleItem];

    updateNodeData(nodeId!, {
      list: newList,
    });
    resetAction();
  };

  const updateAction = async () => {
    const values = await form.validateFields();
    const newValues = {
      ...values,
    };

    const nodeDataList =
      (currentNode?.data.list as BaseNodeProps["list"]) ?? [];
    const index = nodeDataList.findIndex(
      (item) => item.id === currentNode?.data.formData?.id
    );
    nodeDataList[index] = {
      ...nodeDataList[index],
      value: newValues.message,
    };

    updateNodeData(nodeId!, {
      list: nodeDataList,
    });
    resetAction();
  };
  const handleCancel = () => {
    resetAction();
    onCancel?.();
  };

  const handleConfirm = async () => {
    const values = await form.validateFields();
    const newValues = {
      ...values,
    };
    if (!currentNode?.data.formData) {
      createAction();
    } else {
      updateAction();
    }
    onConfirm?.(newValues);
  };

  useEffect(() => {
    if (currentNode?.data.formData) {
      form.setFieldsValue({
        ...currentNode?.data.formData,
        message: currentNode?.data.formData?.value,
      });
    }
  }, [currentNode?.data]);

  useEffect(() => {
    if (!currentNode?.selected) {
      resetAction();
    }
  }, [currentNode?.selected]);
  return (
    <>
      <Form name="form_in_modal" layout="vertical" form={form} preserve={false}>
        <Row gutter={24}>
          <Col span={24}>
            <Form.Item {...formItemProps.message}>
              <TextArea rows={4} placeholder="请输入对话内容" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <div className="form-btn-box">
        <Button onClick={handleCancel}>取消</Button>
        <Button type="primary" onClick={handleConfirm}>
          确定
        </Button>
      </div>
    </>
  );
};

export default FormDetail;
