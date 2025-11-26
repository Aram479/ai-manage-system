import { Modal } from "antd";
import "../../styles.less";
interface IPreviewModal {
  open?: boolean;
  editorData?: string;
  onOk?: (data: any) => void;
  onCancel?: (data: any) => void;
}
const PreviewModal = (props: IPreviewModal) => {
  const { open, editorData = "", onOk, onCancel } = props;
  return (
    <>
      <Modal
        width={1000}
        title="预览"
        open={open}
        onOk={() => onOk?.(false)}
        onCancel={() => onCancel?.(false)}
        destroyOnHidden
      >
        <div className="tiptap_preview tiptap ProseMirror" dangerouslySetInnerHTML={{ __html: editorData }}></div>
      </Modal>
    </>
  );
};

export default PreviewModal;
