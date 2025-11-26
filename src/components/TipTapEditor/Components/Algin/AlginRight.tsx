import BarItem from "../BarItem";

interface IAlginRight {
  icon?: string;
  editor?: any;
  title?: string;
  isActive?: () => boolean;
}

const AlginRight = (props: IAlginRight) => {
  const { icon, editor, title, isActive } = props;
  const handleAlginRight = () => {
    editor.chain().focus().setTextAlign("right").run();
  };
  return (
    <>
      <BarItem title={title} icon={icon} isActive={isActive} onClick={handleAlginRight} />
    </>
  );
};

export default AlginRight;
