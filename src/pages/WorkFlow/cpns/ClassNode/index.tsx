import React, { useEffect, useState } from "react";
import BaseNodeCmp from "../BaseNodeCmp";
import {
  Handle,
  Node,
  NodeProps,
  Position,
  useNodeConnections,
  useReactFlow,
} from "@xyflow/react";
import Portal from "@/components/Portal";
import ClassDetail from "../ClassDetail";

type ClassNodeData = {
  title: string;
  desc: string;
  isStart: boolean; // 是否是开始节点
  list: BaseNodeProps["list"]; // 指令列表
  maxLineCount: number; // 最大连接线数量
};
interface IClassNodeProps extends NodeProps<Node<ClassNodeData>> {}

const ClassNode = (props: Partial<IClassNodeProps>) => {
  const { data, selected, dragging, isConnectable } = props;
  const {
    title = "分类器",
    desc = "分类器节点",
    list = [],
    maxLineCount = 1,
  } = data!;

  const { updateNode } = useReactFlow();
  const [isOpen, setIsOpen] = useState(false);

  // 更新当前节点状态
  const updateNodeAction = (node: Partial<Node>) => {
    updateNode(props.id!, {
      ...node,
    });
  };

  const handleConfirm = (formData: any) => {
    const { message } = formData;
    const newList: ClassNodeData["list"] = [];
    if (message) {
      newList.push({
        label: "测试对话",
        value: message,
        handles: [
          {
            id: "handle-3",
            type: "target",
            position: Position.Left,
            isConnectable: true,
          },
          {
            id: "handle-4",
            type: "source",
            position: Position.Right,
            isConnectable: true,
          },
        ],
      });
    }
    updateNodeAction({
      data: {
        ...formData,
        list: newList,
      },
    });
    setIsOpen(false);
  };
  useEffect(() => {
    if (selected && !dragging) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [selected, dragging]);

  return (
    <>
      <BaseNodeCmp
        {...props}
        title={title}
        desc={desc}
        maxLineCount={maxLineCount}
        list={list}
        onClick={() => {
          setIsOpen(true);
        }}
      />
      <Portal targetClassName="workflowPage">
        <ClassDetail
          open={isOpen}
          title={title}
          data={data}
          onCancel={() => {
            setIsOpen(false);
          }}
          onConfirm={handleConfirm}
        />
      </Portal>
    </>
  );
};

export default ClassNode;
