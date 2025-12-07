import createApiClient from "./api.service";

class PublisherService {
  constructor(baseUrl = "/api/publishers") {
    this.api = createApiClient(baseUrl);
  }

  getAll() {
    return this.api.get("/");
  }

  create(data) {
    return this.api.post("/", data);
  }

  getById(id) {
    return this.api.get(`/${id}`);
  }

  update(id, data) {
    return this.api.put(`/${id}`, data);
  }

  delete(id) {
    return this.api.delete(`/${id}`);
  }
}

export default new PublisherService();
