import Router from 'koa-router'
import Role from './models/Role'
import _ from 'underscore'
// import { User, Role} from './model'

const createRouter = (rootRouter) => {

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
        .get('/admin/role', async(ctx) => {

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

            return ctx.render('admin/role', {
                routes: registerRoutes,
                roles: ['role1', 'role2']
            })
        })


    .get('/admin/role_get', async(ctx) => {
            var _id = ctx.query.id
            let roles = []
            if (_id) {
                // 查找某一个角色
                roles = await Role.get({ _query: { _id } })
            } else {
                // 查找全部角色
                roles = await Role.get()
            }

            ctx.body = {
                code: 200,
                data: roles
            }

        })
        .post('/admin/role_add', async(ctx) => {

            let name = ctx.request.body.name
            let apis = ctx.request.body.apis

            // 不能添加相同的角色名

            const roles = await Role.get({ _query: { name } })
            if (roles.length === 0) {
                const role = new Role({ name, apis })
                const result = await Role.add(role)

                ctx.body = {
                    code: 200,
                    data: result
                }
            } else {
                ctx.body = {
                    code: 500,
                    data: {
                        msg: 'Fail: Role name existed.'
                    }
                }
            }

        })
        .put('/admin/role_update', async(ctx) => {
            let _id = ctx.request.body.id
            let name = ctx.request.body.name
            let apis = ctx.request.body.apis

            // obj -> array
            apis = _.values(apis)

            const roles = await Role.get({ _query: { name } })

            if (roles.length === 0 || roles[0].name === name) {
                const role = new Role({ name, apis })
                const result = await Role.update({ _id }, role)

                ctx.body = {
                    code: 200,
                    data: result
                }
            } else {
                ctx.body = {
                    code: 500,
                    data: {
                        msg: 'Fail: Role name existed.'
                    }
                }
            }

        })
        .delete('/admin/role_delete', async(ctx) => {
            let _id = ctx.request.body.id

            const result = await Role.delete({ _id })

            ctx.body = {
                code: 200,
                data: result
            }

        })



    return router
}


export { createRouter }