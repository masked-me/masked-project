/*!
 * ApiFaker is a simulator that help developers to improve efficiency in development,
 * especially for front-end engineers.
 * Lets define api and run it yourself.
 *
 * @license
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy
 * of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 *
 * Copyright (c) 2014 ApiFaker, http://apifaker.com/
 *
 * @author  hylin, <admin@hylin.org>
 * @version 0.0.2
 * @date    2014-05-12
 */

const mockDataPromise = require('./mock');

/**
 * Module dependencies.
 */
 var router = require('express').Router(),
 models = require('../lib/models'),
 async = require('async'),
 db = require('../lib/database'),
 dealDatabase = require('../lib/dealdatabase');
/**
* Manage api base info
*/

/**
* Home page, will show api list.Also,it handle search action.
*/
router.get('/', function (req, res) {
 var query = {},
   project = req.query.project || '',
   keyword = req.query.keyword || '';
 if (project) {
   query.project = project;
 }
 if (keyword) {
   query.name = { $regex: new RegExp(keyword, 'ig') };
 }
 query.deleted = false;
 db.apiList.find(query).sort({ updateTime: -1 }).exec(function (err, docs) {
   res.render('api-list', { list: docs || [], project: project, keyword: keyword });
 });
});

/**
* Add api page
*/
router.route('/apis/add')
 .get(function (req, res) {
   //fill with empty ApiInfo object
   res.render('api', { apiInfo: models.apiInfoModel });
 })
 .post(function (req, res) {
   //all data is in data field
   var data = req.body.data;
   //validate data
   try {
     data = JSON.parse(data);
   } catch (e) {
     console.log(e);
     res.json({ retcode: -1, retmsg: req.t('tips.jsonFormatErr') });
     return;
   }
   data.createTime = new Date();
   data.updateTime = new Date();
   data.deleted = false;
   db.apiList.insert(data, function (err, doc) {
     if (err) {
       console.log(err);
       res.json({ retcode: -1, retmsg: req.t('tips.saveFailed') });
       return;
     }
     res.json({ retcode: 0, retmsg: req.t('tips.saveSuccess') });
   });
 });

/**
* import api page
*/
router.route('/apis/import')
 .get(function (req, res) {
   //fill with empty ApiInfo object
   res.render('import', { apiInfo: models.importInfoModel });
 })
 .post(function (req, res) {
   //all data is in data field
   var data = req.body.data;
   var isCover = req.body.isCover;
   var SheetNames = req.body.SheetNames;
   //validate data
   try {
     data = JSON.parse(data);
   } catch (e) {
     console.log(e);
     res.json({ retcode: -1, retmsg: req.t('tips.jsonFormatErr') });
     return;
   }
   if (isCover == 'cover') {
     coverApi(data, req, res)
   } else if (isCover == 'add') {
    //  console.log(JSON.stringify(data))
     addSimulators(data, req, res)
   }
 })

/**
* Edit api page
*/
router.route('/apis/edit/:id')
 .get(function (req, res) {
   var id = req.params.id;
   db.apiList.findOne({ _id: id, deleted: false }, function (err, doc) {
     if (err) {
       console.log(err);
       res.json({ retcode: -1, retmsg: req.t('tips.dbError') });
       return;
     }
     if (!doc) {
       res.render('message', { message: req.t('tips.noData') })
     }
     res.render('api', { apiInfo: doc });
   });
 })
 .post(function (req, res) {
   var data = req.body.data;
   try {
     data = JSON.parse(data);
   } catch (e) {
     console.log(e);
     res.json({ retcode: -1, retmsg: req.t('tips.jsonFormatErr') });
     return;
   }
   async.auto({
     getOld: function (callback) {
       db.apiList.findOne({ _id: data._id }, function (err, doc) {
         if (err) {
           callback(err, null);
           return;
         }
         callback(null, doc);
       });
     },
     backup: ["getOld", function (callback, results) {
       var old = results.getOld;
       old.apiId = old._id;
       delete old._id;
       db.apiHistory.insert(old, callback);
     }],
     update: ["backup", function (callback, results) {
       //We lost createTime?Yes,I don't care it now.:)
       data.updateTime = new Date();
       data.deleted = false;
       db.apiList.update({ _id: data._id }, data, {}, callback);
     }]
   }, function (err, results) {
     if (err) {
       console.log(err);
       res.json({ retcode: -1, retmsg: req.t('tips.saveFailed') });
       return;
     }
     res.json({ retcode: 0, retmsg: req.t('tips.updateSuccess') });
   });

 });

/**
* View api page
*/
router.route('/apis/view/:id')
 .get(function (req, res) {
   var id = req.params.id;
   db.apiList.findOne({ _id: id, deleted: false },async function (err, doc) {
    console.log('doc.results',doc.results);
    console.log('doc.demo',doc.demo);
    await mockDataPromise(doc.results,doc.demo).then(proResults=>{
      // console.log("proResults=====",proResults);
      doc.demo=proResults;
    })
     if (err) {
       console.log(err);
       res.json({ retcode: -1, retmsg: req.t('tips.dbError') });
       return;
     }
     res.render('view', { apiInfo: doc });
   });
 });

