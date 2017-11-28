const { ACL_VERIFY, LOGIN_RESULT, USER_STATUS, ROLE } = require('../enum')
const md5 = require('sp-functions/crypto/md5')
const randomString = require('sp-functions/random/string')
const is = require('sp-functions/is')
const moment = require('moment')

const error = require('debug')('sp-auth:error')

export default class AuthService {

    /**
     * 注入数据操作对象
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
        const result = (code, token, expire) => {
            return {
                code: code || LOGIN_RESULT.SUCCESS,
                accessToken: token || '',
                expire: expire || 0
            }
        }

        // 获取用户信息
        let user = await this.userModel.getOneById(userId)

        if (!user) {
            return result(LOGIN_RESULT.NOT_EXIST)
        }

        // 判断用户是否可用
        if (user.status == USER_STATUS.DISABLE)
            return result(LOGIN_RESULT.DISABLED)

        // upsert(插入或更新)用户的access_token
        const accessToken = {
            userId,
            token: `${md5(moment().format('X'))}.${randomString(10)}`,
            expire: moment().add(1, 'days').format("X")
        }
        await this.userAccessTokenModel.upsert(accessToken)

        // => accessToken
        return result(LOGIN_RESULT.SUCCESS, accessToken.token, accessToken.expire)
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
    async register({ role, status, from }) {

        let user = {
            role,
            status,
            from
        }

        user.id = await this.userModel.create(user)

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

        const result = (status, user) => {
            return {
                status,
                user
            }
        }

        // 1. 判断URL是否随便访问

        if (this.isAnyone(acl, url, method)) {
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

        let roleAcl = acl[role]

        if (!roleAcl) {
            error('ACL里没有找到对应的Role: %o', role)
            return false
        }

        for (let i = 0; i < roleAcl.length; i++) {

            let rule = roleAcl[i].split('|')
            let urlRule = rule[0]
            let methodRule = rule[1]

            let urlFlag = false
            let methodFlag = false

            // url 通配符 *
            if (is.include(urlRule, '*')) {
                urlFlag = this.validUrl(urlRule, url)
            } else {
                if (this.validEqual(urlRule, url)) urlFlag = true
            }

            // method 通配符 *
            if (is.include(methodRule, '*')) {
                methodFlag = true
            } else {
                if (this.validEqual(methodRule, method)) methodFlag = true

            }

            //
            if (urlFlag && methodFlag) return true
        }

        return false
    }

    validUrl(rule, url) {
        let pattern = '^' + rule.replace(/\//g, '\\/').replace(/\*/g, '.*')
        let regx = new RegExp(pattern)
        let pass = regx.test(url)
        return pass
    }

    /**
     * 把两个字符串变成小写字母，再比较是否相等
     * @param {String} a 
     * @param {String} b 
     * @returns {Boolean} true 相等，false 不等
     */
    validEqual(a, b) {
        return is.equal(a.toLowerCase(), b.toLowerCase())
    }

    /**
     * 验证是否是随便访问的
     * @param {*} acl 
     * @param {*} url 
     * @param {*} method 
     */
    isAnyone(acl, url, method) {
        return this.verify(acl, ROLE.ANYONE, url, method)
    }
}