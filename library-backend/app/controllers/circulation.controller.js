const CirculationServiceClass = require("../services/circulation.service");
const ResponseDTO = require("../dtos/response.dto");
const MongoDB = require("../utils/mongodb.util");

let CirculationService = null;

class CirculationController {
  async init() {
    if (!CirculationService) {
      CirculationService = new CirculationServiceClass(MongoDB.client);
    }
  }

  async borrowBook(req, res) {
    try {
      const { readerId, bookId, borrowDate, dueDate } = req.body;
      const data = await CirculationService.borrowBook(
        readerId,
        bookId,
        new Date(borrowDate),
        new Date(dueDate)
      );
      res.status(201).json(ResponseDTO.success(data, "Mượn sách thành công"));
    } catch (err) {
      res
        .status(400)
        .json(ResponseDTO.fail({ message: err.message }, "Lỗi mượn sách"));
    }
  }

  async confirmBorrow(req, res) {
    try {
      const { circulationId } = req.body;
      const data = await CirculationService.confirmBorrow(circulationId);
      res.json(ResponseDTO.success(data, "Xác nhận mượn sách thành công"));
    } catch (err) {
      res
        .status(400)
        .json(ResponseDTO.fail({ message: err.message }, "Lỗi xác nhận mượn"));
    }
  }

  async returnBook(req, res) {
    try {
      const { circulationId, returnDate } = req.body;
      const data = await CirculationService.returnBook(
        circulationId,
        returnDate ? new Date(returnDate) : new Date()
      );
      res.json(ResponseDTO.success(data, "Trả sách thành công"));
    } catch (err) {
      res
        .status(400)
        .json(ResponseDTO.fail({ message: err.message }, "Lỗi trả sách"));
    }
  }

  async cancelBorrow(req, res) {
    try {
      const { circulationId } = req.body;
      const data = await CirculationService.cancelBorrow(circulationId);
      res.json(ResponseDTO.success(data, "Hủy mượn sách thành công"));
    } catch (err) {
      res
        .status(400)
        .json(ResponseDTO.fail({ message: err.message }, "Lỗi hủy mượn"));
    }
  }

  async findOverdue(req, res) {
    try {
      const data = await CirculationService.findOverdue();
      res.json(ResponseDTO.success(data, "Danh sách sách quá hạn"));
    } catch (err) {
      res
        .status(500)
        .json(ResponseDTO.fail({ message: err.message }, "Lỗi server"));
    }
  }

  async getByReader(req, res) {
    try {
      const { readerId } = req.params;
      const data = await CirculationService.findByReader(readerId);
      res.json(ResponseDTO.success(data, "Danh sách phiếu mượn của độc giả"));
    } catch (err) {
      res
        .status(400)
        .json(ResponseDTO.fail({ message: err.message }, "Lỗi tìm phiếu mượn"));
    }
  }
}

module.exports = new CirculationController();
