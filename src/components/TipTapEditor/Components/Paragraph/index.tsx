interface IParagraph {
  icon?: string;
  editor?: any;
  title?: string;
  isActive?: () => boolean;
}

const Paragraph = (props: IParagraph) => {
  const { icon, editor, title, isActive } = props;
  const handleParagraph = () => {
    editor.chain().focus().setParagraph().run();
  };
  return (
    <>
      <button className={`menu-item ${isActive?.() ? "is-active" : ""}`} title={title} onClick={handleParagraph}>
        <i className={`ri-${icon}`}></i>
      </button>
    </>
  );
};

export default Paragraph;
