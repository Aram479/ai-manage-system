import BarItem from "../BarItem";

interface IAlginCenter {
  icon?: string;
  editor?: any;
  title?: string;
  isActive?: () => boolean;
}

const AlginCenter = (props: IAlginCenter) => {
  const { icon, editor, title, isActive } = props;
  const handleAlginCenter = () => {
    editor.chain().focus().setTextAlign("center").run();
  };
  return (
    <>
      <BarItem title={title} icon={icon} isActive={isActive} onClick={handleAlginCenter} />
    </>
  );
};

export default AlginCenter;
