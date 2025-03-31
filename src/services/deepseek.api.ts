import { XRequest } from "@ant-design/x";
import OpenAI from "openai";

// deepseek-reasoner  deepseek-chat
export const deepSeekXRequest = XRequest({
  baseURL: "/api/chat/completions",
  // model: "deepseek-chat",
  dangerouslyApiKey: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
  fetch: (url, config) => {
    window.abortController = new AbortController();
    return fetch(url, {
      ...config,
      signal: window.abortController.signal,
    });
  },
});

export const deepSeekOpenAI = new OpenAI({
  baseURL: "https://api.deepseek.com/v1",
  apiKey: process.env.DEEPSEEK_API_KEY,
  dangerouslyAllowBrowser: true,
});


/* 结合 useXAgent使用 */
// const openAiChatRequest: XAgentConfigCustom<TResultStream>["request"] =
// async (messagesData, { onUpdate, onSuccess, onError }) => {
//   // push 用户当前会话
//   const userMessage = {
//     role: userRole,
//     // content: `${messagesData.message}${
//     //   chatList.length ? "" : deepSeekPrompt.concise
//     // }`,
//     content: messagesData.message,
//   };
//   chatList.push(userMessage);
//   const requestData = {
//     messages: chatList,
//     stream: true,
//     max_tokens: 2048,
//     temperature: 0.5, // 默认为1.0，降低它以获得更集中、简洁的回答
//     top_p: 0.9, // 调整此值也可能影响简洁性
//     // stop: ["停止", "stop", "cancel"], // 遇到停止词时，将中断流式调用
//   };
//   const stream = await deepSeekOpenAI.chat.completions.create({
//     model: "deepseek-chat",
//     ...requestData,
//     tools: [
//       {
//         type: "function",
//         function: {
//           name: "navigate_to_page",
//           description: "跳转到指定系统页面",
//           parameters: {
//             type: "object",
//             properties: {
//               path: {
//                 type: "string",
//                 enum: ["/user", "/order", "/dashboard"],
//               },
//             },
//           },
//         },
//       },
//       {
//         type: "function",
//         function: {
//           name: "fill_search_form",
//           description: "填充搜索表单",
//           parameters: {
//             type: "object",
//             properties: {
//               username: { type: "string" },
//             },
//           },
//         },
//       },
//     ],
//   });
//   let content: string = "";
//   for await (const chunk of stream) {
//     // content += chunk.choices[0]?.delta?.content || "";
//     content += chunk.choices[0]?.delta?.tool_calls?.[0]?.function?.arguments
//     // onUpdate(content);
//     console.log(content);
//   }

//   // onSuccess(content);
// };