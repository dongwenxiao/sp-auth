const { ACL_VERIFY } = require('../enum')
const log = require('debug')('sp-auth:log')

/**
 * 生成ACL中间件
 * 
 * opt.getUser(access_key)  // 通过access_key获取用户信息
 */
const factoryACLMiddleware = function(acl, service) {

    return async(ctx, next) => {

        //
        let url = ctx.path
        let method = ctx.method
        
        let accessToken = ctx.header.access_token

        //
        let verify = await service.verifyACL({ acl, url, method, accessToken })
        log('verify result: %O', verify)
        
        //
        if (verify.status === ACL_VERIFY.PASS) {
            if (!verify.user) return await next()
            else {
                ctx.user = verify.user
                await next()

                // 释放
                delete ctx.user
            }
        } else if (verify.status === ACL_VERIFY.FORBIDDEN ||
            verify.status === ACL_VERIFY.NO_ACCESS_TOKEN ||
            verify.status === ACL_VERIFY.DISABLED ||
            verify.status === ACL_VERIFY.USER_NOT_EXIST
        ) {
            ctx.status = 403
        }

    }

}

module.exports = factoryACLMiddleware