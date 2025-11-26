interface IClearFormat {
  icon?: string;
  editor?: any;
  title?: string;
  isActive?: () => boolean;
}

const ClearFormat = (props: IClearFormat) => {
  const { icon, editor, title, isActive } = props;
  const handleClearFormat = () => {
    editor.chain().focus().clearNodes().unsetAllMarks().run();
    editor.chain().focus().unsetColor().run();
  };
  return (
    <>
      <button className={`menu-item ${isActive?.() ? "is-active" : ""}`} title={title} onClick={handleClearFormat}>
        <i className={`ri-${icon}`}></i>
      </button>
    </>
  );
};

export default ClearFormat;
