const xlsx = require("../private/node-xlsx/lib");
const fs = require("fs");
const yaml = require("js-yaml");
const co = require("co");
const prompt = require("co-prompt");

module.exports = (path) => {
  co(function* () {
    let [inPath, outPath] = path;
    // 处理用户输入
    inPath = inPath ? inPath : yield prompt("Input file directory: ");
    outPath = outPath
      ? outPath
      : (yield prompt("Output file directory: ")) || inPath;

    // 获取基础数据
    const baseContent = JSON.parse(fs.readFileSync("./content.json"));
    // 获取yaml转化之后的json数据
    const accountmgmt = yaml2json();
    // 获取json数据内的paths
    const paths = accountmgmt.paths;
    // 获取json数据内的definitions
    const definitions = accountmgmt.definitions;
    // 所有参数描述值对象
    let allDescObj = getAllDescObj(definitions);
    // 获取xlsx样式
    const borderStyle = baseContent.borderStyle;
    const textRight = baseContent.textRight;

    // 获取yaml数据转json
    function yaml2json() {
      let doc = yaml.load(fs.readFileSync(inPath, "utf8"));
      return doc;
    }

    // 获取allDescObj(所有描述键值对对象)
    function getAllDescObj(definitions) {
      let resObj = {};
      // 遍历definitions获取type(类型)及description(描述)
      const allTypeDesc = Object.keys(definitions).map((item) => {
        return Object.keys(definitions[item].properties).map((i) => {
          let obj = {};
          obj[i] = {
            type: definitions[item].properties[i].type,
            description: definitions[item].properties[i].description,
          };
          return obj;
        });
      });

      function extend(o, n) {
        for (var p in n) {
          if (n.hasOwnProperty(p) && !o.hasOwnProperty(p)) o[p] = n[p];
        }
      }

      // 将二维数组转化为键值对的对象形式
      allTypeDesc.flat().forEach((i) => {
        extend(resObj, i);
      });

      return resObj;
    }

    // 生成xlsx数据
    function json2Sheet(nameList, dataList) {
      // 行宽配置项
      const options = {
        "!cols": [
          { wch: 25 },
          { wch: 15 },
          { wch: 10 },
          { wch: 45 },
          { wch: 15 },
          { wch: 15 },
          { wch: 15 },
        ],
      };
      let bufferArray = [];
      for (let name in nameList) {
        bufferArray.push({
          name: nameList[name],
          data: dataList
            .filter((item) => item.operationId === nameList[name])
            .map((i) => i.arr)[0],
        });
      }
      return xlsx.build(bufferArray, options);
    }

    // 获取nameList(sheetName最长31位)
    function getNameList(paths) {
      let maxLength = 31;
      return Object.keys(paths).map((item) =>
        item.replace("/", "").substr(item, maxLength)
      );
    }

    // 获取dataList
    function getDataList(paths) {
      let resArr = [];
      // 新赋值属性operationId(接口名称)
      Object.keys(paths).forEach((i) => {
        for (let type in paths[i]) {
          paths[i][type]["operationId"] = i.replace("/", "");
        }
      });
      // 拼接最终处理所需数据类型
      Object.values(paths).map((item) => {
        let type = Object.keys(item)[0];
        let obj = {
          // 接口名称
          operationId: item[type].operationId.substr(
            item[type].operationId,
            31
          ),
          // 接口类型
          type,
          // 接口用途
          use: item[type].summary
            ? item[type].summary.replace(/\[.*?\]/g, () => {
                return "";
              })
            : "暂无",
          // 请求体
          request:
            type == "post"
              ? item[type].parameters[0].schema.$ref.replace(
                  "#/definitions/",
                  ""
                )
              : item[type].parameters,
          // 响应体
          response: item[type].responses["200"].schema.$ref.replace(
            "#/definitions/",
            ""
          ),
        };
        resArr.push(obj);
      });

      // 通过请求体、响应体获取真实的请求内容及响应内容
      resArr.forEach((item) => {
        item.realRequest = getRealRequest(item.request);
        item.realResponse = getRealRequest(item.response);
      });

      return resArr;
    }

    // 获取真实请求、响应内容,并设置realType(数据真实类型)
    function getRealRequest(name, type = "json") {
      let obj = definitions[name];
      obj && (obj["realType"] = type);
      return obj;
    }

    // 类型转换
    function transType(item) {
      let res = "";
      switch (item.type) {
        case "object":
          res = "json";
          break;
        case "string":
          res = "string";
          break;
        case "integer":
          res = "int";
          break;
        case "number":
          res = "int";
          break;
        case "boolean":
          res = "boolean";
          break;
        case "list":
          res = "list";
          break;
        case "array":
          res = item.items.$ref
            ? getRealRequest(
                item.items.$ref.replace("#/definitions/", ""),
                "jsonArray"
              )
            : "list";
          break;
        default:
          res = getRealRequest(item.$ref.replace("#/definitions/", ""));
      }
      return res;
    }

    // 描述转换
    function transDescription(i) {
      let obj =
        allDescObj[i]["description"] !== undefined
          ? allDescObj[i]
          : { description: "暂无描述" };

      let res = "";
      switch (i) {
        case "result":
          res = "返回值";
          break;
        case "resultMessage":
          res = "返回状态描述";
          break;
        case "resultCode":
          res = "返回状态码";
          break;
        default:
          res = obj["description"];
      }
      return res;
    }

    //获取模拟数据
    function getMockData(i) {
      let res = "";
      switch (i) {
        case "result":
          res = "";
          break;
        case "resultMessage":
          res = {
            v: "接口响应正常",
            s: textRight,
          };
          break;
        case "resultCode":
          res = {
            v: "200",
            s: textRight,
          };
          break;
        default:
          res = "";
      }
      return [res, res, res];
    }

    // 递归获取响应内容数组
    function getResponseArr(item) {
      let boxArr = [];
      const recursive = (cur, bArr) => {
        let responseArr = Object.keys(cur).map((i) => {
          return [
            { v: i, s: borderStyle },
            { v: transType(cur[i]), s: borderStyle },
            { v: "可选", s: borderStyle },
            { v: transDescription(i), s: borderStyle },
            ...getMockData(i),
          ];
        });
        bArr.push(...responseArr);
        responseArr.forEach((i) => {
          if (typeof i[1]["v"] !== "string") {
            bArr.push([]);
            bArr.push([i[0]["v"]]);
            recursive(i[1]["v"].properties, bArr);
          }
        });
      };
      recursive(item.realResponse.properties, boxArr);
      return boxArr;
    }

    // 递归获取请求内容数组
    function getRequestArr(item) {
      let { type } = item;
      let requestArr = [];
      if (type == "get") {
        requestArr = item.request.map((i) => {
          return [
            { v: i.name, s: borderStyle },
            { v: i.type, s: borderStyle },
            { v: i.required ? "必填" : "可选", s: borderStyle },
            { v: i.description, s: borderStyle },
          ];
        });
      } else {
        let boxArr = [];
        const recursive = (cur, bArr) => {
          let responseArr = Object.keys(cur).map((i) => {
            return [
              { v: i, s: borderStyle },
              { v: transType(cur[i]), s: borderStyle },
              { v: "可选", s: borderStyle },
              { v: transDescription(i), s: borderStyle },
            ];
          });
          bArr.push(...responseArr);
          responseArr.forEach((i) => {
            if (typeof i[1]["v"] !== "string") {
              bArr.push([]);
              bArr.push([i[0]["v"]]);
              recursive(i[1]["v"].properties, bArr);
            }
          });
        };
        recursive(item.realRequest.properties, boxArr);
        requestArr = boxArr;
      }
      return requestArr;
    }

    // 修改title基础内容
    function getTitleArr(item) {
      let resArr = JSON.parse(JSON.stringify(baseContent.title));
      // 修改请求类型
      resArr[2][1]["v"] = item.type;
      // 修改用途及说明
      resArr[3][1]["v"] = item.use;
      resArr[4][1]["v"] = item.use;

      return resArr;
    }

    // 获取最终data
    function getRealData(data) {
      return data.map((item) => {
        return item.map((i) => {
          if (typeof i["v"] === "object") {
            return { v: i["v"].realType ? i["v"].realType : i, s: borderStyle };
          } else {
            return i;
          }
        });
      });
    }

    // 合并xlsx所需数组
    function mergeData(dList) {
      let resList = [];
      dList.forEach((item) => {
        let data = [];
        // 数据拼接 表头
        let titleArr = getTitleArr(item);
        data.push(...titleArr);
        // 数据拼接 请求头
        data.push(...baseContent.request);
        // 数据拼接 请求参数
        let requestArr = getRequestArr(item);
        data.push(...requestArr);
        // 数据拼接 响应头
        data.push(...baseContent.response);
        // 数据拼接 响应参数
        let responseArr = getResponseArr(item);
        data.push(...responseArr);
        // 数据拼接 结尾
        data.push(...baseContent.end);
        // 设置realType(真实类型)
        data = getRealData(data);

        let obj = {
          operationId: item.operationId,
          arr: data,
        };
        resList.push(obj);
      });

      return resList;
    }

    // 写入xlsx文件
    function writeXlsx(buffer) {
      fs.writeFileSync(outPath + "\\import.xlsx", buffer);
      console.log('文件转换完成')
      console.log('文件输出位置：',outPath + "\\import.xlsx")
    }

    // 主函数
    function main() {
      let dList = getDataList(paths);
      let dataList = mergeData(dList);
      let nameList = getNameList(paths);
      var buffer = json2Sheet(nameList, dataList);
      writeXlsx(buffer);
    }

    main();
  });
};
