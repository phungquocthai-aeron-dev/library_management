const BookRepository = require("../repositories/book.repository");
const ReaderRepository = require("../repositories/reader.repository");
const CirculationDTO = require("../dtos/circulation.dto");
const CirculationRepository = require("../repositories/circulation.repository");

class CirculationService {
  constructor(client) {
    this.bookRepository = new BookRepository(client);
    this.readerRepository = new ReaderRepository(client);
    this.circulationRepository = new CirculationRepository(client);
  }

  async borrowBook(readerId, bookId, borrowDate, dueDate) {
    const book = await this.bookRepository.findById(bookId);
    const reader = await this.readerRepository.findById(readerId);

    if (!book) throw new Error("Không tìm thấy sách");
    if (!reader) throw new Error("Không tìm thấy độc giả");

    if (book.quantity <= 0) throw new Error("Sách đã hết");
    if (reader.creditScore <= 0 || !reader.isActive)
      throw new Error("Không đủ điểm tín nhiệm để mượn");

    // Cập nhật số lượng sách -1
    await this.bookRepository.update(bookId, { quantity: book.quantity - 1 });
    // Cập nhật điểm tín nhiệm reader -1
    await this.readerRepository.update(readerId, {
      creditScore: reader.creditScore - 1,
    });

    const circulation = {
      readerId,
      bookId,
      borrowDate,
      dueDate,
      returnDate: null,
      status: "BORROWED",
    };

    const created = await this.circulationRepository.create(circulation);
    return new CirculationDTO(created);
  }

  async returnBook(circulationId, returnDate = new Date()) {
    const circulation =
      await this.circulationRepository.findById(circulationId);

    if (!circulation) throw new Error("Không tìm thấy phiếu mượn");

    if (circulation.status === "RETURNED") {
      throw new Error("Sách này đã được trả trước đó");
    }

    const book = await this.bookRepository.findById(circulation.bookId);
    const reader = await this.readerRepository.findById(circulation.readerId);

    // Cập nhật số lượng sách +1
    await this.bookRepository.update(book.id, { quantity: book.quantity + 1 });

    // Tính số ngày trả muộn
    const due = new Date(circulation.dueDate);
    const lateDays = Math.floor((returnDate - due) / (1000 * 60 * 60 * 24));

    let newCreditScore = reader.creditScore + 1;
    if (lateDays > 30) newCreditScore -= 1;

    await this.readerRepository.update(reader._id, {
      creditScore: newCreditScore,
    });

    // Cập nhật circulation
    const updated = await this.circulationRepository.update(circulationId, {
      returnDate,
      status: "RETURNED",
    });

    return new CirculationDTO(updated);
  }

  async findOverdue() {
    const docs = await this.circulationRepository.findOverdue();
    return docs.map((doc) => new CirculationDTO(doc));
  }
}

module.exports = CirculationService;
