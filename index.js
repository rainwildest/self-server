const http = require('http')
const app = require('./module/route')

const ejs = require('ejs')
// 注册服务器
http.createServer(app).listen(3000)

// 配置路由
app.get('/', (req, res) => {
  // res.send('home')
  ejs.renderFile('./views/form.ejs', {}, (error, data) => {
    if (error) {
      throw new Error(error)
    }
    res.send(data)
  })
})

app.get('/news', (req, res) => {
  res.send('新闻页面')
})

app.get('/login', (req, res) => {
  res.send('登录页面')
})

console.log('server runing at http://127.0.0.1:3000')
