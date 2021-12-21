const xlsx = require("./private/node-xlsx/lib");
const admZip = require("adm-zip");
const fs = require("fs");

// 获取基础数据
const baseContent = JSON.parse(fs.readFileSync("./content.json"));
// 获取xlsx样式
const borderStyle = baseContent.borderStyle;
const textRight = baseContent.textRight;

//参数是word文件名,第二个参数是回调表示解析完成
function parseWordDocument(absoluteWordPath, callback) {
  //返回内容的数组
  var resultList = [];
  //如果文件存在
  fs.exists(absoluteWordPath, function (exists) {
    if (exists) {
      //解压缩
      const zip = new admZip(absoluteWordPath);
      //将document.xml(解压缩后得到的文件)读取为text内容
      var contentXml = zip.readAsText("word/document.xml");
      //正则匹配出对应的<w:p>里面的内容,方法是先匹配<w:p>,再匹配里面的<w:t>,将匹配到的加起来即可
      //注意？表示非贪婪模式(尽可能少匹配字符)，否则只能匹配到一个<w:p></w:p>
      var matchedWP = contentXml.match(/<w:p.*?>.*?<\/w:p>/gi);
      //继续匹配每个<w:p></w:p>里面的<w:t>,这里必须判断matchedWP存在否则报错
      if (matchedWP) {
        matchedWP.forEach(function (wpItem) {
          //注意这里<w:t>的匹配，有可能是<w:t xml:space="preserve">这种格式，需要特殊处理
          var matchedWT = wpItem.match(
            /(<w:t>.*?<\/w:t>)|(<w:t\s.[^>]*?>.*?<\/w:t>)/gi
          );
          var textContent = "";
          if (matchedWT) {
            matchedWT.forEach(function (wtItem) {
              //如果不是<w:t xml:space="preserve">格式
              if (wtItem.indexOf("xml:space") === -1) {
                textContent += wtItem.slice(5, -6);
              } else {
                textContent += wtItem.slice(26, -6);
              }
            });
            resultList.push(textContent);
          }
        });
        //解析完成
        callback(resultList);
      }
    } else {
      callback(resultList);
    }
  });
}

