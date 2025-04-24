import React from "react";
import BaseNodeCmp from "../BaseNodeCmp";
import { Node, NodeProps } from "@xyflow/react";

type ClassNodeData = {
  title: string;
  desc: string;
  maxLineCount: number; // 最大连接线数量
};
interface IClassNodeProps extends NodeProps<Node<ClassNodeData>> {}

const ClassNode = (props: Partial<IClassNodeProps>) => {
  const { data, isConnectable } = props;
  const { title = "分类器", desc = "分类器节点", maxLineCount = 1 } = data!;
  return (
    <BaseNodeCmp
      {...props}
      title={title}
      desc={desc}
      maxLineCount={maxLineCount}
    />
  );
};

export default ClassNode;
