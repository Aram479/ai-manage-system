import {createMockApi, getPageContent, mock} from "./mock-api.util";
import {MockApiInfoDTO, MockApiTypeEnum} from "../src/types/model/mock-api.demo.model";
import {MOCK_SERVER} from "../src/constant/request.const";

/**
 * 1.生成数据库数据（数据库）
 */
const CompInfoDataBase = mock({
  "data|100": [
    {
      "id|+1": 100000,
      name: "@cword(5,10)",
      "type|1": Object.values(MockApiTypeEnum),
      author: "@cname/@integer(10000000, 99999999)",
      introduce: "@csentence",
      updateTime: "@datetime(yyyy-MM-dd HH:mm)",
    },
  ],
});

/**
 * 2.通过Map和Sort处理一下数据，得到前端需要的数据结构（数据访问层）
 */
const CompInfoData: MockApiInfoDTO[] = CompInfoDataBase.data.map((item) => item).sort((a, b) => b.id - a.id);

/**
 * 3.生成接口（控制层和服务层）
 */
const mockApi = new createMockApi();
// 页面查询
mockApi.addApi({
  method: "POST",
  url: `${MOCK_SERVER}/comp-list/page`,
  getResult(req) {
    const filterData = CompInfoData.filter((originInfo) => {
      // 从所有赛选条件中去寻找，看原数据中有没有不满足赛选条件的，如果找到不满足的了，赛选掉
      return !Object.entries(req.body || {}).some(([queryKey, queryVal]) => {
        const originValue = originInfo[queryKey as keyof MockApiInfoDTO];
        if (!queryVal || !originValue) {
          return false;
        }
        if (typeof queryVal === "string" || typeof queryVal === "number") {
          return !originValue.toString().includes(queryVal.toString());
        }
        return true;
      });
    });
    return Promise.resolve(getPageContent(filterData, req));
  },
});

// 删除接口
mockApi.addApi({
  method: "DELETE",
  url: `${MOCK_SERVER}/comp-list`,
  getResult(req) {
    if (!req.query?.id) {
      return Promise.reject("id不能为空");
    }
    const idx = CompInfoData.findIndex((item) => item.id.toString() === req.query.id);
    if (idx === -1) {
      return Promise.reject("没有找到对应的id");
    }
    CompInfoData.splice(idx, 1);
    return Promise.resolve();
  },
});

// 新增接口
mockApi.addApi({
  method: "POST",
  url: `${MOCK_SERVER}/comp-list`,
  getResult(req, res) {
    const compInfo = req.body as MockApiInfoDTO;
    if (!compInfo.name || !compInfo.type) {
      return Promise.reject("缺少必传参数");
    }
    const newId = CompInfoData[0].id + 1;
    const newData = {
      id: newId,
      name: "pl" + newId,
    };
    CompInfoData.unshift(<MockApiInfoDTO>newData);
    return Promise.resolve();
  },
});

// 修改接口
mockApi.addApi({
  method: "PUT",
  url: `${MOCK_SERVER}/comp-list`,
  getResult(req) {
    const compInfo = req.body as MockApiInfoDTO;
    if (!compInfo.id) {
      return Promise.reject("缺少必传参数");
    }
    const idx = CompInfoData.findIndex((item) => item.id == compInfo.id);
    if (idx === -1) {
      return Promise.reject("没有找到对应的id");
    }
    CompInfoData[idx] = {
      ...CompInfoData[idx],
      ...req.body,
    };
    return Promise.resolve();
  },
});

export default mockApi.getMockExport();
