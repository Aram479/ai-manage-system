import { Flex } from "antd";
import {
  EmojiCategory,
  EmojiName,
  getEmojiPath,
  getEmojisByCategory,
} from "@/components/wechat-emojis/wechatEmoji";
import styles from "./index.less";
import { Editor } from "@tiptap/core";

interface IEmojisList {
  editor?: Editor;
}

const EmojisList = (props: IEmojisList) => {
  const { editor } = props;
  const faceEmojis = getEmojisByCategory(EmojiCategory.FACE);

  const handleEmoji = (emoji: (typeof faceEmojis)[number]) => {
    editor?.chain().focus().setEmoji(emoji.name).run();
  };

  return (
    <Flex className={styles.emjiosBox} gap={3} wrap>
      {faceEmojis.map((emoji) => (
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

export default EmojisList