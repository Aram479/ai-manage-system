import React from "react";
import BaseNodeCmp from "../BaseNodeCmp";
import { Node, NodeProps } from "@xyflow/react";

type EndNodeData = {
  title: string;
  desc: string;
  maxLineCount: number; // 最大连接线数量
};
interface IEndNodeProps extends NodeProps<Node<EndNodeData>> {}

const EndNode = (props: Partial<IEndNodeProps>) => {
  const { data, isConnectable } = props;
  const { title = "结束", desc = "结束节点", maxLineCount = 1 } = data!;
  return (
    <BaseNodeCmp
      {...props}
      title={title}
      desc={desc}
      maxLineCount={maxLineCount}
    />
  );
};

export default EndNode;
