const BookDTO = require("../dtos/book.dto");
const fs = require("fs");
const path = require("path");
const BookRepository = require("../repositories/book.repository");
const PublisherRepository = require("../repositories/publisher.repository");

class BookService {
  constructor(client) {
    this.bookRepository = new BookRepository(client);
    this.publisherRepository = new PublisherRepository(client);
  }

  async getAll() {
    const books = await this.bookRepository.findAll({ isActive: true });
    return books.map((book) => new BookDTO(book));
  }

  async getById(id) {
    const book = await this.bookRepository.findById(id);
    if (!book || !book.isActive) throw new Error("Không tìm thấy sách");

    const publisher = await this.publisherRepository.findById(book.publisherId);
    book.publisher = publisher || null;

    return new BookDTO(book);
  }

  async create(data, file) {
    if (file) {
      const fileName = `book_${Date.now()}${path.extname(file.originalname)}`;
      const filePath = `/uploads/images/books/${fileName}`;
      fs.renameSync(file.path, path.join(__dirname, "../../", filePath));
      data.img = filePath;
    }
    data.isActive = true;
    const book = await this.bookRepository.create(data);
    return new BookDTO(book);
  }

  async update(id, data, file) {
    const existingBook = await this.getById(id);

    if (file) {
      if (existingBook.img) {
        const oldPath = path.join(__dirname, "../../", existingBook.img);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }

      const fileName = `book_${id}_${Date.now()}${path.extname(file.originalname)}`;
      const filePath = `/uploads/images/books/${fileName}`;
      fs.renameSync(file.path, path.join(__dirname, "../../", filePath));

      data.img = filePath;
    } else {
      delete data.img;
    }

    const updatedBook = await this.bookRepository.update(id, data);
    return new BookDTO(updatedBook);
  }

  async delete(id) {
    const book = await this.getById(id);
    await this.bookRepository.update(id, { isActive: false });
    return { success: true };
  }

  async hardDelete(id) {
    const book = await this.bookRepository.findById(id);
    if (book.img) {
      const imgPath = path.join(__dirname, "../../", book.img);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }
    await this.bookRepository.delete(id);
    return { success: true };
  }

  async search(query) {
    const { title, author } = query;
    const books = await this.bookRepository.findAll({ isActive: true });

    const filtered = books.filter((b) => {
      const matchTitle =
        title && b.title.toLowerCase().includes(title.toLowerCase());
      const matchAuthor =
        author && b.author.toLowerCase().includes(author.toLowerCase());

      return matchTitle || matchAuthor;
    });

    return filtered.map((b) => new BookDTO(b));
  }
}

module.exports = BookService;
