import { Input, Modal } from "antd";
import { useState } from "react";
interface ITextColorModal {
  open?: boolean;
  editor?: any;
  onOk?: (data: any) => void;
  onCancel?: (data: any) => void;
}
const TextColorModal = (props: ITextColorModal) => {
  const { open, editor, onOk, onCancel } = props;
  const [color, setColor] = useState("");
  const onColorPickerBlur = (color: string) => {
    setColor(color);
  };
  const handleSetColor = () => {
    editor.chain().focus().setColor(color).run();
    onOk?.(false);
  };
  return (
    <>
      <Modal title="文字颜色" open={open} onOk={handleSetColor} onCancel={() => onCancel?.(false)} destroyOnHidden>
        <div style={{ display: "flex", alignItems: "center" }}>
          <span>文字颜色：</span>
          <Input type="color" style={{ width: 30, padding: "0" }} onBlur={(e) => onColorPickerBlur(e.target.value)} />
        </div>
      </Modal>
    </>
  );
};

export default TextColorModal;
