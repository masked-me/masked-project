
//修改图片
//修改图片
let fs = require('fs');
let path = require('path');
let async = require('async');

//值是多少自己算。
let base = 0xFF;
let next = 0xD8;
let gifA = 0x47;
let gifB = 0x49;
let pngA = 0x89;
let pngB = 0x50;

let scanDir = 'C:/Users/xupengyu/Documents/WeChat Files/wxid_8104691047012/FileStorage/Image/2021-11/';
let imgDir = 'C:/Users/xupengyu/Documents/WeChat Files/wxid_8104691047012/FileStorage/Image/2021-11/';

let files = fs.readdirSync(scanDir);
var arr = [];
files.forEach(function(item){
    if(path.extname(item) == '.dat'){
        arr.push(item);
    }
})
async.mapLimit(arr,50,function(item,cb){
    convert(item,cb);
},function(){
    process.exit(0);
})
//convert
function convert(item,cb){
    let absPath =path.join(scanDir,item);
    let imgPath = path.join(imgDir,item+'.jpg');
    fs.readFile(absPath,(err,content)=>{
        if(err){
            console.log(err);
            cb(err);
        }
        let firstV = content[0],
            nextV = content[1],
            jT = firstV ^ base,
            jB = nextV ^ next,
            gT = firstV ^ gifA,
            gB = nextV ^ gifB,
            pT = firstV ^ pngA,
            pB = nextV ^ pngB;
        var v = firstV ^ base;
        if(jT == jB){
            v = jT;
        }else if(gT == gB){
            v = gT;
        }else if(pT == pB){
            v = pT;
        }

        let bb = content.map(br=>{
            return br ^ v
        })
        fs.writeFileSync(imgPath,bb)
        cb(null);
    })
}