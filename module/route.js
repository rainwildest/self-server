
const url = require('url')
const fs = require('fs')
const path = require('path')

// 根据后缀名获取文件类型
const getFileMime = (extname) => {
    const data = fs.readFileSync('./mime.json')
    const mimeObj = JSON.parse(data.toString())

    return mimeObj[extname]
}

// 静态web服务方法
const initStatic = (req, res, staticPath) => {
    let isFinish = false

    // 1. 获取地址
    let pathname = url.parse(req.url).pathname
    pathname = (pathname === '/'?'/index.html' : pathname)
    const extname = path.extname(pathname)
    // 2. 通过fs模块读取文件
    try {
        const data = fs.readFileSync(`./${staticPath}${pathname}`)
        if(data) {
            const mime = getFileMime(extname)
            res.writeHead(200, {'Content-type': `${mime};charset="utf-8"`})
            // res.write(data)
            res.end(data)
        }
        isFinish = true
    } catch (error) {
        // res.writeHead(200, {'Content-type': `text/html;charset="utf-8"`})
        // res.end('404')
        isFinish = false
    }

    return isFinish
}

const server = ()=>{
    const g = {
        _get: {},
        _post: {},
        _staticPath: 'public' //静态web目录
    }
    
    const app = (req, res)=> {
        // 封装一个发送结果的函数
        res.send = data => {
            res.writeHead(200, {'Content-type':'text/html;charset="utf-8"'})
            res.end(data)
        }

        // 配置静态web的服务器
        const isFinish = initStatic(req, res, g._staticPath)
        // 如果已经请求了静态文件则退出，不然会出错
        if(isFinish) return 0 

        const pathname = url.parse(req.url).pathname

        // 获取请求类型
        const method = req.method.toLowerCase()
        if(g[`_${method}`][pathname]) {
            if(method === "get"){
                // 执行方法
                g._get[pathname](req, res)
            } else {
                // post 获取post的数据，把它绑定到req.body
                let postData = ''
                req.on('data', chunk => {
                    postData += chunk
                })
                req.on('end',  () => {
                    req.body = postData
                    g._post[pathname](req, res)
                })
            }
        } else {
            res.writeHead(404, {'Content-type':'text/html;charset="utf-8"'})
            res.end('页面不存在')
            console.log('error-404')
        }
    }

    // get 请求
    app.get = (str, cb)=>{
        // 注册方法
        g._get[str]=cb
    }

    // post 请求
    app.post = (str, cb)=>{
        g._post[str]=cb
    }

    // 配置静态web服务目录
    app.static = (path) => {
        g._staticPath = path
    }
    return app
}


module.exports = server();