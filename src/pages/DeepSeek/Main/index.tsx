import WelcomeCmp from "@/component/DeepSeek/WelcomeCmp";
import { deepSeekXRequest } from "@/services/deepseekApi";
import {
  formartRequestMessage,
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
import { Flex, GetProp } from "antd";
import { useEffect, useMemo, useState } from "react";

const MainPage = () => {
  const [content, setContent] = useState("");
  const [isHeader, setIsHeader] = useState(true);
  const [bubbleList, setBubbleList] = useState<any[]>([]);
  // 创建处理器实例
  const processor = new StreamDataProcessor();

  // 调度请求
  const [agent] = useXAgent({
    request: (messagesData, { onUpdate, onSuccess, onError }) => {
      // 重置上一次对话内容
      processor.reset();
      const requestData = {
        ...formartRequestMessage(messagesData),
        stream: true,
      };
      deepSeekXRequest.create(
        requestData,
        {
          onSuccess: (res) => {
            if (res && !requestData.stream) {
              onSuccess(formartResultMessage(res[0]));
            }
          },
          onUpdate: (data) => {
            const newChunkStr = processor.processStream(data);
            // onSuccess(newChunkStr);
            onUpdate(newChunkStr);
          },
          onError,
        },
        new TransformStream<string, string>({
          transform(chunk, controller) {
            controller.enqueue(chunk);
          },
        })
      );
    },
  });

  // function mockReadableStream() {
  //   return new ReadableStream({
  //     async start(controller) {
  //       for (const chunk of []) {
  //         // await new Promise((resolve) => setTimeout(resolve, 100));
  //         controller.enqueue(new TextEncoder().encode(chunk));
  //       }
  //       controller.close();
  //     },
  //   });
  // }

  // const testFunc = async () => {
  //   for await (const chunk of XStream({
  //     readableStream: mockReadableStream(),
  //     transformStream: new TransformStream<string, string>({
  //       transform(chunk, controller) {
  //         controller.enqueue(chunk);
  //       },
  //     }),
  //   })) {
  //     messages[messages.length - 1].message += chunk;
  //     setMessages([...messages]);
  //   }
  // };

  const { onRequest, messages } = useXChat({
    agent,
    requestPlaceholder: "请稍等...",
    requestFallback: "服务器繁忙，请稍后再试！",
  });

  const roles: GetProp<typeof Bubble.List, "roles"> = {
    ai: {
      placement: "start",
      avatar: { icon: <UserOutlined />, style: { background: "#fde3cf" } },
      typing: { step: 5, interval: 20 },
      style: {
        maxWidth: 600,
      },
    },
    local: {
      placement: "end",
      avatar: { icon: <UserOutlined />, style: { background: "#87d068" } },
    },
  };

  const handleSendChat: SenderProps["onSubmit"] = (messages) => {
    onRequest(messages);
    setIsHeader(false);
    setContent("");
  };

  const items = messages.map(({ message, id, status }) => ({
    key: id,
    role: status === "local" ? "local" : "ai",
    content: message,
    // loading: status === "loading",
  }));

  useEffect(() => {
    // console.log(messages);
  }, [messages]);

  return (
    <div>
      {isHeader && <WelcomeCmp />}
      <Flex vertical gap="middle">
        <Bubble.List items={items} roles={roles} />
        <Sender
          value={content}
          // loading={agent.isRequesting()}
          onChange={setContent}
          onSubmit={handleSendChat}
        />
      </Flex>
    </div>
  );
};

export default MainPage;
