const { ACL_VERIFY, LOGIN_RESULT, USER_STATUS, ROLE } = require('../enum')
const md5 = require('sp-functions/crypto/md5')
const randomString = require('sp-functions/random/string')
const moment = require('moment')

export default class authService {

    /**
     * 注入数据操作对象
     * @param {*} param0 
     */
    inject({ userModel, userAccessTokenModel }) {
        this.userModel = userModel
        this.userAccessTokenModel = userAccessTokenModel
    }

    /**
     * 获取登录后的access_token
     * 
     * 来自各种方式的登录之后，再走这个方法
     * 登录验证逻辑，由sp-auth-phone/sp-auth-wx/...自行管理
     * 此方法接收登录成功后得到userId
     * 
     * @param {Int} userId 
     * @returns {Object} {code, accessToken}
     */
    async login(userId) {

        // 返回数据格式
        const result = (code, token) => {
            return {
                code: code || LOGIN_RESULT.SUCCESS,
                accessToken: token || ''
            }
        }

        // 获取用户信息
        let user = await this.userModel.getUserById(userId)

        // 判断用户是否可用
        if (user.status == USER_STATUS.DISABLE)
            return result(LOGIN_RESULT.DISABLED)

        // upsert(插入或更新)用户的access_token
        const accessToken = {
            user_id: userId,
            token: `${md5(moment().format('X'))}.${randomString(10)}`,
            expire: moment().add(1, 'days').format("X")
        }
        await this.userAccessTokenModel.upsert(accessToken)

        // => accessToken
        return result(LOGIN_RESULT.SUCCESS, accessToken.token)
    }

    /**
     * 注册
     * 
     * 此方法主要是返回了新增用户的id
     * dt_user表的数据都是通过这里创建的
     * 
     * @param {Object} {role, status} 
     * @returns {User} 包含了用户id的user对象
     */
    async register({ role, status }) {

        let user = {
            role,
            status
        }

        user.id = this.userModel.create(user)

        return user
    }

    /**
     * ACL逻辑实现
     * 
     * 1. 判断URL是否随便访问
     * 2. 判断是否有accessToken
     * 3. 获取用户Role并判断是否有权限访问
     * 
     * @param {acl, url, method, accessToken}
     * @returns {enum, user} 
     */
    async verifyACL({ acl, url, method, accessToken }) {

        const result = (code, user) => {
            return {
                status,
                user
            }
        }

        // 1. 判断URL是否随便访问

        if (this.isAnyone(url, method)) {
            return result(ACL_VERIFY.PASS, null)
        }

        // 2. 判断是否有accessToken

        if (!accessToken) {
            return result(ACL_VERIFY.NO_ACCESS_TOKEN, null)
        }

        // 3. 获取用户Role并判断是否有权限访问

        // 3.1 用户不存在
        let user = await this.userModel.getUserByAccessToken(accessToken)
        if (!user) {
            return result(ACL_VERIFY.USER_NOT_EXIST, null)
        }

        // 3.2 用户无权限
        let pass = this.verify(acl, user.role, url, method)
        if (!pass) {
            return result(ACL_VERIFY.FORBIDDEN, null)
        }

        // 3.3 验证通过
        return result(ACL_VERIFY.PASS, user)

    }

    verify(acl, role, url, method) {
        if (~acl[role].indexOf(`${url}|${method}`) || // 匹配具体Method
            ~acl[role].indexOf(`${url}|all`)) // 匹配all Method
            return true
        return false
    }

    isAnyone(url, method) {
        return this.verify(ROLE.ANYONE, url, method)
    }
}