import createApiClient from "./api.service";

class CirculationService {
  constructor(baseUrl = "/api/circulations") {
    this.api = createApiClient(baseUrl);
  }

  // Mượn sách
  borrowBook(data) {
    // data: { readerId, bookId, borrowDate, dueDate }
    return this.api.post("/borrow", data);
  }

  approveBorrow(data) {
    // data: { circulationId, staffId }
    return this.api.post("/approve", data);
  }

  // Xác nhận mượn sách
  confirmBorrow(data) {
    // data: { circulationId }
    return this.api.post("/confirm", data);
  }

  // Trả sách
  returnBook(data) {
    // data: { circulationId, returnDate }
    return this.api.post("/return", data);
  }

  // Hủy mượn sách
  cancelBorrow(data) {
    // data: { circulationId }
    return this.api.post("/cancel", data);
  }

  // Tìm sách quá hạn
  findOverdue() {
    return this.api.get("/overdue");
  }

  // Lấy danh sách phiếu mượn theo độc giả
  getByReader(readerId) {
    if (!readerId) throw new Error("Thiếu readerId");
    return this.api.get(`/reader/${readerId}`);
  }
}

export default new CirculationService();
