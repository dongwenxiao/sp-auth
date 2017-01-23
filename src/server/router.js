import Router from 'koa-router'
// import { User, Role} from './model'

const createRouter = (rootRouter, dao) => {

    const router = new Router()

    router
        .get('/register', async(ctx) => {
            // return ctx.render('home', { name: 'victor' })
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

            // const roleInstance = new Role({

            // })

            // 注册的路由
            let registerRoutes = []

            // 二次封装
            rootRouter.root.stack
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

            return ctx.render('role', {
                routes: registerRoutes,
                roles: ['role1', 'role2']
            })

            // ctx.body = registerRoutes.map((r) => (`<div>${r.method} - ${r.path}</div>`)).join('')
        })
        .post('/role', require('koa-bodyparser')(), async(ctx) => {

            let name = ctx.request.body.roleName
            let apis = ctx.request.body.apis

            
            
            ctx.body = 'ok'
        })

    return router
}


export { createRouter }