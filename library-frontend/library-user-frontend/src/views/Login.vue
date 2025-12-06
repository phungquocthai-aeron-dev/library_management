<template>
  <div class="login-container row g-0">
    <div class="sidebar col-md-4 d-flex flex-column justify-content-center">
      <h1>Thư viện Số</h1>
      <p>Hệ thống quản lý thư viện hiện đại, giúp bạn dễ dàng mượn sách.</p>
    </div>

    <div class="main-content col-md-8">
      <h2>Đăng nhập Độc giả</h2>

      <div v-if="successMessage" class="alert alert-success">
        {{ successMessage }}
      </div>

      <form @submit.prevent="handleLogin">
        <div class="form-group mb-3">
          <label for="login-phone">Số điện thoại</label>
          <input
            type="tel"
            id="login-phone"
            v-model="phone"
            class="form-control"
            required
          />
        </div>

        <div class="form-group mb-3">
          <label for="login-password">Mật khẩu</label>
          <input
            type="password"
            id="login-password"
            v-model="password"
            class="form-control"
            required
          />
        </div>

        <button class="btn-main" type="submit">Đăng nhập</button>

        <div class="switch-text">
          Chưa có tài khoản?
          <router-link to="/register-reader" class="text-decoration-none"
            >Đăng ký ngay</router-link
          >
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import AuthService from "@/services/auth.service";

export default {
  name: "Login",
  data() {
    return {
      phone: "",
      password: "",
      loading: false,
      successMessage: "",
    };
  },
  mounted() {
    if (this.$route.query.success === "true") {
      this.successMessage = "Đăng ký thành công! Vui lòng đăng nhập.";
    }

    if (this.$route.query.phone) {
      this.phone = this.$route.query.phone;
    }
  },
  methods: {
    async handleLogin() {
      try {
        const res = await AuthService.login({
          phone: this.phone,
          password: this.password,
        });

        if (res.data.user && res.data.session) {
          await this.$router.push({ name: "home" });
        } else {
          alert(res.data.message || "Đăng nhập thất bại!");
        }
      } catch (err) {
        alert(err.response?.data?.message || "Lỗi đăng nhập");
      }
    },
  },
};
</script>

<style>
.login-container {
  max-width: 900px;
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
}
.sidebar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 0 0 35%;
}
.btn-main {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 16px;
}
.switch-text {
  text-align: center;
  margin-top: 20px;
}
.main-content {
  flex: 1;
  padding: 40px;
  min-width: 300px;
}
</style>
