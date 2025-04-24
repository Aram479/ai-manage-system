import {
  Handle,
  Node,
  NodeProps,
  NodeTypes,
  Position,
  useNodeConnections,
} from "@xyflow/react";
import React, { DOMAttributes, useCallback } from "react";
import "./index.less";
import { ChromeOutlined } from "@ant-design/icons";

const BaseNodeCmp = (props: Partial<BaseNodeProps & DOMAttributes<any>>) => {
  const connections = useNodeConnections({
    handleType: "target",
  });
  const {
    data,
    title = "",
    desc = "",
    list = [],
    maxLineCount = 0,
    isConnectable,
  } = props;
  const handleStyle = { left: 10 };
  const onChange = useCallback((evt) => {
    console.log(evt.target.value);
  }, []);
  return (
    <div className="baseNodeCmp" {...props}>
      <div className="nodeBox">
        <div className="labelBox">
          <div className="label-icon">
            <ChromeOutlined />
          </div>
          <div className="label-text">{title}</div>
        </div>
        <div className="descBox">{desc}</div>
        <div className="container">
          {/* 指令列表 */}
          <div className="commandsBox">
            {list?.map((item, index) => (
              <div key={item.label} className="command-item">
                <div className="item-label">{item.label}</div>
                {item.value && <div className="item-desc">{item.value}</div>}
              </div>
            ))}
          </div>
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        id="a"
        isConnectable={isConnectable}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="b"
        isConnectable={connections.length < maxLineCount}
      />
    </div>
  );
};

export default BaseNodeCmp;