parseWordDocument("./公告服务-接口说明书2.docx", (res) => {
  function initArr(arr = []) {
    // 当前项接口
    let index = 0;
    // 当前接口内容
    let content = [];
    res.forEach((item, i) => {
      if (item == "ddchmpanyActivityInf") {
        res.splice(i, 1); // 从下标 i 开始, 删除 1 个元素
      }
    });
    res.reverse().forEach((item) => {
      // 根据 '功能描述' 切割大数组
      if (item == "功能描述") {
        // 倒置数组顺序
        let objContent = content.reverse();
        // 清空存量数组
        content = [];
        // 当不为0时,处理最后一项需删除
        if (index != 0) {
          objContent.pop();
        }
        let arrItem = {
          key: `功能描述${index}`,
          value: objContent,
        };
        arr.push(arrItem);
        index++;
      } else {
        // 将每一项插入到内容中
        content.push(item);
      }
    });
    return arr;
  }

  function Trim(str) {
    return str.replace(/(^\s*)|(\s*$)/g, "");
  }

  function getRealUrl(value) {
    let i = 0;
    value.forEach((item, index) => {
      if (item.indexOf("接口地址") != -1) {
        i = Number(index + 1);
      }
    });
    if (value[i].indexOf("接口域名/") != -1) {
      return value[i].split("接口域名/")[1];
    } else {
      return value[i].split("：")[1] + "." + value[i + 1].split("：")[1];
    }
  }

  function getRealtype(value) {
    let i = 0;
    value.forEach((item, index) => {
      if (item.indexOf("接口类型") != -1) {
        i = Number(index + 1);
      }
    });
    return value[i].toLowerCase();
  }

  function getRealArr(arr) {
    let menu = {
      request: "request",
      response: "response",
    };
    let resArr = arr.reverse().map((item) => {
      let value = item.value;
      let desc = value[0];
      let url = getRealUrl(value);
      let type = getRealtype(value);
      let paramsObj = {}; // 请求 and 响应参数对象
      let paramsList = []; // 请求 or 响应参数数组
      value.reverse().forEach((i) => {
        if (i.indexOf("请求参数") != -1 || i.indexOf("响应参数") != -1) {
          // 倒置数组顺序
          let resArr = paramsList.reverse();
          // 清空存量数组
          paramsList = [];
          // 对象赋值
          paramsObj[
            i.indexOf("请求参数") != -1 ? menu["request"] : menu["response"]
          ] = resArr;
        } else {
          // 兼容-表格存在标题情况
          let delArr = ["参数", "类型", "必填", "说明"];
          if (delArr.includes(i)) {
            return;
          }
          if (i.indexOf("&lt;") != -1 || i.indexOf("&gt;") != -1) {
            i = i.replace("&lt;", "<").replace("&gt;", ">");
          }
          // 将参数内容添加至数组 并 去除前后空格
          paramsList.push(Trim(i));
        }
      });
      return {
        desc: desc, // 接口描述
        url: url, // 接口地址
        type: type, // 接口类型
        request: paramsObj.request, // 接口请求参数
        response: paramsObj.response, // 接口相应参数
      };
    });

    return resArr;
  }

  function isType(doArr, realIndex, type) {
    return (
      doArr[realIndex] && doArr[realIndex].toLowerCase().indexOf(type) == 0
    );
  }

  function transAZ(name) {
    let res = name.match(/^[A-Za-z]+/) && name.match(/^[A-Za-z]+/)[0];
    return res || name;
  }

  function cutArr(doArr = []) {
    let typeArr = ["long", "int", "array", "string", "json", "list", "boolean"];
    let resArr = [];
    let itemArr = [];
    doArr.forEach((item, index) => {
      if (item == "示例") {
        doArr.splice(index);
      }
    });
    doArr.forEach((item, index) => {
      if (index % 4 == 0) {
        let realIndex = Number(index + 1);
        let flag = true;
        typeArr.forEach((i) => {
          if (isType(doArr, realIndex, i)) {
            flag = false;
          }
        });
        if (flag) {
          doArr[index] = transAZ(doArr[index]);
          doArr.splice(realIndex, 0, [], [], []);
        }
      }
    });
    doArr = doArr.map((item) => {
      return {
        v: item,
        s: item.toString() == "" ? {} : borderStyle,
      };
    });
    let doIndex = 0;
    doArr.forEach((item, index) => {
      let pre = Number(index - 1 + doIndex * 8);
      let cut = Number(index + doIndex * 8);
      let next = Number(index + 1 + doIndex * 8);
      if (
        doArr[pre] &&
        doArr[pre]["v"].toString() != "" &&
        doArr[cut] &&
        doArr[cut]["v"].toString() == "" &&
        doArr[next] &&
        doArr[next]["v"].toString() == ""
      ) {
        doIndex++;
        doArr.splice(pre, 0, [], [], [], []);
      }
    });
    doArr.forEach((item, index) => {
      typeof item.v == "string" ? (item.v = item.v.replace(/：|:/g, "")) : "";
      itemArr.push(item);
      if ((index - 3) % 4 === 0) {
        resArr.push(itemArr);
        itemArr = [];
      }
    });
    return resArr;
  }

  // 数据转化
  function interface2excel(arr) {
    let reslove = arr.map((item) => {
      return {
        desc: item.desc,
        url: item.url,
        type: item.type,
        request: cutArr(item.request),
        response: cutArr(item.response),
      };
    });
    return reslove;
  }

  // 修改title基础内容
  function getTitleArr(item) {
    let resArr = JSON.parse(JSON.stringify(baseContent.title));
    // 修改请求类型
    resArr[2][1]["v"] = item.type || "get";

    // 修改用途及说明
    resArr[3][1]["v"] = item.desc;
    resArr[4][1]["v"] = item.desc;

    return resArr;
  }

  // 生成xlsx数据
  function json2Sheet(dataList) {
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
    let bufferArray = dataList.map((item) => {
      return {
        name: item.operationId,
        data: item.arr,
      };
    });
    return xlsx.build(bufferArray, options);
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

  function isEmpty(response) {
    let flag = false;
    response.forEach((item) => {
      item.forEach((i) => {
        if (i.v == "无") {
          flag = true;
        }
      });
    });
    return flag;
  }

  // 转化响应参数
  function transResponse(response) {
    let arr = [
      ["result", "json", "可选", "返回值", ...getMockData("result")],
      [
        "resultMessage",
        "string",
        "可选",
        "返回状态描述",
        ...getMockData("resultMessage"),
      ],
      ["resultCode", "int", "可选", "返回状态码", ...getMockData("resultCode")],
    ];

    arr = arr.map((item) => {
      return item.map((i) => {
        if (typeof i === "object") {
          return i;
        } else {
          return {
            v: i,
            s: i === "" ? "" : borderStyle,
          };
        }
      });
    });
    if (response.toString() != "" && !isEmpty(response)) {
      arr = arr.concat([[], [{ v: "result", s: borderStyle }]], response);
    }
    return arr;
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
      let requestArr = item.request;
      data.push(...requestArr);
      // 数据拼接 响应头
      data.push(...baseContent.response);
      // 数据拼接 响应参数
      // let responseArr = item.response;
      let responseArr = transResponse(item.response);
      data.push(...responseArr);
      // 数据拼接 结尾
      data.push(...baseContent.end);
      // 设置realType(真实类型)
      // data = getRealData(data);

      let obj = {
        operationId: item.url,
        arr: data,
      };
      resList.push(obj);
    });

    return resList;
  }
  // 写入xlsx文件
  function writeXlsx(buffer) {
    fs.writeFileSync("./word.xlsx", buffer);
  }

  let interfaceArr = getRealArr(initArr());
  let excelData = mergeData(interface2excel(interfaceArr));
  let buffer = json2Sheet(excelData);
  writeXlsx(buffer);

  console.log(interfaceArr.length);
});
