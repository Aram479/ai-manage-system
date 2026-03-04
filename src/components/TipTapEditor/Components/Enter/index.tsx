import BarItem from "../BarItem";

interface IEnter {
  icon?: string;
  editor?: any;
  title?: string;
  isActive?: () => boolean;
}

const Enter = (props: IEnter) => {
  const { icon, editor, title, isActive } = props;
  const handleEnter = () => {
    const { state } = editor.view;
    const endPosition = state.doc.content.size;
    // 在文档末尾插入换行
    editor.commands.insertContentAt(endPosition, "<p></p>");
  };
  return (
    <>
      <BarItem title={title} icon={icon} isActive={isActive} onClick={handleEnter} />
    </>
  );
};

export default Enter;
