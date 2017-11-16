module.exports = {

    /**
     * 用户状态
     */
    USER_STATUS: {
        ENABLE: 1, // 可用
        DISABLE: 0 // 禁用
    },

    /**
     * 用户角色
     */
    ROLE: {
        ANYONE: 'ANYONE', // 任何人

        ADMIN: 'ADMIN', // 管理员
        SUPER_ADMIN: 'SUPER_ADMIN', //超级管理员

        USER: 'USER', // 普通用户
        VIP: 'VIP', // 会员用户

        OPERATOR: 'OPERATOR' // 运营员 
    },

    /**
     * 登录判断结果
     */
    LOGIN_RESULT: {
        SUCCESS: 1, // 成功

        EXPIRED: 2, // 过期
        DISABLED: 3, // 禁用

        NOT_EXIST: 4 // 不存在
    },


    /**
     * ACL 验证结果（中间件处理时候使用）
     */
    ACL_VERIFY: {
        PASS: 'PASS', // 验证通过
        FORBIDDEN: 'FORBIDDEN', // 无权限访问
        DISABLED: 'DISABLED', // 用户被禁用
        NO_ACCESS_TOKEN: 'NO_ACCESS_TOKEN', // 没有access_token
        USER_NOT_EXIST: 'USER_NOT_EXIST' // 用户不存在
    },

    /**
     * 用户是从哪里注册过了的
     */
    REGISTER_FROM: {
        WX: 'wechat', // 微信
        QQ: 'qq', // QQ
        PHONE: 'phone', // 手机号
        EMAIL: 'email', // 邮箱
        WEIBO: 'weibo', // 新浪微博
        GITHUB: 'github', // Github
        FACEBOOK: 'facebook' // Facebook
    }

}