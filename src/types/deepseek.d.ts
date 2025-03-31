type TDeepSeekModel = "deepseek-chat" | "deepseek-reasoner"

interface ChatCompletionChunk {
  id: string;
  object: string;
  created: number;
  model: string;
  system_fingerprint: string;
  choices: Array<{
    index: number;
    message: {
      role?: string;
      content?: string;
    };
    delta: {
      role?: string;
      content?: string;
      reasoning_content?: string;
      tool_calls?: {
        index: number;
        id: string;
        type: "function";
        function: {
          name: string;
          arguments: string;
        };
      }[];
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

type TResultStream = {
  ctmpContent: string; // 思考内容
  chatContent: string; // 对话内容
  toolContent: string; // 工具内容(特指JSON数据)
  ctmpLoadingMessage: string; // 思考loading
  chatLoadngMessage: string; // 对话loading
  abortedReason?: string; // 中断内容
};
