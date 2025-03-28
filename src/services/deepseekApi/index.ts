import { XRequest } from "@ant-design/x";

export const deepSeekXRequest = XRequest({
  baseURL: "/api/chat/completions",
  model: "deepseek-chat",
  dangerouslyApiKey: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
  fetch: (url, config) => {
    window.custonController = new AbortController() as AbortController
    return fetch(url, {
      ...config,
      signal:  window.custonController.signal,
    });
  },
});
