const BookServiceClass = require("../services/book.service");
const ResponseDTO = require("../dtos/response.dto");
const MongoDB = require("../utils/mongodb.util");

let BookService = null;

class BookController {
  async init() {
    if (!BookService) {
      BookService = new BookServiceClass(MongoDB.client);
    }
  }

  async getAll(req, res) {
    try {
      const data = await bookService.getAll();
      return res.json(
        ResponseDTO.success(data, "Lấy danh sách sách thành công")
      );
    } catch (err) {
      return res
        .status(500)
        .json(ResponseDTO.fail({ message: err.message }, "Lỗi server"));
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const data = await bookService.getById(id);
      return res.json(
        ResponseDTO.success(data, "Lấy thông tin sách thành công")
      );
    } catch (err) {
      return res
        .status(404)
        .json(
          ResponseDTO.fail({ message: err.message }, "Không tìm thấy sách")
        );
    }
  }

  async create(req, res) {
    try {
      const data = await bookService.create(req.body, req.file);
      return res
        .status(201)
        .json(ResponseDTO.success(data, "Thêm sách thành công"));
    } catch (err) {
      return res
        .status(400)
        .json(
          ResponseDTO.fail({ message: err.message }, "Dữ liệu không hợp lệ")
        );
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const data = await bookService.update(id, req.body, req.file);
      return res.json(ResponseDTO.success(data, "Cập nhật sách thành công"));
    } catch (err) {
      return res
        .status(400)
        .json(ResponseDTO.fail({ message: err.message }, "Cập nhật thất bại"));
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const result = await bookService.delete(id);
      return res.json(
        ResponseDTO.success(result, "Xóa sách thành công (soft delete)")
      );
    } catch (err) {
      return res
        .status(404)
        .json(
          ResponseDTO.fail({ message: err.message }, "Không tìm thấy sách")
        );
    }
  }

  async hardDelete(req, res) {
    try {
      const { id } = req.params;
      const result = await bookService.hardDelete(id);
      return res.json(
        ResponseDTO.success(result, "Xóa sách hoàn toàn thành công")
      );
    } catch (err) {
      return res
        .status(404)
        .json(
          ResponseDTO.fail({ message: err.message }, "Không tìm thấy sách")
        );
    }
  }

  async search(req, res) {
    try {
      const data = await bookService.search(req.query);
      return res.json(ResponseDTO.success(data, "Kết quả tìm kiếm"));
    } catch (err) {
      return res
        .status(500)
        .json(ResponseDTO.fail({ message: err.message }, "Lỗi server"));
    }
  }
}

module.exports = new BookController();
