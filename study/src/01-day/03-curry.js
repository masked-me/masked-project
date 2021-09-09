function getSum(a, b, c) {
    return a + b + c
}

const curried = curry(getSum);

function curry(fn) {
    return function curriedFn(...args) {
        if (args.length < fn.length) {
            return function () {
                return curriedFn(...args.concat(Array.from(arguments)))
            }
        }
        return fn(...args)
    }
}

console.log(curried(1, 2, 3));
console.log(curried(1)(2, 3));