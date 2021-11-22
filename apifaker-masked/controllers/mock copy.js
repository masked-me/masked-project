var Mock = require('mockjs');
let Random = Mock.Random;

module.exports = (keyAndTypeData,demoData) => new Promise((success, rej) => {
    //mock数据的几种基本类型
    let typeArr = {
        "int": "@integer(1000, 1000000000)",
        "long": "@integer(-2147483648, 2147483647)",
        "status": '@natural(1, 2)',
        "boolean": '@boolean',
        "string": '@ctitle'
    };
    let MockData = {}; //最终返回的对象
    let jsonArrayData = {}; //jsonArray
    let jsonData = {};//普通json
    let params = {}; //普通的外层参数
    let list = [];
    if (!!keyAndTypeData) {
        keyAndTypeData.map(res => {
            if (res.type == "jsonArray") {
                jsonArrayData = {};
                list = [];
                // 对于多维数组对象进行递归
                const jsoRecursion = (objItem) => {
                    // 判空处理
                    if (!!objItem) {
                        let totals = (!!demoData[res.name].length && typeof(demoData[res.name][0]) == 'string') ? demoData[res.name].length : Random.int(1, 20); //随机生成1-20条数据条数
                        for (let i = 0; i < totals; i++) {
                            objItem.map(item => {
                                if (item.type == "jsonArray") {
                                    jsoRecursion(item.obj)
                                } else {
                                    let itemData = Mock.mock({
                                        [item.name]: typeArr[item.type]
                                    })
                                    jsonArrayData = Object.assign({}, jsonArrayData, itemData);
                                }
                            })
                            // 把每个对象追加进数组中
                            list.push(jsonArrayData);
                        }
                    } else {
                        return []
                    }
                }
                jsoRecursion(res.obj)
                jsonArrayData = {
                    [res.name]:list
                };
                // 对象合并 
                MockData = Object.assign({}, MockData, jsonArrayData);
            } else {
                let resData = {};//外层参数合并对象
                let jsonDataItem ={};//json对象
                let arrayData = [];//简单数组
                if(res.type == "json"){
                    // 对json类型进行处理
                    res.obj.map(jsonRes=>{
                        jsonDataItem = Mock.mock({                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
                            [jsonRes.name]: typeArr[jsonRes.type]
                        })
                        jsonData = Object.assign({}, jsonData, jsonDataItem);
                    })
                    jsonData = {
                        [res.name]:jsonData
                    };
                }else if(res.type == "list"){
                    let arrayTotals = !!demoData[res.name].length ? demoData[res.name].length : Random.int(1, 20); //随机生成1-50条数据条数
                    for(let i = 0;i<arrayTotals;i++){
                        let arrayString = Mock.mock("@string()");
                        arrayData.push(arrayString);
                    }
                    //对简单数组进行处理 
                    arrayData = {[res.name]:arrayData}
                }else{
                    // 对外层参数进行处理
                    resData = Mock.mock({
                        [res.name]: typeArr[res.type]
                    })
                    params = Object.assign({}, params, resData);
                }
                // 对象合并 
                MockData = Object.assign({}, MockData, jsonData);
                MockData = Object.assign({}, MockData, arrayData);
                MockData = Object.assign({}, MockData, params);
            }

        })
        // console.log("MockData=====", MockData);
        success(MockData);
    } else {
        rej("解析失败");
    }
});