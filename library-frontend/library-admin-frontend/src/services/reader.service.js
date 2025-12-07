import createApiClient from "./api.service";

class ReaderService {
  constructor(baseUrl = "/api/auth") {
    this.api = createApiClient(baseUrl);
  }

  // === Register Reader ===
  register(data) {
    return this.api.post("/register/reader", data);
  }

  // === Login / Logout ===
  login(data) {
    return this.api.post("/login/reader", data);
  }
  logout() {
    return this.api.post("/logout");
  }

  // === Update Reader Info ===
  update(id, data) {
    return this.api.put(`/reader/${id}`, data);
  }

  updatePassword(id, data) {
    return this.api.put(`/reader/${id}/password`, data);
  }

  // === Activate / Deactivate Reader ===
  activate(id) {
    return this.api.put(`/reader/${id}/activate`);
  }

  deactivate(id) {
    return this.api.put(`/reader/${id}/deactivate`);
  }
}

export default new ReaderService();
