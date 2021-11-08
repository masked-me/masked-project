const http = require('http');
const url = require('url');
const axios = require('axios')
const db = require('db')
const { formatApi } = require('../api/api.js')
const md5 = require('md5')
console.log(db.add())
console.log(md5(1))
const serve = http.createServer((req, res) => {
    const content = url.parse(req.url, true).query
    let str = '';
    Object.keys(content).forEach(item => {
        str += `${item}---${content[item]} \n`
    })
    console.log(str) 
    console.log(module)
    console.log(formatApi(req.url))
    console.log(axios.get())
    console.log('require.main === module---index', require.main === module);
    res.writeHead(200, { 'Content-type': 'text/html;charset=utf-8' });
    res.end('你好  nodejs1')
}).listen(8081)





