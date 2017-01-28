# sp-auth 权限管理

## 角色 
- ```Admin``` 管理员，全部页面都可以访问
- ```Custom[管理员配置]``` 自定义，管理员配置出来的角色
- ```User[管理员配置]``` 注册用户，管理员可以配置访问权限
- ```Anyone[管理员配置]``` 匿名用户，可以访问未限制权限的URL

## 访问控制（URL）

**未定义访问权限** : 

Anyone

**权限列表白名单** : 

Custom \ User

**用户访问限制黑名单** :

具体用户 \ IP
