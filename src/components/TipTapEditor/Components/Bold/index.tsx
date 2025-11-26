interface IBold {
  icon?: string;
  editor?: any;
  title?: string;
  isActive?: () => boolean;
}

const Bold = (props: IBold) => {
  const { icon, editor, title, isActive } = props;
  const handleBold = () => {
    editor.chain().focus().toggleBold().run();
  };
  return (
    <>
      <button className={`menu-item ${isActive?.() ? "is-active" : ""}`} title={title} onClick={handleBold}>
        <i className={`ri-${icon}`}></i>
      </button>
    </>
  );
};

export default Bold;
