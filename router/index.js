const service = require('../service')

module.exports = require('koa-router')

    .post('/login', async(ctx) => {

        let userId = ctx.query.userId
        let accessToken = await service.login(userId)

        // => accessToken

        ctx.body = {
            code: 0,
            msg: '',
            data: { accessToken }
        }
    })