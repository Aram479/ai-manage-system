import { Input, TabsProps, Tabs } from "antd";
import { Rule } from "antd/es/form";
import { useEffect, useRef } from "react";
import FormDetail from "./FormDetail";
import ChatCmp, { TChatRef } from "@/components/Assistant/ChatCmp";
import { useNodeConnections, useReactFlow } from "@xyflow/react";

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
  const connections = useNodeConnections({
    handleId: "handle-4",
    handleType: "source",
  });
  const { updateNodeData } = useReactFlow();
  const { isStart } = data;
  const chatRef = useRef<TChatRef>(null);
  const formRules: Record<string, Rule[]> = {
    message: [{ required: false }],
  };

  const handleSuccess = (messageData: any) => {
    console.log("messageData", messageData);
    console.log("connections", connections);
    if (connections.length) {
      connections.forEach((item) => {
        updateNodeData(item.target, {
          isStart: true,
        });
      });
    }
  };

  useEffect(() => {
    console.log("connections", connections);
  }, [connections]);
  const items: TabsProps["items"] = [
    {
      key: "ClassDetail",
      label: "表单",
      forceRender: true,
      children: <FormDetail data={data} onConfirm={onConfirm} />,
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
      if (isStart) {
        chatRef.current?.sendChat(data.message);
      }
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
