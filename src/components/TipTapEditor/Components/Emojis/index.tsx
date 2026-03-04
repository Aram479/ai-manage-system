import { Popover } from "antd";
import EmojisList from "./EmojisList";
interface IEmojis {
  icon?: string;
  editor?: any;
  title?: string;
  isActive?: () => boolean;
}

const Emojis = (props: IEmojis) => {
  const { icon, editor, title, isActive } = props;
  return (
    <Popover content={<EmojisList editor={editor} />} trigger={["click"]}>
      <button
        className={`menu-item ${isActive?.() ? "is-active" : ""}`}
        title={title}
      >
        <i className={`ri-${icon}`} style={{ fontSize: 20 }}></i>
      </button>
    </Popover>
  );
};

export default Emojis;
