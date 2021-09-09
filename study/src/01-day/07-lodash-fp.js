const _ = require('lodash');

// 数据在前，函数在后
_.map(['a', 'b', 'c'], _.toUpper);
// => ['A', 'B', 'C']
_.map(['a', 'b', 'c']);
// => ['a', 'b', 'c']

const fp = require('lodash/fp');

// 函数在前，数据在后
fp.map(fp.toUpper, ['a', 'b', 'c'])
// => ['A', 'B', 'C']
fp.map(fp.toUpper)(['a', 'b', 'c'])
// => ['A', 'B', 'C']