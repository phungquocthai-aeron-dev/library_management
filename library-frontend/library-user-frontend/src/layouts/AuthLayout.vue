<template>
  <div class="auth-bg">
    <div class="auth-wrapper">
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  name: "AuthLayout",
};
</script>

<style scoped>
.auth-bg {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.auth-wrapper {
  width: 100%;
  max-width: 900px;
  padding: 12px;
  display: flex;
  justify-content: center;
}
</style>
