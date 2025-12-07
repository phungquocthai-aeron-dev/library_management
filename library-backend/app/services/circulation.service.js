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

  async getAll() {
    return await this.circulationRepository.findAll();
  }

  async borrowBook(readerId, bookId, borrowDate, dueDate) {
    const book = await this.bookRepository.findById(bookId);
    const reader = await this.readerRepository.findById(readerId);
    if (!book) throw new Error("Không tìm thấy sách");
    if (!reader) throw new Error("Không tìm thấy độc giả");
    if (book.quantity <= 0) throw new Error("Sách đã hết");
    if (reader.creditScore <= 0 || !reader.isActive)
      throw new Error("Không đủ điểm tín nhiệm để mượn");

    await this.bookRepository.update(book.id, { quantity: book.quantity - 1 });
    await this.readerRepository.update(reader._id, {
      creditScore: reader.creditScore - 1,
    });

    const circulation = {
      readerId,
      bookId,
      borrowDate,
      dueDate,
      returnDate: null,
      status: "PENDING",
    };

    const created = await this.circulationRepository.create(circulation);
    return new CirculationDTO(created);
  }

  async approveBorrow(circulationId, staffId) {
    const circulation =
      await this.circulationRepository.findById(circulationId);
    if (!circulation) throw new Error("Không tìm thấy phiếu mượn");

    if (circulation.status !== "PENDING")
      throw new Error("Chỉ phiếu mượn PENDING mới được duyệt");
    console.error(staffId);
    console.log("AA");
    const updated = await this.circulationRepository.update(circulationId, {
      staffId,
      status: "CONFIRMED",
    });

    return new CirculationDTO(updated);
  }

  async confirmBorrow(circulationId) {
    const circulation =
      await this.circulationRepository.findById(circulationId);
    if (!circulation) throw new Error("Không tìm thấy phiếu mượn");

    if (circulation.status !== "CONFIRMED")
      throw new Error("Chỉ có phiếu mượn CONFIRMED mới được nhận sách");

    const updated = await this.circulationRepository.update(circulationId, {
      status: "BORROWED",
    });

    return new CirculationDTO(updated);
  }

  async returnBook(circulationId, returnDate = new Date()) {
    const circulation =
      await this.circulationRepository.findById(circulationId);
    if (!circulation) throw new Error("Không tìm thấy phiếu mượn");
    if (circulation.status !== "BORROWED")
      throw new Error("Chỉ có phiếu mượn BORROWED mới được trả");
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
    const updated = await this.circulationRepository.update(circulationId, {
      returnDate,
      status: "RETURNED",
    });
    return new CirculationDTO(updated);
  }

  async cancelBorrow(circulationId) {
    const circulation =
      await this.circulationRepository.findById(circulationId);
    if (!circulation) throw new Error("Không tìm thấy phiếu mượn");

    if (circulation.status === "CANCELED")
      throw new Error("Phiếu mượn đã bị hủy");

    if (
      circulation.status === "CONFIRMED" ||
      circulation.status === "PENDING"
    ) {
      // Hoàn trả lại sách
      const book = await this.bookRepository.findById(circulation.bookId);
      const reader = await this.readerRepository.findById(circulation.readerId);

      await this.bookRepository.update(book.id, {
        quantity: book.quantity + 1,
      });

      // Hoàn trả điểm tín nhiệm +1
      await this.readerRepository.update(reader._id, {
        creditScore: reader.creditScore + 1,
      });

      const updated = await this.circulationRepository.update(circulationId, {
        status: "CANCELED",
        returnDate: new Date(),
      });

      return new CirculationDTO(updated);
    }

    throw new Error("Không thể hủy phiếu mượn ở trạng thái hiện tại");
  }

  async findOverdue() {
    const docs = await this.circulationRepository.findOverdue();
    return docs.map((doc) => new CirculationDTO(doc));
  }

  async findByReader(readerId) {
    const docs = await this.circulationRepository.findByReaderId(readerId);
    return docs.map((doc) => new CirculationDTO(doc));
  }
}

module.exports = CirculationService;
