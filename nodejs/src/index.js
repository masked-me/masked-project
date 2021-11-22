const http = require('http');
const ejs = require('ejs');
const app = require('../module/route')


// 注册web服务
http.createServer(app).listen(8081)

// 修改静态资源目录
app.static('public')

// 配置路由
app.get('/news', (req, res) => {
    let msg = '我是ejs'
    let list = [
        'xx1',
        'xx2',
        'xx3',
        'xx4',
    ]
    ejs.renderFile('../view/news.ejs', { msg, list }, (err, data) => {
        res.send(data)
    })
})

// 配置路由
app.get('/login', (req, res) => {
    ejs.renderFile('../view/form.ejs', {}, (err, data) => {
        res.send(data)
    })
})

// 配置路由
app.post('/doLogin', (req, res) => {
    res.send(req.body)
})
