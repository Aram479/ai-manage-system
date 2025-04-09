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
    const chunk: ChatCompletionChunk = JSON.parse(dataString);
    /* 提取并处理内容 stream为true时delta有数据  否则message有数据  */
    const contentDelta = chunk.choices[0]?.delta ?? chunk.choices[0]?.message;

    // 思考 流内容
    const ctmpContent = contentDelta?.reasoning_content;
    // 对话 流内容
    const content = contentDelta?.content;
    // 工具 流内容
    const toolContent = contentDelta?.tool_calls?.[0]?.function.arguments;
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
    if (chunk.choices[0]?.finish_reason === "stop") {
      this.isCompleted = true;
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

      if (dataString === "[DONE]") {
        this.isCompleted = true;
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
  /**
   * 检查流是否完成
   */
  public isStreamCompleted(): boolean {
    return this.isCompleted;
  }

  public reset(): void {
    this.isCompleted = false;
    this.resultString = {
      ctmpContent: "",
      chatContent: "",
      toolContent: "",
    };
  }
}

// 聊天对话数据交叉
export const chatsCrossMerge = (...arrs: BubbleDataType[][]): BubbleDataType[] => {
  // 翻转后.zip才是正确顺序
  arrs = arrs.reverse();
  // 使用 _.zip 将两个数组按索引配对
  const zipped = _.zip(...arrs);
  // 使用 _.flatten 将二维数组展平为一维数组
  return _.flatten(zipped).filter((item) => item) as BubbleDataType[];
};
