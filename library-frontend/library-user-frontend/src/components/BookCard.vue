<template>
  <div class="col">
    <div class="card h-100 book-card position-relative">
      <img :src="book.image" class="card-img-top" :alt="book.title" />

      <div class="card-body">
        <router-link
          :to="`/book/${book.id}`"
          class="card-title text-decoration-none book-title"
        >
          <h6>{{ book.title }}</h6>
        </router-link>

        <p class="card-text">👤 {{ book.author }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "BookCard",
  props: {
    book: Object,
  },
};
</script>

<style scoped>
.book-card {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
}

.book-card img {
  object-fit: contain;
  height: 280px;
  width: 100%;
  padding: 10px;
  background-color: #f6f6f6;
  transition: transform 0.3s ease;
}

.book-card:hover img {
  transform: scale(1.05);
}

.book-title h6 {
  color: #333;
  transition: color 0.2s ease;
}

.book-title:hover h6 {
  color: #007bff;
}
</style>
