const fp = require('lodash/fp')

class MayBe {
    static of(value) {
        return new MayBe(value)
    }
    constructor(value) {
        this._value = value
    }
    map(fn) {
        return this.isNothing() ? MayBe.of(null) : MayBe.of(fn(this._value))
    }
    isNothing() {
        return this._value === null || this._value === undefined;
    }
}

const r = MayBe.of(null).map(fp.toUpper)
console.log(r)
//MayBe { _value: null }