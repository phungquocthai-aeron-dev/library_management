<template>
  <div>
    <Navbar />

    <main class="container">
      <router-view />
    </main>

    <Footer />
  </div>
</template>

<script>
import Navbar from "@/components/Navbar.vue";
import Footer from "@/components/Footer.vue";

export default {
  components: { Navbar, Footer },
};
</script>

<style>
body {
  background: #f8f9fa;
  min-height: 100vh;
}
</style>
