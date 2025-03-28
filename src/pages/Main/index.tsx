import WelcomeCmp from "@/component/WelcomeCmp";
import MarkDownCmp from "@/component/MarkDownCmp";
import { deepSeekPrompt } from "@/constant/deepSeek";
import { deepSeekXRequest } from "@/services/deepseekApi";
import {
  formartResultMessage,
  StreamDataProcessor,
} from "@/utils/deepseekUtils";
import { UserOutlined } from "@ant-design/icons";
import {
  Bubble,
  Sender,
  SenderProps,
  useXAgent,
  useXChat,
} from "@ant-design/x";
import { BubbleDataType } from "@ant-design/x/es/bubble/BubbleList";
import { Flex, GetProp } from "antd";
import { useState } from "react";

const MainPage = () => {
  const [userRole, setUserRole] = useState("user");
  const [aiRole, setAiRole] = useState("assistant");
  const [content, setContent] = useState("");
  const [isHeader, setIsHeader] = useState(true);
  const [chatList, setChatList] = useState<any[]>([]);
  const [bubbleList, setBubbleList] = useState<any[]>([]);
  // 创建处理器实例
  const processor = new StreamDataProcessor();

  // 调度请求
  const [agent] = useXAgent({
    request: async (messagesData, { onUpdate, onSuccess, onError }) => {
      // 重置上一次对话内容
      processor.reset();
      // push 用户当前会话
      const userMessage = {
        role: userRole,
        content: `${messagesData.message}${deepSeekPrompt.concise}`,
      };
      chatList.push(userMessage);
      const requestData = {
        messages: chatList,
        stream: true,
        max_tokens: 2048,
        temperature: 0.5, // 默认为1.0，降低它以获得更集中、简洁的回答
        top_p: 0.9, // 调整此值也可能影响简洁性
      };
      await deepSeekXRequest.create(
        requestData,
        {
          // 请求结束后调用
          onSuccess: (res) => {
            if (res) {
              if (!requestData.stream) {
                onSuccess(formartResultMessage(res[0]));
              } else {
                const aiMessage = {
                  role: aiRole,
                  content: processor.getFullContent(),
                };
                // push AI 当前说完的会话
                chatList.push(aiMessage);
                setChatList([...chatList]);
                // 发送成功事件，以通知isRequesting结束了
                onSuccess(aiMessage.content);
              }
            }
          },
          // 流式调用
          onUpdate: (data) => {
            const newChunkStr = processor.processStream(data);
            // onSuccess(newChunkStr);
            onUpdate(newChunkStr);
          },
          onError: (error) => {
            setChatList([...chatList]);
          },
        },
        new TransformStream<string, string>({
          transform(chunk, controller) {
            controller.enqueue(chunk);
          },
        })
      );
    },
  });

  const { onRequest, messages } = useXChat({
    agent,
    requestPlaceholder: "请稍等...",
    requestFallback: "服务器繁忙，请稍后再试！",
  });

  const roles: GetProp<typeof Bubble.List, "roles"> = {
    assistant: {
      placement: "start",
      avatar: { icon: <UserOutlined />, style: { background: "#fde3cf" } },
      typing: { step: 5, interval: 20 },
      styles: {
        content: {
          minWidth: "calc(100% - 50px)",
        },
      },
    },
    local: {
      placement: "end",
      avatar: { icon: <UserOutlined />, style: { background: "#87d068" } },
    },
  };

  const handleSendChat: SenderProps["onSubmit"] = (message) => {
    onRequest(message);
    setIsHeader(false);
    setContent("");
  };

  const items: BubbleDataType[] = messages.map(({ message, id, status }) => ({
    key: id,
    role: status === "local" ? "local" : "assistant",
    content: message,
    // loading: status === "loading",
    messageRender: (content: string) =>
      status !== "local" ? (
        <MarkDownCmp content={content} theme="onDark" />
      ) : (
        <div>{content}</div>
      ),
  }));

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        padding: "20px",
      }}
    >
      {isHeader && (
        <div
          style={{
            position: "absolute",
            top: "20px",
            left: 20,
            right: 20,
          }}
        >
          <WelcomeCmp />
        </div>
      )}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          width: "100%",
          height: "100%",
        }}
      >
        <Bubble.List
          items={items}
          roles={roles}
          style={{
            flexBasis: "65vh",
            flexGrow: "1",
            overflowY: "auto",
          }}
        />

        <Sender
          value={content}
          loading={agent.isRequesting()}
          onChange={setContent}
          onSubmit={handleSendChat}
        />
      </div>
    </div>
  );
};

export default MainPage;
