interface ICode {
  icon?: string;
  editor?: any;
  title?: string;
  isActive?: () => boolean;
}

const Code = (props: ICode) => {
  const { icon, editor, title, isActive } = props;
  const handleCode = () => {
    editor.chain().focus().toggleCode().run();
  };
  return (
    <>
      <button className={`menu-item ${isActive?.() ? "is-active" : ""}`} title={title} onClick={handleCode}>
        <i className={`ri-${icon}`}></i>
      </button>
    </>
  );
};

export default Code;
