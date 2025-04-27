import { Input, TabsProps, Tabs } from "antd";
import { Rule } from "antd/es/form";
import { useEffect, useRef } from "react";
import FormDetail from "./FormDetail";
import ChatCmp, { TChatRef } from "@/components/Assistant/ChatCmp";
import {
  Node,
  useNodeConnections,
  useNodeId,
  useReactFlow,
} from "@xyflow/react";

interface IStartDetailProps {
  open?: boolean;
  title?: string;
  onConfirm?: (data?: any) => void;
  onCancel?: (data?: any) => void;
}
const { TextArea } = Input;

const ClassDetail = (props: IStartDetailProps) => {
  const { open, title, onConfirm, onCancel } = props;
  const { getNode, getNodeConnections, updateNodeData } =
    useReactFlow<Node<Partial<BaseNodeProps>>>();
  const nodeId = useNodeId()!;
  const currentNode = getNode(nodeId!)!;
  const chatRef = useRef<TChatRef>(null);

  const handleSuccess = (messageData: any) => {
    const sourceNode = getNode(nodeId!)!;
    const handleSource = sourceNode.data.execute?.handles?.find(
      (item) => item.type == "source"
    );
    const sourceConnections = getNodeConnections({
      nodeId,
      handleId: handleSource?.id,
      type: handleSource?.type,
    });
    sourceConnections.forEach((item) => {
      const targetNode = getNode(item.target);
      const targetNodeDataList = targetNode?.data.list;
      const targetHandle = targetNodeDataList?.find((targetItem) => {
        return targetItem.handles?.find(
          (handle) => handle.id === item.targetHandle
        );
      });
      if (targetHandle) {
        targetHandle.isStart = true;
      }
      // const targetNewList = targetNode?.data.list?.map((item) => {
      //   item.isStart = true;
      //   return item;
      // });
      // 更新target数据
      updateNodeData(item.target, {
        list: targetNodeDataList,
      });
    });
    const sourceNewList = sourceNode?.data.list?.map((item) => {
      item.isStart = false;
      return item;
    });
    // 清除当前执行完的命令
    updateNodeData(nodeId!, {
      execute: undefined,
      list: sourceNewList,
    });
  };

  const items: TabsProps["items"] = [
    {
      key: "ClassDetail",
      label: "表单",
      forceRender: true,
      children: <FormDetail onCancel={onCancel} onConfirm={onConfirm} />,
    },
    {
      key: "Assistant",
      label: "对话",
      forceRender: true,
      children: (
        <ChatCmp ref={chatRef} isSender={false} onSuccess={handleSuccess} />
      ),
    },
  ];

  useEffect(() => {
    if (currentNode?.data) {
      const { execute, list } = currentNode?.data;
      // 针对单个手动点击 执行命令
      if (execute) {
        if (execute && execute.isStart) {
          console.log("执行单个命令", execute);
          chatRef.current?.sendChat(execute.value as string);
        }
      } else if (list?.length) {
        list.forEach((item) => {
          if (item.isStart) {
            console.log("执行多个命令");
            chatRef.current?.sendChat(item.value as string);
          }
        });
      }
    }
  }, [currentNode?.data]);

  return (
    <>
      <div
        className="workflow-popover"
        title={title}
        style={{ display: open ? "block" : "none" }}
      >
        <Tabs defaultActiveKey="classDetail" items={items} />
      </div>
    </>
  );
};

export default ClassDetail;
