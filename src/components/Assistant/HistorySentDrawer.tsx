import { Button, Drawer, DrawerProps, Empty, Flex, Input, message } from "antd";
import {
  CopyOutlined,
  EditOutlined,
  RedoOutlined,
  UpCircleFilled,
} from "@ant-design/icons";
import Actions, { IActionsProps } from "../Actions";
import styles from "./index.less";
import ClipboardUtil from "@/utils/clipboardUtil";
import { useState } from "react";

interface IHistorySentDrawerProps extends DrawerProps {
  chatList?: TChatList;
  onSend?: (content: string) => void;
}

const HistorySentDrawer = (props: IHistorySentDrawerProps) => {
  const { chatList, onSend, ...draweProps } = props;
  const [currentEditItem, setCurrentEditItem] = useState<TChatList[number]>();
  const [textareaValue, setTextareaValue] = useState("");
  const actionItems: IActionsProps<TChatList[number]>["items"] = [
    {
      key: "edit",
      icon: <EditOutlined />,
      label: "编辑",
      onItemClick: (item) => {
        setTextareaValue(item?.content || "");
        setCurrentEditItem(item);
      },
    },
    {
      key: "copy",
      icon: <CopyOutlined />,
      label: "复制",
      onItemClick: (item) => {
        ClipboardUtil.writeText(item?.content ?? "");
        message.success({
          key: "copy",
          content: "复制成功",
        });
      },
    },
  ];

  const restTextArea = () => {
    setTextareaValue("");
    setCurrentEditItem(undefined);
  };

  const handleEditCancel = () => {
    restTextArea();
  };

  const handleEditConfirm = () => {
    onSend?.(textareaValue);
    restTextArea();
  };
  return (
    <Drawer {...draweProps}>
      {chatList?.length ? (
        <Flex vertical gap={5} align="end" justify="end">
          {chatList.map((item) => (
            <div className={styles.drawerChatListBox} key={item.id}>
              {/* 编辑文本域 */}
              {currentEditItem?.id === item.id ? (
                <div className={styles.textareaBox}>
                  <Input.TextArea
                    value={textareaValue}
                    autoSize={{ minRows: 3, maxRows: 5 }}
                    style={{
                      border: "none",
                      boxShadow: "none",
                      width: "100%",
                    }}
                    onChange={(e) => {
                      setTextareaValue(e.target.value);
                    }}
                  />
                  <Flex justify="end" gap={8}>
                    <Button onClick={handleEditCancel}>取消</Button>
                    <Button
                      type="primary"
                      disabled={
                        !textareaValue || item.content === textareaValue
                      }
                      onClick={handleEditConfirm}
                    >
                      发送
                    </Button>
                  </Flex>
                </div>
              ) : (
                <>
                  {/* 文本内容 */}
                  <div className={styles.contentBox}>
                    <span className={styles.content}>{item.content}</span>
                  </div>
                  <Actions
                    className={styles.actionsBox}
                    itemData={item}
                    items={actionItems}
                  />
                </>
              )}
            </div>
          ))}
        </Flex>
      ) : (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )}
    </Drawer>
  );
};

export default HistorySentDrawer;
