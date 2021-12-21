
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
IMPORT-DIVIDER

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
            
MOCKBRANCH-DIVIDER
/**
 * 通过APP调用ApiFkaer挡板数据，返回到前端
 * 参数格式
 *  data = {
 *		params: { userId: "123" }, //请求参数
 *	    url: { 
 *          urlApi: "http://10.2.30.130:8081/",  //请求url
 *          cmd: "get_list"  //请求接口名
 *       }
 *	};
 * @export
 */
 export function GetScpMockFunction(data = {}) {
    return BrowserApi.callHandler('GetApiFakerFunction', data);
}
SCPMOCKFUN-DIVIDER
// 获取环境变量
const nodeEnv = process.env["NODE_ENV"]
// 需要 ScpMock数据 接口列表
let ScpMockUrl: any[] = [
    "/ebank/accountmgmt/v1/queryAccountTradeList",
    "/bizmate/approval/v1/getList"
];

if (nodeEnv !== "development") {
    ScpMockUrl = [];
}

export { ScpMockUrl };
SCPMOCKURL-DIVIDER