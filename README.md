# sp-auth 权限管理


## MongoDB

```
用户表名： __sp_user

角色表名： __sp_role
```


## 权限管理页面

[/auth/admin/role](http://localhost:3000/auth/admin/role)


## 判断逻辑
```
- 无角色用户(1种角色)
    - 只能访问有配置好的无角色用户可访问的URL
- 有角色用户(n种角色)
    - 获取用户的角色(列表)
        - 只能访问角色列表匹配出来的URL
```

## 角色(均是小写字母)
- ```Admin``` 管理员，全部页面都可以访问
- ```Anyone[管理员配置]``` 匿名用户，可以访问未限制权限的URL
- ```User[管理员配置]``` 注册用户，管理员可以配置访问权限
- ```Custom[管理员配置]``` 自定义，管理员配置出来的角色

## 访问控制（TODO）

**未定义访问权限** : 

Anyone

**权限列表白名单** : 

Custom \ User

**用户访问限制黑名单** :

具体用户 \ IP



从 session 中获取 role

从 db 中获取 role-mapping-api