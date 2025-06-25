import { useParentMessage } from "@/hooks/useIframe";
import { Select, SelectProps } from "antd";

const index = () => {
  /* ------------------------------------------------------------- */
  // 接收主页面消息
  const handleParentMessage = (
    data: IframeMessageType,
    event: MessageEvent
  ) => {
    if (data.type === "HELLO") {
      console.log("子页面接收到数据", data);
    }
  };

  // 向主页面发送消息
  const handleSendMessage: SelectProps["onChange"] = (_v, option) => {
    // message
    //   .open({
    //     type: "loading",
    //     content: "即将跳转",
    //     duration: 3,
    //   })
    //   .then(() => sendMessageToParent({ type: "module", payload: option }));
    sendMessageToParent({ type: "module", payload: option });
  };

  const { sendMessageToParent } = useParentMessage(
    "http://localhost:8081",
    handleParentMessage
  );
  /* ------------------------------------------------------------- */
  return (
    <div>
      机型选择
      <Select
        placeholder="请选择机型"
        options={[
          {
            label: "F2.5 CM2621 F158B",
            value: "F2.5 CM2621 F158B",
          },
          {
            label: "Z10 CM2670 L159B",
            value: "F2.5 CM2621 F158B",
          },
        ]}
        onChange={handleSendMessage}
      />
    </div>
  );
};

export default index;
