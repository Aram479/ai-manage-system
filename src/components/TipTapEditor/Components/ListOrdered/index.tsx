import BarItem from "../BarItem";

interface ListOrdered {
  icon?: string;
  editor?: any;
  title?: string;
  isActive?: () => boolean;
}

const ListOrdered = (props: ListOrdered) => {
  const { icon, editor, title, isActive } = props;
  const handleListOrdered = () => {
    editor.chain().focus().toggleOrderedList().run();
  };
  return (
    <>
      <BarItem title={title} icon={icon} isActive={isActive} onClick={handleListOrdered} />
    </>
  );
};

export default ListOrdered;
