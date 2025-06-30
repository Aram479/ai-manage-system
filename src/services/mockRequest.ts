interface IMockData<T> {
  code: number;
  data: T;
  message?: string;
}

// 通用的模拟请求函数
export const mockRequest = <T>(
  mockData: T,
  errorData?: IMockData<any>,
  delay: number = 500
) => {
  return new Promise<IMockData<T>>((resolve, reject) => {
    setTimeout(() => {
      if (!errorData) {
        // 模拟成功返回数据
        resolve({
          code: 200,
          data: mockData,
          message: "请求成功",
        });
      } else {
        // 如果你想模拟失败，可以使用下面这行：
        reject({
          ...errorData,
          message: errorData.message ?? "网络异常，请稍后重试",
        });
      }
    }, delay);
  });
};
