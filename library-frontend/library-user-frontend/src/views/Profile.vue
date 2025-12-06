<template>
  <div
    class="container d-flex justify-content-center align-items-center"
    style="min-height: 62vh"
  >
    <div class="row g-4 w-100">
      <!-- PROFILE CARD -->
      <div class="col-lg-4">
        <div class="profile-card">
          <img
            :src="user.avatar || defaultAvatar"
            class="profile-avatar"
            alt="Avatar"
          />
          <h2 class="fw-bold mb-2">{{ user.fullName }}</h2>

          <div class="credit-score-box mb-3">
            <div class="small opacity-75">Điểm tín dụng</div>
            <div
              class="h2 fw-bold d-flex justify-content-center align-items-center gap-1"
            >
              <span>{{ user.creditScore }}</span>
              <span style="font-size: 20px">⭐</span>
            </div>
          </div>
        </div>
      </div>

      <!-- PROFILE INFO & PASSWORD -->
      <div class="col-lg-8">
        <div class="card p-4 border-0 rounded-4 shadow">
          <!-- Thông tin cá nhân -->
          <h4 class="fw-bold mb-3">👤 Thông tin cá nhân</h4>
          <div class="row g-3">
            <div class="col-md-6 mt-4">
              <label class="form-label">📝 Họ và tên</label>
              <input type="text" class="form-control" v-model="user.fullName" />
            </div>

            <div class="col-md-6 mt-4">
              <label class="form-label">📞 Số điện thoại</label>
              <input type="text" class="form-control" v-model="user.phone" />
            </div>

            <div class="col-md-6 mt-4">
              <label class="form-label">🎂 Ngày sinh</label>
              <input
                type="date"
                class="form-control"
                v-model="user.birthDate"
              />
            </div>

            <div class="col-md-6 mt-4">
              <label class="form-label">⚧ Giới tính</label>
              <select class="form-select" v-model="user.gender">
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>
            </div>

            <div class="col-12 mt-4">
              <label class="form-label">📍 Địa chỉ</label>
              <input type="text" class="form-control" v-model="user.address" />
            </div>

            <div class="col-12 d-flex justify-content-center mt-3">
              <button class="edit-btn" @click="saveUserInfo">
                💾 Lưu thông tin
              </button>
            </div>
          </div>

          <!-- Mật khẩu -->
          <h4 class="fw-bold mt-3 mb-3">🔑 Cập nhật mật khẩu</h4>
          <div class="row g-3">
            <div class="col-md-6 mt-2">
              <label class="form-label">Mật khẩu cũ</label>
              <input
                type="password"
                class="form-control"
                v-model="oldPassword"
              />
            </div>

            <div class="col-md-6 mt-2">
              <label class="form-label">Mật khẩu mới</label>
              <input
                type="password"
                class="form-control"
                v-model="newPassword"
              />
            </div>

            <div class="col-md-12 mt-2">
              <label class="form-label">Nhập lại mật khẩu mới</label>
              <input
                type="password"
                class="form-control"
                v-model="confirmPassword"
              />
            </div>

            <div class="col-12 d-flex justify-content-center mt-3">
              <button class="edit-btn" @click="updatePassword">
                💾 Cập nhật mật khẩu
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import AuthService from "@/services/auth.service";
import defaultAvatar from "@/assets/default-avatar.jpg";

export default {
  name: "Profile",
  setup() {
    const user = ref({
      fullName: "",
      phone: "",
      birthDate: "",
      gender: "",
      address: "",
      avatar: "",
      creditScore: 0,
    });

    const oldPassword = ref("");
    const newPassword = ref("");

    const loadUser = () => {
      const currentUser = AuthService.getCurrentReader();
      if (currentUser) {
        user.value = { ...currentUser };
        // Map gender backend -> frontend
        if (currentUser.gender === "MALE") user.value.gender = "Nam";
        else if (currentUser.gender === "FEMALE") user.value.gender = "Nữ";
        else user.value.gender = "Khác";
      }
    };

    onMounted(() => {
      loadUser();
      window.addEventListener("auth-changed", loadUser);
    });

    // Cập nhật thông tin cá nhân
    const saveUserInfo = async () => {
      try {
        const payload = {
          fullName: user.value.fullName,
          phone: user.value.phone,
          gender:
            user.value.gender === "Nam"
              ? "MALE"
              : user.value.gender === "Nữ"
              ? "FEMALE"
              : "OTHER",
          address: user.value.address,
          birthDate: user.value.birthDate,
        };

        await AuthService.updateInfo(payload);

        alert("✅ Thông tin cá nhân đã được cập nhật!");
      } catch (err) {
        console.error(err);
        alert(
          "❌ Cập nhật thất bại: " +
            (err.response?.data?.message || err.message)
        );
      }
    };

    const confirmPassword = ref("");

    const updatePassword = async () => {
      try {
        if (
          !oldPassword.value ||
          !newPassword.value ||
          !confirmPassword.value
        ) {
          alert("Vui lòng điền đầy đủ các trường mật khẩu!");
          return;
        }

        if (newPassword.value === oldPassword.value) {
          alert("Mật khẩu mới không được trùng mật khẩu cũ!");
          return;
        }

        if (newPassword.value !== confirmPassword.value) {
          alert("Mật khẩu mới và nhập lại không khớp!");
          return;
        }

        await AuthService.updatePassword(oldPassword.value, newPassword.value);

        oldPassword.value = "";
        newPassword.value = "";
        confirmPassword.value = "";

        alert("✅ Mật khẩu đã được cập nhật!");
      } catch (err) {
        console.error(err);
        alert(
          "❌ Cập nhật mật khẩu thất bại: " +
            (err.response?.data?.message || err.message)
        );
      }
    };

    return {
      user,
      defaultAvatar,
      saveUserInfo,
      oldPassword,
      newPassword,
      confirmPassword,
      updatePassword,
    };
  },
};
</script>

<style scoped>
.profile-avatar {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  margin: 0 auto 20px;
  border: 5px solid #667eea;
  object-fit: cover;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.profile-card {
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  text-align: center;
  background: white;
}

.credit-score-box {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 20px;
}

.profile-btn {
  width: 100%;
}

.edit-btn {
  padding: 8px 16px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.edit-btn:hover {
  background: #5568d3;
  transform: translateY(-2px);
}
</style>
