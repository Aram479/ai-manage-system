import BarItem from "../BarItem";

interface IAlginLeft {
  icon?: string;
  editor?: any;
  title?: string;
  isActive?: () => boolean;
}

const AlginLeft = (props: IAlginLeft) => {
  const { icon, editor, title, isActive } = props;
  const handleAlginLeft = () => {
    editor.chain().focus().setTextAlign("left").run();
  };
  return (
    <>
      <BarItem title={title} icon={icon} isActive={isActive} onClick={handleAlginLeft} />
    </>
  );
};

export default AlginLeft;
