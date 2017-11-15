# sp-auth 权限管理

是基于super-project的权限配置和访问控制模块，主要包含了：

 - ```user_access_token``` 创建和查找
 - ```ACL``` 判断逻辑

## 挂载middleware
```js
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