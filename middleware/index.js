const { ACL_VERIFY } = require('../enum')
const service = require('../service')

/**
 * 生成ACL中间件
 * 
 * opt.getUser(access_key)  // 通过access_key获取用户信息
 */
const factoryACLMiddleware = function(acl) {

    return async(ctx, next) => {

        //
        let url = ctx.path
        let method = ctx.method
        let accessToken = ctx.header.access_token

        //
        let verify = service.verifyACL({ acl, url, method, accessToken })

        //
        if (verify.code === ACL_VERIFY.PASS) {
            if (!verify.user) return await next()
            else {
                ctx.user = verify.user
                await next()

                // 释放
                delete ctx.user
            }
        } else if (verify.code === ACL_VERIFY.FORBIDDEN ||
            verify.code === ACL_VERIFY.NO_ACCESS_TOKEN ||
            verify.code === ACL_VERIFY.DISABLED ||
            verify.code === ACL_VERIFY.USER_NOT_EXIST
        ) {
            ctx.status = 403
            return
        }

    }

}

module.exports = factoryACLMiddleware