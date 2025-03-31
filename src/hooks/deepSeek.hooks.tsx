import { deepSeekXRequest } from "@/services/deepseek.api";
import { StreamDataProcessor } from "@/utils/deepseek.utils";
import { Bubble, SenderProps, useXAgent, useXChat } from "@ant-design/x";
import { XAgentConfigCustom } from "@ant-design/x/es/use-x-agent";
import { history } from "@umijs/max";
import { GetRef } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { useEffect, useMemo, useRef, useState } from "react";
import { message as AMessage } from "antd";
import { deepSeekPrompt } from "@/constant/deepSeek.constant";

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

interface IUseDeepSeekXChat {
  userName?: string;
  aiName?: string;
  defaultMessage?: string;
  requestInfo?: any;
  onSuccess?: (messageData: TResultStream) => void;
}
export const useDeepSeekXChat = (props: IUseDeepSeekXChat) => {
  const { requestInfo } = props;
  const [userRole, setUserRole] = useState("user");
  const [aiRole, setAiRole] = useState("assistant");
  const [chatList, setChatList] = useState<any[]>([]);
  // 流数据处理Util工具
  const processorRef = useRef(new StreamDataProcessor());
  const { transformStream, controller, streamClass } = useStreamController();
  const model = useRef<TDeepSeekModel>(props.requestInfo.model);
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
      content: `${messagesData.message}${
        chatList.length ? "" : deepSeekPrompt.concise
      }`,
      // content: messagesData.message,
    };
    chatList.push(userMessage);
    if (props.defaultMessage) {
    }
    const requestData = {
      ...requestInfo,
      model: model.current ?? "88",
      messages: chatList,
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

            isStreaming.current = false;
            const result = formartMessage();
            // 如果不是流数据 则存储Object数据块 并保存
            onSuccess(result);
            // 对话完毕时 清除当前思考时间记录
            startTime.current = 0;
            cmptTime.current = 0;

            // 流执行完，没被锁(暂停)执行指令触发
            if (!isStreamLocked.current) {
              props.onSuccess?.(result);
              handleCommandExecutor(result.toolContent);
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
    requestPlaceholder: () => {
      return {
        ctmpContent: "",
        ctmpLoadingMessage: "",
        chatContent: "",
        chatLoadngMessage: "",
        toolContent: "",
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
        toolContent: errMsg,
        abortedReason: errMsg,
      };
    },
  });

  const handleSendChat: SenderProps["onSubmit"] = (message) => {
    isStreamLocked.current = false;
    // 重置上一次对话状态和信息
    processorRef.current.reset();
    onRequest(message as any);
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

  // 指令分发器
  const handleCommandExecutor = (commandMessage: string) => {
    try {
      if (commandMessage) {
        const command = JSON.parse(commandMessage);
        if (command.event === "navigate_to_page") {
          history.push(command.path);
        } else if (command.event === "help_have_conversation") {
          isAutoChat.current = true;
          const { message } = command;
          // setContent(message)
          handleSendChat(message);
        }
      }
    } catch (error) {
      AMessage.error("命令错误，请重试！");
    }
  };

  useEffect(() => {
    // 默认消息
    if (props.defaultMessage) {
      const defaultUserMessage = {
        role: userRole,
        content: props.defaultMessage,
      };
      chatList.push(defaultUserMessage);
    }
  }, [props.defaultMessage]);

  useEffect(() => {
    if (props.requestInfo) {
      model.current = props.requestInfo.model;
    }
  }, [props.requestInfo]);

  return {
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
