// 函数组合  调试
// NEVER GIVE UP  -->  never-give-up
const _ = require("lodash");

const str = 'NEVER GIVE UP'
// 函数组合--调试
const log = _.curry((tag, v) => { console.log(tag, v); return v; })

const split = _.curry((regs, value) => _.split(value, regs))
const map = _.curry((func, arr) => _.map(arr, func))
const jion = _.curry((regs, arr) => _.join(arr, regs))

const never = _.flowRight(jion('-'), map(_.toLower), split(' '))

console.log(never(str))
