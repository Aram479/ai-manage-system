import { Form, InputNumber, Modal } from "antd";

interface ITableCreate {
  open: boolean;
  onOk?: (data?: any) => void;
  onCancel?: () => void;
}
const TableCreateModal = (props: ITableCreate) => {
  const { open, onOk, onCancel } = props;
  const [form] = Form.useForm();
  const handleOk = () => {
    const data = form.getFieldsValue();
    onOk?.(data);
  };
  const handleCancel = () => {
    onCancel?.();
  };
  return (
    <>
      <Modal title="创建表格" open={open} onOk={handleOk} onCancel={handleCancel} destroyOnHidden>
        <Form
          form={form}
          name="basic"
          preserve={false}
          initialValues={{
            rows: 3,
            cols: 3,
          }}
        >
          <Form.Item label="行" name="rows">
            <InputNumber min={1} controls={false} precision={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item label="列" name="cols">
            <InputNumber min={1} controls={false} precision={0} style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default TableCreateModal;
