import { Dropdown, MenuProps } from "antd";
import { useState } from "react";
import BarItem from "../BarItem";
import TextColorModal from "./TextColorModal";
interface ITextColor {
  icon?: string;
  editor?: any;
  title?: string;
  isActive?: () => boolean;
}

const TextColor = (props: ITextColor) => {
  const { icon, editor, title, isActive } = props;
  const [isColorModal, setIsColorModal] = useState(false);

  const items: MenuProps["items"] = [
    {
      key: "setColor",
      label: "设置颜色",
      onClick: () => setIsColorModal(true),
    },
    {
      key: "clearColor",
      label: "清除颜色",
      onClick: () => editor.chain().focus().unsetColor().run(),
    },
  ];
  return (
    <>
      <Dropdown menu={{ items }} trigger={["click"]}>
        <BarItem title={title} icon={icon} isActive={isActive} />
      </Dropdown>
      <TextColorModal open={isColorModal} editor={editor} onOk={setIsColorModal} onCancel={setIsColorModal} />
    </>
  );
};

export default TextColor;
