import { useEffect, useState } from "react";
import BaseNodeCmp from "../BaseNodeCmp";
import { Node, NodeProps, useNodeId, useReactFlow } from "@xyflow/react";
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

  const nodeId = useNodeId();
  const { updateNode, updateNodeData, getNodeConnections, getNode } =
    useReactFlow();
  const currentNodeData = getNode(nodeId!);
  const [selectData, setSelectData] = useState<any>();
  const [isOpen, setIsOpen] = useState(false);

  const handleAddCommand = (formData: any) => {
    setIsOpen(false);
  };

  useEffect(() => {
    if (!selected || dragging) {
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
        onAddClick={() => setIsOpen(true)}
        onSelect={(data) => {
          updateNode(nodeId!, {
            selected: true,
          });
          updateNodeData(nodeId!, {
            formData: data,
          });
          setIsOpen(true);
        }}
        onDelete={(deleteItem) => {
          const nodeDataList =
            (currentNodeData?.data.list as BaseNodeProps["list"]) ?? [];
          const newList = nodeDataList.filter(
            (item) => item.id != deleteItem.id
          );
          updateNodeData(nodeId!, {
            list: newList,
          });
        }}
      />
      <Portal targetClassName="workflowPage">
        <ClassDetail
          open={isOpen}
          title={title}
          onCancel={() => {
            setIsOpen(false);
          }}
          onConfirm={handleAddCommand}
        />
      </Portal>
    </>
  );
};

export default ClassNode;
