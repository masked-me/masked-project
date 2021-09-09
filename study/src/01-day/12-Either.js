class Left {
    static of(value) {
        return new Left(value)
    }
    constructor(value) {
        this._value = value
    }
    map() {
        return this
    }
}

class Right {
    static of(value) {
        return new Right(value)
    }
    constructor(value) {
        this._value = value
    }
    map(fn) {
        return Right.of(fn(this._value))
    }
}

function getJson(params) {
    try {
        return Right.of(JSON.parse(params))
    } catch (e) {
        return Left.of({ error: e.message })
    }
}

const r = getJson('{ "name":"ss" }').map(x => x.name.toUpperCase())
console.log('r', r);