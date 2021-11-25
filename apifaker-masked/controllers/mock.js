/*
 * @Author: pengyu.xu
 * @Date: 2021-11-21 10:13:41
 * @LastEditors: pengyu.xu
 * @LastEditTime: 2021-11-23 16:59:36
 * @Description:
 * @FilePath: \controllers\mock.js
 */

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
    if (!!keyAndTypeData) {
        // 对于多维数组对象进行递归
        const jsonMockHandle = (jsonObject, dome, box, prebox) => {
            // 获取当前对象需要操作的值
            let { obj, name, type } = jsonObject;
            // curDome 兼容处理
            let curDome = name == '' ? dome : dome[name]
            // 判空处理
            if (!!obj) {
                // 获取jsonArray 数组的长度
                let totals = getTotals(curDome);
                // 获取当前模块真实dome
                curDome = Array.isArray(curDome) ? curDome[0] : curDome
                // 遍历处理数据
                obj.map((item,index,arr) => {
                    // 分支判断
                    if (item.type == "jsonArray" || item.type == "json") {
                        // jsonArray、json类型数据处理 赋初始值 {} 并递归调用
                        jsonMockHandle(item, curDome, box[item.name] = {}, box)
                    } else if (item.type == "list"){
                        // list类型数据处理
                        listMockHandle(curDome, item, box)
                    } else {
                        // 非jsonArray、json、list类型数据处理
                        otherMockHandle(curDome, item, box)
                    }
                    // 当前数组循环处理完时 处理数据拼装
                    if(arr.length-1 == index){
                        mergeDateHandle(totals, box, prebox, type)
                    }
                })
            }

            function listMockHandle(curDome, item, box){
                let str = curDome[item.name][0] || '';
                let arrayData = []
                // 数组判断是否指定值
                if(str.indexOf(',') != -1){
                    let arr = str.split(',')
                    for(let i in arr){
                        arrayData.push(arr[i])
                    }
                }else{
                    let arrayTotals = !!curDome[item.name].length ? str : Random.int(1, 20); //随机生成1-50条数据条数
                    for(let i = 0;i<arrayTotals;i++){
                        let arrayString = Mock.mock("@ctitle");
                        arrayData.push(arrayString);
                    }
                }
                box[item.name] = arrayData
            }

            function otherMockHandle(curDome, item, box){
                if(!!curDome[item.name] && curDome[item.name].toString().indexOf('@') == 0) {
                    box[item.name] =  Mock.mock(curDome[item.name])
                } else {
                    box[item.name] = !!curDome[item.name] ? curDome[item.name] : Mock.mock(typeArr[item.type])
                }
            }

            function mergeDateHandle(totals, box, prebox, type){
                let jsonObjArray = []
                jsonObjArray.length = totals
                jsonObjArray.fill(box)
                // 当为jsonArray时,用当前对象填充数组
                type == 'jsonArray' ? prebox[name] = jsonObjArray : prebox[name] = box
            }
            
            function getTotals(curDome){
                let jsonArrayLength = Array.isArray(curDome) ? Array.isArray(curDome.slice(-1)) ? curDome.slice(-1)[0] : {}: {};
                let totals = typeof(jsonArrayLength) != 'object'? jsonArrayLength : Random.int(1, 10); //随机生成1-20条数据条数
                return totals;
            }
        }
        // 声明符合jsoRecursion第一个入参规格的对象
        let processed = {
            obj: keyAndTypeData,
            name: '',
            type: 'json'
        }
        // 调用数据递归处理
        jsonMockHandle(processed, demoData, {}, jsonArrayData)
        // 对象合并 
        MockData = Object.assign({}, MockData, Object.values(jsonArrayData)[0]);
        // 返回数据
        success(MockData);
    } else {
        rej("解析失败");
    }
});