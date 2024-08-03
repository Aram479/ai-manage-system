import { fetchData, request } from '@/services/request';

export function apiTestFun(id: number, signal: AbortSignal) {
  return fetchData({
    url: "/admin-server/field-manage/list",
    method: "post",
    data: {
      id,
    },
    signal,
  });
}

export function apiTestGetFun() {
  return request({
    url: "http://127.0.0.1:4567/bing-server/AS/Suggestions?pt=page.home&mkt=zh-CN&qry=&cp=0&css=1&zis=1&cvid=95B22D021CCC4125BE5567DCBB3EBA11",
    method: "get",
    headers: {
      Authorization: "123456",
    },
  });
}