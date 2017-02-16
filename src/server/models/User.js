import Model from 'sp-model'

const USER_COLLECTION_NAME = 'user'

export default class User extends Model {

    constructor({ id, username, password, role, email, phone, wx_openid, wx_info }) {


        super(USER_COLLECTION_NAME)

        this.id = id
        this.username = username
        this.password = password
        this.role = role
        this.email = email
        this.phone = phone
        this.wx_openid = wx_openid
        this.wx_info = wx_info
    }

    static async login(query, password) {

        const db = await this.dao.getDB()
        const col = await db.collection(USER_COLLECTION_NAME)
        const cursor = col.find(query)
        const users = await cursor.toArray()
        db.close()

        // 登录用户未找到
        if (users.length === 0) {
            return null
        }

        // 登录用户密码错误
        const user = users[0]
        if (user.password !== password) {
            return false
        }

        // 登录成功
        return user
    }

    static async loginByEmail(email, password) {
        return await this.login({ email }, password)
    }

    static async loginByUsername(username, password) {
        return await this.login({ username }, password)
    }

    static async loginByPhone(phone, password) {
        return await this.login({ phone }, password)
    }


}