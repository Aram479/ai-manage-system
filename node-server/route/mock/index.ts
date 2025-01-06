import {setReturnJson} from "../../../mock/mock-api.util";
import {trimStartStr} from "../../utils/util";
import {MOCK_SERVER} from "../../../src/constant/request.const";


const express = require('express');
const router = express.Router();
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({storage: storage});
// // 文件存储配置;
// const storage = multer.diskStorage({
//   //路径配置
//   destination: function (req, file, cb) {
//     cb(null, path.resolve(__dirname, '../../public/upload'));
//   },
//   //文件名配置
//   filename: function (req, file, cb) {
//     //4位随机字符+文件名
//     const ramdomStr = Math.random().toString(36).slice(-6);
//     const ext = path.extname(file.originalname);
//     const filename = `${ramdomStr}${ext}`;
//     cb(null, filename);
//   },
// });
//
// // 文件上传配置
// const upload = multer({
//   storage
// });

const mountApi = (apis: Record<string, Function>) => {
  Object.entries(apis).forEach((func) => {
    const apiArr = func[0].split(' ');
    if (apiArr.length < 2) {
      return;
    }
    const apiName = apiArr[0].toLowerCase();
    const apiFunc = func[1];
    if (typeof apiFunc !== 'function') {
      return;
    }
    if (apiArr[1].endsWith('/upload')) {
      router[apiName]?.(trimStartStr(apiArr[1], MOCK_SERVER), upload.single('file'), (req, res) => {
        setReturnJson(res);
        return apiFunc(req, res);
      });
    } else {
      router[apiName]?.(trimStartStr(apiArr[1], MOCK_SERVER), (req, res) => {
        setReturnJson(res);
        return apiFunc(req, res);
      });
    }
  });
};

/**
 * 注意，要求引入的文件的依赖，只能是相对依赖、common包下的依赖
 */
const mockApis = require('../../../mock');
Object.values(mockApis).forEach((apiObj) => {
  mountApi(apiObj as Record<string, Function>);
});

module.exports = router;