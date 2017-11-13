# sp-auth 权限管理

是基于super-project的权限配置和访问控制模块，主要包含了：

 - ```user_access_token``` 创建和查找
 - ```ACL``` 判断逻辑

## 挂载middleware

## 挂载router

## 使用service

### register({ status, role })

### login(userId)

## ACL Example

```js
// acl 配置样例
// 黑名单和白名单结构一样

module.exports = {
    ANYONE: [
        '/login|all',
        '/register|get',
        '/register|post',
        '/forget|get'
    ],
    ADMIN: [
        '/dashboard|all',
        '/report|all',
        '/account/*|get'
    ]
}
```