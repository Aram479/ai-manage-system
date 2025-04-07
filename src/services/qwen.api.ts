/* 通义千问 */

import { XRequest } from "@ant-design/x";

export const qwenXRequest = XRequest({
  baseURL: "/ali/chat/completions",
  // model: "deepseek-chat",
  dangerouslyApiKey: `Bearer ${process.env.QWEN_API_KEY}`,
  fetch: (url, config) => {
    window.abortController = new AbortController();
    return fetch(url, {
      ...config,
      signal: window.abortController.signal,
    });
  },
});

export const qwenPictureXRequest = XRequest({
  baseURL: "/ali/services/aigc/text2image/image-synthesis",
  model: "wanx2.1-t2i-turbo", // wanx2.1-t2i-turbo wanx-v1
  dangerouslyApiKey: `Bearer ${process.env.QWEN_API_KEY}`,
  fetch: (url, config) => {
    window.abortController = new AbortController();
    return fetch(url, {
      ...config,
      signal: window.abortController.signal,
    });
  },
});