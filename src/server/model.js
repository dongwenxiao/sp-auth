import { DATA_TYPE, REGISTER_TYPE } from './constants'
import { spMongoDB } from 'sp-mongo'

export const Struct = {
    user: {
        // base
        username: { type: DATA_TYPE.string },
        password: { type: DATA_TYPE.string },
        role: { type: DATA_TYPE.string },
        // unique
        email: { type: DATA_TYPE.string },
        phone: { type: DATA_TYPE.string },
        // wx
        wx_openid: { type: DATA_TYPE.string },
        wx_info: { type: DATA_TYPE.object }
    }
}

export class User {

    constructor() {

    }

    register(data) {
        if (data.type === REGISTER_TYPE.username) {} // 唯一验证
        if (data.type === REGISTER_TYPE.email) {} // 发送邮件验证链接
        if (data.type === REGISTER_TYPE.phone) {} // 发送验证码
        if (data.type === REGISTER_TYPE.wx) {} // URL跳转


        

    }

    login(data) {}

    forgot(data) {}

}