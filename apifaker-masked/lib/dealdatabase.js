
var async = require('async'),
db = require('../lib/database');

// 根据接口id删除模拟数据
function removeSimulators(apiId){
    return new Promise((resolve, reject) => {
        db.simulators.remove({ apiId: apiId }, { multi: true }, function (err, docs) {
            resolve({err, docs})
        })
    });
}
// 根据接口id删除接口
function removeApi(apiId){
    return new Promise((resolve, reject) => {
        db.apiList.remove({_id: apiId, deleted:false}, { multi: true }, function (err, docs) {
            resolve({err, docs})
        })
    });
}
// 根据名称查找接口
function findApi(name){
    return new Promise((resolve, reject) => {
        db.apiList.find({name: name, deleted:false}, function (err, docs) {
            resolve({err, docs})
        })
    });
}
// 保存接口
function saveApi(apiList){
    return new Promise((resolve, reject) => {
        db.apiList.insert(apiList, function(err, docs){
            resolve({err, docs})
        })
    });
}
// 保存模拟数据
function saveSimulators(simulators){
    return new Promise((resolve, reject) => {
        db.simulators.insert(simulators, function(err, docs){
            resolve({err, docs})
        })
    });
}

module.exports = {removeSimulators,removeApi,findApi,saveApi,saveSimulators}