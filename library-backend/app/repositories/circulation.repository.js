const { ObjectId } = require("mongodb");

class CirculationRepository {
  constructor(client) {
    this.collection = client.db().collection("circulation");
  }

  async findAll() {
    const docs = await this.collection
      .aggregate([
        // --- READER LOOKUP ---
        {
          $lookup: {
            from: "reader",
            let: { readerIdStr: "$readerId" },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$_id", { $toObjectId: "$$readerIdStr" }] },
                },
              },
              { $project: { password: 0 } },
            ],
            as: "reader",
          },
        },

        // --- BOOK LOOKUP ---
        {
          $lookup: {
            from: "book",
            let: { bookIdStr: "$bookId" },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$_id", { $toObjectId: "$$bookIdStr" }] },
                },
              },
            ],
            as: "book",
          },
        },

        // --- STAFF LOOKUP ---
        // --- STAFF LOOKUP ---
        {
          $lookup: {
            from: "staff",
            let: { staffIdStr: "$staffId" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: [
                      "$_id",
                      {
                        $convert: {
                          input: "$$staffIdStr",
                          to: "objectId",
                          onError: null,
                          onNull: null,
                        },
                      },
                    ],
                  },
                },
              },
              { $project: { password: 0 } },
            ],
            as: "staff",
          },
        },

        { $unwind: { path: "$reader", preserveNullAndEmptyArrays: true } },
        { $unwind: { path: "$book", preserveNullAndEmptyArrays: true } },
        { $unwind: { path: "$staff", preserveNullAndEmptyArrays: true } },
      ])
      .toArray();

    return docs.map((doc) => ({
      id: doc._id,
      readerId: doc.readerId,
      bookId: doc.bookId,
      borrowDate: doc.borrowDate,
      dueDate: doc.dueDate,
      returnDate: doc.returnDate || null,
      status: doc.status,
      reader: doc.reader || null,
      book: doc.book || null,
      staff: doc.staff || null,
    }));
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

  async findByReaderId(readerId) {
    const docs = await this.collection
      .aggregate([
        { $match: { readerId } },
        {
          $lookup: {
            from: "book",
            let: { bookIdStr: "$bookId" },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$_id", { $toObjectId: "$$bookIdStr" }] },
                },
              },
            ],
            as: "book",
          },
        },
      ])
      .toArray();

    return docs;
  }
}

module.exports = CirculationRepository;
