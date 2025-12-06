<template>
  <div class="card shadow-lg border-0 rounded-4 p-4">
    <div class="row g-4">
      <!-- IMAGE -->
      <div class="col-md-4">
        <img
          :src="bookImage"
          class="img-fluid rounded-4 shadow-sm w-100"
          style="max-height: 550px; object-fit: cover"
        />
      </div>
      <!-- TEXT INFO -->
      <div class="col-md-8">
        <h1 class="fw-bold mb-2">{{ book.title }}</h1>
        <p class="fs-5 mb-4"><strong>Tác giả: </strong>{{ book.author }}</p>

        <div class="price-section mb-4 text-white rounded-4 p-3 shadow">
          <div class="price-label">Giá sách:</div>
          <div class="price-value">{{ formatPrice(book.price) }}</div>
        </div>

        <div class="row g-3">
          <div class="col-6">
            <div class="info-item">
              <span class="info-label">Năm xuất bản: </span
              ><span class="info-value">{{ book.pubYear }}</span>
            </div>
          </div>
          <div class="col-6">
            <div class="info-item">
              <span class="info-label">Nhà xuất bản: </span
              ><span class="info-value"
                >{{ book.publisher?.name || "—" }}
              </span>
            </div>
          </div>
          <div class="col-6">
            <div class="info-item">
              <span class="info-label">Số lượng: </span
              ><span class="info-value"> {{ book.quantity }} quyển </span>
            </div>
          </div>
          <div class="col-6">
            <div class="info-item">
              <span class="info-label">Mã sách: </span
              ><span class="info-value">{{ book.id }}</span>
            </div>
          </div>
        </div>

        <div class="mt-4">
          <button class="btn btn-primary" @click="showModal = true">
            Mượn sách
          </button>
          <BorrowModal
            :book="book"
            :image="bookImage"
            v-model:visible="showModal"
            @borrow="handleBorrow"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BorrowModal from "@/components/BorrowModal.vue";
import BookService from "@/services/book.service";
import CirculationService from "@/services/circulation.service";
import AuthService from "@/services/auth.service";

export default {
  components: { BorrowModal },
  data() {
    return {
      book: {},
      showModal: false,
    };
  },
  computed: {
    bookImage() {
      const baseURL = "http://localhost:3000";
      return this.book.img
        ? baseURL + this.book.img
        : "https://via.placeholder.com/400x600?text=No+Image";
    },
  },
  async mounted() {
    const id = this.$route.params.id;
    const res = await BookService.getById(id);
    this.book = res.data.data;
  },
  methods: {
    formatPrice(value) {
      return Number(value).toLocaleString("vi-VN") + " ₫";
    },
    async handleBorrow(payload) {
      // Xử lý thêm sau khi mượn thành công nếu cần
      console.log("Borrowed:", payload);
    },
  },
};
</script>

<style scoped>
.info-item {
  background: #fafaff;
  border: 1px solid #e8e9ff;
  padding: 15px;
  border-radius: 12px;
}
.info-label {
  font-size: 13px;
  text-transform: uppercase;
  color: #6b7280;
  font-weight: 600;
}
.info-value {
  font-size: 15px;
  font-weight: 600;
}
.price-section {
  background: linear-gradient(135deg, #667eea, #6b5ee6);
}
.price-value {
  font-size: 32px;
  font-weight: 700;
}
</style>
