import { EditOutlined, LoginOutlined, RedoOutlined } from "@ant-design/icons";
import { BubbleMenu } from "@tiptap/react";
import { Button, Form, Input, Modal } from "antd";
import { useEffect, useImperativeHandle } from "react";
interface IProps {
  url?: string;
  open?: boolean;
  editor?: any;
  linkRef?: any;
  onEdit?: (data: any) => void;
  onSave?: (url: string) => void;
  onCancel?: () => void;
  onRemove?: () => void;
}
const LinkModal = (props: IProps) => {
  const { url, open, linkRef, editor, onSave, onCancel, onEdit, onRemove } = props;
  const [form] = Form.useForm();
  const handleOK = async () => {
    const linkUrl = form.getFieldValue("link");
    onSave?.(linkUrl);
  };
  const shouldShow = (showData: any) => {
    const { editor, from, to } = showData;
    // only show the bubble menu for links.
    return from === to && editor.isActive("link");
  };
  const handleRemove = () => {
    form.resetFields();
    onRemove?.();
  };
  useImperativeHandle(linkRef, () => ({
    resetForm: (url: string) => {
      form.resetFields();
    },
  }));
  const removeLink = () => {
    editor.chain().focus().extendMarkRange("link").unsetLink().run();
  };
  const enterLink = () => {
    const url = editor.getAttributes("link").href;
    window.open(url);
  };
  useEffect(() => {
    form.setFieldsValue({
      link: url,
    });
  }, [open]);
  return (
    <div>
      <Modal
        title="链接"
        open={open}
        onCancel={onCancel}
        footer={[
          <Button key="reset" onClick={handleRemove}>
            重置
          </Button>,
          <Button key="save" onClick={handleOK}>
            保存
          </Button>,
        ]}
        destroyOnHidden
      >
        <Form form={form} name="basic" preserve={false}>
          <Form.Item label="link" name="link">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
      <BubbleMenu
        className="bubble-menu-light"
        tippyOptions={{ duration: 150 }}
        editor={editor}
        shouldShow={shouldShow}
      >
        <Button shape="circle" title="修改" icon={<EditOutlined />} onClick={onEdit}></Button>
        <Button type="primary" danger shape="circle" title="重置" icon={<RedoOutlined />} onClick={removeLink}></Button>
        <Button type="primary" shape="circle" title="访问" icon={<LoginOutlined />} onClick={enterLink}></Button>
      </BubbleMenu>
    </div>
  );
};
export default LinkModal;
