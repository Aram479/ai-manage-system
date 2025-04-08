import { message } from "antd";
import "./global.less";
import type { RequestConfig } from "@umijs/max";
import Assistant from "./component/Assistant";

const { API_BASE_URL } = process.env;

export const request: RequestConfig = {
  timeout: 60 * 60 * 1000,
  baseURL: API_BASE_URL,
  requestInterceptors: [
    (config: RequestConfig) => {
      config.headers!.Authorization = `Bearer ${process.env.DEEPSEEK_API_KEY}`;
      return { ...config };
    },
  ],
  errorConfig: {
    errorHandler: async (error: any) => {
      // const { errcode, data } = error.response || {};
      // if (data && typeof data.result === "string") {
      //   message.error({
      //     content: data.result,
      //     duration: 1,
      //   });
      // }
    },
    errorThrower: () => null,
  },
  responseInterceptors: [
    async (response) => {
      // const { data } = response;
      // // 检查errcode并处理错误
      // if (data?.errcode && data?.errcode !== 0) {
      //   handleError(data, response);
      // }

      // // 检查content-type是否为application/json
      // if (response.headers["content-type"]?.includes("application/json")) {
      //   // 获取responseType: 'blob'接口错误 返回数据
      //   const text = await data?.text?.();
      //   if (text) {
      //     const newData = JSON.parse(text);
      //     if (newData?.errcode && newData?.errcode !== 0) {
      //       handleError(newData, response);
      //     }
      //   }
      //   response.data = data.result;
      // }

      return response;
    },
    [
      (response) => response,
      async (error) => {
        // const { request, config } = error;
        // if (request?.status === 401) {
        //   redirectToAuth();
        // }
        return Promise.reject(error);
      },
    ],
  ],
};

// 全局组件
export function rootContainer(container: React.ReactNode) {
  return (
    <div>
      {/* 根页面 */}
      {container}
      {/* Chat助手 */}
      <Assistant />
    </div>
  );
}
