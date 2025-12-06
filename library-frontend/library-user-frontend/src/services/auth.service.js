import createApiClient from "./api.service";

class AuthService {
  constructor(baseUrl = "/api/auth") {
    this.api = createApiClient(baseUrl);
  }

  async register(data) {
    return await this.api.post("/register/reader", data, {
      withCredentials: true,
    });
  }

  async login(credentials) {
    const res = await this.api.post("/login/reader", credentials, {
      withCredentials: true,
    });

    // ❗ Backend phải trả về: { user, session }
    if (res.data.user) {
      // Lưu user vào localStorage
      localStorage.setItem("reader", JSON.stringify(res.data.user));
      window.dispatchEvent(new Event("auth-changed"));
    }

    return res;
  }

  async logout() {
    await this.api.post("/logout", {}, { withCredentials: true });
    localStorage.removeItem("reader");
    window.dispatchEvent(new Event("auth-changed"));
  }

  getCurrentReader() {
    const u = localStorage.getItem("reader");
    return u ? JSON.parse(u) : null;
  }

  isLoggedIn() {
    return !!localStorage.getItem("reader");
  }

  async updateInfo(data) {
    const res = await this.api.put("/reader", data, {
      withCredentials: true,
    });

    // Backend phải trả { user: updatedUser }
    if (res.data.user) {
      localStorage.setItem("reader", JSON.stringify(res.data.user));
      window.dispatchEvent(new Event("auth-changed"));
    }

    return res.data.user;
  }

  async updatePassword(oldPassword, newPassword) {
    const res = await this.api.put(
      "/reader/password",
      { oldPassword, newPassword },
      { withCredentials: true }
    );
    return res.data.user;
  }
}

export default new AuthService();
