import { useChatEvent } from "@/hooks/useChatEvent";
import {
  Button,
  Col,
  DatePicker,
  Form,
  FormProps,
  Input,
  InputNumber,
  Row,
} from "antd";
import dayjs, { Dayjs } from "dayjs";
import {
  OrderManageToolsEvents,
  TOrderManageTools,
} from "@/tools/orderManageTools";

interface ISearchForm extends FormProps {
  onSearch: (data?: any) => void;
  onReset: (data?: any) => void;
}
export type TOrderFormData = {
  userName?: string;
  goodsName?: string;
  goodsPrice?: number;
  createTime?: Dayjs;
};

const SearchForm = (props: Partial<ISearchForm>) => {
  const { onSearch, onReset } = props;
  const [form] = Form.useForm<TOrderFormData>();

  const handleSearch = () => {
    const values = form.getFieldsValue();
    onSearch?.(values);
  };

  const handleReset = () => {
    form.resetFields();
    onReset?.({});
  };

  useChatEvent<TOrderManageTools>((event) => {
    if (event.name === OrderManageToolsEvents.Search_Order) {
      const chatData = event.data;
      form.setFieldsValue({
        ...chatData,
        createTime: chatData?.createTime
          ? dayjs(chatData?.createTime)
          : undefined,
      });
      handleSearch();
    }
  });

  return (
    <div className="searchFormCmp">
      <Form layout="vertical" form={form} preserve={false}>
        <Row gutter={24}>
          <Col span={6}>
            <Form.Item name="userName" label="用户名称">
              <Input placeholder="请输入" allowClear />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="goodsName" label="商品名称">
              <Input placeholder="请输入" allowClear />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="goodsPrice" label="商品价格">
              <InputNumber
                placeholder="请输入"
                controls={false}
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="createTime" label="创建时间">
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col flex="auto" className="form-btn-box">
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
