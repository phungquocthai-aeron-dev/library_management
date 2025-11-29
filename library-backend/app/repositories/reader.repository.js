const { ObjectId } = require("mongodb");

class ReaderRepository {
  constructor(client) {
    this.collection = client.db().collection("reader");
  }

  async findById(id) {
    return await this.collection.findOne({ _id: new ObjectId(id) });
  }

  async findAll() {
    return await this.collection.find().toArray();
  }

  async create(reader) {
    const result = await this.collection.insertOne(reader);
    return await this.findById(result.insertedId);
  }

  async update(id, updateData) {
    await this.collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
    return await this.findById(id);
  }

  async delete(id) {
    return await this.collection.deleteOne({ _id: new ObjectId(id) });
  }
}

module.exports = ReaderRepository;
