import { Editor } from "@tiptap/react";
interface IHeading1 {
  icon?: string;
  editor?: Editor;
  title?: string;
  isActive?: () => boolean;
}

const Heading1 = (props: IHeading1) => {
  const { icon, editor, title, isActive } = props;
  const handleHeading1 = () => {
    editor.chain().focus().toggleHeading({ level: 1 }).run();
  };
  return (
    <>
      <button className={`menu-item ${isActive?.() ? "is-active" : ""}`} title={title} onClick={handleHeading1}>
        <i className={`ri-${icon}`}></i>
      </button>
    </>
  );
};

export default Heading1;
