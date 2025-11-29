const { ObjectId } = require("mongodb");

class BookRepository {
  constructor(client) {
    this.collection = client.db().collection("book");
  }

  async findAll() {
    const docs = await this.collection.find().toArray();
    return docs.map((doc) => ({ id: doc._id, ...doc }));
  }

  async findById(id) {
    const doc = await this.collection.findOne({ _id: new ObjectId(id) });
    return doc ? { id: doc._id, ...doc } : null;
  }

  async create(book) {
    const result = await this.collection.insertOne(book);
    return await this.findById(result.insertedId);
  }

  async update(id, data) {
    await this.collection.updateOne({ _id: new ObjectId(id) }, { $set: data });
    return await this.findById(id);
  }

  async delete(id) {
    return await this.collection.deleteOne({ _id: new ObjectId(id) });
  }

  async search(query) {
    const regex = new RegExp(query, "i");
    const docs = await this.collection
      .find({
        isActive: true,
        $or: [{ title: regex }, { author: regex }],
      })
      .toArray();
    return docs.map((doc) => ({ id: doc._id, ...doc }));
  }
}

module.exports = BookRepository;
