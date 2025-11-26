interface IHeading2 {
  icon?: string;
  editor?: any;
  title?: string;
  isActive?: () => boolean;
}

const Heading2 = (props: IHeading2) => {
  const { icon, editor, title, isActive } = props;
  const handleHeading2 = () => {
    editor.chain().focus().toggleHeading({ level: 2 }).run();
  };
  return (
    <>
      <button className={`menu-item ${isActive?.() ? "is-active" : ""}`} title={title} onClick={handleHeading2}>
        <i className={`ri-${icon}`}></i>
      </button>
    </>
  );
};

export default Heading2;
