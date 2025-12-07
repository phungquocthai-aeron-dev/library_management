<template>
  <div
    class="not-found-page d-flex flex-column justify-content-center align-items-center text-center"
  >
    <img :src="notFoundImage" alt="404 Not Found" class="mb-4" />
    <h1 class="display-4 mb-3">404 - Trang không tồn tại</h1>
    <p class="text-muted mb-4">
      Xin lỗi, trang bạn đang tìm kiếm không tồn tại.
    </p>
    <router-link to="/" class="btn btn-primary">
      🏠 Quay về trang chủ
    </router-link>
  </div>
</template>

<script>
import notFoundImage from "@/assets/404.png";

export default {
  name: "NotFound",
  data() {
    return {
      notFoundImage,
    };
  },
};
</script>

<style scoped>
.not-found-page {
  min-height: 80vh;
  padding: 40px 20px;
}
.not-found-page img {
  max-width: 400px;
  width: 100%;
}
</style>
