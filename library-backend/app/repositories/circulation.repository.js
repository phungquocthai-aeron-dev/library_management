const { ObjectId } = require("mongodb");

class CirculationRepository {
  constructor(client) {
    this.collection = client.db().collection("circulation");
  }

  async findAll() {
    const docs = await this.collection.find().toArray();
    return docs.map((doc) => ({ id: doc._id, ...doc }));
  }

  async findById(id) {
    const doc = await this.collection.findOne({ _id: new ObjectId(id) });
    return doc ? { id: doc._id, ...doc } : null;
  }

  async create(circulation) {
    const result = await this.collection.insertOne(circulation);
    return await this.findById(result.insertedId);
  }

  async update(id, data) {
    await this.collection.updateOne({ _id: new ObjectId(id) }, { $set: data });
    return await this.findById(id);
  }

  async delete(id) {
    return await this.collection.deleteOne({ _id: new ObjectId(id) });
  }

  async findOverdue() {
    const now = new Date();
    const docs = await this.collection
      .aggregate([
        { $match: { dueDate: { $lt: now }, status: "BORROWED" } },
        {
          $lookup: {
            from: "reader",
            localField: "readerId",
            foreignField: "_id",
            as: "reader",
          },
        },
        {
          $lookup: {
            from: "book",
            localField: "bookId",
            foreignField: "_id",
            as: "book",
          },
        },
      ])
      .toArray();
    return docs;
  }
}

module.exports = CirculationRepository;
