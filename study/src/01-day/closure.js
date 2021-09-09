function getPI(r) {
    console.log('1')
    return Math.PI * r * r
}

function memoize(fn) {
    let cache = {}
    return function () {
        let key = JSON.stringify(arguments)
        cache[key] = cache[key] || fn.apply(fn, arguments)
        return cache[key]
    }
}
const getNewPI = memoize(getPI)
console.log(getNewPI(4 / Math.pow(Math.PI, 1 / 2)))
console.log(getNewPI(4))
console.log(getNewPI(4))