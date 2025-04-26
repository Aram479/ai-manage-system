import { Handle, useNodeConnections } from "@xyflow/react";
import React, { DOMAttributes, useCallback } from "react";
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
  onItemDelete?: (data?: any) => void;
};
const BaseNodeCmp = (
  props: Partial<BaseNodeProps & (DOMAttributes<any> & THandleProps)>
) => {
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
    onAddClick,
    onItemDelete,
  } = props;
  const handleStyle = { left: 10 };
  const onChange = useCallback((evt) => {
    console.log(evt.target.value);
  }, []);
  return (
    <>
      <div className="baseNodeCmp" onClick={props.onClick}>
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
                <div key={item.id} className="command-itemBox">
                  <div className="command-item">
                    <div className="item-content">
                      <div className="item-label">{item.label}</div>
                      {item.value && (
                        <div className="item-desc">{item.value}</div>
                      )}
                    </div>
                    <div className="commandBox">
                      <Tooltip title="执行命令">
                        <PlayCircleOutlined onClick={item.onClick} />
                      </Tooltip>
                      <Tooltip title="删除命令">
                        <DeleteOutlined onClick={() => onItemDelete?.(item)} />
                      </Tooltip>
                    </div>
                  </div>
                  {item.handles?.map((handleItem) => (
                    <Handle
                      key={handleItem.id}
                      {...handleItem}
                      // id={item.value}
                      // type="source"
                      // position={Position.Left}
                      // isConnectable={isConnectable}
                    />
                  ))}
                </div>
              ))}
            </div>
            <div className="messageFooterBox">
              <Tooltip title="新增指令">
                <PlusOutlined onClick={onAddClick} />
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BaseNodeCmp;
