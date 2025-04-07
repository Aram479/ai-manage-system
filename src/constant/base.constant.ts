import { useDeepSeekXChat } from "@/hooks/deepSeek.hooks";
import { useQwenXChat } from "@/hooks/qwen.hooks";
import { MenuItemType } from "antd/es/menu/interface";

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
      default: "qwen-vl-max-latest", // qwen-plus qwen-max qwen-vl-max qwen-vl-max-latest
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

export const AiXChatHookMap = new Map([
  ["qwen", useQwenXChat],
  ["deepseek", useDeepSeekXChat],
]);
