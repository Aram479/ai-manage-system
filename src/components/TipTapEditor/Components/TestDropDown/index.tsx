import { Select } from "antd";

interface TestDropDown {
  icon?: string;
  editor?: any;
  title?: string;
  list?: TestDropDown[];
  action?: (data?: any) => void;
  isActive?: () => boolean;
}

const TestDropDown = (props: TestDropDown) => {
  const { icon, editor, title, list, isActive } = props;
  const handleTestDropDown = () => {
    editor.chain().focus().toggleBulletList().run();
  };
  const options = list.map((item) => ({ ...item, value: item.icon }));
  return (
    // <>{list && list.map((item) => <BarItem title={title} icon={icon} isActive={isActive} onClick={item.action} />)}</>
    <>
      {/* {list && list.map((item) => item.component?.({ ...item, editor }))} */}
      <Select
        options={options}
        defaultValue={options[0].value}
        optionRender={(option) => option.component?.({ ...option, editor })}
      />
    </>
  );
};

export default TestDropDown;
