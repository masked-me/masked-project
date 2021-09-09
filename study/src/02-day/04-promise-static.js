import { ajax } from './02-ajax.js'

Promise.resolve('foo').then(res => {
    console.log(res)
})

const promise = ajax('src/day-02/users.json')
const promise2 = Promise.resolve(promise)

console.log(promise === promise2)

Promise.resolve({
    then: (onFullFilled, onRejected) => {
        onFullFilled('foo.then')
    }
}).then(res => {
    console.log(res)
})

Promise.reject(new Error('promise rejected'))
    .catch(err => {
        console.log(err)
    })
