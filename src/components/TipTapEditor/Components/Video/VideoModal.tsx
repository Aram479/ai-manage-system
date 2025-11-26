import { Form, Input, Modal } from "antd";
interface IVideoModal {
  open?: boolean;
  onOk?: (url: string) => void;
  onCancel?: () => void;
}
const VideoModal = (props: IVideoModal) => {
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
    const Expression = /http(s)?:\/\/(www\.)?(youtube\.com)|(youtu\.be)/;
    const objExp = new RegExp(Expression);
    if (!value || value.trim() === "") {
      return Promise.reject("请输入地址");
    }
    if (!objExp.test(value)) {
      return Promise.reject(["格式错误", " 目前只允许添加https://www.youtube.com或https://www.youtu.be前缀的视频链接"]);
    } else {
      return Promise.resolve();
    }
  };
  return (
    <div>
      <Modal title="视频" open={open} onOk={handleOk} onCancel={handleCancel} destroyOnHidden>
        <div>
          <Form form={form} preserve={false}>
            <Form.Item name="url" label="Youtube地址" rules={[{ required: true, validator: Urlvalidator }]}>
              <Input allowClear></Input>
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </div>
  );
};
export default VideoModal;
