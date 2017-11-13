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
    }
}