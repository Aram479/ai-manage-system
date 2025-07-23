import { useEffect } from "react";
import {
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  ModalProps,
  Row,
  Select,
} from "antd";
import { Rule } from "antd/es/form";
import {
  DeliveryTypeOptions,
  GoodsOptions,
  PayTypeOptions,
} from "@/constant//options";
import { useChatEvent } from "@/hooks/useChatEvent";
import dayjs from "dayjs";
import {
  OrderManageToolsEvents,
  TOrderManageTools,
} from "@/tools/orderManageTools";

interface ICreateOrderModalCmp extends ModalProps {
  onOk?: (data?: any) => void;
  onCancel?: (data?: any) => void;
}

const CreateOrderModalCmp = (props: ICreateOrderModalCmp) => {
  const { open, onOk, onCancel } = props;
  const [form] = Form.useForm();

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
      form.resetFields(["goodsPrice", "goodsCount", "goodsDesc"]);
    }
  };

  const handleConfirm = async () => {
    await form.validateFields();
    const formData = {
      ...form.getFieldsValue(true),
      orderNo: dayjs().format("YYYYMMDDss"),
    };
    const newData = {
      ...formData,
      orderNo: formData.orderNo || dayjs().format("YYYYMMDDhhmmss"),
    };
    onOk?.(newData);
  };

  const handleCencel = () => {
    onCancel?.(false);
  };

  useEffect(() => {
    // 打开/关闭清空数据
    if (!open) {
      resetAction();
    }
  }, [open]);

  useChatEvent<TOrderManageTools>((event) => {
    if (event.name === OrderManageToolsEvents.Create_Order) {
      const chatData = event.data;
      form.setFieldsValue({
        ...chatData,
        deliveryTime: chatData?.deliveryTime
          ? dayjs(chatData?.deliveryTime)
          : undefined,
      });
    }
  });

  return (
    <div>
      <Modal
        {...props}
        okText="提交"
        open={open}
        maskClosable={false}
        width={800}
        onOk={handleConfirm}
        onCancel={handleCencel}
      >
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
      </Modal>
    </div>
  );
};

export default CreateOrderModalCmp;
