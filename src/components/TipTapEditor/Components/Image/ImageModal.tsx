import { Form, Input, Modal } from "antd";
interface IImageModal {
  open?: boolean;
  onOk?: (url: string) => void;
  onCancel?: () => void;
}
const ImageModal = (props: IImageModal) => {
  const { open, onOk, onCancel } = props;
  const [form] = Form.useForm();
  const handleOk = async () => {
    await form.validateFields();
    const url = form.getFieldValue("url");
    onOk?.(url);
  };
  const handleCancel = () => {
    onCancel?.();
  };
  const Urlvalidator = (_: any, value: string) => {
    const Expression = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;
    const objExp = new RegExp(Expression);
    if (!value || value.trim() === "") {
      return Promise.reject("请输入地址！");
    }
    if (!objExp.test(value)) {
      return Promise.reject("请输入正确的图片地址！");
    } else {
      return Promise.resolve();
    }
  };
  return (
    <div>
      <Modal title="图片" open={open} onOk={handleOk} onCancel={handleCancel} destroyOnHidden>
        <div>
          <Form form={form} preserve={false}>
            <Form.Item name="url" label="线上地址" rules={[{ required: true, validator: Urlvalidator }]}>
              <Input></Input>
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </div>
  );
};
export default ImageModal;
