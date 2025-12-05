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

    this.reader = circulationDoc.reader || null;
    this.book = circulationDoc.book || null;
  }
}

module.exports = CirculationDTO;
