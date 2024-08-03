import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { ResponseModel } from '@/models/request.model';
import { SUCCESS_CODE } from '@/constant/request.const';
import { message } from 'antd';

const CommonConfig = {
  timeout: 6000,
};
const service = axios.create({ ...CommonConfig });

const fileService = axios.create({ ...CommonConfig });

export function request<T>(config: AxiosRequestConfig): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    service(config)
      .then((res: AxiosResponse<T>) => resolve(res.data || (res as any)))
      .catch((res: AxiosResponse<null>) => {
        reject(res.data || (res as any));
      });
  });
}

export function fileRequest(config: AxiosRequestConfig): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const options = { responseType: 'blob', ...config } as AxiosRequestConfig;
    fileService(options).then(
      (res: AxiosResponse<Blob>) => resolve(res.data),
      (res: AxiosResponse<null>) => {
        reject(res.data || (res as any));
      },
    );
  });
}

export function fetchData<T>(config: AxiosRequestConfig) {
  return request<ResponseModel<T>>(config).then((data) => {
    if (data.returnCode !== SUCCESS_CODE) {
      message.error(data.msg || '未知错误');
      return Promise.reject();
    }
    return data.data;
  });
}
