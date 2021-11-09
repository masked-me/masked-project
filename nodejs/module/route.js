const fs = require('fs')
const url = require('url')
const { getMimeType } = require('../lib/common')

let server = () => {

    let G = {
        _get: {},
        _post: {},
        _staticPath: 'static'
    }

    // 扩展res
    let changeRes = (res) => {
        res.send = (data) => {
            res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' })
            res.end(data)
        }
    }

    // 静态web服务方法
    let initStatic = (req, res, static) => {
        return new Promise((resolve, rejects) => {
            let pathname = url.parse(req.url, true).pathname
            pathname = pathname == '/' ? 'index.html' : pathname
            statics = `../${static}` + '/' + pathname
            if (pathname != '/favicon.ico') {
                try {
                    let data = fs.readFileSync(statics)
                    if (data) {
                        res.writeHead(200, { 'Content-type': `${getMimeType(statics)};charset=utf-8` });
                        res.end(data)
                        resolve(true)
                    }
                } catch (error) {
                    resolve(false)
                }
            }
        })
    }

    let app = async (req, res) => {
        changeRes(res)
        let pathname = url.parse(req.url).pathname
        let method = '_' + req.method.toLowerCase()
        let isStatic = await initStatic(req, res, G._staticPath)
        if (!isStatic) {
            if (G[method][pathname]) {
                if (method == '_post') {
                    let postData = ''
                    req.on('data', chunk => {
                        postData += chunk
                    })
                    req.on('end', () => {
                        req.body = postData
                        G[method][pathname](req, res)
                    })
                    return;
                }
                G[method][pathname](req, res)
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' })
                res.end('404 访问资源找不到')
            }
        }
    }
    app.static = (staticPath) => {
        G._staticPath = staticPath
    }

    app.get = (str, cb) => {
        G._get[str] = cb
    }

    app.post = (str, cb) => {
        G._post[str] = cb
    }

    return app;
}
module.exports = server()