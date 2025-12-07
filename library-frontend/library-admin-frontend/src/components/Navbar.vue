<template>
  <header class="header">
    <div class="header-actions">
      <div class="user-profile" v-if="user">
        <div class="avatar">{{ getInitials(user.fullName) }}</div>
        <div>
          <div style="font-weight: 600; font-size: 14px">
            {{ user.fullName }}
          </div>
          <div style="font-size: 12px; color: #7f8c8d">
            {{ roleLabel }}
          </div>
        </div>
      </div>
      <div v-else>
        <button class="btn btn-primary" @click="goLogin">Đăng nhập</button>
      </div>
    </div>
  </header>
</template>

<script>
import { ref, onMounted } from "vue";
import AuthService from "@/services/auth.service";
import { useRouter } from "vue-router";

export default {
  name: "Navbar",
  setup() {
    const user = ref(AuthService.getCurrentReader());
    const router = useRouter();

    const roleLabel = user.value?.isActive ? "Quản trị viên" : "Nhân viên";

    const updateUser = () => {
      user.value = AuthService.getCurrentReader();
    };

    const getInitials = (fullName) => {
      if (!fullName) return "NV";
      return fullName
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
    };

    const goLogin = () => {
      router.push({ name: "login" });
    };

    onMounted(() => {
      window.addEventListener("auth-changed", updateUser);
    });

    return { user, getInitials, roleLabel, goLogin };
  },
};
</script>

<style scoped>
/* Giữ nguyên CSS của bạn */
.header {
  background: white;
  padding: 20px 30px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 20px;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  padding: 8px 15px;
  border-radius: 25px;
  transition: background 0.3s;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
}
</style>
