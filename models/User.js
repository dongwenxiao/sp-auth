import spModel from 'sp-model'

export default class User extends spModel {

    _table = 'dt_user'

    /**
     * 在acl判断的时候使用此方法
     * @param {*} accessToken 
     */
    async getUserByAccessToken(accessToken) {

        let sql = `
            SELECT b.id AS id, b.status, b.role, b.from, b.create_time, b.update_time
            FROM dt_user_access_token a
            LEFT JOIN dt_user b 
            ON a.user_id = b.id
            WHERE a.token = '${accessToken}'
        `

        let [result] = await this.mysql.query(sql)

        return this.returnOne(result)
    }

}