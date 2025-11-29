class CirculationDTO {
  constructor(circulationDoc) {
    if (!circulationDoc) return;

    this.id = circulationDoc._id;
    this.readerId = circulationDoc.readerId;
    this.bookId = circulationDoc.bookId;
    this.borrowDate = circulationDoc.borrowDate;
    this.dueDate = circulationDoc.dueDate;
    this.returnDate = circulationDoc.returnDate;
    this.status = circulationDoc.status;

    this.reader = circulationDoc.reader ? circulationDoc.reader[0] : null;
    this.book = circulationDoc.book ? circulationDoc.book[0] : null;
  }
}

module.exports = CirculationDTO;
