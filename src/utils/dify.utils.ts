import { BubbleDataType } from "@ant-design/x/es/bubble/BubbleList";
import _ from "lodash";

type TMessage = {
  message?: string;
  messages?: string[];
};

export const formartRequestMessage = (messageInfo: TMessage) => {
  if (messageInfo) {
    return {
      messages: [{ role: "assistant", content: messageInfo.message }],
    };
  }
  return [];
};

export const formartResultMessage = (result: ChatCompletionChunk) => {
  if (result) {
    if (result.choices?.length) {
      return result.choices[0].delta.content ?? "";
    }
  }
  return "";
};

// 定义接口

export class StreamDataProcessor {
  private isCompleted: boolean = false; // 标记是否已完成
  private isCtmpContent: boolean = false; // 是否是思考流内容
  private conversation_id: MessageEvent["conversation_id"] = ""; // 上一次消息的id
  private endChunk: Partial<MessageEndEvent> = {}; // 结束的Chunk
  // 存储二者解析后字符串
  private resultString: Pick<
    TResultStream,
    "ctmpContent" | "chatContent" | "toolContent"
  > = {
    ctmpContent: "",
    chatContent: "",
    toolContent: "",
  };

  /**
   * 处理单个数据块
   * @param chunkStr 单个数据块的字符串形式
   */
  public processChunk(dataString: string): string {
    const chunk: TDifyChunkResponse | TDifyCompletionResponse =
      JSON.parse(dataString);
    /* 提取并处理内容 stream为true时delta有数据  否则message有数据  */
    // 对话 流内容
    let content = "";
    // 思考 流内容
    let ctmpContent = "";
    // 工具 流内容
    let toolContent = "";
    if (chunk.event === "agent_message") {
      const startCtmp = /^<think>\n/.test(chunk.answer);
      const endCtmp = /\n<\/think>$/.test(chunk.answer);
      // 思考内容对话chunk会以<think>\n...开始，以\n</think>结束：<think>\n...\n</think>
      if (startCtmp) {
        // Dify用<think>\n作为思考开始标记
        this.isCtmpContent = true;
        chunk.answer = chunk.answer?.replace(/^<think>\n/, "");
      } else if (endCtmp) {
        this.isCtmpContent = false;
        chunk.answer = chunk.answer?.replace(/\n<\/think>$/, "");
      }

      if (this.isCtmpContent) {
        ctmpContent = chunk.answer;
      } else {
        content = chunk.answer;
      }
      this.conversation_id = chunk.conversation_id;
    } else if (chunk.event === "message") {
      content = chunk.answer;
      this.conversation_id = chunk.conversation_id;
    }

    if (ctmpContent ?? false) {
      this.resultString.ctmpContent += ctmpContent;
    }

    if (content ?? false) {
      this.resultString.chatContent += content;
    }

    if ((toolContent ?? false) && _.isString(toolContent)) {
      this.resultString.toolContent += toolContent;
    }

    // 检查是否结束
    if (chunk.event === "message_end") {
      this.isCtmpContent = false;
      this.isCompleted = true;
      this.endChunk = chunk;
    }
    return this.resultString.chatContent ?? "";
  }

  /**
   * 处理整个流数据
   * @param stream 流式数据字符串
   */
  public processStream(stream: string): string {
    if (this.isCompleted) {
      return this.resultString.chatContent;
    }

    const lines = stream
      .split("\n")
      .filter((line) => line.trim().startsWith("data:"));

    for (const line of lines) {
      const dataString = line.replace(/^data:\s*/, "").trim();
      const chunk: TDifyChunkResponse = JSON.parse(dataString);
      if (chunk.event === "message_end") {
        this.isCtmpContent = false;
        this.isCompleted = true;
        this.endChunk = chunk;
        break;
      }

      this.processChunk(dataString); // 处理每个数据块
    }

    return this.resultString.chatContent;
  }

  /**
   * 获取当前所有内容
   */
  public getAllContent(): Pick<
    TResultStream,
    "ctmpContent" | "chatContent" | "toolContent"
  > {
    return this.resultString;
  }

  public getChatContent(): string {
    return this.resultString.chatContent;
  }
  public getCtmpContent(): string {
    return this.resultString.ctmpContent;
  }
  public getToolContent(): string {
    return this.resultString.toolContent;
  }
  public getEndChunk(): typeof this.endChunk {
    return this.endChunk;
  }
  public getConversationId(): string {
    return this.conversation_id;
  }

  /**
   * 检查流是否完成
   */
  public isStreamCompleted(): boolean {
    return this.isCompleted;
  }

  public reset(): void {
    this.isCompleted = false;
    this.isCtmpContent = false;
    this.resultString = {
      ctmpContent: "",
      chatContent: "",
      toolContent: "",
    };
  }
}

// 聊天对话数据交叉
export const chatsCrossMerge = (
  ...arrs: BubbleDataType[][]
): BubbleDataType[] => {
  // 翻转后.zip才是正确顺序
  arrs = arrs.reverse();
  // 使用 _.zip 将两个数组按索引配对
  const zipped = _.zip(...arrs);
  // 使用 _.flatten 将二维数组展平为一维数组
  return _.flatten(zipped).filter((item) => item) as BubbleDataType[];
};
