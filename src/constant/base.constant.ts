import { useDeepSeekXChat } from "@/hooks/deepSeek.hooks";
import { useQwenXChat } from "@/hooks/qwen.hooks";
import { MenuItemType } from "antd/es/menu/interface";

// 执行工具
export const Tools_Options = [
  // {
  //   type: "function",
  //   function: {
  //     name: "help_have_conversation",
  //     description: "根据对话上下文，帮助我对话",
  //     parameters: {
  //       type: "object",
  //       properties: {
  //         event: {
  //           type: "string",
  //           description: "事件名称(必填)", // 设置 "必填" 二字，AI才会保证输出此字段
  //           emun: ["help_have_conversation"],
  //         },
  //         message: {
  //           type: "string",
  //           description: "帮我，随机生成一个问题，或者问候语句",
  //         },
  //       },
  //     },
  //     required: ["message"],
  //   },
  // },
  {
    type: "function",
    function: {
      name: "navigate_to_page",
      description: "跳转到指定系统页面",
      parameters: {
        type: "object",
        properties: {
          event: {
            type: "string",
            description: "事件名称(必填)", // 设置 "必填" 二字，AI才会保证输出此字段
            emun: ["navigate_to_page"],
          },
          path: {
            type: "string",
            description: "目标页面路径",
            enum: ["/main", "/demo", "/AutoChat"],
          },
          state: {
            type: "object",
            properties: {
              content: {
                type: "string",
                description: "输入框中要发送的消息", 
              },
            },
          },
        },
      },
      required: ["path"],
    },
  },
  {
    type: "function",
    function: {
      name: "update_user_profile",
      description: "更新用户资料",
      parameters: {
        type: "object",
        properties: {
          event: {
            type: "string",
            description: "事件名称(必填)", // 设置 "必填" 二字，AI才会保证输出此字段
            emun: ["update_user_profile"],
          },
          username: {
            type: "string",
            description: "用户登录名",
          },
          age: {
            type: "integer",
            description: "用户年龄",
          },
          is_vip: {
            type: "boolean",
            description: "是否为VIP用户",
          },
          tags: {
            type: "array",
            items: {
              type: "string",
            },
            description: "用户标签",
          },
          address: {
            type: "object",
            description: "用户地址",
            properties: {
              street: { type: "string" },
              city: { type: "string" },
            },
            required: ["street"],
          },
        },
        required: ["username", "age"],
      },
    },
  },
];

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
