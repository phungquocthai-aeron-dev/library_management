class PublisherDTO {
  constructor(publisherDoc) {
    if (!publisherDoc) return;

    this.id = publisherDoc._id;
    this.name = publisherDoc.name;
    this.address = publisherDoc.address;
  }
}

module.exports = PublisherDTO;
