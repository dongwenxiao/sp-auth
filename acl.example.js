// acl 配置样例
// 黑名单和白名单结构一样

module.exports = {
    ANYONE: [
        '/login|*',
        '/register|get',
        '/register|post',
        '/forget|get'
    ],
    ADMIN: [
        '/dashboard|*',
        '/report|*',
        '/account/*|get'
    ]
}