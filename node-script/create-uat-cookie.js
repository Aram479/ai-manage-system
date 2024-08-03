const environment = require('../environment/index.ts');
const fs = require('fs');
const path = require('path');
const resultPath = path.resolve('./', './dist/result.txt');

// 判断文件是否存在，存在就删除
if (fs.existsSync(resultPath)) {
  fs.unlinkSync(resultPath);
}

// 写入方法
function writeFile(key, stringVal) {
  fs.appendFileSync(resultPath, `add_header Set-Cookie \"ENV__${key}=${stringVal}\"\n`);
}

// 递归写入value
function getKeyValues(data = {}, fatherKey = '') {
  for (let key in data) {
    const val = data[key];
    if (typeof val !== 'object') {
      const resultString = fatherKey ? `${fatherKey}.${key}` : key;
      writeFile(resultString, val);
    } else {
      getKeyValues(val, key);
    }
  }
}

getKeyValues(environment);
