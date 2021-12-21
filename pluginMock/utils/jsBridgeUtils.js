/*
 功能：jsBridge相关方法封装
author：yinfujun
 */
// import Vue from 'vue';
// import { SnToast } from 'sinosun-ui'
import { getClass, isPC } from './commonUtil'
const customTheme = require('../../build/custom-theme.js');


/**
 * 重定向页面
 * @param {Object} url
 */
// export function locationPage(url) {
//     CheckNetWork(function () {
//         window.location.href = url;
//     }, this);
// }

/**
 * 返回页面
 * @param {Object} url
 */
// export function goBackPage_new(url, backSteps, loadData) {
//     goBackFunction_new(url, backSteps, loadData);
// }

/**
 * 返回页面
 * @param {Object} url
 */
// export function goBackPage(url) {
//     goBackFunction(url);
// }

/**
 * 检查网络状态
 * @param {Object} func   函数名
 * @param {Object} content  上下文
 */
export function CheckNetWork(func, content) {
    NativeSupportApi.checkNetWork().then(function (statusData) {
        if (statusData.contectState) {
            if (func) {
                func.call(content);
            }
        } else {
            SnToast('网络连接不可用', 'middle');
        }
        return statusData;
    })
}

/**
 * 确认框提示
 * @param {Object} content  内容
 * @param {Object} rightFunction  确定函数
 * @param {Object} title    title
 * @param {Object} type     类型
 */
/**
 *
 * @param {Object} content      内容
 * @param {Object} rightFunction   右侧按钮点击事件
 * @param {Object} title        title
 * @param {Object} type         类型       1-单个按钮  2-两个按钮  3-多个按钮      默认为两个按钮
 * @param {Object} strLeftBtn   左侧按钮
 * @param {Object} strRightBtn  右侧按钮
 * @param {Object} leftFunction   左侧按钮点击事件
 * @param {Object} H5Flag       是否调用H5方法
 */
export function showConfirm(
    content,
    rightFunction,
    type,
    strLeftBtn,
    strRightBtn,
    title,
    leftFunction,
    H5Flag
) {
    var type = type || 2; //默认两个按钮
    if (!H5Flag) {
        //非H5方法
        if (2 == type) {
            //两个按钮
            strLeftBtn = strLeftBtn || '取消';
            strRightBtn = strRightBtn || '确定';
            if (isPC()) {
                //PC默认为左侧确定，右侧取消
                var tempFun = rightFunction;
                rightFunction = leftFunction;
                leftFunction = tempFun;
                var tempText = strRightBtn;
                strRightBtn = strLeftBtn || '取消';
                strLeftBtn = tempText || '确定';
            }
        }
        //调用native弹框方法
        BrowserApi.popAppCommonDialog({
            requestCode: 0,
            strTitle: title,
            message: content,
            strLeftBtn: strLeftBtn,
            // rightBtnFontColor: '#478aee', //右边按钮默认颜色
            rightBtnFontColor: customTheme['theme-color'], //右边按钮默认颜色
            strRightBtn: strRightBtn,
        }).then(function (data) {
            if (3 == data.clickType) {
                //两个按钮点击右侧按钮     //选择按钮类型 1:关闭按钮  2:左侧按钮  3:右侧按钮
                if (rightFunction) {
                    //函数存在则执行函数
                    rightFunction();
                }
            } else if (2 == data.clickType) {
                //两个按钮点击左侧按钮
                if (leftFunction) {
                    //函数存在则执行函数
                    leftFunction();
                }
            }
        });
        // }
    } else {
        alert(content);
    }
}


/**
 * 设置页面title、按钮、菜单，包含原addAppButton，changeViewTitle
 * @param {Arr} menuList，数组第一个参数为titile的str，后面的为按钮名
 * 
 * 按钮配置说明：
 * String name;  //  如果是菜单，用name显示菜单文字
 * String iconNormalBase64;  // 如果是图标按钮，用来显示 正常图标（JS交互时，用base64转码，如果图片超过5k，提出来让UI重新切图）
 * String iconPressedBase64; // 如果是图标按钮，用来显示 按下效果 图标（JS交互时，用base64转码，如果图片超过5k，提出来让UI重新切图）
 * String menuId;  //必填   菜单ID （不区分是 图标按钮 或是 菜单项），列表中的menuId必须相互唯一
 * Int type;  // 必填 类型 1 ActionBar上的图标按钮，2 下拉菜单项 3 title显示（一般情况下，只有一个图标按钮，可以有多个下拉菜单项）
 * 注意
 * name 和 iconNormalBase64 至少需要填写一个；
 * name 和iconNormalBase64 都有值时ActionBar上的按钮优先显示name，下拉菜单项会左边显示图标，右边显示name；
 * pc可配多个1级按钮，app1级按钮知会显示1个
 * 当有多个type 为1的item时，app会取第一个值；       
 * 下拉菜单项显示顺序默认按menuList的顺序排序； 
 * menuList位Arr，第一位固定为title，后面可以传menuMap里面的key，也可以直接传json(fun需要传变量时使用)
 * extData：扩展数据
 * 
 */
export function initTitleMenu(menuList) {
    var menuMap = {
        menuTitle: { name: menuList[0], menuId: 'title', type: 3 },
    }
    var titleMenuList = [menuMap.menuTitle];
    for (var i = 1; i < menuList.length; i++) {
        var menuName = menuList[i];
        if ('String' == getClass(menuName) && !!menuMap[menuName]) {
            titleMenuList.push(menuMap[menuName]);
        } else if ('Object' == getClass(menuName)) {
            titleMenuList.push(menuName);
        }
    }
    BrowserApi.RegisterMenuFunction(titleMenuList);
}


/**
 * js调用 Native 错误日志打印方法，将日志打印到本地
 * @export
 */

export function PrintErrorLogFunction(data = {}) {
    return BrowserApi.callHandler('PrintErrorLogFunction', data);
}


