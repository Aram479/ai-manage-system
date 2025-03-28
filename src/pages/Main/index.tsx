import WelcomeCmp from "@/component/WelcomeCmp";
import MarkDown from "@/component/MarkDownCmp";
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
import { GetProp } from "antd";
import { memo, useRef, useState } from "react";
import styles from "./index.less";
import { useStreamController } from "@/hooks/deepSeekHooks";
import { XAgentConfigCustom } from "@ant-design/x/es/use-x-agent";

const MarkDownCmp = memo(MarkDown);
const MainPage = () => {
  const [userRole, setUserRole] = useState("user");
  const [aiRole, setAiRole] = useState("assistant");
  const [content, setContent] = useState("");
  const [isHeader, setIsHeader] = useState(true);
  const [chatList, setChatList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // 创建处理器实例
  const processorRef = useRef(new StreamDataProcessor());
  const { transformStream, controller, streamTest } = useStreamController();

  const chatRequest: XAgentConfigCustom<string>["request"] = async (
    messagesData,
    { onUpdate, onSuccess, onError }
  ) => {
    setLoading(true);
    // push 用户当前会话
    const userMessage = {
      role: userRole,
      content: `${messagesData.message}${
        chatList.length ? "" : deepSeekPrompt.concise
      }`,
    };
    chatList.push(userMessage);
    const requestData = {
      messages: chatList,
      stream: true,
      max_tokens: 2048,
      temperature: 0.5, // 默认为1.0，降低它以获得更集中、简洁的回答
      top_p: 0.9, // 调整此值也可能影响简洁性
      // stop: ["停止", "stop", "cancel"], // 遇到停止词时，将中断流式调用
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
                content: processorRef.current.getFullContent(),
              };
              // push AI 当前说完的会话
              chatList.push(aiMessage);
              setChatList([...chatList]);
              // 发送成功事件，以通知isRequesting结束了, 如果用agent.isRequesting的话
              onSuccess(aiMessage.content);
              setLoading(false);
            }
          }
        },
        // 流式调用
        onUpdate: (data) => {
          const newChunkStr = processorRef.current.processStream(data);
          onUpdate(newChunkStr);
        },
        onError: (error) => {
          console.log("error", error);
          setChatList([...chatList]);
          onError(error);
          setLoading(false);
        },
      },
      transformStream()
    );
  };

  // 调度请求
  const [agent] = useXAgent({
    request: chatRequest,
  });

  const { onRequest, messages } = useXChat({
    agent,
    requestPlaceholder: "请稍等...",
    requestFallback: () => {
      const errMsg =
        window.custonController.reson ?? "服务器繁忙，请稍后再试！";
      return errMsg;
    },
  });

  // 对话时，用户和AI样式
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

  const items: BubbleDataType[] = messages.map(({ message, id, status }) => ({
    key: id,
    role: status === "local" ? "local" : "assistant",
    content: message,
    // loading: status === "loading",
    messageRender: (content: string) =>
      status !== "local" ? (
        <MarkDownCmp theme="onDark" content={content} loading={loading} />
      ) : (
        <div>{content}</div>
      ),
  }));

  const handleSendChat: SenderProps["onSubmit"] = (message) => {
    // 重置上一次对话状态和信息
    processorRef.current.reset();

    onRequest(message);
    setIsHeader(false);
    setContent("");
  };

  const handleStopChat: SenderProps["onCancel"] = () => {
    // 流输出前中断
    if (!streamTest?.writable.locked) {
      setLoading(false);
      window.custonController.abort("用户中止了");

      // streamTest?.writable?.close();
    }
    // 流输出后中断
    controller?.terminate();
  };

  return (
    <div className={styles.mainPage}>
      {isHeader && (
        <div>
          <WelcomeCmp />
        </div>
      )}
      <div className={styles.chatListBox}>
        <Bubble.List
          className={styles.bubbleListBox}
          items={items}
          roles={roles}
        />

        <Sender
          value={content}
          loading={loading}
          onChange={setContent}
          onSubmit={handleSendChat}
          onCancel={handleStopChat}
        />
      </div>
    </div>
  );
};

export default MainPage;
