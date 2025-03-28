import { memo, useMemo, useRef, useState } from "react";
import { GetProp } from "antd";
import { LoadingOutlined, UserOutlined } from "@ant-design/icons";
import { BubbleDataType } from "@ant-design/x/es/bubble/BubbleList";
import { XAgentConfigCustom } from "@ant-design/x/es/use-x-agent";
import { deepSeekPrompt } from "@/constant/deepSeek";
import {
  Bubble,
  Sender,
  SenderProps,
  useXAgent,
  useXChat,
} from "@ant-design/x";
import {
  formartResultMessage,
  StreamDataProcessor,
} from "@/utils/deepseekUtils";
import { useStreamController } from "@/hooks/deepSeekHooks";
import { deepSeekXRequest } from "@/services/deepseekApi";
import WelcomeCmp from "@/component/WelcomeCmp";
import MarkDown from "@/component/MarkDownCmp";
import styles from "./index.less";

const MarkDownCmp = memo(MarkDown);

const MainPage = () => {
  const [userRole, setUserRole] = useState("user");
  const [aiRole, setAiRole] = useState("assistant");
  const [content, setContent] = useState("");
  const [isHeader, setIsHeader] = useState(true);
  const [chatList, setChatList] = useState<any[]>([]);
  // 流数据处理U工具
  const processorRef = useRef(new StreamDataProcessor());
  const { transformStream, controller, streamClass } = useStreamController();

  // 发起对话请求
  const chatRequest: XAgentConfigCustom<string>["request"] = async (
    messagesData,
    { onUpdate, onSuccess, onError }
  ) => {
    // push 用户当前会话
    const userMessage = {
      role: userRole,
      // content: `${messagesData.message}${
      //   chatList.length ? "" : deepSeekPrompt.concise
      // }`,
      content: messagesData.message,
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
                content: processorRef.current.getChatContent(),
              };
              // push AI 当前说完的会话
              chatList.push(aiMessage);
              setChatList([...chatList]);
              // 发送成功事件，以通知isRequesting结束了, 如果用agent.isRequesting的话
              const allContent = processorRef.current.getAllContent();
              onSuccess({
                ...allContent,
                abortedReason: window.abortController.signal.reason,
              });
            }
          }
        },
        // 流式调用，注意：这里任何useState和其他异步数据都只能获取初始值，无法获取set之后的数据，请使用useRef
        onUpdate: (data) => {
          processorRef.current.processStream(data);
          const allContent = processorRef.current.getAllContent();
          onUpdate({
            ...allContent,
            abortedReason: window.abortController.signal.reason,
          });
        },
        onError: (error) => {
          setChatList([...chatList]);
          onError(error);
        },
      },
      transformStream()
    );
  };

  // 调度请求
  const [agent] = useXAgent({
    request: chatRequest,
  });

  const loading = useMemo(() => agent.isRequesting(), [agent.isRequesting()]);

  const { onRequest, messages } = useXChat({
    agent,
    requestPlaceholder: () => {
      return {
        ctmpContent: "思考中...",
        chatContent: "",
        abortedReason: "",
      };
    },
    parser: (message) => {
      const newMessage = {
        ...message,
        status: 1,
      };
      return newMessage;
    },
    requestFallback: () => {
      const errMsg =
        window.abortController.signal.reason ?? "服务器繁忙，请稍后再试！";
      return {
        ctmpContent: errMsg,
        chatContent: errMsg,
        abortedReason: errMsg,
      };
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
          background: "#00000000",
        },
      },
    },
    local: {
      placement: "end",
      avatar: { icon: <UserOutlined />, style: { background: "#87d068" } },
      styles: {
        content: {
          background: "#e0dfff",
        },
      },
    },
  };

  const items: BubbleDataType[] = messages.map(({ message, id, status }) => ({
    key: id,
    role: status === "local" ? "local" : "assistant",
    content: message,
    loading: status === "loading" && !streamClass?.readable.locked,
    messageRender: (content: string) =>
      status !== "local" ? (
        !message.abortedReason ? (
          <div>
            <div style={{ background: "skyblue" }}>{message.ctmpContent}</div>
            <div style={{ background: "#fff" }}>
              <MarkDownCmp
                theme="onDark"
                content={message.chatContent}
                loading={loading}
              />
            </div>
          </div>
        ) : (
          <>{message.abortedReason}</>
        )
      ) : (
        <div>{content}</div>
      ),
  }));

  const handleSendChat: SenderProps["onSubmit"] = (message) => {
    // 重置上一次对话状态和信息
    processorRef.current.reset();
    setIsHeader(false);
    setContent("");
    onRequest(message);
  };

  const handleStopChat: SenderProps["onCancel"] = () => {
    // 1.中断请求：流输出前中断
    if (!streamClass?.writable.locked) {
      window.abortController.abort("用户中止了回答。");

      // 流关闭(仅流输出前可用，输出中调用会报错)
      // streamClass?.writable?.close();
    }
    // 2.中断流：流输出后中断
    controller?.terminate();
  };
  console.log(messages);
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
