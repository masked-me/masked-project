// 函数组合  调试
// NEVER GIVE UP  -->  never-give-up
// const _ = require("lodash");
const fp = require("lodash/fp");

const str = 'NEVER GIVE UP'
// 函数组合--调试
const log = fp.curry((tag, v) => { console.log(tag, v); return v; })


const never = fp.flowRight(fp.join('-'), fp.map(fp.toLower), fp.split(' '))

console.log(never(str))
