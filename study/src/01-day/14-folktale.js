const { compose, curry } = require('folktale/core/lambda')
const { toUpper, first } = require('lodash/fp')

const f = curry(2, (x, y) => x + y)

console.log(f(1, 2))
console.log(f(1)(2))

const p = compose(toUpper, first)

console.log(p(['one', 'two']))