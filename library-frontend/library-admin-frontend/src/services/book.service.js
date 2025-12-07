import createApiClient from "./api.service";

class BookService {
  constructor(baseUrl = "/api/books") {
    this.api = createApiClient(baseUrl);
  }

  getAll() {
    return this.api.get("/");
  }

  getById(id) {
    return this.api.get(`/${id}`);
  }

  search(value) {
    return this.api.get(`/search`, {
      params: {
        title: value,
        author: value,
      },
    });
  }

  create(data) {
    return this.api.post("/", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }

  update(id, data) {
    return this.api.put(`/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }

  delete(id) {
    return this.api.delete(`/${id}`);
  }

  hardDelete(id) {
    return this.api.delete(`/${id}/hard`);
  }
}

export default new BookService();
