class BookDTO {
  constructor(bookDoc) {
    if (!bookDoc) return;

    this.id = bookDoc._id;
    this.title = bookDoc.title;
    this.price = bookDoc.price;
    this.quantity = bookDoc.quantity;
    this.pubYear = bookDoc.pubYear;
    this.author = bookDoc.author;
    this.img = bookDoc.img;
    this.isActive = bookDoc.isActive;

    this.publisherId = bookDoc.publisherId;

    this.publisher = bookDoc.publisher || null;
  }
}

module.exports = BookDTO;
