import {
  Handle,
  Node,
  useNodeConnections,
  useNodeId,
  useReactFlow,
} from "@xyflow/react";
import React, { DOMAttributes, useCallback, useEffect, useMemo } from "react";
import "./index.less";
import {
  ChromeOutlined,
  DeleteOutlined,
  PlayCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Tooltip } from "antd";
import _ from "lodash";

type THandleProps = {
  onAddClick?: (data?: any) => void;
  onSelect?: (data?: any) => void;
  onDelete?: (data?: any) => void;
};
const BaseNodeCmp = (
  props: Partial<BaseNodeProps & (DOMAttributes<any> & THandleProps)>
) => {
  const nodeId = useNodeId();
  const connections = useNodeConnections({
    id: nodeId!,
    handleType: "source",
  });
  const { updateNode, updateNodeData, getNodeConnections, getNode } =
    useReactFlow<Node<Partial<BaseNodeProps>>>();
  const nodeConnections = getNodeConnections({
    nodeId: nodeId!,
    type: "source",
  });
  const {
    data,
    title = "",
    desc = "",
    list = [],
    maxLineCount = 0,
    isConnectable,
    isAddOper,
    onAddClick,
    onSelect,
    onDelete,
  } = props;

  return (
    <>
      <div className="baseNodeCmp" onClick={props.onClick}>
        <div className="nodeBox">
          <div className="labelBox">
            <div className="label-icon">
              <ChromeOutlined />
            </div>
            <div className="label-text">
              {title}
              {connections.length}
              {nodeConnections.length}
            </div>
          </div>
          <div className="descBox">{desc}</div>
          <div className="container">
            {/* 指令列表 */}
            <div className="commandsBox">
              {list?.map((item, index) => (
                <div key={item.id} className="command-itemBox">
                  <div
                    className="command-item"
                    onClick={() => onSelect?.(item)}
                  >
                    <div className="item-content">
                      <div className="item-label">{item.label}</div>
                      {item.value && (
                        <div className="item-desc">{item.value}</div>
                      )}
                    </div>
                    <div className="commandBox">
                      <Tooltip title="执行命令">
                        <PlayCircleOutlined
                          onClick={(e) => {
                            item.onClick?.(item);
                            e.stopPropagation();
                          }}
                        />
                      </Tooltip>
                      <Tooltip title="删除命令">
                        <DeleteOutlined
                          onClick={(e) => {
                            onDelete?.(item);
                            e.stopPropagation();
                          }}
                        />
                      </Tooltip>
                    </div>
                  </div>
                  {item.handles?.map((handleItem) => (
                    // source isConnectable最大支持连接一个
                    <Handle
                      key={handleItem.id}
                      {...handleItem}
                      isConnectable={
                        handleItem.isConnectable ??
                        !connections.find(
                          (item) => item.sourceHandle === handleItem.id
                        )
                      }
                      // id={item.value}
                      // type="source"
                      // position={Position.Left}
                      // isConnectable={isConnectable}
                    />
                  ))}
                </div>
              ))}
            </div>
            {onAddClick && (
              <div className="messageFooterBox">
                <Tooltip title="新增指令">
                  <PlusOutlined onClick={onAddClick} />
                </Tooltip>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default BaseNodeCmp;
