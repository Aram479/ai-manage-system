import Portal from "@/components/Portal";
import BaseNodeCmp from "../BaseNodeCmp";
import {
  Node,
  NodeProps,
  useNodeConnections,
  useReactFlow,
} from "@xyflow/react";
import StartDetail from "../StartDetail";
import { useEffect, useState } from "react";

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

  const handleConfirm = (formData: any) => {
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
      {/* Handle一定要放置在外层不可与Node在同一元素下 */}
      {/* <Handle
        id="a"
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        style={{
          background: "blue",
          top: 20,
        }}
      /> */}
      <Portal targetClassName="workflowPage">
        <StartDetail
          open={isOpen}
          title={title}
          data={data}
          nodeId={props.id}
          onCancel={() => {
            setIsOpen(false);
          }}
          onConfirm={handleConfirm}
        />
      </Portal>
    </>
  );
};

export default StartNode;
