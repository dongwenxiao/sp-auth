export default class Model {

    constructor(collection) {
        this.collection = collection
    }

    static configDAO(dao) {
        this.dao = dao
    }

    static async get(selecter) {
        return await this.dao.find(collection, selecter)
    }

    static async add(user) {
        return await this.dao.insert(collection, user)
    }

    static async update(user, selecter, user, option) {
        return await this.dao.update(collection, selecter, user, option)
    }

    static async delete(selecter) {
        return await this.dao.delete(collection, selecter)
    }

}