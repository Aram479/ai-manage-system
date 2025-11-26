interface IHighlight {
  icon?: string;
  editor?: any;
  title?: string;
  isActive?: () => boolean;
}

const Highlight = (props: IHighlight) => {
  const { icon, editor, title, isActive } = props;
  const handleHighlight = () => {
    editor.chain().focus().toggleHighlight().run();
  };
  return (
    <>
      <button className={`menu-item ${isActive?.() ? "is-active" : ""}`} title={title} onClick={handleHighlight}>
        <i className={`ri-${icon}`}></i>
      </button>
    </>
  );
};

export default Highlight;
