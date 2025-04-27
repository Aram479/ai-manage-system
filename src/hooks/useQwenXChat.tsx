import { useEffect, useMemo, useRef, useState } from "react";
import {
  CaretRightOutlined,
  CopyOutlined,
  CopyrightOutlined,
  DislikeOutlined,
  LikeOutlined,
  PlayCircleOutlined,
} from "@ant-design/icons";
import { Attachments, SenderProps, useXAgent, useXChat } from "@ant-design/x";
import { BubbleDataType } from "@ant-design/x/es/bubble/BubbleList";
import { XAgentConfigCustom } from "@ant-design/x/es/use-x-agent";
import { useModel } from "@umijs/max";
import { message as AMessage, Tooltip, Upload } from "antd";
import dayjs, { Dayjs } from "dayjs";
import _ from "lodash";
import { qwenXRequest } from "@/services/qwen.api";
import MarkDownCmp from "@/components/MarkDownCmp";
import { chatPrompt } from "@/constant/base";
import ClipboardUtil from "@/utils/clipboardUtil";
import { StreamDataProcessor } from "@/utils/deepseek.utils";

export const useStreamController = () => {
  const streamController = useRef<TransformStreamDefaultController | null>(
    null
  );

  const streamClass = useRef<TransformStream | null>(null);

  // 注意：这里任何useState和其他异步数据都只能获取初始值，无法获取set之后的数据，请使用useRef
  const transformStream = () => {
    const newStream = new TransformStream({
      transform(chunk, controller) {
        streamController.current = controller;
        controller.enqueue(chunk);
      },
    });
    streamClass.current = newStream;
    return newStream;
  };

  return {
    transformStream,
    controller: streamController.current,
    streamClass: streamClass.current,
  };
};

