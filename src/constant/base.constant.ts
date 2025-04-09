import { MenuItemType } from "antd/es/menu/interface";
import _ from "lodash";

export const Ai_Options: (MenuItemType & {
  model?: {
    default: TAllModel; // 默认模型
    autoChat: TAllModel; // 自动对话模型
    deep: TAllModel; // 深度思考模型
  };
})[] = [
  {
    key: "qwen",
    label: "通义千问",
    model: {
      default: "qwen-max", // qwen-plus qwen-max qwen-vl-max qwen-vl-max-latest qwq-plus-latest qwen-vl-plus
      autoChat: "qwen-plus",
      deep: "deepseek-r1",
    },
  },
  {
    key: "deepseek",
    label: "DeepSeek",
    model: {
      default: "deepseek-chat",
      autoChat: "deepseek-chat",
      deep: "deepseek-reasoner",
    },
  },
];

export const chatPrompt = {
  concise:
    "。请用简洁语言回答，避免口语化词汇和冗余表达，同时如果中断后，用户又继续的情况下要根据上下文完整的衔接然后补充; 这句话你不用回复我",
  towntalk: (talk: string = "") =>
    `开启聊天模式，我需要你以对方的口气回应对方，帮我回复下"${talk}"吧，你不需要想太多，帮我当成对方，你不需要列列表，只需要以我的语气根据上下文，进行如何回答对方或提出问题或反驳对方即可，当然你可以选择性的说粗话`,
};
