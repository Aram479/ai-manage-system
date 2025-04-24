import Portal from "@/components/Portal";
import BaseNodeCmp from "../BaseNodeCmp";
import { Node, NodeProps } from "@xyflow/react";
import StartDetail from "../StartDetail";
import { useEffect, useState } from "react";

type StartNodeData = {
  title: string;
  desc: string;
  maxLineCount: number; // 最大连接线数量
};
interface IStartNodeProps extends NodeProps<Node<StartNodeData>> {}

const StartNode = (props: Partial<IStartNodeProps>) => {
  const { data, selected, isConnectable } = props;
  const { title = "开始", desc = "开始节点", maxLineCount = 1 } = data!;
  const [list, setList] = useState<BaseNodeProps["list"]>([]);
  const [formData, setFormData] = useState<any>(null);
  const handleConfirm = (formData: any) => {
    const { startTime, startDate } = formData;
    const newList = [];
    if (startTime) {
      newList.push({
        label: "开始时间",
        value: `${startTime}秒后`,
      });
    }
    if (startDate) {
      newList.push({
        label: "开始日期",
        value: startDate,
      });
    }
    setFormData(formData);
    setList(newList);
  };

  useEffect(() => {
    if (selected) {
      setFormData(data);
    }
  }, [selected]);

  return (
    <>
      <BaseNodeCmp
        {...props}
        title={title}
        desc={desc}
        maxLineCount={maxLineCount}
        list={list}
      />
      <Portal targetClassName="workflowPage">
        {selected && (
          <StartDetail
            title={title}
            data={formData}
            onConfirm={handleConfirm}
          />
        )}
      </Portal>
    </>
  );
};

export default StartNode;