interface IUseQwenXChat {
  userName?: string;
  aiName?: string;
  defaultMessage?: string;
  requestBody?: any;
  onSuccess?: (messageData: TResultStream) => void;
}
const useQwenXChat = (props: IUseQwenXChat) => {
  const { requestBody } = props;
  const { chatUploadFiles, setCommandExecutor } = useModel("chat");
  const requestProps = useRef(requestBody);
  const [userRole, setUserRole] = useState("user");
  const [aiRole, setAiRole] = useState("assistant");
  const [chatList, setChatList] = useState<any[]>([]);
  // 流数据处理Util工具
  const processorRef = useRef(new StreamDataProcessor());
  const { transformStream, controller, streamClass } = useStreamController();

  // 思考开始时间
  const startTime = useRef<Dayjs | number>(0);
  // 思考用时
  const cmptTime = useRef<number>(0);
  // 流是否被暂停
  const isStreamLocked = useRef(false);
  // 流是否执行中
  const isStreaming = useRef(false);
  // 是否开启自动对话
  const isAutoChat = useRef(false);

  // 格式化返回数据
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

  // 发起对话请求: chatrequest内部要用useRef变量，否则依赖值不会更新
  const chatRequest: XAgentConfigCustom<TResultStream>["request"] = async (
    messagesData,
    { onUpdate, onSuccess, onError }
  ) => {
    if (chatUploadFiles.current.length) {
      chatUploadFiles.current.forEach((item) => {
        // 文档理解(qwen-long) role必须为system
        const fileMessage = {
          role: "system",
          content: `fileid://${item.response?.id}`,
        };
        chatList.push(fileMessage);
      });
    }

    // push 用户当前会话
    const userMessage = {
      role: userRole,
      // content: `${messagesData.message?.chatContent}${
      //   chatList.length ? "" : deepSeekPrompt.concise
      // }`,
      content: `${
        chatList.length
          ? ""
          : props.defaultMessage
          ? chatPrompt.towntalk(props.defaultMessage)
          : ""
      }${messagesData.message?.chatContent}`,
      // content: messagesData.message?.chatContent,
    };
    chatList.push(userMessage);

    const requestData = {
      ...requestProps.current,
      model: requestProps.current.model,
      messages: chatList,
    };
    await qwenXRequest.create(
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

            isStreaming.current = false;
            const result = formartMessage();
            // 如果不是流数据 则存储Object数据块 并保存
            onSuccess(result);
            // 对话完毕时 清除当前思考时间记录
            startTime.current = 0;
            cmptTime.current = 0;
            // 流执行完，没被锁(暂停)执行指令触发
            if (!isStreamLocked.current) {
              props.onSuccess?.(chatList);
              // 清除上一次上传的文件
              chatUploadFiles.current = [];
              // 设置指令分发器
              setCommandExecutor(result.toolContent ?? "");
            }
          }
        },
        // 流式调用，注意：这里任何useState和其他异步数据都只能获取初始值，无法获取set之后的数据，请使用useRef
        onUpdate: (data) => {
          isStreaming.current = true;
          // 如果是流数据 则处理String流数据块 并保存
          processorRef.current.processStream(data as unknown as string);
          onUpdate(formartMessage());
        },
        onError: (error) => {
          setChatList([...chatList]);
          // 清除上一次上传的文件
          chatUploadFiles.current = [];
          onError(error);
        },
      },
      transformStream()
    );
  };
  // 调度请求
  const [agent] = useXAgent({
    // chatRequest
    request: chatRequest,
  });

  const { onRequest, messages } = useXChat({
    agent,
    defaultMessages: [
      {
        id: "local",
        message: {
          ctmpContent: "",
          ctmpLoadingMessage: "",
          chatContent:
            "欢迎访问智能管理系统，你可以尝试输入“当前有哪些系统功能”",
          chatLoadngMessage: "",
          toolContent: "",
          abortedReason: "",
          chatFiles: [],
        },
        status: "local",
      },
    ],
    requestPlaceholder: () => {
      return {
        ctmpContent: "",
        ctmpLoadingMessage: "",
        chatContent: "",
        chatLoadngMessage: "",
        toolContent: "",
        abortedReason: "",
        chatFiles: [],
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
        toolContent: errMsg,
        abortedReason: errMsg,
      };
    },
  });

  const handleSendChat: SenderProps["onSubmit"] = (message) => {
    isStreamLocked.current = false;
    // 重置上一次对话状态和信息
    processorRef.current.reset();
    onRequest({
      chatContent: message,
      chatFiles: chatUploadFiles.current,
    });
  };

  const handleStopChat: SenderProps["onCancel"] = () => {
    if (isStreaming.current || agent.isRequesting()) {
      isStreamLocked.current = !!streamClass?.writable.locked;
      // 1.中断请求：流输出前中断
      if (!isStreaming.current) {
        window.abortController.abort("用户中止了回答。");
        // 流关闭(仅流输出前可用，输出中调用会报错)
        streamClass?.writable.close();
      } else {
        // 2.中断流：流输出后中断
        controller?.terminate();
      }
    }
  };

  const items = (): BubbleDataType[] => {
    let newItems = [];
    const newMessages = messages.map(({ id, ...item }) => ({
      ...item,
      role: item.status === "local" ? item.status : "assistant",
      content:
        (item.message.chatContent || item.message.toolContent) ?? item.message,
      loading: item.status === "loading" && !streamClass?.readable.locked,
    }));

    newItems = [...newMessages];
    return newItems.map(({ message, status, ...item }) => ({
      ...item,
      messageRender: (content) =>
        status !== "local" ? (
          !message.abortedReason ? (
            <div>
              {message.ctmpContent && (
                <div className="ctmpMessageBox">
                  {/* 思考状态 */}
                  <div className="ctmpTimeBox">
                    <div>
                      <CopyrightOutlined />
                    </div>
                    <div>{message.ctmpLoadingMessage}</div>
                  </div>
                  {/* 思考内容 */}
                  <div className="ctmpContentBox">{message.ctmpContent}</div>
                </div>
              )}

              <div style={{ background: "auto" }}>
                <MarkDownCmp
                  theme="onDark"
                  content={String(content)}
                  loading={agent.isRequesting()}
                />
                {status === "success" && (
                  <div className="messageFooterBox">
                    {message.toolContent && (
                      <Tooltip title="重新执行命令">
                        <PlayCircleOutlined
                          onClick={_.throttle(() => {
                            setCommandExecutor(content);
                          }, 300)}
                        />
                      </Tooltip>
                    )}

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
                        ClipboardUtil.writeText(content);
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
          <div>
            {isAutoChat.current ? (
              <MarkDownCmp
                theme="onDark"
                content={String(content)}
                loading={agent.isRequesting()}
              />
            ) : (
              <div style={{ display: "inline-block", margin: "0 8px" }}>
                <div>{content}</div>

                {/* 文件列表 */}
                {!!message.chatFiles?.length && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      flexDirection: "column",
                      gap: 5,
                      marginTop: "8px",
                    }}
                  >
                    {message.chatFiles?.map((file, index) => (
                      <Attachments.FileCard key={index} item={file} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ),
    }));
  };

  useEffect(() => {
    requestProps.current = requestBody;
  }, [requestBody]);
  return {
    items: items(),
    messages,
    processorRef,
    chatList,
    streamClass,
    isStreamLocked,
    isStreaming,
    loading: agent.isRequesting(),
    onRequest: handleSendChat,
    onCancel: handleStopChat,
  };
};
export default useQwenXChat;
