import { spMongoDB } from 'sp-mongo'
import Router from 'koa-router'

export default class spApi {
    /**
     * Creates an instance of ApiFactory.
     * 
     * @param {any} opt {ip: '', port: '', db: '', prefix: ''} 连接mongodb需要的信息
     * @param {any} router 包含 .use() 方法的对象
     * 
     * @memberOf ApiFactory
     */
    constructor(opt, router) {

        // 维护当前的路由列表
        this.collections = []

        // mongodb 数据库连接信息
        this.ip = opt.ip
        this.port = opt.port
        this.db = opt.db

        // 所有接口URL前缀
        this.urlPrefix = opt.prefix || '/api'

        // koa 路由，主要使用 .use() 挂载
        this.rootRouter = router

        // 当前auth路由
        this.router = new Router()

        // 实例化数据库连接对象
        this.dao = new spMongoDB({ ip: this.ip, port: this.port, db: this.db })
    }

    /**
     * 挂载到主路由上
     * 
     * 
     * @memberOf ApiFactory
     */
    mount() {

        // 先挂载自身接口
        this.addApi()

        // 挂载prefix路由
        const apiRouter = new Router()
        apiRouter.use(this.urlPrefix, this.router.routes(), this.router.allowedMethods())
        this.rootRouter.use(apiRouter)
    }

    addApi() {
        this.router
            .get('/register', async(ctx) => {
                ctx.body = 'rrrr'
            })
            .post('/register', async(ctx) => {

            })
            .get('/login', async(ctx) => {

            })
            .post('/login', async(ctx) => {

            })
            .get('/forgot', async(ctx) => {

            })
            .post('/forgot', async(ctx) => {

            })
            .get('/role', async(ctx) => {

                // 注册的路由
                let registerRoutes = []

                // 二次封装
                this.rootRouter.root.stack
                    .filter((r) => r.methods.length > 0)
                    .forEach((r) => {
                        r.methods.forEach((m) => {
                            registerRoutes.push({
                                method: m,
                                path: r.path
                            })
                        })
                    })

                // 过滤掉其他
                registerRoutes = registerRoutes.filter((r) => {
                    let m = r.method.toUpperCase()
                    return !(m === 'HEAD' || m === 'OPTIONS')
                })


                ctx.body = registerRoutes.map((r) => (`<div>${r.method} - ${r.path}</div>`)).join('')
            })
    }

    response(code, data, msg, type = 'json') {
        if (type === 'json') {
            return {
                code,
                data,
                msg
            }
        }
    }
}