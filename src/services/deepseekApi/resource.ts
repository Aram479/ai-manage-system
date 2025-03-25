import OpenAI from "openai";
import { request } from "@umijs/max";
// export const getResource = (chatId) => {
//   return request.get(`/api/resources/${chatId}`);
// };

export const creatResource = () => {
  // console.log(request)
  return request("/api/chat/completions", {
    method: "POST",
    maxBodyLength: Infinity,
    data: {
      messages: [{ role: "system", content: "Hello" }],
      model: "deepseek-chat",
    },
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
};
