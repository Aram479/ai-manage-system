interface IRedo {
  icon?: string;
  editor?: any;
  title?: string;
  isActive?: () => boolean;
}

const Redo = (props: IRedo) => {
  const { icon, editor, title, isActive } = props;
  const handleRedo = () => {
    editor.chain().focus().redo().run();
  };
  return (
    <>
      <button className={`menu-item ${isActive?.() ? "is-active" : ""}`} title={title} onClick={handleRedo}>
        <i className={`ri-${icon}`}></i>
      </button>
    </>
  );
};

export default Redo;
