class ReaderDTO {
  constructor(readerDoc) {
    if (!readerDoc) return;

    this.id = readerDoc._id;
    this.fullName = readerDoc.fullName;
    this.birthDate = readerDoc.birthDate;
    this.gender = readerDoc.gender;
    this.address = readerDoc.address;
    this.phone = readerDoc.phone;
    this.creditScore = readerDoc.creditScore;
    this.isActive = readerDoc.isActive;
  }
}

module.exports = ReaderDTO;
