const url = require('url')


const server = ()=>{
    const g = {}
    g._get = {}
    g._post = {}
    
    const app = (req, res)=> {
        // 封装一个发送结果的函数
        res.send = data => {
            res.writeHead(200, {'Content-type':'text/html;charset="utf-8"'})
            res.end(data)
        }

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
                g._post[pathname](req, res)
            }
            
        } else {
            res.writeHeader(404, {'Content-type':'text/html;charset="utf-8"'})
            res.end('页面不存在')
        }
    }

    app.get = (str, cb)=>{
        // 注册方法
        g._get[str]=cb
    }

    app.post = (str, cb)=>{
        g._post[str]=cb
    }

    return app
}


module.exports = server();