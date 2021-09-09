function* foo() {
    console.log('start')
    const res = yield 'foo'
    console.log(res)
}

const generator = foo()

const result = generator.next()

console.log(result)

generator.next('ss')

generator.throw(new Error('Generator error'))