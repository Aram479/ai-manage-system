import { useState } from "react";
import BarItem from "../BarItem";
import PreviewModal from "./PreviewModal";
interface IPreview {
  icon?: string;
  editor?: any;
  title?: string;
  isActive?: () => boolean;
}

const Preview = (props: IPreview) => {
  const { icon, editor, title, isActive } = props;
  const [editorData, setEditorData] = useState("");
  const [isPreview, setIsPreview] = useState(false);
  const handlePreview = () => {
    // editor.getHTML() // 这个获取的html没有原样输出
    // editor.view.dom.innerHTML
    setEditorData(editor.view.dom.innerHTML);
    setIsPreview(true);
  };
  return (
    <>
      <BarItem title={title} icon={icon} isActive={isActive} onClick={handlePreview} />
      <PreviewModal
        open={isPreview}
        onOk={(bol) => setIsPreview(bol)}
        onCancel={(bol) => setIsPreview(bol)}
        editorData={editorData}
      />
    </>
  );
};

export default Preview;
