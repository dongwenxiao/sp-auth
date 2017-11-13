const ENUM = require('../enum')
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
                code: code || ENUM.LOGIN_RESULT.SUCCESS,
                accessToken: token || ''
            }
        }

        // 获取用户信息
        let user = await this.userModel.getUserById(userId)

        // 判断用户是否可用
        if (user.status == ENUM.USER_STATUS.DISABLE)
            return result(ENUM.LOGIN_RESULT.DISABLED)

        // upsert(插入或更新)用户的access_token
        const userAccessToken = {
            user_id: userId,
            token: `${md5(moment().format('X'))}.${randomString(10)}`,
            expire: moment().add(1, 'days').format("X")
        }
        await this.userAccessTokenModel.upsert(userId, userAccessToken)

        // => accessToken
        return result(ENUM.LOGIN_RESULT.SUCCESS, userAccessToken.token)
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
}