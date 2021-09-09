const _ = require("lodash")

const map = _.curry((func, arr) => _.map(arr, func))

console.log(map(parseInt, [1, 2, 3]));
