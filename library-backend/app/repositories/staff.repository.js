const { ObjectId } = require("mongodb");

class StaffRepository {
  constructor(client) {
    this.collection = client.db().collection("staff");
  }

  async findById(id) {
    return await this.collection.findOne({ _id: new ObjectId(id) });
  }

  async findByPhone(phone) {
    return await this.collection.findOne({ phone });
  }

  async findAll() {
    return await this.collection.find().toArray();
  }

  async create(staff) {
    const result = await this.collection.insertOne(staff);
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

module.exports = StaffRepository;
