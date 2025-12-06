const AuthServiceClass = require("../services/auth.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../errors/api-error");

let AuthService = null;

class AuthController {
  async init() {
    if (!AuthService) {
      AuthService = new AuthServiceClass(MongoDB.client);
    }
  }

  async registerReader(req, res, next) {
    try {
      const data = req.body;
      const userDTO = await AuthService.registerReader(data);
      res.status(201).json({
        message: "Đăng ký độc giả thành công",
        user: userDTO,
      });
    } catch (err) {
      next(new ApiError(400, err.message));
    }
  }

  async registerStaff(req, res, next) {
    try {
      const data = req.body;
      const userDTO = await AuthService.registerStaff(data);
      res.status(201).json({
        message: "Đăng ký nhân viên thành công",
        user: userDTO,
      });
    } catch (err) {
      next(new ApiError(400, err.message));
    }
  }

  async loginReader(req, res, next) {
    try {
      const { phone, password } = req.body;
      const userDTO = await AuthService.loginReader(req, phone, password);

      req.session.user = {
        id: userDTO.id,
        type: "reader",
      };

      req.session.save(() => {
        res.json({
          message: "Đăng nhập thành công",
          user: userDTO,
          session: req.session.user,
        });
      });
    } catch (e) {
      next(new ApiError(400, e.message));
    }
  }

  async loginStaff(req, res, next) {
    try {
      const { phone, password } = req.body;
      const userDTO = await AuthService.loginStaff(req, phone, password);

      req.session.user = {
        id: userDTO.id,
        type: "staff",
      };

      req.session.save(() => {
        res.json({
          message: "Đăng nhập thành công",
          user: userDTO,
          session: req.session.user,
        });
      });
    } catch (e) {
      next(new ApiError(400, e.message));
    }
  }

  async logout(req, res, next) {
    try {
      await AuthService.logout(req);
      res.json({ message: "Đăng xuất thành công" });
    } catch (error) {
      next(new ApiError(500, error.message));
    }
  }

  async activateReader(req, res, next) {
    try {
      const { id } = req.params;
      const updated = await AuthService.activateReader(id);
      res.json({ message: "Kích hoạt độc giả thành công", user: updated });
    } catch (err) {
      next(new ApiError(400, err.message));
    }
  }

  async deactivateReader(req, res, next) {
    try {
      const { id } = req.params;
      const updated = await AuthService.deactivateReader(id);
      res.json({ message: "Vô hiệu hóa độc giả thành công", user: updated });
    } catch (err) {
      next(new ApiError(400, err.message));
    }
  }

  async activateStaff(req, res, next) {
    try {
      const { id } = req.params;
      const updated = await AuthService.activateStaff(id);
      res.json({ message: "Kích hoạt nhân viên thành công", user: updated });
    } catch (err) {
      next(new ApiError(400, err.message));
    }
  }

  async deactivateStaff(req, res, next) {
    try {
      const { id } = req.params;
      const updated = await AuthService.deactivateStaff(id);
      res.json({ message: "Vô hiệu hóa nhân viên thành công", user: updated });
    } catch (err) {
      next(new ApiError(400, err.message));
    }
  }

  async updateRoleStaff(req, res, next) {
    try {
      const { id } = req.params;
      const { role } = req.body;
      const updated = await AuthService.updateRoleStaff(id, role);
      res.json({
        message: "Cập nhật vai trò nhân viên thành công",
        user: updated,
      });
    } catch (err) {
      next(new ApiError(400, err.message));
    }
  }

  async updateReader(req, res, next) {
    try {
      const userId = req.session.user.id;
      const updateData = req.body;
      const updated = await AuthService.updateReader(userId, updateData);
      res.json({ message: "Cập nhật độc giả thành công", user: updated });
    } catch (err) {
      next(new ApiError(400, err.message));
    }
  }

  async updatePasswordReader(req, res, next) {
    try {
      const userId = req.session.user.id;
      const { oldPassword, newPassword } = req.body;
      const updated = await AuthService.updatePasswordReader(
        userId,
        oldPassword,
        newPassword
      );
      res.json({
        message: "Cập nhật mật khẩu độc giả thành công",
        user: updated,
      });
    } catch (err) {
      next(new ApiError(400, err.message));
    }
  }

  async updateStaff(req, res, next) {
    try {
      const userId = req.session.user.id;
      const updateData = req.body;
      const updated = await AuthService.updateStaff(userId, updateData);
      res.json({ message: "Cập nhật nhân viên thành công", user: updated });
    } catch (err) {
      next(new ApiError(400, err.message));
    }
  }

  async updatePasswordStaff(req, res, next) {
    try {
      const userId = req.session.user.id;
      const { oldPassword, newPassword } = req.body;
      const updated = await AuthService.updatePasswordStaff(
        userId,
        oldPassword,
        newPassword
      );
      res.json({
        message: "Cập nhật mật khẩu nhân viên thành công",
        user: updated,
      });
    } catch (err) {
      next(new ApiError(400, err.message));
    }
  }
}

module.exports = new AuthController();
