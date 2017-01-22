import Model from './Model'


export default class User extends Model {

    constructor({
        id,
        username,
        password,
        role,
        email,
        phone,
        wx_openid,
        wx_info
    }) {

        const USER_COLLECTION_NAME = 'user'
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
}