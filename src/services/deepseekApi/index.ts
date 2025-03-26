import { useXAgent, XRequest } from "@ant-design/x";
import { request } from "@umijs/max";

// export const deepSeekXRequest = useXAgent({
//   baseURL: "/api/chat/completions",
//   model: "deepseek-chat",
//   dangerouslyApiKey: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
// });



// export const creatChat = (data: any) => {
//   return request("/api/chat/completions", {
//     method: "POST",
//     data: {
//       model: "deepseek-chat",
//       stream: true,
//       ...data,
//     },
//   });
// };

export const deepSeekXRequest = XRequest({
  baseURL: "/api/chat/completions",
  model: "deepseek-chat",
  dangerouslyApiKey: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
});