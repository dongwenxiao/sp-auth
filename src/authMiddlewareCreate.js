import Role from './server/models/Role'

export default function authMiddlewareCreate(rootRouter) {

    return async(ctx, next) => {

        let url = ctx.request.url
        let method = ctx.request.method
        let path = '' // 路由匹配出来的规则

        // 无需权限，直接访问

        if (~[
            '/auth/admin/role',
            '/auth/admin/role/get',
            '/auth/admin/role/add',
            '/auth/admin/role/update',
            '/auth/admin/role/delete',
            '/auth/login',
            '/auth/register'
        ].indexOf(url)) {
            return await next()
        }

        // 不受sp-auth管的路由，直接跳过

        const matched = rootRouter.match(url, method)
        if (!matched.route) {
            return await next()
        }

        // sp-auth 访问权限校验

        let currentUserRole = ctx.session.role || 'anyone'
        if (matched.route) {
            for (let i = 0; i < matched.pathAndMethod.length; i++) {
                let pm = matched.pathAndMethod[i]

                if (pm.methods.length > 0 && ~pm.methods.indexOf(method)) {

                    // 找到匹配规则
                    path = pm.path

                    // console.log(method)
                    // console.log(path)

                    // 获取权限访问列表进行权限校验

                    const roles = await Role.get()

                    for (let i = 0; i < roles.length; i++) {
                        let role = roles[i]
                        if (role.name === currentUserRole) {

                            for (let j = 0; j < role.apis.length; j++) {
                                let api = role.apis[j]
                                if (api.path === path && api.method === method && eval(api.status)) {
                                    // 当前角色有访问URL的权限
                                    console.log('有权限')
                                    return await next()
                                }
                            }

                            // 当前角色没有访问URL的权限
                            console.log(`无权限 - URL未匹配 : ${method} - ${url}`)
                            ctx.body = '403'
                            ctx.status = 403
                            return
                        }

                    }

                    console.log('无权限 - 角色未匹配')
                    ctx.body = '403'
                    ctx.status = 403
                    return
                }
            }
        }
    }
}