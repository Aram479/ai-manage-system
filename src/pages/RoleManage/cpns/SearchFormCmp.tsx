import { RoleOptions } from "@/constant/options";
import { useChatEvent } from "@/hooks/useChatEvent";
import {
  RoleManageToolsEvents,
  TRoleManageTools,
} from "@/tools/roleManageTools";
import { Button, Col, DatePicker, Form, FormProps, Row, Select } from "antd";
import dayjs from "dayjs";

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

  useChatEvent<TRoleManageTools>((event) => {
    if (event.name === RoleManageToolsEvents.Search_Role) {
      const chatData = event.data;
      if (chatData) {
        form.setFieldsValue({
          ...chatData,
          createTime: chatData.createTime
            ? dayjs(chatData.createTime)
            : undefined,
        });
      }
    }
  });

  return (
    <div className="searchFormCmp">
      <Form name="form_in_modal" layout="vertical" form={form} preserve={false}>
        <Row gutter={24}>
          <Col span={6}>
            <Form.Item name="role" label="角色">
              <Select placeholder="请选择" options={RoleOptions} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="createTime" label="创建时间">
              <DatePicker style={{ width: "100%" }} />
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
