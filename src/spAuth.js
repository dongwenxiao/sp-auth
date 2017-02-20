import Router from 'koa-router'
import { spResponse } from 'sp-response'
import { spMongoDB } from 'sp-mongo'
import { createRouter } from './server/router'
import authMiddlewareCreate from './authMiddlewareCreate'
import Role from './server/models/Role'
import User from './server/models/User'

// 表名
const USER_COLLECTION_NAME = '__sp_user'
const ROLE_COLLECTION_NAME = '__sp_role'


export default class spApi {

    /**
     * Creates an instance of ApiFactory.
     *
     * @param {any} opt {ip: '', port: '', db: '', prefix: ''} 连接mongodb需要的信息
     * @param {any} router 包含 .use() 方法的对象
     *
     * @memberOf ApiFactory
     */
    constructor(opt, router, middleware) {

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

        // koa 中间件挂载
        this.rootMiddleware = middleware

        this.init()
    }

    init() {


        // 实例化数据库连接对象
        this.dao = new spMongoDB({ ip: this.ip, port: this.port, db: this.db })

        // 当前auth路由
        this.router = createRouter(this.rootRouter)

        // 配置数据库连接对象和表名
        User.configDAO(this.dao)
        User.configCollection(USER_COLLECTION_NAME)
        Role.configDAO(this.dao)
        Role.configCollection(ROLE_COLLECTION_NAME)

        // handbars 模板注册
        const views = require('sp-koa-views')
        this.rootMiddleware.use(views(__dirname + '/server/views', {
            extension: 'ejs'
        }))
    }

    /**
     * 挂载到主路由上
     *
     * @memberOf ApiFactory
     */
    mount() {

        // 挂载prefix路由

        const apiRouter = new Router()
        apiRouter.use(spResponse)
        apiRouter.use(this.urlPrefix, this.router.routes(), this.router.allowedMethods())
        this.rootRouter.use(apiRouter)

        // 挂载权限校验中间件

        const rootRouter = this.rootRouter.root
        const authMiddleware = authMiddlewareCreate(rootRouter)
        this.rootMiddleware.use(authMiddleware)

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