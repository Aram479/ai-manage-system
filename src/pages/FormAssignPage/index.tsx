import React, { useEffect, useState } from "react";
import { useRequest } from "@umijs/max";
import {
  Card,
  Col,
  DatePicker,
  Flex,
  Form,
  Input,
  message,
  Modal,
  ModalProps,
  Row,
  Select,
  Switch,
} from "antd";
import { Rule } from "antd/es/form";
import {
  DeliveryTypeOptions,
  GoodsOptions,
  PayTypeOptions,
} from "@/constant//options";
import { useChatEvent } from "@/hooks/useChatEvent";
import dayjs from "dayjs";
import { useFieldEvent } from "@/hooks/useFieldEvent";
import {
  FormAssignPageToolsEvents,
  TFormAssignPageTools,
} from "@/tools/formAssignPageTools";

interface IFormAssignPage extends ModalProps {
  onOk?: (data?: any) => void;
  onCancel?: (data?: any) => void;
}

const FormAssignPage = (props: IFormAssignPage) => {
  const { open, onOk, onCancel } = props;
  const [form] = Form.useForm();
  // 是否实时赋值
  const [isAutoAssign, setIsAutoAssign] = useState(false);
  const formRules: Record<string, Rule[]> = {
    username: [{ required: true }],
    goodsName: [{ required: true }],
    goodsPrice: [],
    goodsCount: [],
    goodsDesc: [],
    goodsTotalPrice: [],
    payType: [{ required: true }],
    deliveryType: [{ required: true }],
    deliveryTime: [],
  };

  // Modal销毁时清空数据
  const resetAction = () => {
    form.resetFields();
  };

  const handleGoodsChange = (value: any, item: any) => {
    if (item) {
      form.setFieldsValue({
        goodsPrice: item.price,
        goodsCount: item.count,
        goodsDesc: item.desc,
      });
    } else {
      resetAction();
    }
  };

  const handleConfirm = async () => {
    await form.validateFields();
    const formData = form.getFieldsValue(true);
    message.success("创建成功");
    onOk?.(formData);
  };

  const handleCencel = () => {
    onCancel?.(false);
  };

  const setFormDataAction = (chatData: TFormAssignPageTools["data"]) => {
    form.setFieldValue("userName", chatData?.userName);
    form.setFieldValue("goodsName", chatData?.goodsName);
    form.setFieldValue("goodsPrice", chatData?.goodsPrice);
    form.setFieldValue("goodsDesc", chatData?.goodsDesc);
    form.setFieldValue("goodsCount", chatData?.goodsCount);
    form.setFieldValue("payType", chatData?.payType);
    form.setFieldValue("deliveryType", chatData?.deliveryType);
    form.setFieldValue(
      "deliveryTime",
      chatData?.deliveryTime ? dayjs(chatData?.deliveryTime) : undefined
    );
  };

  useChatEvent<TFormAssignPageTools>((event) => {
    if (!isAutoAssign) {
      if (event.name === FormAssignPageToolsEvents.Create_Form) {
        const chatData = event.data;
        setFormDataAction(chatData)
        // handleConfirm();
      }
    }
  });

  useFieldEvent<TFormAssignPageTools>((event) => {
    if (isAutoAssign) {
      if (event.name === FormAssignPageToolsEvents.Create_Form) {
        const chatData = event.data;
        setFormDataAction(chatData);
      }
    }
  });

  useEffect(() => {
    // 打开/关闭清空数据
    if (!open) {
      resetAction();
    }
  }, [open]);

  return (
    <div className="dap-main-content">
      <Card>
        <div>
          实时赋值：
          <Switch onChange={setIsAutoAssign} />
        </div>
        <Form layout="vertical" form={form}>
          <Row gutter={24}>
            <Col span={6}>
              <Form.Item
                name="userName"
                label={"用户名"}
                rules={formRules.plant}
              >
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="goodsName"
                label="商品名称"
                rules={formRules.goodsName}
              >
                <Select
                  options={GoodsOptions}
                  allowClear
                  placeholder="请选择"
                  onChange={handleGoodsChange}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={6}>
              <Form.Item
                name="goodsPrice"
                label="商品价格"
                rules={formRules.goodsPrice}
              >
                <Input disabled placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="goodsDesc"
                label="商品描述"
                rules={formRules.goodsDesc}
              >
                <Input disabled placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="goodsCount"
                label="商品数量"
                rules={formRules.goodsCount}
              >
                <Input disabled placeholder="请输入" />
              </Form.Item>
            </Col>
            {/* <Col span={6}>
              <Form.Item
                name="goodsTotalPrice"
                label="商品总价"
                rules={formRules.goodsTotalPrice}
              >
                <Input disabled placeholder="请输入" />
              </Form.Item>
            </Col> */}
          </Row>
          <Row gutter={24}>
            <Col span={6}>
              <Form.Item
                name="payType"
                label="支付方式"
                rules={formRules.payType}
              >
                <Select
                  placeholder="请选择"
                  allowClear
                  options={PayTypeOptions}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="deliveryType"
                label="配送方式"
                rules={formRules.deliveryType}
              >
                <Select
                  placeholder="请选择"
                  allowClear
                  options={DeliveryTypeOptions}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="deliveryTime"
                label="配送时间"
                rules={formRules.deliveryTime}
              >
                <DatePicker placeholder="请选择" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
    </div>
  );
};

export default FormAssignPage;
