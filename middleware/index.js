/**
 * 生成ACL中间件
 * 
 * opt.getUser(access_key)  // 通过access_key获取用户信息
 */
const factoryACLMiddleware = function(acl, opt) {

    // 
    if (!opt) new Error('factoryACLMiddleware(acl, opt): opt must be objcet!')
    if (!opt.getUser) new Error('opt.getUser must be function!')

    return async(ctx, next) => {

        /* 
        ACL 处理流程:
        check_anyone_url -> check_access_key -> check_role_url
        */

        const url = ctx.path
        const method = ctx.method

        // =>
        if (isAnyone(url, method)) {
            await next()
            return
        }

        const accessKey = ctx.header.access_key

        // => 
        if (!accessKey) {
            ctx.status = 403
            return
        }

        const user = opt.getUser(accessKey)

        // =>
        if (!user) {
            ctx.status = 403
            return
        }

        // =>
        if (!verify(user.role, url, method)) {
            ctx.status = 403
            return
        }


        // 带上用户信息
        // =>
        ctx.user = user
        await next()

        // 释放
        delete ctx.user

    }

    // acl 检查
    function verify(role, url, method) {
        if (~acl[role].indexOf(`${url}|${method}`))
            return true
        return false
    }

    // 判断是否是任何人可以访问的url
    function isAnyone(url, method) {
        return verify('anyone', url, method)
    }
}

module.exports = factoryACLMiddleware