import { ajax } from "./02-ajax.js"

const getData = ajax('api/urls.json')
const timeout = new Promise((resolve, reject) => {
    setTimeout(() => {
        reject(new Error('time out'))
    }, 1500)
})

Promise.race([
    getData,
    timeout
]).then(res => {
    console.log(res)
})