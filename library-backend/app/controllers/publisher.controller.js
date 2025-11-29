const PublisherServiceClass = require("../services/publisher.service");
const ResponseDTO = require("../dtos/response.dto");
const MongoDB = require("../utils/mongodb.util");

let PublisherService = null;

class PublisherController {
  async init() {
    if (!PublisherService) {
      PublisherService = new PublisherServiceClass(MongoDB.client);
    }
  }

  async getAll(req, res) {
    try {
      const data = await publisherService.getAll();
      return res.json(
        ResponseDTO.success(data, "Lấy danh sách nhà xuất bản thành công")
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
      const data = await publisherService.getById(id);
      return res.json(
        ResponseDTO.success(data, "Lấy thông tin nhà xuất bản thành công")
      );
    } catch (err) {
      return res
        .status(404)
        .json(
          ResponseDTO.fail(
            { message: err.message },
            "Không tìm thấy nhà xuất bản"
          )
        );
    }
  }

  async create(req, res) {
    try {
      const data = await publisherService.create(req.body);
      return res
        .status(201)
        .json(ResponseDTO.success(data, "Thêm nhà xuất bản thành công"));
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
      const data = await publisherService.update(id, req.body);
      return res.json(
        ResponseDTO.success(data, "Cập nhật nhà xuất bản thành công")
      );
    } catch (err) {
      return res
        .status(404)
        .json(
          ResponseDTO.fail(
            { message: err.message },
            "Không tìm thấy nhà xuất bản"
          )
        );
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      await publisherService.delete(id);
      return res.json(ResponseDTO.success(null, "Xóa nhà xuất bản thành công"));
    } catch (err) {
      return res
        .status(404)
        .json(
          ResponseDTO.fail(
            { message: err.message },
            "Không tìm thấy nhà xuất bản"
          )
        );
    }
  }
}

module.exports = new PublisherController();
