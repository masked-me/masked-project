import { ajax } from './02-ajax.js'

ajax('api/urls.json').then(res => {
    let values = Object.values(res)
    let urls = values.map(item => ajax(item))
    return Promise.all(urls)
}).catch(err => {
    console.log(err)
    return '2'
}).then(res => {
    console.log('res', res)
})