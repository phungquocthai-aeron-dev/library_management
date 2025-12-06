<template>
  <div class="register-container row g-0 w-100">
    <div class="sidebar col-md-4 d-flex flex-column justify-content-center">
      <h1>Thư viện Số</h1>
      <p>Tạo tài khoản để mượn sách và quản lý tài liệu.</p>
    </div>

    <div class="form-section col-md-8">
      <h2 class="mb-4">Đăng ký Độc giả</h2>

      <form @submit.prevent="handleRegister">
        <div class="mb-3">
          <label>Họ và tên *</label>
          <input v-model="fullName" type="text" class="form-control" required />
        </div>

        <div class="row mb-3">
          <div class="col-md-6">
            <label>Ngày sinh *</label>
            <input
              v-model="birthDate"
              type="date"
              class="form-control"
              required
            />
          </div>

          <div class="col-md-6">
            <label>Giới tính *</label>
            <select v-model="gender" class="form-select" required>
              <option value="">Chọn giới tính</option>
              <option value="MALE">Nam</option>
              <option value="FEMALE">Nữ</option>
              <option value="OTHER">Khác</option>
            </select>
          </div>
        </div>

        <div class="mb-3">
          <label>Địa chỉ *</label>
          <input v-model="address" type="text" class="form-control" required />
        </div>

        <div class="mb-3">
          <label>Số điện thoại *</label>
          <input v-model="phone" type="tel" class="form-control" required />
        </div>

        <div class="mb-3">
          <label>Mật khẩu *</label>
          <input
            v-model="password"
            type="password"
            minlength="6"
            class="form-control"
            required
          />
        </div>

        <div class="mb-3">
          <label>Xác nhận mật khẩu *</label>
          <input
            v-model="confirmPassword"
            type="password"
            class="form-control"
            required
          />
        </div>

        <button type="submit" class="btn-custom mt-2">Đăng ký</button>

        <div class="text-center mt-3 switch-text">
          Đã có tài khoản?
          <router-link to="/login-reader">Đăng nhập</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import AuthService from "@/services/auth.service";

export default {
  name: "RegisterReader",
  data() {
    return {
      fullName: "",
      birthDate: "",
      gender: "",
      address: "",
      phone: "",
      password: "",
      confirmPassword: "",
    };
  },
  methods: {
    async handleRegister() {
      if (this.password !== this.confirmPassword) {
        alert("Mật khẩu xác nhận không khớp!");
        return;
      }

      const payload = {
        fullName: this.fullName,
        birthDate: this.birthDate,
        gender: this.gender,
        address: this.address,
        phone: this.phone,
        password: this.password,
      };

      try {
        const res = await AuthService.register(payload);

        if (res.data.user) {
          this.$router.push({
            path: "/auth/login",
            query: { success: "true", phone: this.phone },
          });
        } else {
          alert(res.data.message || "Đăng ký thất bại!");
        }
      } catch (err) {
        alert(err.response?.data?.message || "Lỗi đăng ký");
      }
    },
  },
};
</script>

<style>
.register-container {
  max-width: 850px;
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 15px 45px rgba(0, 0, 0, 0.2);
}

.sidebar {
  background: linear-gradient(135deg, #667eea, #764ba2);
  padding: 25px 20px;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.sidebar h1 {
  font-size: 36px;
  margin-bottom: 10px;
}

.form-section {
  padding: 25px 25px;
}

.form-section h2 {
  font-size: 20px;
  margin-bottom: 15px;
}

.form-control,
.form-select {
  height: 38px;
  padding: 6px 10px;
  font-size: 14px;
}

.mb-3 {
  margin-bottom: 12px !important;
}

.btn-custom {
  height: 40px;
  padding: 8px;
  font-size: 15px;
  border-radius: 8px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  font-weight: 600;
}

.switch-text {
  margin-top: 10px;
  font-size: 14px;
}
.switch-text a {
  text-decoration: none;
}
</style>
