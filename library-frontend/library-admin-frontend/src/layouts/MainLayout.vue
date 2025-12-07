<template>
  <div class="main-layout">
    <Sidebar />

    <div class="main-content">
      <Navbar />
      <router-view />
    </div>
  </div>
</template>

<script>
import Sidebar from "@/components/Sidebar.vue";
import Navbar from "@/components/Navbar.vue";

export default {
  components: { Sidebar, Navbar },
};
</script>

<style>
.main-layout {
  display: flex;
}

.main-content {
  margin-left: 260px;
  width: calc(100% - 260px);
}
</style>
