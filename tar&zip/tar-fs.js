const tar = require("tar-fs");
const fs = require("fs");
const path = require("path");
const stat = fs.stat;

const version = "1.0.0";
const time = "20210905";

console.log("开始压缩，请稍等...");

const buildList = [
    // { name: "account" },
    // { name: "advertise" },
    { name: "approval" },       //mPaas
    // { name: "appStore" },
    // { name: "attendance" },     //mPaas
    // { name: "authority" },      //mPaas
    // { name: "bosspay" },
    // { name: "cockpit" },     //2021-02-22 未更新
    // { name: "company" },
    // { name: "cpyManage" },      //mPaas
    // { name: "criteria" },    //2021-02-22 未更新
    // { name: "flowMgr" },
    // { name: "helper" },
    // { name: "notice" },         //mPaas
    // { name: "tcm" },
    // { name: "user" },
    // { name: "wallet" },
    // { name: "frontconfig" },
    // { name: "wdss" },
    // { name: "loans" },
];
console.log(buildList.length);
const flag = buildList.some((res) => res.name === "frontconfig");
var copy = function (src, dst) {
    //读取目录
    fs.readdir(src, function (err, paths) {
        console.log(paths);
        if (err) {
            throw err;
        }
        paths.forEach(function (path) {
            var _src = src + "/" + path;
            var _dst = dst + "/" + path;
            var readable;
            var writable;
            stat(_src, function (err, st) {
                if (err) {
                    throw err;
                }

                if (st.isFile()) {
                    readable = fs.createReadStream(_src); //创建读取流
                    writable = fs.createWriteStream(_dst); //创建写入流
                    readable.pipe(writable);
                } else if (st.isDirectory()) {
                    exists(_src, _dst, copy);
                }
            });
        });
    });
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

//删除多余zip包
function removeZipFn(item) {
    return new Promise((res, rej) => {
        let pathZip = path.resolve(__dirname, `./${item.name}/dist`);
        let dirInfo = fs.readdirSync(pathZip);
        console.log("dirInfo", dirInfo);
        try {
            dirInfo.forEach((i, index) => {
                if (index == dirInfo.length - 1) {
                    throw new Error("complete");
                }
                console.log("删除 i: ", i);
                i.indexOf("000") != -1 &&
                    deleteFolder(path.resolve(__dirname, `./${item.name}/dist/${i}`));
            });
        } catch (error) {
            if (error.message == "complete") {
                res(true);
            } else {
                rej(false);
                console.log("error-----删除文件报错-----error", error);
            }
        }
    });
}
var exists = function (src, dst, callback) {
    //测试某个路径下文件是否存在
    fs.exists(dst, function (exists) {
        if (exists) {
            callback(src, dst);
        } else {
            fs.mkdir(dst, function () {
                callback(src, dst);
            });
        }
    });
};

if (!fs.existsSync("./frontconfig/dist")) {
    fs.mkdirSync("./frontconfig/dist");
}

if (!fs.existsSync("./frontconfig/dist/frontconfig")) {
    fs.mkdirSync("./frontconfig/dist/frontconfig");
}

let P = new Promise((res, rej) => {
    flag && exists("./frontconfig/config", "./frontconfig/dist/frontconfig/config", copy);
    flag && exists("./frontconfig/bankIcons", "./frontconfig/dist/frontconfig/bankIcons", copy);
    res(true);
});

P.then((res) => {
    buildList.forEach((item, index) => {
        //先删除dist文件内的多余zip文件
        removeZipFn(item).then((res) => {
            //再进行tar包压缩
            res &&
                tar
                    .pack(path.resolve(__dirname, `./${item.name}/dist`),{
                        entries:[`${item.name}`],
                        readable:true,
                        writable:true
                    })
                    .pipe(
                        fs.createWriteStream(
                            path.resolve(
                                __dirname,
                                `./tarList/bizmate-static-${item.name}-${version}+${time}.tar`,
                            ),
                        ),
                    );
        });
    });
    console.log("压缩完毕");
});
