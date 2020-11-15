const url = require('url')


const server = ()=>{
    const g = {}
    g._get = {}
    g._post = {}
    
    const app = (req, res)=> {
        console.log('======================')
        console.log('g', g)
        const pathname = url.parse(req.url).pathname
        if(g[pathname]) {
            // 执行方法
            g[pathname](req, res)
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