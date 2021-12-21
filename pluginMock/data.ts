
/*
 * @Author: caohui
 * @Date: 2020-12-08 16:44:41
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-01-15 09:29:29
 * @Description: 
 * @FilePath: \bosspay\src\service\Api.ts
 */


const { NetApi } = require('@/lib/netAdapter');
import { getHostUrl } from '@/utils/commonUtil';
import { SnToast } from "sinosun-ui";
import { log } from "../utils/logUtil.js";
import { PAYPASSWORD_API_URL } from "./ApiUrl";
import WebJSBridgeImpl from "bankConfig/getAccessToken/BankJSBridgeImpl";
import mineApi from "bankConfig/getAccessToken/mineApi";
const webJSBridgeImpl = new WebJSBridgeImpl();

//ScpMock 挡板数据接口
import { ScpMockUrl } from './ScpMock'
import { GetScpMockFunction } from "../utils/jsBridgeUtils.js";
import axios from 'axios'
import qs from 'qs'

const SCPMOCKURL = ScpMockUrl;
const urlApi = 'http://10.2.30.231/'
const version = 'v1'
const scpmock = 'scpmock'
const axiosMock = true
const typeMenu = {
    Get:'get',
    Post:'post'
}

// mock 数据 发布生产可以注释掉
import { localDev } from "./netConfig";
const nodeEnv = process.env['NODE_ENV'];
let getMockData = (url: any, params: any) => {
    console.log(params);
    return {
        request: url
    }
};
// 开发环境需要mock数据
// if (nodeEnv === `development`) {
console.log(`nodeEnv======`, nodeEnv);
getMockData = require("mock")
// }

// 后端未开发接口需要用mock
const NEEDMOCKDATAAPILIST: any[] = [];
// 用来区分mock中 需要后端请求数据 （一部分走mock 一部分走真实）
const NEEDAXIOSAPILIST: any[] = [];
// 不延时获取mock数据接口
const NODELAYAPIURLLIST: any[] = [];
const DEALYTIME = 1;
// 不显示toast接口
const NOTSHOWERRORTOASTList: any[] = [PAYPASSWORD_API_URL.CHECK_PAYMENT_PWD,'/ebank/accountmgmt/v1/queryAccountInfo'];

class Api extends NetApi {
    constructor() {
        super()
    }

    async getToken(url: string) {
        
        const token = await webJSBridgeImpl.GetLocationAccesstion();
        return {
            "accessToken": token
        }
    }

    // async getAccessToken() {
    //     const token = await webJSBridgeImpl.GetLocationAccesstion();
    //     return {
    //         "accessToken": token
    //     }
    // }
    /**
     * @description: 通用接口返回处理
     * @param url 请求地址
     * @param params 请求参数
     * @param type 请求类型
     * @param errorMessage 失败提示
     */
    dealResultPromise(url: any, params: any, type: string = `Get`, errorMessage: any, needLogin: boolean = true): Promise<object> {
        return new Promise(async (res, rej) => {

            //TODO 处理 SCPMOCK 数据 发布生产可以注释掉
            if (SCPMOCKURL.includes(url)) {
                const urlApiMock = `${urlApi}~${scpmock}`;
                const requestName = `${url.split(version)[1]}`;
                const data = {
                    params: JSON.stringify(params),
                    Url: {
                        urlApi: urlApiMock,
                        cmd: requestName  //请求接口名
                    }
                }
                if(axiosMock){
                    axios({
                        method: typeMenu[type],
                        url: `${urlApiMock}${requestName}`,
                        data: qs.stringify(params)
                    }).then(Response => {
                        res(Response)
                    })
                    return
                }else {
                    GetScpMockFunction(data).then(Response => {
                        res(JSON.parse(Response.data))
                    }).catch(Response => {
                        rej(Response)
                    })
                    return;
                }
            }
            
            // TODO 处理 mock 数据 发布生产可以注释掉
            if (!NEEDAXIOSAPILIST.includes(url) && (localDev || NEEDMOCKDATAAPILIST.includes(url))) {
                let resultMockData = getMockData['default'](url, params);
                resultMockData.request = {};
                resultMockData.request.url = url;
                resultMockData = this.tranferResultModel(resultMockData);
                if (NODELAYAPIURLLIST.includes(url)) {
                    res(resultMockData);
                } else {
                    setTimeout(() => {
                        res(resultMockData);
                    }, DEALYTIME * 1000);
                }
                return;
            }
            const host_url = await getHostUrl();
            const complete_url = `${host_url}${url}`
            const data = await mineApi.getRequsetInfo();
            const { ebankId, cpyId, userName } = data;
            params.ebankId = ebankId;
            params.cpyId = cpyId;
            params.userName = userName;
            this[`do${type}`](complete_url, params, needLogin)
                .then(result => {
                    result.request.url = url;
                    result.result = this.tranferResultModel(result);
                    if (result.isSuccess()) {
                        const resultData = result.result || {};
                        res(resultData);
                    } else {
                        if (!NOTSHOWERRORTOASTList.includes(url)) {
                            SnToast(result.resultDesc);
                        }
                        console.log(`${url} @@error -------> `, result);
                        rej(result);
                    }
                })
                .catch(err => {
                    console.log(`${url} @@error -------> `, err);
                    log(
                        {
                            logpath: url,
                            content: err,
                        },
                        3,
                        true
                    );
                    SnToast(errorMessage);
                    rej();
                });
        });
    }

    /**
     * 处理业务错误码
     * @virtual BaseApi中这是一个抽象方法，由子类具体的业务api去实现自己的业务错误码
     * @param resultCode
     */
    transferBisErrorCode(resultCode: number): string {
        return ``;
        // switch (resultCode) {
        //     case 80124001:
        //         return ``;
        //     case 80124901:
        //         return ``;
        //     case 80107107:
        //         return ``;
        //     case 80107901:
        //         return ``;
        //     case 80115103:
        //         return ``;
        //     case 80100002:
        //         return ``;
        //     case 80109001:
        //         return `网络不给力，请您稍后重试!`;
        //     case 80109002:
        //         return `请求参数错误`;
        //     case 80109101:
        //         return "解密参数异常";
        //     case 80109102:
        //         return `用户登录密码错误`;
        //     case 80109103:
        //         return `原支付密码不正确`;
        //     case 80109104:
        //         return `用户未设置支付密码`;
        //     case 80109119:
        //         return "当前交易金额超过授权单可用额度";
        //     case 80109111:
        //         return "原老板付密码不正确";
        //     case 80109112:
        //         return "签名信息校验失败";
        //     case 80109123:
        //         return "今日支付密码输错累计5次，支付冻结";
        //     case 80116710:
        //         return "今日老板付密码输错累计5次，账号被锁定";
        //     case 80109401:
        //         return "企业没有开通老板付，请先开通老板付";
        //     case 80109402:
        //         return "权限不足";
        //     default:
        //         // return `请求异常，请稍后重试!`;
        //         return ``;
        // }
    }
}

export default Api;