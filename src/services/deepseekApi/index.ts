import { XRequest } from "@ant-design/x";

// deepseek-reasoner  deepseek-chat
export const deepSeekXRequest = XRequest({
  baseURL: "/api/chat/completions",
  model: "deepseek-reasoner",
  dangerouslyApiKey: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
  fetch: (url, config) => {
    window.abortController = new AbortController();
    return fetch(url, {
      ...config,
      signal: window.abortController.signal,
    });
  },
});
