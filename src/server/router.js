import Router from 'koa-router'

export default function createRouter(perfix = '/auth') {

    const authRouter = new Router()

    authRouter
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
        .get('/auth', async(ctx) => {
            
        })

    // 整体挂载路由前缀
    const prefixRouter = new Router()
    prefixRouter.use(perfix, authRouter.routes(), authRouter.allowedMethods())

    return prefixRouter
}