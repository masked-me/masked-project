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
                let onlyOne = '';
                // 对于多维数组对象进行递归
                const jsoRecursion = (objItem, objName, dome, box, prebox, type) => {
                    let curDome = dome[objName]
                    // 判空处理
                    if (!!objItem) {
                        onlyOne = Array.isArray(curDome) 
                        ? 
                            Array.isArray(curDome.slice(-1)) 
                        ? 
                            curDome.slice(-1)[0] 
                        :
                            {}
                        :
                            {}
                        let totals = typeof(onlyOne) != 'object'? onlyOne : Random.int(1, 20); //随机生成1-20条数据条数
                        objItem.map((item,index,arr) => {
                            if (item.type == "jsonArray" || item.type == "json") {
                                box[item.name] = {}
                                let toSonCurDome = Array.isArray(curDome) ? curDome[0] : curDome
                                jsoRecursion(item.obj, item.name, toSonCurDome, box[item.name], box, item.type)
                            } else if (item.type == "list"){
                                let listCurDome = Array.isArray(curDome)  ? curDome[0] : curDome
                                let str = listCurDome[item.name][0] || '';
                                let arrayData = []
                                if(str.indexOf(',') != -1){
                                    let arr = str.split(',')
                                    for(let i in arr){
                                        arrayData.push(arr[i])
                                    }
                                }else{
                                    let arrayTotals = !!listCurDome[item.name].length ? str : Random.int(1, 20); //随机生成1-50条数据条数
                                    for(let i = 0;i<arrayTotals;i++){
                                        let arrayString = Mock.mock("@ctitle");
                                        arrayData.push(arrayString);
                                    }
                                }
                                box[item.name] = arrayData
                            } else {
                                let otherCurDome = Array.isArray(curDome)  ? curDome[0] : curDome
                                box[item.name] = !!otherCurDome[item.name] ? otherCurDome[item.name] : Mock.mock(typeArr[item.type])
                            }
                            if(arr.length-1 == index){
                                let arr = []
                                arr.length = totals
                                arr.fill(box)
                                type == 'jsonArray' ? prebox[objName] = arr : prebox[objName] = box
                                
                            }
                        })
                    } else {
                        return []
                    }
                }
                jsoRecursion(res.obj, res.name, demoData, {}, jsonArrayData, res.type)
                // 对象合并 
                MockData = Object.assign({}, MockData, jsonArrayData);
            } else {
                let resData = {};//外层参数合并对象
                let arrayData = [];//简单数组
                if(res.type == "json"){
                    // 对json类型进行处理
                    // 对于多维数组对象进行递归
                    const jsonReslove = (objItem, objName, dome, box, prebox, type) => {
                        let curDome = dome[objName]
                        // 判空处理
                        if (!!objItem) {
                            onlyOne = Array.isArray(curDome) 
                            ? 
                                Array.isArray(curDome.slice(-1)) 
                            ? 
                                curDome.slice(-1)[0] 
                            :
                                {}
                            :
                                {}
                            let totals = typeof(onlyOne) != 'object'? onlyOne : Random.int(1, 20); //随机生成1-20条数据条数
                            objItem.map((item,index,arr) => {
                                if (item.type == "json" || item.type == "jsonArray") {
                                    box[item.name] = {}
                                    let toSonCurDome =  Array.isArray(curDome) ? curDome[0] : curDome
                                    jsonReslove(item.obj, item.name, toSonCurDome, box[item.name], box, item.type)
                                }  else if (item.type == "list"){
                                    let str = (Array.isArray(curDome) ? curDome[0][item.name][0] : curDome[item.name][0] )|| ''
                                    let arrayData = []
                                    if(str.indexOf(',') != -1){
                                        let arr = str.split(',')
                                        for(let i in arr){
                                            arrayData.push(arr[i])
                                        }
                                    }else{
                                        let orCurDome = Array.isArray(curDome) ? curDome[0] : curDome
                                        let arrayTotals = !!orCurDome[item.name][0] ? str : Random.int(1, 20); //随机生成1-50条数据条数
                                        for(let i = 0;i<arrayTotals;i++){
                                            let arrayString = Mock.mock("@ctitle");
                                            arrayData.push(arrayString);
                                        }
                                    }
                                    box[item.name] = arrayData
                                } else {
                                    let strCurDome = Array.isArray(curDome) ? curDome[0] : curDome
                                    box[item.name] = !!strCurDome[item.name] ? strCurDome[item.name] : Mock.mock(typeArr[item.type])
                                }

                                if(arr.length-1 == index){
                                    let arr = []
                                    arr.length = totals
                                    arr.fill(box)
                                    type == 'jsonArray' ? prebox[objName] = arr : prebox[objName] = box
                                }
                            })
                        } else {
                            return []
                        }
                    }
                    jsonReslove(res.obj, res.name, demoData, {}, jsonData)
                }else if(res.type == "list"){
                    let str = demoData[res.name][0] || ''
                    if(str.indexOf(',') != -1){
                        let arr = str.split(',')
                        for(let i in arr){
                            arrayData.push(arr[i])
                        }
                    }else{
                        let arrayTotals = !!demoData[res.name][0] ? str : Random.int(1, 20); //随机生成1-50条数据条数
                        for(let i = 0;i<arrayTotals;i++){
                            let arrayString = Mock.mock("@ctitle");
                            arrayData.push(arrayString);
                        }
                    }

                    //对简单数组进行处理 
                    arrayData = {[res.name]:arrayData}
                }else{
                    // 对外层参数进行处理
                    resData = !!demoData[res.name] 
                    ?
                        {
                            [res.name]: demoData[res.name]
                        }
                    :
                        Mock.mock({
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
        success(MockData);
    } else {
        rej("解析失败");
    }
});