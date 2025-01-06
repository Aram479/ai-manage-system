import mockjs from 'mockjs';
import {SafeAny} from "../src/types/model/common.model";
import {ERROR_CODE, SUCCESS_CODE} from "../src/constant/request.const";

export const {Random, mock} = mockjs;

/**
 * 表单数据文件类型
 */
export interface FormDataFileModel {
  fieldname: string; // formData中的key
  originalname: string; // 文件名
  mimetype: string; // 文件类型
  encoding: string; // 编码类型 7bit
  size: number; // 文件大小
  buffer: Buffer; // 文件二进制流
}

export interface MockRequest<T = SafeAny> {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  url: string;
  headers?: { [key: string]: string };
  body?: T;
  params?: { [key: string]: string };
  query?: { [key: string]: string };
  file?: FormDataFileModel; // 上传文件时的文件FormData对象
}

export interface MockResponse {
  status: number;
  statusText: string;
  headers?: { [key: string]: string };
  body?: string;
  send: (body: string) => void;
  setHeader: (key: string, val: string) => void;
}

export interface MockApiModel extends Pick<MockRequest, 'url' | 'method'> {
  getResult: (req: MockRequest, res: MockResponse) => Promise<unknown>;
  delay?: number;
}

/**
 * 发送成功响应
 */
export const sendOk = (res: MockResponse, body: unknown = null) => {
  res.send(
    JSON.stringify({
      returnCode: SUCCESS_CODE,
      errorMsg: null,
      body,
    })
  );
};

/**
 * 发送失败响应
 */
export const sendError = (res: MockResponse, errorMsg = "") => {
  res.send(
    JSON.stringify({
      returnCode: ERROR_CODE,
      msg: errorMsg,
      body: null,
    })
  );
};

/**
 * 分页查询结果
 */
export const getPageContent = (data: unknown[], req: MockRequest) => {
  const pageIndex = (req?.body?.pageIndex as number) || 1;
  const pageSize = (req?.body?.pageSize as number) || 10;
  if (!data?.length) {
    return {
      content: [],
      totalElements: 0,
      totalPages: 0,
      pageIndex,
      pageSize,
    };
  }
  return {
    content: data.slice((pageIndex - 1) * pageSize, (pageIndex - 1) * pageSize + pageSize),
    totalElements: data.length,
    totalPages: Math.ceil(data.length / pageSize),
    pageIndex,
    pageSize,
  };
};

/**
 * 设置返回json格式
 */
export const setReturnJson = (res: MockResponse) => {
  res.setHeader('Content-Type', 'application/json');
};


/**
 * 延迟请求
 */
export const delayRequest = (time = 200) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(undefined);
    }, time);
  });
};

/**
 * 模拟随机机构信息
 */
export const getRandomOrgInfo = (orgId?: string, originOrgId?: string) => {
  return {
    originOrgId,
    orgId,
    orgName: Random.pick(
      '招商银行/总行/信息技术部/基础设施研发中心/协同办公开发团队/综合应用开发室(成都)'.split('/'),
    ),
    pathName: '招商银行/总行/信息技术部/基础设施研发中心/协同办公开发团队/综合应用开发室(成都)',
    originPathId: '100001/104922/104939/119387',
  };
};

/**
 * 模拟随机人员信息
 */
export const getRandomUserInfo = (openId: string) => {
  return {
    employeeId: Random.integer(80000000, 90000000).toString(),
    openId,
    userName: Random.cname(),
    pathName: Random.pick(
      '招商银行/总行/信息技术部/基础设施研发中心/协同办公开发团队/综合应用开发室(成都)'.split('/'),
    ),
  };
};

/**
 * 模拟设置Authorization
 */
export const setAuthorization = (req: MockRequest, res: MockResponse) => {
  res.setHeader(
    'authorization',
    req.headers?.authorization ||
    'i_am_a_mock_jwt_token_i_am_a_mock_jwt_token_i_am_a_mock_jwt_token_i_am_a_mock_jwt_token',
  );
};

/**
 * 辅助创建MockApi的类
 */
export class createMockApi {
  mockApiList: MockApiModel[];

  constructor() {
    this.mockApiList = [];
  }

  addApi(api: MockApiModel) {
    this.mockApiList.push(api);
  }

  getMockExport() {
    const mockExport: Record<string, (req: MockRequest, res: MockResponse) => Promise<void>> = {};
    this.mockApiList.forEach((mockApi) => {
      const targetUrl = mockApi.url;
      mockExport[`${mockApi.method} ${targetUrl}`] = async (
        req: MockRequest,
        res: MockResponse,
      ) => {
        setAuthorization(req, res);
        await delayRequest(mockApi.delay || 500);
        try {
          const result = await mockApi.getResult(req, res);
          return sendOk(res, result);
        } catch (e) {
          return sendError(res, typeof e === 'string' ? e : JSON.stringify(e));
        }
      };
    });
    return mockExport;
  }
}
