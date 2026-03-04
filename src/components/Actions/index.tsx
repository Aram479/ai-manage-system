import { CSSProperties, MouseEventHandler, ReactNode } from "react";
import { Dropdown, MenuProps } from "antd";
import { Tooltip } from "antd/lib";
import { EllipsisOutlined } from "@ant-design/icons";
import _ from "lodash";
import styles from "./index.less";

type TActionItemType<T = any> = {
  key: string;
  label?: string;
  disabled?: boolean;
  icon?: ReactNode;
  children?: MenuProps["items"];
  onItemClick?: (itemData?: T, event?: MouseEventHandler<any>) => void;
};

export interface IActionsProps<T = any> {
  className?: string;
  items: TActionItemType<T>[];
  itemData?: T; // 用于onItemClick返回数据
  style?: CSSProperties;
  onClick?: (event?: MouseEventHandler<any>) => void;
}

const Actions = (props: IActionsProps) => {
  const { className = '', items, itemData, style, onClick } = props;
  return (
    <div className={`${className} ${styles.actions}`} style={style}>
      {items.map((item) => (
        <div
          key={item.key}
          className={`${styles.actionItemsBox} ${
            item.disabled ? styles.actionDisabled : styles.actionHover
          }`}
        >
          {/* 有children */}
          {item.children?.length ? (
            <Dropdown menu={{ items: item.children }}>
              <div
                onClick={_.throttle((event) => {
                  !item.disabled && item.onItemClick?.(itemData, event);
                }, 300)}
              >
                {item.icon ?? <EllipsisOutlined />}
              </div>
            </Dropdown>
          ) : (
            <Tooltip title={item.label}>
              {/* 无children */}
              <Dropdown menu={{ items: item.children || [] }}>
                <div
                  onClick={_.throttle((event) => {
                    !item.disabled && item.onItemClick?.(itemData, event);
                  }, 300)}
                >
                  {item.icon}
                </div>
              </Dropdown>
            </Tooltip>
          )}
        </div>
      ))}
    </div>
  );
};

export default Actions;
