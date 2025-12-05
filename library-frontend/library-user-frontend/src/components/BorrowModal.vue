<template>
  <div class="modal fade" id="borrowModal" tabindex="-1">
    <div class="modal-dialog modal-lg modal-dialog-centered">
      <div class="modal-content p-3">
        <!-- Header -->
        <div class="modal-header">
          <h5 class="modal-title">📝 Phiếu Mượn Sách</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
          ></button>
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
            <!-- Ngày mượn -->
            <div class="mb-3">
              <label class="form-label">📅 Ngày mượn</label>
              <input
                type="text"
                class="form-control"
                :value="borrowDate"
                disabled
              />
            </div>
            <!-- Chọn hạn trả -->
            <div class="mb-3">
              <label class="form-label">⏳ Chọn thời hạn mượn</label>
              <select v-model="selectedOption" class="form-select" required>
                <option value="">-- Chọn thời hạn --</option>
                <option value="7">7 ngày</option>
                <option value="14">14 ngày</option>
                <option value="30">30 ngày</option>
              </select>
            </div>
            <!-- Ngày trả tính tự động -->
            <div class="mb-3" v-if="dueDate">
              <label class="form-label">📆 Ngày trả dự kiến</label>
              <input
                type="text"
                class="form-control"
                :value="dueDate"
                disabled
              />
            </div>
            <div class="text-center">
              <button class="btn btn-primary px-5">Xác nhận mượn sách</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import AuthService from "@/services/auth.service";
import CirculationService from "@/services/circulation.service";
import { Modal } from "bootstrap";

export default {
  name: "BorrowModal",
  props: { book: Object, image: String },
  data() {
    const now = new Date();
    return {
      borrowDate: now.toISOString(),
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
      this.dueDate = date.toISOString();
    },
  },
  methods: {
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
      } catch (err) {
        console.error(err);
        alert("Mượn sách thất bại!");
      }

      const modalEl = document.getElementById("borrowModal");
      const modal = Modal.getInstance(modalEl) || new Modal(modalEl);
      modal.hide();

      const backdrop = document.querySelector(".modal-backdrop");
      if (backdrop) backdrop.remove();

      document.body.classList.remove("modal-open");
      document.body.style.removeProperty("padding-right");
    },
  },
};
</script>
