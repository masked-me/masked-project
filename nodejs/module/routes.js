const path = require('path');
const fs = require('fs');
const url = require('url');
const ejs = require('ejs')
const mimeType = require('./mime.json')

let getMimeType = function (filePath) {
    let ext = path.extname(filePath).split('.').pop().toLowerCase();
    if (!ext) {
        return mimeType['.txt']
    }

    return mimeType['.' + ext] || mimeType['.txt']
}
module.exports = {
    static: (req, res, static) => {
        return new Promise((resolve, rejects) => {
            let pathname = url.parse(req.url, true).pathname
            pathname = pathname == '/' ? 'index.html' : pathname
            static = '../static' + '/' + pathname
            if (pathname != '/favicon.ico') {
                try {
                    let data = fs.readFileSync(static)
                    if (data) {
                        res.writeHead(200, { 'Content-type': `${getMimeType(static)};charset=utf-8` });
                        res.end(data)
                        resolve(true)
                    }
                } catch (error) {
                    resolve(false)
                }
            }
        })
    },
    login: (req, res) => {

        ejs.renderFile('../view/form.ejs', {}, (err, data) => {
            res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' })
            res.end(data);
        })
    },
    news: (req, res) => {
        let msg = '我是ejs'
        let list = [
            'xx1',
            'xx2',
            'xx3',
            'xx4',
        ]
        ejs.renderFile('../view/news.ejs', { msg, list }, (err, data) => {
            res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' })
            res.end(data);
        })
    },
    doLogin: (req, res) => {
        let postData = ''
        req.on('data', chunk => {
            postData += chunk
        })

        req.on('end', () => {
            res.end('post ok' + postData)
        })
    },
    error: (req, res) => {
        // res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' })
        res.end('404 访问资源找不到')
    }
}