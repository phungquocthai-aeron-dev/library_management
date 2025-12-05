import createApiClient from "./api.service";

class AuthService {
  constructor(baseUrl = "/api/auth") {
    this.api = createApiClient(baseUrl);
  }

  async login(credentials) {
    const res = await this.api.post("/login/reader", credentials, {
      withCredentials: true,
    });

    if (res.data.user && res.data.session) {
      const reader = {
        ...res.data.user,
        session: res.data.session,
      };

      localStorage.setItem("reader", JSON.stringify(reader));

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
}

export default new AuthService();
