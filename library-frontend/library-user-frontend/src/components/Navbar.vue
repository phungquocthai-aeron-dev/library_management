<template>
  <nav
    class="navbar navbar-expand-lg navbar-light bg-white shadow-sm rounded sticky-top mb-4"
  >
    <div class="container">
      <a class="navbar-brand" href="#">📚 Library System</a>

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarContent"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              role="button"
              data-bs-toggle="dropdown"
            >
              Danh mục
            </a>
            <ul class="dropdown-menu">
              <li><a class="dropdown-item">Công nghệ thông tin</a></li>
              <li><a class="dropdown-item">Khoa học</a></li>
              <li><a class="dropdown-item">Thiếu nhi</a></li>
              <li><hr class="dropdown-divider" /></li>
              <li><a class="dropdown-item">Xem chi tiết</a></li>
            </ul>
          </li>

          <li class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              role="button"
              data-bs-toggle="dropdown"
            >
              Nhà xuất bản
            </a>
            <ul class="dropdown-menu">
              <li><a class="dropdown-item">NXB Trẻ</a></li>
              <li><a class="dropdown-item">Alpha Books</a></li>
              <li><a class="dropdown-item">Kim Đồng</a></li>
              <li><hr class="dropdown-divider" /></li>
              <li><a class="dropdown-item">Xem chi tiết</a></li>
            </ul>
          </li>
        </ul>

        <form class="d-flex me-3">
          <input
            class="form-control rounded-pill"
            type="search"
            placeholder="Tìm kiếm sách..."
          />
        </form>

        <div v-if="!isLoggedIn">
          <router-link to="/auth/login" class="btn btn-outline-primary me-2">
            Đăng nhập
          </router-link>
          <router-link to="/auth/register" class="btn btn-primary">
            Đăng ký
          </router-link>
        </div>

        <div v-else class="dropdown">
          <img
            :src="defaultAvatar"
            class="rounded-circle border border-2 border-primary"
            alt="avatar"
            data-bs-toggle="dropdown"
            style="
              cursor: pointer;
              width: 40px;
              height: 40px;
              object-fit: cover;
            "
          />

          <ul class="dropdown-menu dropdown-menu-end">
            <li class="px-3 py-2 border-bottom">
              <strong>{{ currentUser?.fullName }}</strong
              ><br />
              <small class="text-warning">⭐ 4.8</small>
            </li>
            <li><a class="dropdown-item">📘 Quản lý mượn trả</a></li>
            <li><a class="dropdown-item">⚙️ Tài khoản</a></li>

            <li>
              <button class="dropdown-item text-danger" @click="handleLogout">
                🚪 Đăng xuất
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import AuthService from "@/services/auth.service";
import defaultAvatar from "@/assets/default-avatar.jpg";

export default {
  data() {
    return {
      currentUser: AuthService.getCurrentReader(),
      defaultAvatar,
    };
  },

  computed: {
    isLoggedIn() {
      return AuthService.isLoggedIn();
    },
  },

  methods: {
    async handleLogout() {
      await AuthService.logout();
      this.currentUser = null;

      this.$router.push({ name: "login" });
    },
  },
};
</script>

<style scoped>
.navbar-brand {
  font-weight: 700;
  color: #667eea;
  cursor: pointer;
}
</style>
