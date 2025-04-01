export const deepSeekPrompt = {
  concise:
    "。请用简洁语言回答，避免口语化词汇和冗余表达，同时如果中断后，用户又继续的情况下要根据上下文完整的衔接然后补充; 这句话你不用回复我",
  towntalk: (talk: string = "") =>
    `开启聊天模式，我需要你以对方的口气回应对方，帮我回复下"${talk}"吧，你不需要想太多，帮我当成对方，你不需要列列表，只需要以我的语气根据上下文，进行如何回答对方或提出问题或反驳对方即可，当然你可以选择性的说粗话`,
};

export const deepSeektools = [
  {
    type: "function",
    function: {
      name: "help_have_conversation",
      description: "根据对话上下文，帮助我对话",
      parameters: {
        type: "object",
        properties: {
          event: {
            type: "string",
            description: "事件名称(必填)", // 设置 "必填" 二字，AI才会保证输出此字段
            emun: ["help_have_conversation"],
          },
          message: {
            type: "string",
            description: "帮我，随机生成一个问题，或者问候语句",
          },
        },
      },
      required: ["message"],
    },
  },
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
            enum: ["/main", "/demo"],
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
