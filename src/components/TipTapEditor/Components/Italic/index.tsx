interface IItalic {
  icon?: string;
  editor?: any;
  title?: string;
  isActive?: () => boolean;
}

const Italic = (props: IItalic) => {
  const { icon, editor, title, isActive } = props;
  const handleItalic = () => {
    editor.chain().focus().toggleItalic().run();
  };
  return (
    <>
      <button className={`menu-item ${isActive?.() ? "is-active" : ""}`} title={title} onClick={handleItalic}>
        <i className={`ri-${icon}`}></i>
      </button>
    </>
  );
};

export default Italic;
