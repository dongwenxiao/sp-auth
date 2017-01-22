import Model from './Model'

class Role extends Model {

    constructor({ apis, name }) {

        const ROLE_COLLECTION_NAME = 'role'
        super(ROLE_COLLECTION_NAME)

        this.name = name
        this.apis = apis
    }


}