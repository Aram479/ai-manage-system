import { useChatEvent } from "@/hooks/useChatEvent";
import { OrderToolsEvents, TOrderTools } from "@/tools/orderTools";
import { Button, Col, DatePicker, Form, FormProps, Input, Row } from "antd";
import dayjs from "dayjs";
import CreateOrderModalCmp from "./CreateOrderModalCmp";
import { useState } from "react";

interface ISearchForm extends FormProps {
  onSearch: (data?: any) => void;
  onReset: (data?: any) => void;
}

const { RangePicker } = DatePicker;

const SearchForm = (props: Partial<ISearchForm>) => {
  const { onSearch, onReset } = props;
  const [form] = Form.useForm();

  const handleSearch = () => {
    const values = form.getFieldsValue();
    onSearch?.(values);
  };

  const handleReset = () => {
    form.resetFields();
    onReset?.({});
  };

  useChatEvent<TOrderTools>((event) => {
    if (event.event == OrderToolsEvents.Search_Order) {
      form.setFieldsValue({
        orderNo: event.orderNo,
        orderName: event.orderName,
        createTime: [dayjs(event.startTime), dayjs(event.endTime)],
      });
      handleSearch();
    }
  });

  return (
    <div className="searchFormCmp">
      <Form layout="vertical" form={form} preserve={false}>
        <Row gutter={24}>
          <Col span={6}>
            <Form.Item name="orderNo" label="订单号">
              <Input placeholder="请输入" allowClear />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="orderName" label="订单名称">
              <Input placeholder="请输入" allowClear />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="createTime" label="创建时间-结束时间">
              <RangePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col flex="auto" className="sbom-form-btn-box">
            <Button type="primary" onClick={handleSearch}>
              查询
            </Button>
            <Button onClick={handleReset}>重置</Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default SearchForm;
