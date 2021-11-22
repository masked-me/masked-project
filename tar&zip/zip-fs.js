const compressing = require("compressing");
//创建文件夹
const path = require("path");
const fs = require("fs");

//打包者信息
//目前生产 0.0.1.1
const version = "0.0.1.3"; //最新sit 0.0.1.3
// const AppId = "61C5638181017";//dev          目前废弃
// const AppId = "2F31D13301533";//sit          目前废弃
// const AppId = "C03D471291642"; //uat         目前废弃
// const AppId = "20CB552291511"; //sim         目前废弃

// const AppId = "1B9EA75021016"; //pro 二维码
// const AppId = "076222F020933"; //pro 应用商店

// const AppId = "A929B02131551"; //pro 容灾演练

// mPaas迁移-新环境
// const AppId = "4F84643101036"; //new-dev
const AppId = "C455C34101036"; //new-sit
// const AppId = "20CB552101036"; //new-uat
// const AppId = "4814C5B101037"; //new-准生产

// 是否上 商云
const isSHANGYUN = true;

const buildInfo = {
  name: "masked",
  time: formatDateTime(),
  env: getEnvTypt(),
  version: version,
  remark: "离线资源包",
};

const AppIdPath = `./zipList/${AppId}`;
//离线资源包列表
const zipList = [
  // {
  //     name: "approval",
  //     realList: [
  //         "00000022",
  //         "00000023",
  //         "00000024",
  //         "00000058",
  //         "00000121",
  //         "00000119",
  //         "00000184",
  //         "00000037",
  //         "00000041",
  //         "00000033",
  //         "00000120",
  //         "00000034",
  //         "00000268",
  //         "00000032",
  //     ],
  // },
  // {
  //     name: "attendance",
  //     realList: ["00000019", "00000265"],
  // },
  // {
  //     name: `authority`,
  //     realList: [`00000049`],
  // },
  // {
  //     name: `cpyManage`,
  //     realList: [`00000029`],
  // },
  // {
  //     name: `notice`,
  //     realList: [`00000006`],
  // },
  {
    name: `loans`,
    realList: [`00000340`],
  },
];
const offlineInfo = {
  "00000058": `"00000058出差","00000058","${version}","1","0.0.1-","0.0.1-","${
    isSHANGYUN ? "/bizmate/static/approval" : ""
  }/approval/apply.html","",1,1`,
  "00000121": `"00000121打卡异常","00000121","${version}","1","0.0.1-","0.0.1-","${
    isSHANGYUN ? "/bizmate/static/approval" : ""
  }/approval/apply.html","",1,1`,
  "00000119": `"00000119销假","00000119","${version}","1","0.0.1-","0.0.1-","${
    isSHANGYUN ? "/bizmate/static/approval" : ""
  }/approval/apply.html","",1,1`,
  "00000184": `"00000184用章","00000184","${version}","1","0.0.1-","0.0.1-","${
    isSHANGYUN ? "/bizmate/static/approval" : ""
  }/approval/apply.html","",1,1`,
  "00000037": `"00000037请假","00000037","${version}","1","0.0.1-","0.0.1-","${
    isSHANGYUN ? "/bizmate/static/approval" : ""
  }/approval/apply.html","",1,1`,
  "00000041": `"00000041通用","00000041","${version}","1","0.0.1-","0.0.1-","${
    isSHANGYUN ? "/bizmate/static/approval" : ""
  }/approval/apply.html","",1,1`,
  "00000033": `"00000033差旅报销","00000033","${version}","1","0.0.1-","0.0.1-","${
    isSHANGYUN ? "/bizmate/static/approval" : ""
  }/approval/apply.html","",1,1`,
  "00000120": `"00000120外出","00000120","${version}","1","0.0.1-","0.0.1-","${
    isSHANGYUN ? "/bizmate/static/approval" : ""
  }/approval/apply.html","",1,1`,
  "00000034": `"00000034费用报销","00000034","${version}","1","0.0.1-","0.0.1-","${
    isSHANGYUN ? "/bizmate/static/approval" : ""
  }/approval/apply.html","",1,1`,
  "00000268": `"00000268合同审批","00000268","${version}","1","0.0.1-","0.0.1-","${
    isSHANGYUN ? "/bizmate/static/approval" : ""
  }/approval/apply.html","",1,1`,
  "00000032": `"00000032采购","00000032","${version}","1","0.0.1-","0.0.1-","${
    isSHANGYUN ? "/bizmate/static/approval" : ""
  }/approval/apply.html","",1,1`,
  "00000022": `"00000022我的申请","00000022","${version}","1","0.0.1-","0.0.1-","${
    isSHANGYUN ? "/bizmate/static/approval" : ""
  }/approval/mflowList.html","",1,1`,
  "00000023": `"00000023我的审批","00000023","${version}","1","0.0.1-","0.0.1-","${
    isSHANGYUN ? "/bizmate/static/approval" : ""
  }/approval/mflowList.html","",1,1`,
  "00000024": `"00000024知会我","00000024","${version}","1","0.0.1-","0.0.1-","${
    isSHANGYUN ? "/bizmate/static/approval" : ""
  }/approval/mflowList.html","",1,1`,
  "00000029": `"00000029企业设置","00000029","${version}","1","0.0.1-","0.0.1-","${
    isSHANGYUN ? "/bizmate/static/cpymanage" : ""
  }/pages/cpymgr.html","",1,1`,
  "00000049": `"00000049权限设置","00000049","${version}","1","0.0.1-","0.0.1-","${
    isSHANGYUN ? "/bizmate/static/authority" : ""
  }/pages/appauthmgr.html","",1,1`,
  "00000019": `"00000019考勤打卡","00000019","${version}","1","0.0.1-","0.0.1-","${
    isSHANGYUN ? "/bizmate/static/attendance" : ""
  }/pages/index.html","",1,1`,
  "00000006": `"00000006企业公告","00000006","${version}","1","0.0.1-","0.0.1-","${
    isSHANGYUN ? "/bizmate/static/notice" : ""
  }/pages/index.html","",1,1`,
  "00000265": `"00000265考勤统计","00000265","${version}","1","0.0.1-","0.0.1-","${
    isSHANGYUN ? "/bizmate/static/attendance" : ""
  }/pages/attendance.html","",1,1`,
  "00000340": `"00000340快乐秒贷","00000340","${version}","1","0.0.1-","0.0.1-","${
    isSHANGYUN ? "/bizmate/static/loans" : ""
  }/pages/loans.html","",1,1`,
};
//删除方法
function deleteFolder(path) {
  let files = [];
  if (fs.existsSync(path)) {
    files = fs.readdirSync(path);
    files.forEach(function (file, index) {
      let curPath = path + "/" + file;
      if (fs.statSync(curPath).isDirectory()) {
        deleteFolder(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
}
//递归创建目录 同步方法
function mkdirsSync(dirname) {
  if (fs.existsSync(dirname)) {
    return true;
  } else {
    if (mkdirsSync(path.dirname(dirname))) {
      fs.mkdirSync(dirname);
      return true;
    }
  }
}

function _copy(src, dist) {
  var paths = fs.readdirSync(src);
  paths.forEach(function (p) {
    var _src = src + "/" + p;
    var _dist = dist + "/" + p;
    var stat = fs.statSync(_src);
    if (stat.isFile()) {
      // 判断是文件还是目录
      fs.writeFileSync(_dist, fs.readFileSync(_src));
    } else if (stat.isDirectory()) {
      //锁定/static目录，并写入打包信息
      src.indexOf("/static") > -1 &&
        p === "js" &&
        fs.writeFileSync(
          _dist.replace("js", "") + `version.json`,
          JSON.stringify(buildInfo)
        );
      copyDir(_src, _dist); // 当是目录是，递归复制
    }
  });
}

/*
 * 复制目录、子目录，及其中的文件
 * @param src {String} 要复制的目录
 * @param dist {String} 复制到目标目录
 */
function copyDir(src, dist) {
  var b = fs.existsSync(dist);
  if (!b) {
    mkdirsSync(dist); //创建目录
  }
  _copy(src, dist);
}

function createDocs(src, dist, callback) {
  copyDir(src, dist);
  if (callback) {
    callback();
  }
}
function formatDateTime() {
  let date = new Date();
  var y = date.getFullYear();
  var m = date.getMonth();
  m = timeFormat(m + 1);
  var d = date.getDate();
  d = timeFormat(d);
  var h = date.getHours();
  h = timeFormat(h);
  var minute = date.getMinutes();
  minute = timeFormat(minute);
  var second = date.getSeconds();
  second = timeFormat(second);
  return y + "-" + m + "-" + d + " " + h + ":" + minute + ":" + second;
}

function timeFormat(time) {
  return time < 10 ? "0" + time : time;
}
function getEnvTypt() {
  let type = "";
  switch (AppId) {
    case "61C5638181017" || "4F84643101036":
      type = "DEV";
      break;
    case "2F31D13301533" || "C455C34101036":
      type = "SIT";
      break;
    case "C03D471291642" || "20CB552101036":
      type = "UAT";
      break;
    case "20CB552291511" || "4814C5B101037":
      type = "SIM";
      break;
    case "1B9EA75021016" || "076222F020933":
      type = "PRO";
      break;
    default:
      type = "DEV";
      break;
  }
  return type;
}
const num = zipList.reduce((current, preValue) => {
  return current + preValue.realList.length;
}, 0);

function buildZip() {
  //判断文件是否存在
  deleteFolder(AppIdPath);
  fs.mkdirSync(AppIdPath);
  return new Promise((res, rej) => {
    let newNum = 0;
    zipList.forEach((item) => {
      //1.同步创建文件夹
      let name = item.name;
      let realList = item.realList;
      realList.forEach((i, index) => {
        console.log("i", i);
        let distPath = `./${name}/dist/${name}`;
        let realIdPath = `./${name}/dist/${i}`;
        let zipRealIdPath = `./${name}/dist/${i}/bizmate/static/${name}`;
        let toPath = `${AppIdPath}/${i}`;
        // return
        //删除已有文件夹
        deleteFolder(realIdPath);
        //创建zip文件夹
        fs.mkdirSync(realIdPath);

        if (isSHANGYUN) {
          //创建zip文件夹
          fs.mkdirSync(realIdPath + `/bizmate`);
          //创建zip文件夹
          fs.mkdirSync(realIdPath + `/bizmate/static`);
          //创建zip文件夹
          fs.mkdirSync(realIdPath + `/bizmate/static/${name.toLowerCase()}`);
        }

        //拷贝文件至指定位置
        createDocs(
          distPath,
          isSHANGYUN ? zipRealIdPath : realIdPath,
          function () {
            //zip压缩
            compressing.zip
              .compressDir(realIdPath, `${toPath}.zip`)
              .then(() => {
                newNum++;
                newNum === num && res(true);
              })
              .catch((err) => {
                console.error(err);
              });
          }
        );
      });
    });
  });
}

function creatCsvFile() {
  return new Promise((res, rej) => {
    let csvContent =
      `名称,h5Id,版本号,资源包类型(全局资源包：0，普通资源包：1),Android版本范围,IOS版本范围,主入口 URL,扩展信息,下载时机(0:仅WIFI，1:所有网络都下载),安装时机(0:不预加载，1:预加载)` +
      "\r";
    zipList.forEach((item) => {
      let realList = item.realList;
      realList.forEach((i) => {
        csvContent += offlineInfo[i] + "\r";
      });
    });
    fs.writeFileSync(`${AppIdPath}/updata.csv`, csvContent);
    res(true);
  });
}
console.log("所有(zip压缩)开始");

buildZip().then((res) => {
  console.log("所有(zip压缩)完成");
  creatCsvFile().then((R) => {
    console.log("创建(csv文件)完成");
    //zip压缩
    compressing.zip
      .compressDir(AppIdPath, `${AppIdPath}.zip`)
      .then(() => {
        console.log("生成(批量导入H5离线包)完成");
      })
      .catch((err) => {
        console.error(err);
      });
  });
});

// mPaas批量导入离线资源包脚本
// document.querySelectorAll('.g-tool-wrap').forEach((item,index)=>{
//     if(index == 20) return;
//     if(index%2 != 0 ){
//         item.querySelectorAll('button')[1].click()
//     }else{
//         item.querySelector('div').querySelector('a').click()
//     }
// })
