const http = require('http');
const url = require('url')
const ejs = require('ejs')

const routes = require('../module/routes')

const serve = http.createServer(async (req, res) => {
    let isStatic = await routes.static(req, res, 'static')
    let pathname = url.parse(req.url).pathname.replace('/', '')
    if (!isStatic) {
        try {
            routes[pathname](req, res)
        } catch (error) {
            routes[`error`](req, res)
        }
    }
})

serve.listen(3000)


console.log('服务运行至,http://localhost:3000/')





