const http = require('http')
const app = require('./module/route')

// 注册服务器
http.createServer(app).listen(3000)

// 配置路由
app.get('/', (req, res)=>{
    res.writeHead(200, {'Content-type':'text/html;charset="utf-8"'})
    res.end('home')
})

app.get('/news', (req, res)=>{
    res.writeHead(200, {'Content-type':'text/html;charset="utf-8"'})
    res.end('新闻')
})

app.get('/login', (req, res)=>{
    res.writeHead(200, {'Content-type':'text/html;charset="utf-8"'})
    res.end('登录页面')
})

console.log('server runing at http://127.0.0.1:3000')