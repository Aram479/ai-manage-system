/* 通义千问 */

import { XRequest } from "@ant-design/x";

// 接口文档 http://127.0.0.1/app/746cab7a-8ff0-4688-8421-c7ba4250a38b/develop
export const difyXRequest = XRequest({
  baseURL: "/dify/chat-messages",
  dangerouslyApiKey: `Bearer ${process.env.DIFY_TOKEN}`,
  fetch: (url, config) => {
    window.abortController = new AbortController();
    return fetch(url, {
      ...config,
      signal: window.abortController.signal,
    });
  },
});

// export const open_ai = new OpenAI({
//   baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1",
//   apiKey: process.env.QWEN_API_KEY,
//   dangerouslyAllowBrowser: true,
// });

// export const difyFileUpload = open_ai.files;

// export const difyPictureXRequest = XRequest({
//   baseURL: "/ali/services/aigc/text2image/image-synthesis",
//   model: "wanx2.1-t2i-turbo", // wanx2.1-t2i-turbo wanx-v1
//   dangerouslyApiKey: `Bearer ${process.env.QWEN_API_KEY}`,
//   fetch: (url, config) => {
//     window.abortController = new AbortController();
//     return fetch(url, {
//       ...config,
//       signal: window.abortController.signal,
//     });
//   },
// });
