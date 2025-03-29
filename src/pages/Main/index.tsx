import { memo, useMemo, useRef, useState } from "react";
import { GetProp, GetRef } from "antd";
import {
  CopyOutlined,
  CopyrightOutlined,
  DislikeOutlined,
  LikeOutlined,
  LoadingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { BubbleDataType } from "@ant-design/x/es/bubble/BubbleList";
import { XAgentConfigCustom } from "@ant-design/x/es/use-x-agent";
import { deepSeekPrompt } from "@/constant/deepSeek";
import dayjs, { Dayjs } from "dayjs";
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
import _ from "lodash";
import { message as AMessage } from "antd";
import ClipboardUtil from "@/utils/clipboardUtil";
const MarkDownCmp = memo(MarkDown);

const MainPage = () => {
  const [userRole, setUserRole] = useState("user");
  const [aiRole, setAiRole] = useState("assistant");
  const [content, setContent] = useState("");
  const [isHeader, setIsHeader] = useState(true);
  const [chatList, setChatList] = useState<any[]>([]);
  const listRef = useRef<GetRef<typeof Bubble.List>>(null);
  // 流数据处理U工具
  const processorRef = useRef(new StreamDataProcessor());
  const { transformStream, controller, streamClass } = useStreamController();

  const startTime = useRef<Dayjs | number>(0);
  // 思考用时
  const cmptTime = useRef<number>(0);

  // 流是否被暂停
  const isStreamLocked = useRef(false);

  const formartMessage = (): TResultStream => {
    const allContent = processorRef.current.getAllContent();
    if (!startTime.current) startTime.current = dayjs();
    if (!cmptTime.current && allContent.chatContent) {
      cmptTime.current = dayjs().diff(startTime.current, "second");
    }

    return {
      ...allContent,
      abortedReason: window.abortController.signal.reason,
      ctmpLoadingMessage: allContent.ctmpContent
        ? isStreamLocked.current && !allContent.chatContent
          ? "思考已中止"
          : allContent.chatContent
          ? `已完成深度思考（用时${cmptTime.current}秒）`
          : "思考中..."
        : "",
      chatLoadngMessage: "等待思考完毕...",
    };
  };

  // 发起对话请求
  const chatRequest: XAgentConfigCustom<TResultStream>["request"] = async (
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
              processorRef.current.processChunk(res[0]);
            }
            const aiMessage = {
              role: aiRole,
              content: processorRef.current.getChatContent(),
            };
            chatList.push(aiMessage);
            setChatList([...chatList]);

            // 如果不是流数据 则存储Object数据块 并保存

            onSuccess(formartMessage());

            isStreamLocked.current = false
            // 对话完毕时 清除当前思考时间记录
            startTime.current = 0;
            cmptTime.current = 0;
          }
        },
        // 流式调用，注意：这里任何useState和其他异步数据都只能获取初始值，无法获取set之后的数据，请使用useRef
        onUpdate: (data) => {
          // 如果是流数据 则处理String流数据块 并保存
          processorRef.current.processStream(data as unknown as string);
          onUpdate(formartMessage());
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
        ctmpContent: "",
        ctmpLoadingMessage: "",
        chatContent: "",
        chatLoadngMessage: "",
        abortedReason: "",
      };
    },
    requestFallback: () => {
      const errMsg =
        window.abortController.signal.reason ?? "服务器繁忙，请稍后再试！";
      return {
        ctmpContent: errMsg,
        ctmpLoadingMessage: errMsg,
        chatContent: errMsg,
        chatLoadngMessage: errMsg,
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
          background: "#fff",
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
    content: message.chatContent ?? message,
    loading: status === "loading" && !streamClass?.readable.locked,
    // 最终展示的内容使用content才可以有打字效果，无论是不是stream
    messageRender: (content) =>
      status !== "local" ? (
        !message.abortedReason ? (
          <div>
            {message.ctmpContent && (
              <div className={styles.ctmpMessageBox}>
                {/* 思考状态 */}
                <div className={styles.ctmpTimeBox}>
                  <div>
                    <CopyrightOutlined />
                  </div>
                  <div>{message.ctmpLoadingMessage}</div>
                </div>
                {/* 思考内容 */}
                <div className={styles.ctmpContentBox}>
                  {message.ctmpContent}
                </div>
              </div>
            )}

            <div style={{ background: "#fff" }}>
              <MarkDownCmp theme="onDark" content={content} loading={loading} />
              {status === "success" && (
                <div className={styles.messageFooterBox}>
                  <LikeOutlined
                    onClick={_.throttle(() => {
                      AMessage.success({
                        key: "thanks",
                        content: "感谢您的支持",
                      });
                    }, 300)}
                  />
                  <DislikeOutlined />
                  <CopyOutlined
                    onClick={_.throttle(() => {
                      ClipboardUtil.writeText(String(content));
                      AMessage.success({
                        key: "copy",
                        content: "复制成功",
                      });
                    }, 300)}
                  />
                </div>
              )}
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
    isStreamLocked.current = !!streamClass?.writable.locked;
    // 1.中断请求：流输出前中断
    if (!streamClass?.writable.locked) {
      window.abortController.abort("用户中止了回答。");

      // 流关闭(仅流输出前可用，输出中调用会报错)
      streamClass?.writable?.close();
    }
    // 2.中断流：流输出后中断
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
          ref={listRef}
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
