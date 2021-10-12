'use strict';
const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');
const chalk = require('chalk');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const config = require('../../config')
const reg = /^([1-9]\d|[1-9])(\.([1-9]\d|\d)){1,3}$/ // 版本号效验正则 5.0到5.0.0.0

// inquirer交互式命令问题设置
const questions = [
    {
        type: 'input',
        name: 'version',
        message: '请输入版本号:',
        validate: function (value) {
            return reg.test(value) ? true : '请输入正确格式的版本号,例如5.0.3.1'
        },
        filter: String,
        // default:'5.0.4.1'
    },
];

let npmArg = JSON.parse(process.env.npm_config_argv).original // 获取npm命令行参数

let version = checkVer(npmArg) 

if (version != undefined) { // 执行npm命令中包含版本号
    runBuild().then(res => {
        console.log('runBuild complete')
        let versionStr = JSON.stringify({
            version: version,
            buildDateTime: new Date().toLocaleString()
        }, null, 4);
        writeVersion(versionStr);
    }).then(res => {
        console.log('writeVersion complete')
    }).catch(e => {
        console.log('error,', e)
    });
} else { //不包含版本号
    enterVer()
}


/**
 * 检查数组中是否存在版本号
 * @param {*} arr 
 */
function checkVer(arr) {
    let version
    if(arr.indexOf('-V') > -1) {
        if (reg.test(arr[arr.indexOf('-V')+1])) {
            version = arr[arr.indexOf('-V')+1]
        }
    }
    return version
}

/**
 * 交互式命令手动输入版本号
 */
function enterVer() {
    inquirer.prompt(questions).then(answers => {
        let versionObj = {
            ...answers,
            "buildDateTime": new Date().toLocaleString()
        };
        let versionStr = JSON.stringify(versionObj, null, 4);
        console.info(chalk.green('版本相关信息:'));
        console.log(versionStr);
        console.info(chalk.cyan('正在编译中...'));
        
        runBuild().then(res => {
            console.log('runBuild complete')
            writeVersion(versionStr);
        }).then(res => {
            console.log('writeVersion complete')
        }).catch(e => {
            console.log('error,', e)
        });
    });
}

/**
 * 文件写操作
 * @param {*} versionStr 
 */
async function writeVersion(versionStr) {
    await fs.writeFile(path.join(config.build.assetsRoot, '/static/version.json'), versionStr, function (err, data) {
        if (err) {
            console.error(err);
        }
    });
}

/**
 * 执行node build/build.js
 */
async function runBuild() {
    const { stdout, stderr } = await exec(`node build/build.js`);
    console.log('stdout:', stdout);
}
