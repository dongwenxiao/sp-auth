import spModel from 'sp-model'
const moment = require('moment')

export default class UserAccessToken extends spModel {

    _table = 'dt_user_access_token'

    async upsert(accessToken) {

        let update_time = moment().format('X')
        let create_time = update_time

        let { expire, token, userId } = accessToken

        let sql = `
            INSERT INTO dt_user_access_token
                (user_id, token, \`expire\`, create_time, update_time)
            VALUES 
                ( ${userId} , '${token}' , ${expire} , ${create_time} , ${update_time} )
            ON DUPLICATE KEY UPDATE
                token = '${token}',
                update_time = ${update_time}
        `

        let [result] = await this.mysql.query(sql)

        return result.affectedRows

    }

}