import BarItem from "../BarItem";

interface IAlginJustify {
  icon?: string;
  editor?: any;
  title?: string;
  isActive?: () => boolean;
}

const AlginJustify = (props: IAlginJustify) => {
  const { icon, editor, title, isActive } = props;
  const handleAlginJustify = () => {
    editor.chain().focus().setTextAlign("justify").run();
  };
  return (
    <>
      <BarItem title={title} icon={icon} isActive={isActive} onClick={handleAlginJustify} />
    </>
  );
};

export default AlginJustify;
