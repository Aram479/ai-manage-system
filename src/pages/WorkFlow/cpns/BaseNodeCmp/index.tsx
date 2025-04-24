import { Handle, Node, NodeProps, NodeTypes, Position } from "@xyflow/react";
import React, { useCallback } from "react";
import "./index.less";
import { ChromeOutlined } from "@ant-design/icons";

type NodeData = { value: number };
interface IBaseNodeCmpProps extends NodeProps<Node<NodeData>> {}

const BaseNodeCmp = (props: IBaseNodeCmpProps) => {
  const { data, isConnectable } = props;
  const handleStyle = { left: 10 };
  const onChange = useCallback((evt) => {
    console.log(evt.target.value);
  }, []);
  return (
    <div className="baseNodeCmp">
      <div className="nodeBox">
        <div className="labelBox">
          <div className="label-icon">
            <ChromeOutlined />
          </div>
          <div className="label-text">分类器</div>
        </div>
        <div className="descBox">根据内容调用LLM 进行智能分类</div>
        <div className="container">内容</div>
      </div>
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
      />
      <Handle
        type="target"
        position={Position.Bottom}
        id="a"
        style={{ left: 10 }}
        isConnectable={isConnectable}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="b"
        isConnectable={isConnectable}
      />
    </div>
  );
};

export default BaseNodeCmp;
