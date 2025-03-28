type TMessage = {
  message?: string;
  messages?: string[];
};

export const formartRequestMessage = (messageInfo: TMessage) => {
  if (messageInfo) {
    return {
      messages: [{ role: "system", content: messageInfo.message }],
    };
  }
  return [];
};

const DeepSeekResult = {
  id: "23e6c543-8187-4539-beca-4d3ee424bc01",
  object: "chat.completion",
  created: 1742955599,
  model: "deepseek-chat",
  choices: [
    {
      index: 0,
      message: {
        role: "assistant",
        content: "你好！请问有什么可以帮你的吗？😊",
      },
      logprobs: null,
      finish_reason: "stop",
    },
  ],
  usage: {
    prompt_tokens: 3,
    completion_tokens: 11,
    total_tokens: 14,
    prompt_tokens_details: {
      cached_tokens: 0,
    },
    prompt_cache_hit_tokens: 0,
    prompt_cache_miss_tokens: 3,
  },
  system_fingerprint: "fp_3d5141a69a_prod0225",
};
type TDeepSeekResult = typeof DeepSeekResult;
export const formartResultMessage = (result: TDeepSeekResult) => {
  if (result) {
    if (result.choices?.length) {
      return result.choices[0].message.content;
    }
  }
  return "";
};

// 定义接口
interface ChatCompletionChunk {
  id: string;
  object: string;
  created: number;
  model: string;
  system_fingerprint: string;
  choices: Array<{
    index: number;
    delta: {
      role?: string;
      content?: string;
      reasoning_content?: string;
    };
    logprobs: null | any; // 根据实际需求调整类型
    finish_reason: null | string;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
    prompt_tokens_details: {
      cached_tokens: number;
    };
    prompt_cache_hit_tokens: number;
    prompt_cache_miss_tokens: number;
  };
}

export type TResultStream = {
  ctmpContent: string; // 用于存储完整的 思考内容
  chatContent: string; // 用于存储完整的 对话内容
};
export class StreamDataProcessor {
  private isCompleted: boolean = false; // 标记是否已完成
  // 存储二者解析后字符串
  private resultString: TResultStream = {
    ctmpContent: "",
    chatContent: "",
  };
  /**
   * 处理单个数据块
   * @param chunkStr 单个数据块的字符串形式
   */
  private processChunk(chunkStr: string): void {
    try {
      const chunk: ChatCompletionChunk = JSON.parse(chunkStr);

      /* 提取并处理内容 */
      const contentDelta = chunk.choices[0]?.delta;

      // 思考 流内容
      const ctmpContent = contentDelta?.reasoning_content;
      // 对话 流内容
      const content = contentDelta?.content;

      if (ctmpContent != null) {
        this.resultString.ctmpContent += ctmpContent;
      }

      if (content !== null) {
        this.resultString.chatContent += content;
      }

      // 检查是否结束
      if (chunk.choices[0]?.finish_reason === "stop") {
        this.isCompleted = true;
      }
    } catch (error) {}
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
  public getAllContent(): TResultStream {
    return this.resultString;
  }

  public getChatContent(): string {
    return this.resultString.chatContent;
  }
  public getCtmpContent(): string {
    return this.resultString.ctmpContent;
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
    };
  }
}
