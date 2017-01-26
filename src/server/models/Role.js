import Model from './Model'

export default class Role extends Model {

    constructor({ apis, name }) {

        // const ROLE_COLLECTION_NAME = 'role'
        // super(ROLE_COLLECTION_NAME)

        super()

        this.name = name
        this.apis = apis
    }
}