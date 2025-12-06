<template>
  <div>
    <h5 class="mb-4">
      Kết quả tìm kiếm cho: "<strong>{{ keyword }}</strong
      >"
    </h5>

    <div v-if="books.length === 0" class="text-center my-5">
      <img
        :src="emptyImage"
        alt="Không có kết quả"
        class="mb-3"
        style="max-width: 300px"
      />
      <p class="text-muted">Không tìm thấy kết quả phù hợp</p>
    </div>

    <div v-else class="row row-cols-1 row-cols-md-3 row-cols-lg-6 g-4">
      <BookCard
        v-for="book in filteredBooks.slice(0, visibleCount)"
        :key="book.id"
        :book="book"
      />
    </div>

    <div v-if="books.length > 0" class="text-center mt-4">
      <button
        v-if="visibleCount < filteredBooks.length"
        class="btn btn-outline-primary rounded-pill px-4"
        @click="loadMore"
      >
        Xem thêm ↓
      </button>

      <button
        v-else-if="filteredBooks.length > initialCount"
        class="btn btn-outline-secondary rounded-pill px-4"
        @click="showLess"
      >
        Ẩn bớt ↑
      </button>
    </div>
  </div>
</template>

<script>
import BookCard from "@/components/BookCard.vue";
import BookService from "@/services/book.service";
import emptyImage from "@/assets/empty.png";

export default {
  components: { BookCard },

  data() {
    return {
      books: [],
      keyword: this.$route.query.q || "",
      visibleCount: 18,
      loadStep: 12,
      initialCount: 18,
      emptyImage,
    };
  },

  computed: {
    filteredBooks() {
      return this.books;
    },
  },

  methods: {
    loadMore() {
      this.visibleCount += this.loadStep;
    },
    showLess() {
      this.visibleCount = this.initialCount;
    },

    async fetchSearchResults() {
      if (!this.keyword) {
        this.books = [];
        return;
      }

      try {
        const res = await BookService.search(this.keyword);
        const baseURL = "http://localhost:3000";

        this.books = res.data.data.map((b) => ({
          ...b,
          image: b.img
            ? baseURL + b.img
            : "https://via.placeholder.com/500x700",
        }));
        this.visibleCount = this.initialCount;
      } catch (error) {
        console.error("Lỗi khi tìm kiếm:", error);
        this.books = [];
      }
    },
  },

  watch: {
    "$route.query.q"(newVal) {
      this.keyword = newVal;
      this.fetchSearchResults();
    },
  },

  mounted() {
    this.fetchSearchResults();
  },
};
</script>
