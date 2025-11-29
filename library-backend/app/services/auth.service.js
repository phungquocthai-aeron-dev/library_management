const ReaderRepository = require("../repositories/reader.repository");
const StaffRepository = require("../repositories/staff.repository");
const ReaderDTO = require("../dtos/reader.dto");
const StaffDTO = require("../dtos/staff.dto");
const bcryptUtil = require("../utils/bcrypt");

class AuthService {
  constructor(client) {
    this.readerRepository = new ReaderRepository(client);
    this.staffRepository = new StaffRepository(client);
  }
  // -------------------- Login --------------------
  async loginReader(req, id, password) {
    const user = await this.readerRepository.findById(id);
    if (!user) throw new Error("Độc giả không tồn tại");
    if (!user.isActive) throw new Error("Tài khoản đang bị vô hiệu hóa");

    const isMatch = await bcryptUtil.compare(password, user.password);
    if (!isMatch) throw new Error("Sai mật khẩu");

    req.session.user = {
      type: "reader",
      id: user._id,
    };

    return new ReaderDTO(user);
  }

  async loginStaff(req, id, password) {
    const user = await this.staffRepository.findById(id);
    if (!user) throw new Error("Nhân viên không tồn tại");
    if (!user.isActive) throw new Error("Tài khoản đang bị vô hiệu hóa");

    const isMatch = await bcryptUtil.compare(password, user.password);
    if (!isMatch) throw new Error("Sai mật khẩu");

    req.session.user = {
      type: "staff",
      id: user._id,
      role: user.role,
    };

    return new StaffDTO(user);
  }

  // -------------------- Logout --------------------
  async logout(req) {
    return new Promise((resolve) => {
      req.session.destroy(() => resolve(true));
    });
  }

  // -------------------- Update Info --------------------
  async updateReader(id, updateData) {
    const updated = await this.readerRepository.update(id, updateData);
    return new ReaderDTO(updated);
  }

  async updateStaff(id, updateData) {
    const updated = await this.staffRepository.update(id, updateData);
    return new StaffDTO(updated);
  }

  // -------------------- Update Password --------------------
  async updatePasswordReader(id, oldPassword, newPassword) {
    const user = await this.readerRepository.findById(id);
    if (!user) throw new Error("Độc giả không tồn tại");

    const isMatch = await bcryptUtil.compare(oldPassword, user.password);
    if (!isMatch) throw new Error("Mật khẩu cũ không đúng");

    const hashed = await bcryptUtil.hash(newPassword);
    const updated = await this.readerRepository.update(id, {
      password: hashed,
    });
    return new ReaderDTO(updated);
  }

  async updatePasswordStaff(id, oldPassword, newPassword) {
    const user = await this.staffRepository.findById(id);
    if (!user) throw new Error("Nhân viên không tồn tại");

    const isMatch = await bcryptUtil.compare(oldPassword, user.password);
    if (!isMatch) throw new Error("Mật khẩu cũ không đúng");

    const hashed = await bcryptUtil.hash(newPassword);
    const updated = await this.staffRepository.update(id, { password: hashed });
    return new StaffDTO(updated);
  }

  // -------------------- Register --------------------
  async registerReader(data) {
    const hashedPassword = await bcryptUtil.hash(data.password);
    const newReader = {
      ...data,
      password: hashedPassword,
      isActive: true, // mặc định active
      creditScore: data.creditScore ?? 10, // mặc định 10 điểm tín nhiệm
    };
    const created = await this.readerRepository.create(newReader);
    return new ReaderDTO(created);
  }

  async registerStaff(data) {
    const hashedPassword = await bcryptUtil.hash(data.password);
    const newStaff = {
      ...data,
      password: hashedPassword,
      isActive: true, // mặc định active
    };
    const created = await this.staffRepository.create(newStaff);
    return new StaffDTO(created);
  }

  // -------------------- Enable / Disable User --------------------
  async deactivateReader(id) {
    const reader = await this.readerRepository.findById(id);
    if (!reader) throw new Error("Độc giả không tồn tại");
    const updated = await this.readerRepository.update(id, { isActive: false });
    return new ReaderDTO(updated);
  }

  async activateReader(id) {
    const reader = await this.readerRepository.findById(id);
    if (!reader) throw new Error("Độc giả không tồn tại");
    const updated = await this.readerRepository.update(id, { isActive: true });
    return new ReaderDTO(updated);
  }

  async deactivateStaff(id) {
    const staff = await this.staffRepository.findById(id);
    if (!staff) throw new Error("Nhân viên không tồn tại");
    const updated = await this.staffRepository.update(id, { isActive: false });
    return new StaffDTO(updated);
  }

  async activateStaff(id) {
    const staff = await this.staffRepository.findById(id);
    if (!staff) throw new Error("Nhân viên không tồn tại");
    const updated = await this.staffRepository.update(id, { isActive: true });
    return new StaffDTO(updated);
  }

  // -------------------- Update Role (Staff) --------------------
  async updateRoleStaff(id, newRole) {
    const staff = await this.staffRepository.findById(id);
    if (!staff) throw new Error("Nhân viên không tồn tại");
    const updated = await this.staffRepository.update(id, { role: newRole });
    return new StaffDTO(updated);
  }
}

module.exports = AuthService;
