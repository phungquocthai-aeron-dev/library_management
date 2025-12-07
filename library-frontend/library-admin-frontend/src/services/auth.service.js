import createApiClient from "./api.service";

class AuthService {
  constructor(baseUrl = "/api/auth") {
    this.api = createApiClient(baseUrl);
  }

  async register(data) {
    return await this.api.post("/register/staff", data, {
      withCredentials: true,
    });
  }

  async login(credentials) {
    const res = await this.api.post("/login/staff", credentials, {
      withCredentials: true,
    });

    // ❗ Backend phải trả về: { user, session }
    if (res.data.user) {
      // Lưu user vào localStorage
      localStorage.setItem("staff", JSON.stringify(res.data.user));
      window.dispatchEvent(new Event("auth-changed"));
    }

    return res;
  }

  async logout() {
    await this.api.post("/logout", {}, { withCredentials: true });
    localStorage.removeItem("staff");
    window.dispatchEvent(new Event("auth-changed"));
  }

  getCurrentReader() {
    const u = localStorage.getItem("staff");
    return u ? JSON.parse(u) : null;
  }

  isLoggedIn() {
    return !!localStorage.getItem("staff");
  }

  async updateInfo(data) {
    const res = await this.api.put("/staff", data, {
      withCredentials: true,
    });

    // Backend phải trả { user: updatedUser }
    if (res.data.user) {
      localStorage.setItem("staff", JSON.stringify(res.data.user));
      window.dispatchEvent(new Event("auth-changed"));
    }

    return res.data.user;
  }

  async updatePassword(oldPassword, newPassword) {
    const res = await this.api.put(
      "/staff/password",
      { oldPassword, newPassword },
      { withCredentials: true }
    );
    return res.data.user;
  }
}

export default new AuthService();
