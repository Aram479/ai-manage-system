import { Position, useNodeId, useReactFlow } from "@xyflow/react";
import { Button, Col, DatePicker, Form, InputNumber, Row } from "antd";
import { FormItemProps } from "antd/lib";
import { DOMAttributes, useEffect, useState } from "react";
import dayjs from "dayjs";
import _ from "lodash";

type TFormData = {
  startTime?: number;
  startDate?: string;
};

interface IStartDetailProps {
  open?: boolean;
  title?: string;
  data?: any;
  onConfirm?: (data?: any) => void;
  onCancel?: (data?: any) => void;
}

const StartDetail = (props: IStartDetailProps) => {
  const { open, data, onConfirm, onCancel } = props;
  const nodeId = useNodeId();
  const { updateNode, updateNodeData, getNodeConnections } = useReactFlow();
  const [form] = Form.useForm<TFormData>();
  const [formItemProps, setFormItemProps] = useState<
    Record<keyof TFormData, FormItemProps>
  >({
    startTime: {
      name: "startTime",
      label: "开始时间",
      rules: [{ required: false }],
    },
    startDate: {
      name: "startDate",
      label: "开始日期",
      rules: [{ required: false }],
    },
  });

  const sourceHandleAction: (
    handleId?: string
  ) => Record<keyof TFormData, DOMAttributes<any>> = (handleId) => {
    const formValues = form.getFieldsValue();
    return {
      startTime: {
        onClick: () => {
          const connectionsByHandle = getNodeConnections({
            nodeId: nodeId!,
            handleId,
            type: "source",
          });
          setTimeout(() => {
            connectionsByHandle.forEach((item) => {
              updateNodeData(item.target, {
                isStart: true,
              });
            });
          }, formValues.startTime! * 1000);
        },
      },
      startDate: {},
    };
  };

  const updateAction = async () => {
    const values = await form.validateFields();
    const newValues = {
      ...values,
      startDate:
        values.startDate &&
        dayjs(values.startDate).format("YYYY-MM-DD HH:mm:ss"),
    };

    const valuesToKeys = Object.keys(newValues) as Array<keyof TFormData>;
    const handleList = valuesToKeys
      .filter((key) => newValues[key])
      .map((key) => {
        const handleId = `${nodeId}-${key}`;
        const handleItem: BaseNodeProps["list"][number] = {
          label: formItemProps[key].label as string,
          value: newValues[key],
          handles: [
            {
              id: `${handleId}-${Position.Right}`,
              type: "source",
              position: Position.Right,
              isConnectable: true,
            },
          ],
          ...sourceHandleAction(`${handleId}-${Position.Right}`)[key],
        };
        return handleItem;
      });
    updateNodeData(nodeId!, {
      ...newValues,
      list: handleList,
    });
  };

  const handleConfirm = async () => {
    const values = await form.validateFields();
    const newValues = {
      ...values,
      startDate:
        values.startDate &&
        dayjs(values.startDate).format("YYYY-MM-DD HH:mm:ss"),
    };
    updateAction();
    onConfirm?.(newValues);
  };

  useEffect(() => {
    if (open && data) {
      form.setFieldsValue({
        ...data,
        startDate:
          data?.startDate && dayjs(data?.startDate, "YYYY-MM-DD HH:mm:ss"),
      });
    }
  }, [open, data]);

  return (
    <>
      {open && (
        <div className="workflow-popover">
          <Form name="form_in_modal" layout="vertical" form={form}>
            <Row gutter={24}>
              <Col span={24}>
                <Form.Item {...formItemProps.startTime}>
                  <InputNumber
                    controls={false}
                    style={{ width: "100%" }}
                    suffix={<div style={{ color: "#00000040" }}>s</div>}
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item {...formItemProps.startDate}>
                  <DatePicker style={{ width: "100%" }} />
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
        </div>
      )}
    </>
  );
};

export default StartDetail;
