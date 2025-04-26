import { Input, TabsProps, Tabs } from "antd";
import { Rule } from "antd/es/form";
import { useEffect, useRef } from "react";
import FormDetail from "./FormDetail";
import ChatCmp, { TChatRef } from "@/components/Assistant/ChatCmp";
import { useNodeConnections, useNodeId, useReactFlow } from "@xyflow/react";

interface IStartDetailProps {
  open?: boolean;
  title?: string;
  data?: any;
  onConfirm?: (data?: any) => void;
  onCancel?: (data?: any) => void;
}
const { TextArea } = Input;

const ClassDetail = (props: IStartDetailProps) => {
  const { open, title, data, onConfirm, onCancel } = props;
  const { updateNodeData, getNodeConnections } = useReactFlow();
  const { isStart } = data;
  const chatRef = useRef<TChatRef>(null);
  const formRules: Record<string, Rule[]> = {
    message: [{ required: false }],
  };

  const handleSuccess = (messageData: any) => {
    // TODO ：请增加分类器的列表处理后再处理success
    console.log("data", data);
    // const connections = getNodeConnections
    // console.log("messageData", messageData);
    // console.log("connections", connections);
    // if (connections.length) {
    //   connections.forEach((item) => {
    //     updateNodeData(item.target, {
    //       isStart: true,
    //     });
    //   });
    // }
  };

  const items: TabsProps["items"] = [
    {
      key: "ClassDetail",
      label: "表单",
      forceRender: true,
      children: (
        <FormDetail data={data} onCancel={onCancel} onConfirm={onConfirm} />
      ),
    },
    {
      key: "Assistant",
      label: "对话",
      forceRender: true,
      children: (
        <ChatCmp ref={chatRef} isSender={false} onSuccess={handleSuccess} />
      ),
    },
  ];

  useEffect(() => {
    if (isStart) {
      chatRef.current?.sendChat(data.message);
    }
  }, [data]);
  return (
    <>
      <div
        className="workflow-popover"
        title={title}
        style={{ display: open ? "block" : "none" }}
      >
        {/*  */}
        <Tabs defaultActiveKey="classDetail" items={items} />
      </div>
    </>
  );
};

export default ClassDetail;
