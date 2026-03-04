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
      default: "qwen-max-latest", // qwen-max qwen-plus qwen-vl-max qwen-vl-max-latest qwq-plus-latest qwen-vl-plus qwen-long(处理文件)
      autoChat: "qwen-plus",
      deep: "qwq-plus", // deepseek-r1(deepseek) qwq-plus(通义 深度思考)
    },
  },
  // {
  //   key: "deepseek",
  //   label: "DeepSeek",
  //   model: {
  //     default: "deepseek-chat",
  //     autoChat: "deepseek-chat",
  //     deep: "deepseek-reasoner",
  //   },
  // },
];

export const chatPrompt = {
  concise:
    "。请用简洁语言回答，避免口语化词汇和冗余表达，同时如果中断后，用户又继续的情况下要根据上下文完整的衔接然后补充; 这句话你不用回复我",
  towntalk: (talk: string = "") =>
    `开启聊天模式，我需要你以对方的口气回应对方，你不需要想太多，帮我当成对方，你不需要列列表，只需要以我的语气根据上下文，进行如何回答对方或提出问题或反驳对方即可，当然你可以选择性的说粗话，内容如下：`,
  chart: (chart: string = "任意图表") =>
    `你是一位经验丰富的程序员，擅长使用各种图表工具和库（如Ant Design Charts、G6.js等）。请利用你的专业知识，以${chart}的形式展示提出的数据集的信息。请确保你的${chart}直观易懂，色彩搭配合理，并且能够有效地传达数据中的关键信息。使得${chart}能保持良好的显示效果。要求如下：`,
  page: (pageName: string = "随机页面") => `你是一位资深系统管理项目管理人员，精通系统各种工具，擅长处理各种问题，非常熟悉${pageName}的功能，能精准理解客户在${pageName}页面的提出的功能和问题。下面我提出的问题是：`
};
