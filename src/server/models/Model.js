export default class Model {

    static configCollection(collection) {
        this.collection = collection
    }

    static configDAO(dao) {
        this.dao = dao
    }

    static async get(selecter = {}) {
        return await this.dao.find(this.collection, selecter)
    }

    static async add(model) {
        return await this.dao.insert(this.collection, model)
    }

    static async update(selecter, model, option) {
        return await this.dao.update(this.collection, selecter, model, option)
    }

    static async delete(selecter) {
        return await this.dao.delete(this.collection, selecter)
    }

}