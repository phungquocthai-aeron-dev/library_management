<template>
  <aside class="sidebar">
    <div class="logo">
      <h2>
        <span class="logo-icon">📚</span>
        Thư Viện
      </h2>
    </div>

    <ul class="menu">
      <li
        v-for="item in menuItems"
        :key="item.name"
        :class="['menu-item', { active: item.route === $route.name }]"
      >
        <router-link
          v-if="item.route"
          :to="{ name: item.route }"
          class="d-flex align-items-center gap-2 text-white text-decoration-none w-100"
        >
          <span class="menu-icon">{{ item.icon }}</span>
          <span>{{ item.name }}</span>
        </router-link>

        <div v-else class="d-flex align-items-center gap-2">
          <span class="menu-icon">{{ item.icon }}</span>
          <span>{{ item.name }}</span>
        </div>
      </li>
    </ul>

    <!-- Logout button -->
    <div v-if="user" class="mt-auto p-3">
      <button class="btn btn-outline-light w-100" @click="logout">
        🔓 Đăng xuất
      </button>
    </div>
  </aside>
</template>

<script>
import AuthService from "@/services/auth.service";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

export default {
  name: "Sidebar",
  setup() {
    const router = useRouter();
    const user = ref(AuthService.getCurrentReader());

    const menuItems = [
      { name: "Mượn trả", icon: "🔄", route: "home" },
      { name: "Sách", icon: "📖", route: "book" },
    ];

    const activeItem = ref("Mượn trả");

    const setActive = (name) => {
      activeItem.value = name;
    };

    const logout = async () => {
      await AuthService.logout();
      user.value = null;
      router.push({ name: "login" });
    };

    const updateUser = () => {
      user.value = AuthService.getCurrentReader();
    };

    onMounted(() => {
      window.addEventListener("auth-changed", updateUser);
    });

    return { user, menuItems, activeItem, setActive, logout };
  },
};
</script>

<style scoped>
.sidebar {
  width: 260px;
  background: linear-gradient(180deg, #2c3e50 0%, #34495e 100%);
  color: white;
  padding: 0;
  position: fixed;
  height: 100vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.logo {
  padding: 10px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 10px;
}

.logo h2 {
  font-size: 24px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-icon {
  width: 35px;
  height: 35px;
  background: #3498db;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.menu {
  list-style: none;
  padding-left: 0;
  margin: 0;
  flex-grow: 1;
}

.menu-item {
  padding: 14px 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  border-left: 3px solid transparent;
  transition: all 0.3s;
}

.menu-item.active {
  background: rgba(52, 152, 219, 0.2);
  border-left-color: #3498db;
}

.menu-item:hover {
  background: rgba(255, 255, 255, 0.1);
  border-left-color: #3498db;
}
</style>
