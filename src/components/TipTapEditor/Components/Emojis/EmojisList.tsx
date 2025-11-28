import { Flex } from "antd";
import { Editor } from "@tiptap/core";
import {
  EmojiCategory,
  EmojiName,
  getEmojiPath,
  getEmojisByCategory,
} from "@/components/wechat-emojis/wechatEmoji";
import styles from "./index.less";

interface IEmojisList {
  editor?: Editor;
}

const EmojisList = (props: IEmojisList) => {
  const { editor } = props;
  // 所有表情
  const allEmojis = getEmojisByCategory(EmojiCategory.ALL);

  const handleEmoji = (emoji: (typeof allEmojis)[number]) => {
    editor?.chain().focus().setEmoji(emoji.name).run();
  };

  return (
    <Flex className={styles.emjiosBox} gap={3} wrap>
      {allEmojis.map((emoji) => (
        <img
          key={emoji.name}
          src={getEmojiPath(emoji.name as EmojiName) || ""}
          alt={emoji.name}
          className={styles.emojiItem}
          onClick={() => handleEmoji(emoji)}
        />
      ))}
    </Flex>
  );
};

export default EmojisList;
