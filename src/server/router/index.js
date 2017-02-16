import Router from 'koa-router'
import User from '../models/User'
// import _ from 'underscore'
import { createRouter as createAdminRouter } from './admin'

const createRouter = (rootRouter) => {

    const router = new Router()
    const adminRouter = createAdminRouter(rootRouter)

    router.use('/admin', adminRouter.routes())

    router
        .get('/register', async(ctx) => {

            // var ss = ctx.spResponse(200, { a: 1 }, 'sss')

            // console.log(ss)
            // ctx.body = ss

            const r = await User.registerByEmail({
                email: 'cs_victor@126.com',
                password: '123456'
            })

            ctx.body = r

        })
        .post('/register', async(ctx) => {

            const username = ctx.request.body.username
            const email = ctx.request.body.email
            const password = ctx.request.body.password

            let user

            if (email) {
                user = await User.registerByEmail({
                    email,
                    password
                })
            }

            if (username) {
                user = await User.registerByEmail({
                    username,
                    password
                })
            }

            if (user) {
                ctx.session.user = user
                ctx.session.role = 'user'
                ctx.spResponse(200, user, '注册成功。')
            } else {
                ctx.spResponse(200, {}, '注册失败。')
            }

        })
        .post('/login', async(ctx) => {

            const username = ctx.request.body.username
            const email = ctx.request.body.email
            const password = ctx.request.body.password

            //
            let user
            if (username) user = await User.loginByUsername(username, password)
            if (email) user = await User.loginByEmail(email, password)

            // 无可用登录信息
            if (user === undefined) {
                ctx.spResponse(200, {}, '提供登录信息有误。')
            }

            // 没找到登录用户
            if (user === null) {
                ctx.spResponse(200, {}, '没找到登录用户。')
            }

            // 密码错误
            if (user === false) {
                ctx.spResponse(200, {}, '密码错误。')
            }

            // 登录成功
            if (user) {
                ctx.session.user = user
                ctx.session.role = 'user'

                ctx.spResponse(200, user, '登录成功。')
            }

        })
        .get('/login', async(ctx) => {

        })
        .get('/forgot', async(ctx) => {

        })
        .post('/forgot', async(ctx) => {

        })


    return router
}


export { createRouter }