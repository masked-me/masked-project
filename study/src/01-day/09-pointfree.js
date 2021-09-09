// 把一个字符串中的首字母提取并转换成大写，使用. 作为分隔符
// world wild web ==> W.W.W
const str = 'world wild web';

const fp = require('lodash/fp');

const toFirst = fp.flowRight(fp.join('.'), fp.map(fp.flowRight(fp.first, fp.toUpper)), fp.split(' '));

console.log(toFirst(str))

