const fs = require("fs");

// 获取 Api 文件数据
let ApiData = fs.readFileSync("./service/Api.ts").toString().split("\n");

let scpMockUrl = "./service/ScpMock.ts";
// 获取 jsBridge 文件数据
let jsBridgeData = fs
  .readFileSync("./utils/jsBridgeUtils.js")
  .toString()
  .split("\n");

// 获取 scpMockUrl 文件数据
let scpMockData = fs
  .readFileSync(scpMockUrl)
  .toString()
  .split("\n");

// 基础插件数据
let pluginContent = fs
  .readFileSync("./pluginContent.js")
  .toString()
  .split("\n");
const pluginData = getPluginData();

function pluginExists() {
  let exiDir = [];
  ApiData.forEach((item) => {
    if (item.indexOf(pluginData.IMPORT[2]) != -1) {
      exiDir.push("Api.ts");
    }
  });
  jsBridgeData.forEach((item) => {
    if (item.indexOf(pluginData.SCPMOCKFUN[12]) != -1) {
      exiDir.push("jsBridgeUtils.js");
    }
  });
  return exiDir;
}

// 获取基础插件数据
function getPluginData() {
  let arr = [];
  let data = {};
  pluginContent.forEach((item) => {
    if (item.indexOf("DIVIDER") != -1) {
      let name = item.split("-")[0];
      data[`${name}`] = arr;
      arr = [];
    } else {
      arr.push(item);
    }
  });
  return data;
}

// 在 Api.ts 文件内插入 插件代码
function setData(data) {
  let i = 0;
  data.forEach((item, index) => {
    // 判断是否为空格区域
    if (item == "\r" && data[Number(index + 1)] !== "\r") {
      i++;
      // 在第二个空格区域插入 上方引入
      if (i == 2) {
        data.splice(index, 0, ...pluginData.IMPORT);
      }
    }
    // 在 dealResultPromise 函数内 插入mock请求分支
    if (item.indexOf("dealResultPromise") != -1) {
      data.splice(Number(index + 2), 0, ...pluginData.MOCKBRANCH);
    }
  });
  return data;
}

// 数组拼接成字符串
function getRealData(data) {
  return data.reduce((pre, cur) => {
    return pre + "\n" + cur;
  }, "");
}

let exiDir = pluginExists();
if (exiDir.length){ console.log(1); return};
console.log(2); 
// 插入插件数据
ApiData = setData(ApiData);
// 进行字符串转化
let resApiData = getRealData(ApiData);
// 在 jsBridge 文件最后 插入scpMockFunction
jsBridgeData = jsBridgeData.concat(...pluginData.SCPMOCKFUN);
// 进行字符串转化
let resJsBridgeData = getRealData(jsBridgeData);
// 生成文件
fs.writeFileSync("./jsBridgeData.js", resJsBridgeData, "utf-8");
fs.writeFileSync("./data.ts", resApiData, "utf-8");

fs.writeFileSync(scpMockUrl,scpMockData.join("\n"), "utf-8");
