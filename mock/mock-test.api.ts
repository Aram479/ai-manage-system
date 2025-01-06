import {createMockApi} from "./mock-api.util";
import {MOCK_SERVER} from "../src/constant/request.const";

console.log('mock start');
const mockApi = new createMockApi();
mockApi.addApi({
  method: "GET",
  url: `${MOCK_SERVER}/field-manage/list`,
  getResult(req) {
    return Promise.resolve([
      {
        id: '1223213213213213213123213210',
        fieldProject: ['招乎荣誉1', '价值卡荣誉1'],
        lastModified: '2022-06-08 14:00:00',
        fieldName: '工会荣誉体系',
        admins: [
          {
            userName: '袁琳丽',
            employeeId: '01173729',
            checked: false,
            enterpriseId: 'uatf04a6705882ac0170588f0d87000c',
            openId: '4C4041FA7320C1446D335231D2B4C9AA',
            orgId: '2c9e01827ed6f6a8017ed7b6fe6c1977',
            userId: '4C4041FA7320C1446D335231D2B4C9AA',
          },
        ],
        description: '我是一个体系',
        secretKey: 'fdgs1asafdsagfdsgfdh210',
      },
    ])
  },
});
export default mockApi.getMockExport();
