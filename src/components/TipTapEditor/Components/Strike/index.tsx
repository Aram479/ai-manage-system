interface IStrike {
  icon?: string;
  editor?: any;
  title?: string;
  isActive?: () => boolean;
}

const Strike = (props: IStrike) => {
  const { icon, editor, title, isActive } = props;
  const handleStrike = () => {
    editor.chain().focus().toggleStrike().run();
  };
  return (
    <>
      <button className={`menu-item ${isActive?.() ? "is-active" : ""}`} title={title} onClick={handleStrike}>
        <i className={`ri-${icon}`}></i>
      </button>
    </>
  );
};

export default Strike;
