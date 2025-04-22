/* 通义千问 */

import { XRequest } from '@ant-design/x';
import OpenAI from 'openai';

export const qwenXRequest = XRequest({
  baseURL: '/ali/chat/completions',
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

export const open_ai = new OpenAI({
  baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
  apiKey: process.env.QWEN_API_KEY,
  dangerouslyAllowBrowser: true,
});

export const qwenFileUpload = open_ai.files;

export const qwenPictureXRequest = XRequest({
  baseURL: '/ali/services/aigc/text2image/image-synthesis',
  model: 'wanx2.1-t2i-turbo', // wanx2.1-t2i-turbo wanx-v1
  dangerouslyApiKey: `Bearer ${process.env.QWEN_API_KEY}`,
  fetch: (url, config) => {
    window.abortController = new AbortController();
    return fetch(url, {
      ...config,
      signal: window.abortController.signal,
    });
  },
});
