import { Flex, Tooltip } from "antd";
import styles from "./index.less";
type TCommandItem = {
  key: string | number;
  label?: string;
  value?: string;
};

export interface ICommandListProps {
  items: TCommandItem[];
  onItemClick?: (data: TCommandItem) => void;
}

const CommandList = (props: ICommandListProps) => {
  const { items = [], onItemClick } = props;

  const handleCommandClick = (item: TCommandItem) => {
    onItemClick?.(item);
  };

  return (
    <Flex vertical gap={16} className={styles.commandList}>
      {items.map((item) => (
        <Tooltip
          key={item.key}
          placement="left"
          title={item.value}
          arrow={false}
        >
          <Flex
            className={styles.commandItem}
            gap={5}
            vertical
            onClick={() => handleCommandClick(item)}
          >
            <div className={styles.title}>{item.label ?? "标题"}</div>
            <div className={`${styles.content} doubleLine`}>
              {item.value ?? "无"}
            </div>
          </Flex>
        </Tooltip>
      ))}
    </Flex>
  );
};

export default CommandList;
