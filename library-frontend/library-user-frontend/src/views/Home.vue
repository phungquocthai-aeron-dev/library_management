<template>
  <div>
    <!-- ======= CAROUSEL ======= -->
    <div
      id="libraryCarousel"
      class="carousel slide mb-5 rounded shadow"
      data-bs-ride="carousel"
    >
      <div class="carousel-inner">
        <div class="carousel-item active">
          <img
            src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1400&h=450&fit=crop"
            class="d-block w-100"
          />
          <div
            class="carousel-caption text-start bg-dark bg-opacity-50 rounded p-3"
          >
            <h2>Mượn sách dễ dàng</h2>
            <p>Hệ thống quản lý hiện đại, tiện lợi</p>
          </div>
        </div>

        <div class="carousel-item">
          <img
            src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1400&h=450&fit=crop"
            class="d-block w-100"
          />
          <div
            class="carousel-caption text-start bg-dark bg-opacity-50 rounded p-3"
          >
            <h2>Khám phá thế giới tri thức</h2>
            <p>Hàng ngàn đầu sách chất lượng đang chờ bạn</p>
          </div>
        </div>

        <div class="carousel-item">
          <img
            src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1400&h=450&fit=crop"
            class="d-block w-100"
          />
          <div
            class="carousel-caption text-start bg-dark bg-opacity-50 rounded p-3"
          >
            <h2>Đọc sách mỗi ngày</h2>
            <p>Nâng cao kiến thức, mở rộng tầm nhìn</p>
          </div>
        </div>
      </div>

      <button
        class="carousel-control-prev"
        type="button"
        data-bs-target="#libraryCarousel"
        data-bs-slide="prev"
      >
        <span class="carousel-control-prev-icon"></span>
      </button>

      <button
        class="carousel-control-next"
        type="button"
        data-bs-target="#libraryCarousel"
        data-bs-slide="next"
      >
        <span class="carousel-control-next-icon"></span>
      </button>
    </div>

    <!-- ======= SÁCH (CÓ FILTER) ======= -->
    <section class="mb-5">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h2>{{ currentFilterLabel }}</h2>

        <!-- Dropdown Filter -->
        <div class="dropdown">
          <button
            class="btn btn-outline-primary rounded-pill dropdown-toggle"
            data-bs-toggle="dropdown"
          >
            <i class="bi bi-funnel"></i> Lọc
          </button>

          <ul class="dropdown-menu dropdown-menu-end shadow">
            <li>
              <button class="dropdown-item" @click="applyFilter('recommended')">
                Đề xuất
              </button>
            </li>
            <li>
              <button class="dropdown-item" @click="applyFilter('newest')">
                Mới nhất
              </button>
            </li>
            <li>
              <button class="dropdown-item" @click="applyFilter('oldest')">
                Cũ nhất
              </button>
            </li>
            <li>
              <button class="dropdown-item" @click="applyFilter('highPrice')">
                Giá cao nhất
              </button>
            </li>
            <li>
              <button class="dropdown-item" @click="applyFilter('lowPrice')">
                Giá thấp nhất
              </button>
            </li>
            <li>
              <button class="dropdown-item" @click="applyFilter('quantity')">
                Số lượng
              </button>
            </li>
          </ul>
        </div>
      </div>

      <!-- Danh sách sách -->
      <div class="row row-cols-1 row-cols-md-3 row-cols-lg-6 g-4">
        <BookCard
          v-for="book in filteredBooks.slice(0, visibleCount)"
          :key="book.id"
          :book="book"
        />
      </div>

      <!-- BUTTON LOAD MORE -->
      <div class="text-center mt-4">
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
    </section>
  </div>
</template>

<script>
import BookCard from "@/components/BookCard.vue";
import BookService from "@/services/book.service";

export default {
  components: { BookCard },

  data() {
    return {
      books: [],
      filteredBooks: [],
      currentFilter: "recommended",
      visibleCount: 12, // hiển thị 2 hàng đầu
      loadStep: 12, // mỗi lần load 2 hàng nữa
      initialCount: 12, // số lượng mặc định
      filterLabels: {
        recommended: "Đề xuất",
        newest: "Mới nhất",
        oldest: "Cũ nhất",
        highPrice: "Giá cao nhất",
        lowPrice: "Giá thấp nhất",
        quantity: "Số lượng",
      },
    };
  },

  computed: {
    currentFilterLabel() {
      return this.filterLabels[this.currentFilter];
    },
  },

  methods: {
    applyFilter(type) {
      this.currentFilter = type;

      switch (type) {
        case "newest":
          this.filteredBooks = [...this.books].sort(
            (a, b) => b.pubYear - a.pubYear
          );
          break;

        case "oldest":
          this.filteredBooks = [...this.books].sort(
            (a, b) => a.pubYear - b.pubYear
          );
          break;

        case "highPrice":
          this.filteredBooks = [...this.books].sort(
            (a, b) => b.price - a.price
          );
          break;

        case "lowPrice":
          this.filteredBooks = [...this.books].sort(
            (a, b) => a.price - b.price
          );
          break;

        case "quantity":
          this.filteredBooks = [...this.books].sort(
            (a, b) => b.quantity - a.quantity
          );
          break;

        default:
          this.filteredBooks = [...this.books];
      }

      this.visibleCount = this.initialCount; // reset về 2 hàng
    },
    loadMore() {
      this.visibleCount += this.loadStep;
    },
    showLess() {
      this.visibleCount = this.initialCount;
    },
  },

  async mounted() {
    try {
      const res = await BookService.getAll();
      const books = res.data.data;

      const baseURL = "http://localhost:3000";

      this.books = books.map((b) => ({
        ...b,
        image: b.img ? baseURL + b.img : "https://via.placeholder.com/500x700",
      }));

      this.filteredBooks = [...this.books];
    } catch (error) {
      console.error("Lỗi khi lấy danh sách sách:", error);
    }
  },
};
</script>