/**
* Delete api by id
*/
router.route('/apis/delete/:id')
 .get(function (req, res) {
   var id = req.params.id;
   //We do not physically delete api data,but mark it as deleted=true
   db.apiList.update({ _id: id }, { $set: { "deleted": true } }, {}, function (err, doc) {
     if (err) {
       console.log(err);
       res.json({ retcode: -1, retmsg: req.t('tips.dbError') });
       return;
     }
     res.json({ retcode: 0, retmsg: req.t('tips.deleteSuccess') });
   });
 });

module.exports = router;

async function coverApi(apiArr, req, res) {
  console.log('apiArr',apiArr)
 for (let i = 0; i < apiArr.length; i++) {
   var exitApi = isError(await dealDatabase.findApi(apiArr[i].apiHead.name), req, res)
   if (exitApi.length > 0) {
     isError(await dealDatabase.removeSimulators(exitApi[0]._id), req, res)
     isError(await dealDatabase.removeApi(exitApi[0]._id), req, res)
   }
   var newApi = isError(await dealDatabase.saveApi({ ...apiArr[i].apiHead, params: apiArr[i].params, results: apiArr[i].results, demo: apiArr[i].demo, createTime: new Date(), updateTime: new Date(), deleted: false }), req, res)
   var simulators = []
   apiArr[i].simulatorsArr.forEach(item1 => {
     // item1.simResults = JSON.stringify(item1.simResults)
     simulators.push({ apiId: newApi._id, ...item1, createTime: new Date(), updateTime: new Date() })
   })
   var newSimulators = isError(await dealDatabase.saveSimulators(simulators), req, res)
 }
 res.json({ retcode: 0, retmsg: req.t('tips.saveSuccess') });
}

async function addSimulators(apiArr, req, res) {
  console.log('apiArr',apiArr)
  // console.log('apiArr',req)
  // console.log('apiArr',res)
 for (let i = 0; i < apiArr.length; i++) {
   var exitApi = isError(await dealDatabase.findApi(apiArr[i].apiHead.name), req, res)
   var newApi = {}
   if (exitApi.length > 0) {
     var newApi = exitApi[0]
     // await removeSimulators(exitApi[0]._id)
     // await removeApi(exitApi[0]._id)
   } else {
     var newApi = isError(await dealDatabase.saveApi({ ...apiArr[i].apiHead, params: apiArr[i].params, results: apiArr[i].results, demo: apiArr[i].demo, createTime: new Date(), updateTime: new Date(), deleted: false }), req, res)
   }
   var simulators = []
   apiArr[i].simulatorsArr.forEach(item1 => {
     // item1.simResults = JSON.stringify(item1.simResults)
     simulators.push({ apiId: newApi._id, ...item1, createTime: new Date(), updateTime: new Date() })
   })
   var newSimulators = isError(await dealDatabase.saveSimulators(simulators), req, res)
 }
 res.json({ retcode: 0, retmsg: req.t('tips.saveSuccess') });
}

function isError(data, req, res) {
 if (data.err) {
   res.json({ retcode: -1, retmsg: req.t('tips.saveFailed') });
   res.end()
   return;
 } else {
   return data.docs
 }
}

/**
* 随机生成指定类型的数据
*/
function getInfoBack(type, value) {
 switch (type) {
   case 'int':
     return GetRandomNum(0, 100)
     break;
   case 'long':
     return GetRandomNum(100000, 1000000)
     break;
   case 'string':
     return randomString(GetRandomNum(0, 200))
     break;
   case 'list':
     return randArray(GetRandomNum(0, 20), 0, 1000)
     break;
   case 'json':
     return {}
     break;
   case 'jsonArray':
     return []
     break;
   default:
     break;
 }
}

/**
* 生成随机数
*/
function randomString(e) {
 e = e || 32;
 var t = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678",
   a = t.length,
   n = "";
 for (i = 0; i < e; i++) n += t.charAt(Math.floor(Math.random() * a));
 return n
}

// 本例子代表生成100000-999999的随机数
function GetRandomNum(Min, Max) {
 var Range = Max - Min;
 var Rand = Math.random();
 return (Min + Math.round(Rand * Range));
}

// 生成随机数组
function randArray(len, min, max) {
 return Array.from({ length: len }, v => Math.floor(Math.random() * (max - min)) + min)
}
// 生成随机json
function randomJson(len,value){
  let jsonData = value.obj||[];
  let results = {};
  if(!!jsonData){
     jsonData.map(res=>{
      results = {[res.name]:getInfoBack(res.type)}
      results = Object({},results,results)
    })
  }
  return results;
}
