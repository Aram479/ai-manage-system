import { deepSeektools } from "@/constant/deepSeek.constant";
import { deepSeekXRequest } from "@/services/deepseek.api";
import { StreamDataProcessor } from "@/utils/deepseek.utils";
import { Bubble, useXAgent, useXChat } from "@ant-design/x";
import { XAgentConfigCustom } from "@ant-design/x/es/use-x-agent";
import { GetRef } from "antd";
import { Dayjs } from "dayjs";
import { useRef, useState } from "react";

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
  requestData?: any;
  deepSeektools?: any[];
}
export const useDeepSeekXChat = (props: IUseDeepSeekXChat) => {
  const [userRole, setUserRole] = useState("user");
  const [aiRole, setAiRole] = useState("assistant");
  const [chatList, setChatList] = useState<any[]>([]);
  const listRef = useRef<GetRef<typeof Bubble.List>>(null);
  // 流数据处理U工具
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
      // tools 不支持模型 deepseek-reasoner
      tools: deepSeektools,
      tool_choice: "auto",
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

            isStreaming.current = true;
            const result = formartMessage();
            // 如果不是流数据 则存储Object数据块 并保存
            onSuccess(result);
            // 对话完毕时 清除当前思考时间记录
            startTime.current = 0;
            cmptTime.current = 0;

            // 流执行完，没被锁(暂停)执行指令触发
            if (!isStreamLocked.current) {
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
  return {
    messages: [],
    processorRef,
  };
};
