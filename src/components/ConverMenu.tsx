import { useEffect } from "react";
import { Conversations, ConversationsProps } from "@ant-design/x";
import { history, useSelectedRoutes } from "@umijs/max";
import { GetProp } from "antd";
import _ from "lodash";

const ConverMenu = () => {
  const routes = useSelectedRoutes();

  const items: GetProp<ConversationsProps, 'items'> = Array.from({ length: 3 }).map((_, index) => ({
    key: `item${index + 1}`,
    label: `Conversation Item ${index + 1}`,
  }));

  const handleMenuItem: ConversationsProps["onActiveChange"] = (value) => {
    history.push(value);
  };
  useEffect(() => {
    console.log("routes", _.find(routes, ["pathname", "/"])?.route);
  }, []);
  return (
    <div>
      <Conversations
        items={items}
        defaultActiveKey="item1"
        onActiveChange={handleMenuItem}
      />
    </div>
  );
};

export default ConverMenu;
