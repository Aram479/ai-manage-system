import Portal from "@/components/Portal";
import BaseNodeCmp from "../BaseNodeCmp";
import {
  Handle,
  Node,
  NodeProps,
  Position,
  useNodeConnections,
  useReactFlow,
} from "@xyflow/react";
import StartDetail from "../StartDetail";
import { useEffect, useState } from "react";
import { Button } from "antd";

type StartNodeData = {
  title: string;
  desc: string;
  list: BaseNodeProps["list"]; // 指令列表
  maxLineCount: number; // 最大连接线数量
};
interface IStartNodeProps extends NodeProps<Node<StartNodeData>> {}

const StartNode = (props: Partial<IStartNodeProps>) => {
  const { data, selected, dragging, isConnectable } = props;
  const {
    title = "开始",
    desc = "开始节点",
    list = [],
    maxLineCount = 1,
  } = data!;
  const { updateNode, updateNodeData } = useReactFlow();
  const connections = useNodeConnections({
    handleId: "handle-1",
    handleType: "source",
  });
  const [isOpen, setIsOpen] = useState(false);

  // 更新当前节点状态
  const updateNodeAction = (id: string, node: Partial<Node>) => {
    updateNode(id, {
      ...node,
    });
  };

  const handleConfirm = (formData: any) => {
    const { startTime, startDate } = formData;
    const newList: StartNodeData["list"] = [];
    if (startTime) {
      newList.push({
        label: "开始时间",
        value: `${startTime}秒后`,
        handles: [
          {
            id: "handle-1",
            type: "source",
            position: Position.Right,
            isConnectable: true,
          },
        ],
      });
    }
    if (startDate) {
      newList.push({
        label: "开始日期",
        value: startDate,
        handles: [
          {
            id: "handle-2",
            type: "source",
            position: Position.Right,
            isConnectable: true,
          },
        ],
      });
    }
    updateNodeAction(props.id!, {
      data: {
        ...formData,
        list: newList,
      },
    });
    setIsOpen(false);
  };

  const handleStart = () => {
    console.log("开始执行", connections);
    if (connections.length) {
      setTimeout(() => {
        connections.forEach((item) => {
          updateNodeData(item.target, {
            isStart: true,
          });
        });
      }, 1000);
    }
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
      {/* Handle一定要放置在外层不可与Node在同一元素下 */}
      <Handle
        id="a"
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        style={{
          background: "blue",
          top: 20,
        }}
      />
      <Portal targetClassName="workflowPage">
        <StartDetail
          open={isOpen}
          title={title}
          data={data}
          onCancel={() => {
            setIsOpen(false);
          }}
          onConfirm={handleConfirm}
        />
      </Portal>
      <Button onClick={handleStart}>开始执行</Button>
    </>
  );
};

export default StartNode;
