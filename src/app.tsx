import { message } from "antd";
import "./global.less";
import { AxiosResponse, type RequestConfig } from "@umijs/max";
import localCache from "@/utils/cache";
const { API_BASE_URL } = process.env;

export const request: RequestConfig = {
  timeout: 60 * 60 * 1000,
  baseURL: API_BASE_URL,
  requestInterceptors: [
    (config: RequestConfig) => {
      config.headers!.Authorization = `Bearer ${localCache.getItem("token")}`;
      return { ...config };
    },
  ],
  errorConfig: {
    errorHandler: async (error: any) => {
      const { data } = error.response || {};
      if (data && typeof data.message === "string") {
        message.error({
          content: data.message,
          duration: 1,
        });
      }
    },
    errorThrower: () => null,
  },
  responseInterceptors: [
    async (response: AxiosResponse<any>) => {
      // const { data } = response;
      // // 统一处理错误
      // if (response.headers["content-type"]?.includes("application/json")) {
      //   const text = await data?.text?.();
      //   if (text) {
      //     const newData = JSON.parse(text);
      //     console.log("newData", newData)
      //     if (newData?.code && newData?.code !== 200) {

      //       // handleError(newData, response);
      //     }
      //   }
      //   response.data = data.result;
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
      response.data = response.data.data;
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
