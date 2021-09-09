const fs = require('fs')
const fp = require('lodash/fp')

class IO {
    static of(value) {
        return new IO(function () {
            return value
        })
    }
    constructor(fn) {
        this._value = fn
    }
    //返回函数 调用map
    map(fn) {
        return new IO(fp.flowRight(fn, this._value))
    }
    join() {
        return this._value()
    }
    flatMap(fn) {
        return this.map(fn).join()
    }
}
// new IO  传入函数
function readFile(path) {
    return new IO(function () {
        return fs.readFileSync(path, 'utf-8')
    })
}
// IO.of  传入变量
function getContent(file) {
    return IO.of(file)
}


const p = readFile('package.json')
    //返回函数 调用map
    .map(fp.toUpper)
    //返回函子 调用flatMap
    .flatMap(getContent).join()

console.log(p)