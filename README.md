# sp-auth 权限管理

是基于super-project的权限配置和访问控制模块，主要包含了：

 - ```user_access_token``` 创建和查找
 - ```ACL``` 判断逻辑

> 说明：<br>
> sp-auth 对用户的操作仅限于 userId 的创建和获取。<br>
> register() 方法是创建用户记录，返回 userId，这里没有其他的用户信息。<br>
> login() 是用 userId 换取 accessToken<br><br>
> sp-service-wx 是封装了微信登录授权相关的方法，逻辑：微信授权成功后用微信的openId去调用register() 创建 userId ，
> 后续登录调用 login() 返回 accessToken，客户端请求接口的时候在 header 里带上 AccessToken 做为凭证，
> 服务端利用 Koa 中间件做访问控制判断。

## 挂载middleware
```js
const acl = require('sp-auth/middleware')
const config = require('./config')
app.use(acl(config.acl, instance.authService))
```


## 使用service

```js
// file: User.js

import User from 'sp-auth/models/User'
export default class extends User {   
}
```

```js
// file: instance.js

import spMysql from 'sp-mysql'
import User from './models/User'
import AuthService from 'sp-auth/service'
import UserAccessToken from 'sp-auth/models/UserAccessToken'

const config = require('./config')
const mysql = new spMysql(config.mysql)


const userModel = new User(mysql)
const userAccessTokenModel = new UserAccessToken(mysql)

const authService = new AuthService()
authService.inject({ userModel, userAccessTokenModel })

export {
    mysql,
    userModel,
    authService
}
```

### register({ status, role }) => user
```js

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
    // ...
    return {
        id
        role,
        status,
        from
    }
}
```


### login(userId) => {code, accessToken}
```js
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

login(userId) {
    // ...
    return {
        code,
        accessToken
    }
}
```

## ACL Example

```js
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
```