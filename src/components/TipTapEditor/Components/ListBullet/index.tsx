import BarItem from "../BarItem";

interface ListBullet {
  icon?: string;
  editor?: any;
  title?: string;
  isActive?: () => boolean;
}

const ListBullet = (props: ListBullet) => {
  const { icon, editor, title, isActive } = props;
  const handleListBullet = () => {
    editor.chain().focus().toggleBulletList().run();
  };
  return (
    <>
      <BarItem title={title} icon={icon} isActive={isActive} onClick={handleListBullet} />
    </>
  );
};

export default ListBullet;
