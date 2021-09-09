// ''.match(/\s+/g);
// ''.match(/\d+/g);
const _ = require('lodash');

const Space = /\s+/g;
const Number = /\d+/g;

const match = _.curry((regs, arr) => {
    return arr.match(regs)
})

const haveSpace = match(Space)

const filter = _.curry((func, arr) => {
    return arr.filter(func)
})

const findSpace = filter(haveSpace)

console.log(haveSpace('123 123'));
console.log(findSpace(['123 1233', '23232', '1 2']));

