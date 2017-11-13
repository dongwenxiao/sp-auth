import spModel from 'sp-model'

export default class UserAccessToken extends spModel {

    _table = 'dt_user_access_token'

    async upsert(userId) {

    }

}