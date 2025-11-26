interface IUndo {
  icon?: string;
  editor?: any;
  title?: string;
  isActive?: () => boolean;
}

const Undo = (props: IUndo) => {
  const { icon, editor, title, isActive } = props;
  const handleUndo = () => {
    editor.chain().focus().undo().run();
  };
  return (
    <>
      <button className={`menu-item ${isActive?.() ? "is-active" : ""}`} title={title} onClick={handleUndo}>
        <i className={`ri-${icon}`}></i>
      </button>
    </>
  );
};

export default Undo;
