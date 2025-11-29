const { ObjectId } = require("mongodb");

class PublisherRepository {
  constructor(client) {
    this.collection = client.db().collection("publisher");
  }

  async findAll() {
    return await this.collection.find().toArray();
  }

  async findById(id) {
    return await this.collection.findOne({ _id: new ObjectId(id) });
  }

  async create(publisher) {
    const result = await this.collection.insertOne(publisher);
    return await this.findById(result.insertedId);
  }

  async update(id, data) {
    await this.collection.updateOne({ _id: new ObjectId(id) }, { $set: data });
    return await this.findById(id);
  }

  async delete(id) {
    return await this.collection.deleteOne({ _id: new ObjectId(id) });
  }
}

module.exports = PublisherRepository;
