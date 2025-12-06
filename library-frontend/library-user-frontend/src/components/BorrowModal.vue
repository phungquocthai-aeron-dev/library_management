<template>
  <div v-if="visible" class="modal-backdrop">
    <div class="modal-content p-3">
      <!-- Header -->
      <div class="modal-header">
        <h5 class="modal-title">📝 Phiếu Mượn Sách</h5>
        <button
          type="button"
          class="btn-close"
          @click="closeModal"
          style="background-color: gray; width: 40px; height: 40px"
        >
          <i class="fa-solid fa-x"></i>
        </button>
      </div>
      <!-- Body -->
      <div class="modal-body">
        <!-- Preview sách -->
        <div class="d-flex gap-3 mb-3">
          <img
            :src="image"
            class="rounded"
            style="width: 100px; height: 140px; object-fit: cover"
          />
          <div>
            <h6>{{ book.title }}</h6>
            <p class="text-muted mb-0">
              <strong>Tác giả: </strong> {{ book.author }}
            </p>
            <p class="mb-0"><strong>Giá: </strong> {{ book.price }}</p>
            <p class="mb-0">
              <strong>Còn lại: </strong> {{ book.quantity }} cuốn
            </p>
          </div>
        </div>
        <form @submit.prevent="submitBorrow">
          <div class="mb-3">
            <label class="form-label">📅 Ngày mượn</label>
            <input
              type="text"
              class="form-control"
              :value="borrowDate"
              disabled
            />
          </div>

          <div class="mb-3">
            <label class="form-label">⏳ Chọn thời hạn mượn</label>
            <select v-model="selectedOption" class="form-select" required>
              <option value="">-- Chọn thời hạn --</option>
              <option value="7">7 ngày</option>
              <option value="14">14 ngày</option>
              <option value="30">30 ngày</option>
            </select>
          </div>

          <div class="mb-3" v-if="dueDate">
            <label class="form-label">📆 Ngày trả dự kiến</label>
            <input type="text" class="form-control" :value="dueDate" disabled />
          </div>

          <div class="text-center">
            <button class="btn btn-primary px-5">Xác nhận mượn sách</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import AuthService from "@/services/auth.service";
import CirculationService from "@/services/circulation.service";

export default {
  name: "BorrowModal",
  props: {
    book: Object,
    image: String,
    visible: Boolean,
  },
  data() {
    const now = new Date();
    return {
      borrowDate: now.toISOString().split("T")[0],
      selectedOption: "",
      dueDate: null,
    };
  },
  watch: {
    selectedOption(value) {
      if (!value) {
        this.dueDate = null;
        return;
      }
      const date = new Date();
      date.setDate(date.getDate() + Number(value));
      this.dueDate = date.toISOString().split("T")[0];
    },
  },
  methods: {
    closeModal() {
      this.$emit("update:visible", false);
    },
    async submitBorrow() {
      if (!this.selectedOption) {
        alert("Vui lòng chọn thời hạn mượn!");
        return;
      }

      const reader = AuthService.getCurrentReader();
      if (!reader) {
        alert("Bạn phải đăng nhập để mượn sách!");
        return;
      }

      const payload = {
        readerId: reader.id,
        bookId: this.book.id,
        borrowDate: this.borrowDate,
        dueDate: this.dueDate,
      };

      try {
        await CirculationService.borrowBook(payload);
        alert("Mượn sách thành công!");
        this.closeModal();
        this.$emit("borrow", payload);
      } catch (err) {
        console.error(err);
        alert("Mượn sách thất bại!");
      }
    },
  },
};
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 600px;
  max-width: 90%;
  max-height: 90%;
  overflow-y: auto;
}

.btn-close {
  background: transparent;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
}
</style>
