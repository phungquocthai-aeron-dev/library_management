import createApiClient from "./api.service";

class CirculationService {
  constructor(baseUrl = "/api/circulations") {
    this.api = createApiClient(baseUrl);
  }

  borrowBook(data) {
    return this.api.post("/borrow", data);
  }

  returnBook(data) {
    return this.api.post("/return", data);
  }

  findOverdue() {
    return this.api.get("/overdue");
  }
}

export default new CirculationService();
