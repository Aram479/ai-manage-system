// 定义基本的时间戳格式
type Timestamp = {
  created_at: number;
};

// 定义 message 和 agent_message 事件的基础结构
interface MessageEvent extends Timestamp {
  task_id: string;
  message_id: string;
  conversation_id: string;
  answer: string;
}

// 定义 agent_thought 事件结构
interface AgentThoughtEvent extends Timestamp {
  id: string;
  task_id: string;
  message_id: string;
  position: number;
  thought: string;
  observation?: string;
  tool?: string;
  tool_input?: string;
  message_files?: Array<{ file_id: string }>;
  conversation_id: string;
}

// 定义 message_file 事件结构
interface MessageFileEvent extends Timestamp {
  id: string;
  type: "image";
  belongs_to: "assistant";
  url: string;
  conversation_id: string;
}

// 定义 message_end 和 tts_message_end 事件中的 metadata 结构
interface Metadata {
  usage: any; // 这里可以进一步定义 Usage 类型
  retriever_resources?: Array<any>; // 这里也可以进一步定义 RetrieverResource 类型
}

// 定义 message_end 事件结构
interface MessageEndEvent extends Timestamp {
  task_id: string;
  message_id: string;
  conversation_id: string;
  metadata?: Metadata;
}

// 定义 tts_message 事件结构
interface TTSMessageEvent extends Timestamp {
  task_id: string;
  message_id: string;
  audio: string;
}

// 定义 message_replace 事件结构
interface MessageReplaceEvent extends Timestamp {
  task_id: string;
  message_id: string;
  conversation_id: string;
  answer: string;
}

// 定义 error 事件结构
interface ErrorEvent extends Timestamp {
  task_id: string;
  message_id: string;
  status: number;
  code: string;
  message: string;
}

// 定义 ping 事件结构（无额外字段）
interface PingEvent {
  event: "ping";
}

interface IDifyRequestBody {
  /**
   * 用户输入/提问内容。
   */
  query: string;

  /**
   * 允许传入 App 定义的各变量值。inputs 参数包含了多组键值对（Key/Value pairs），
   * 每组的键对应一个特定变量，每组的值则是该变量的具体值。默认 {}。
   */
  inputs?: { [key: string]: any };

  /**
   * streaming 流式模式（推荐）。基于 SSE（Server-Sent Events）实现类似打字机输出方式的流式返回。
   * blocking 阻塞模式，等待执行完毕后返回结果。（请求若流程较长可能会被中断）。
   * 由于 Cloudflare 限制，请求会在 100 秒超时无返回后中断。
   * 注：Agent模式下不允许blocking。
   */
  response_mode: "streaming" | "blocking";

  /**
   * 用户标识，用于定义终端用户的身份，方便检索、统计。由开发者定义规则，
   * 需保证用户标识在应用内唯一。
   */
  user: string;

  /**
   * （选填）会话 ID，需要基于之前的聊天记录继续对话，必须传之前消息的 conversation_id。
   */
  conversation_id?: string;

  /**
   * 上传的文件。
   */
  files?: Array<{
    type: "image"; // 目前仅支持图片格式
    transfer_method: "remote_url" | "local_file"; // 传递方式
    url?: string; // 图片地址。（仅当传递方式为 remote_url 时）
    upload_file_id?: string; // 上传文件 ID。（仅当传递方式为 local_file 时）
  }>;

  /**
   * （选填）自动生成标题，默认 true。
   * 若设置为 false，则可通过调用会话重命名接口并设置 auto_generate 为 true 实现异步生成标题。
   */
  auto_generate_name?: boolean;
}

// 非stream
type TDifyCompletionResponse = {
  event: "message"; // 事件类型，固定为 "message"
  task_id: string; // 任务 ID，用于请求跟踪和下方的停止响应接口
  id: string; // 唯一ID，代表此次响应的整体唯一标识符
  message_id: string; // 消息唯一 ID，用于区分不同的消息
  conversation_id: string; // 会话 ID，用于关联属于同一会话的消息
  mode: "chat"; // App 模式，固定为 "chat"，表示当前模式为聊天模式
  answer: string; // 完整回复内容，包含 AI 给出的回答
  metadata: {
    usage: {
      prompt_tokens: number; // 提示词的 token 数量
      total_tokens: number; // 总共使用的 token 数量
    }; // 模型用量信息，记录了关于请求的使用情况
    retriever_resources: Array<{
      content: string; // 引用的具体内容或段落
      document_id: string; // 文档 ID，引用内容所属文档的唯一标识符
      source: string; // 来源描述，提供引用内容的来源信息
    }>; // 引用和归属分段列表，可能包括引用的内容及其来源等信息
  }; // 元数据对象，包含了与本次回答相关的额外信息
  created_at: number; // 消息创建时间戳，如：1705395332，表示消息生成的时间
};

// stream：综合所有事件类型的联合类型
type TDifyChunkResponse =
  // | ({ event: "message" } & MessageEvent)
  | ({ event: "agent_message" } & MessageEvent)
  | ({ event: "agent_thought" } & AgentThoughtEvent)
  | ({ event: "message_file" } & MessageFileEvent)
  | ({ event: "message_end" } & MessageEndEvent)
  | ({ event: "tts_message" } & TTSMessageEvent)
  | ({ event: "tts_message_end" } & Omit<TTSMessageEvent, "audio">)
  | ({ event: "message_replace" } & MessageReplaceEvent)
  | ({ event: "error" } & ErrorEvent)
  | PingEvent;
