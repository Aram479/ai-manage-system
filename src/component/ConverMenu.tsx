import { Conversations, ConversationsProps } from "@ant-design/x";
import { history } from "@umijs/max";
import { GetProp } from "antd";
import React from "react";

const ConverMenu = () => {
  const items: GetProp<ConversationsProps, "items"> = Array.from({
    length: 10,
  }).map((_, index) => ({
    key: `item${index + 1}`,
    label: `Conversation Item ${index + 1}`,
    disabled: index === 3,
    group: index > 5 ? "本周" : "今天",
  }));

  const handleMenuItem: ConversationsProps["onActiveChange"] = (value) => {
    history.push(value);
  };
  return (
    <div>
      <Conversations
        items={items}
        defaultActiveKey="item1"
        groupable
        onActiveChange={handleMenuItem}
      />
    </div>
  );
};

export default ConverMenu;
