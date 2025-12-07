<template>
  <div>
    <!-- Header -->
    <div class="page-header">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-md-8">
            <h1 class="mb-2">📖 Thông Tin Mượn Trả Sách</h1>
            <p class="mb-0">Quản lý và theo dõi lịch sử mượn trả của bạn</p>
          </div>
        </div>
      </div>
    </div>

    <div class="container">
      <!-- Loading -->
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Đang tải...</span>
        </div>
      </div>

      <template v-else>
        <!-- Thống kê -->
        <div class="row mb-4">
          <div class="col-md-3 mb-3">
            <div class="stats-card confirmed">
              <div>📝 Chờ nhận</div>
              <div class="number">{{ stats.confirmed }}</div>
            </div>
          </div>
          <div class="col-md-3 mb-3">
            <div class="stats-card borrowed">
              <div>📚 Đang mượn</div>
              <div class="number">{{ stats.borrowed }}</div>
            </div>
          </div>
          <div class="col-md-3 mb-3">
            <div class="stats-card returned">
              <div>✅ Đã trả</div>
              <div class="number">{{ stats.returned }}</div>
            </div>
          </div>
          <div class="col-md-3 mb-3">
            <div class="stats-card overdue">
              <div>⚠️ Quá hạn</div>
              <div class="number">{{ stats.overdue }}</div>
            </div>
          </div>
        </div>

        <!-- Bộ lọc -->
        <div class="filter-tabs mb-3">
          <div class="text-center">
            <button
              v-for="filter in filters"
              :key="filter.value"
              :class="[
                'btn',
                currentFilter === filter.value
                  ? 'btn-primary active'
                  : filter.btnClass,
              ]"
              @click="applyFilter(filter.value)"
            >
              {{ filter.label }}
            </button>
          </div>
        </div>

        <!-- Danh sách phiếu mượn -->
        <div v-if="filteredCirculations.length > 0">
          <div
            v-for="c in filteredCirculations"
            :key="c.id"
            class="circulation-card"
          >
            <div class="row align-items-center g-3">
              <!-- Cột 1: Ảnh sách -->
              <div class="col-md-2">
                <img
                  :src="getBookImage(c)"
                  :alt="getBookTitle(c)"
                  class="book-img"
                />
              </div>

              <!-- Cột 2: Thông tin sách -->
              <div class="col-md-3">
                <h5 class="mb-1">{{ getBookTitle(c) }}</h5>
                <p class="text-muted mb-0">{{ getBookAuthor(c) }}</p>
              </div>

              <!-- Cột 3: Thông tin mượn trả + hành động -->
              <div class="col-md-7">
                <div class="row">
                  <div class="col-md-4">
                    <small class="text-muted">Ngày mượn:</small><br />
                    <strong>{{ formatDate(c.borrowDate) }}</strong>
                  </div>
                  <div class="col-md-4">
                    <small class="text-muted">Hạn trả:</small><br />
                    <strong>{{ formatDate(c.dueDate) }}</strong>
                    <span v-html="getDaysLeftHTML(c)"></span>
                  </div>
                  <div class="col-md-4">
                    <small class="text-muted">Ngày trả:</small><br />
                    <strong>{{
                      c.returnDate ? formatDate(c.returnDate) : "-"
                    }}</strong>
                  </div>
                </div>

                <!-- Nút hành động -->
                <div class="mt-2 text-end">
                  <button
                    v-if="c.status === 'CONFIRMED'"
                    class="btn btn-confirm btn-sm me-2"
                    @click="confirmReceive(c)"
                    :disabled="confirmLoading === c.id"
                  >
                    <span v-if="confirmLoading === c.id">
                      <span
                        class="spinner-border spinner-border-sm me-1"
                      ></span>
                      Đang xử lý...
                    </span>
                    <span v-else>✅ Xác nhận đã nhận</span>
                  </button>

                  <button
                    v-if="c.status === 'CONFIRMED'"
                    class="btn btn-danger btn-sm"
                    @click="cancelBorrow(c.id)"
                    :disabled="cancelLoading === c.id"
                    style="border-radius: 20px"
                  >
                    <span v-if="cancelLoading === c.id">
                      <span
                        class="spinner-border spinner-border-sm me-1"
                      ></span>
                      Đang hủy...
                    </span>
                    <span v-else>❌ Hủy mượn</span>
                  </button>

                  <button
                    v-if="c.status === 'PENDING'"
                    class="btn btn-danger btn-sm"
                    @click="cancelBorrow(c.id)"
                    :disabled="cancelLoading === c.id"
                    style="border-radius: 20px"
                  >
                    <span v-if="cancelLoading === c.id">
                      <span
                        class="spinner-border spinner-border-sm me-1"
                      ></span>
                      Đang hủy...
                    </span>
                    <span v-else>❌ Hủy mượn</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty state theo filter -->
        <div v-else-if="circulations.length > 0" class="empty-state">
          <img :src="emptyImage" alt="Empty" />
          <h4>Không có kết quả</h4>
          <p class="text-muted">Không tìm thấy phiếu mượn nào với bộ lọc này</p>
        </div>

        <!-- Empty state khi chưa có lịch sử -->
        <div v-else class="empty-state">
          <img
            src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=300&h=300&fit=crop"
            alt="Empty"
          />
          <h4>Chưa có lịch sử mượn trả</h4>
          <p class="text-muted">Hãy bắt đầu mượn sách để xem lịch sử tại đây</p>
          <router-link to="/books" class="btn btn-primary">
            🎯 Mượn sách ngay
          </router-link>
        </div>
      </template>
    </div>

    <!-- Modal xác nhận -->
    <div
      class="modal fade"
      id="confirmModal"
      tabindex="-1"
      ref="confirmModalRef"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">✅ Xác nhận đã nhận sách</h5>
            <button
              type="button"
              class="btn-close"
              @click="hideModal"
              :disabled="modalProcessing"
            ></button>
          </div>
          <div class="modal-body">
            <p>
              Bạn xác nhận đã nhận sách
              <strong>{{ selectedCirculation?.book?.[0]?.title }}</strong
              >?
            </p>
            <p class="text-muted small">
              Sau khi xác nhận, trạng thái sẽ chuyển sang "Đang mượn"
            </p>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              @click="hideModal"
              :disabled="modalProcessing"
            >
              Hủy
            </button>
            <button
              type="button"
              class="btn btn-success"
              @click="confirmReceive"
              :disabled="modalProcessing"
            >
              <span v-if="modalProcessing">
                <span class="spinner-border spinner-border-sm me-1"></span>
                Đang xử lý...
              </span>
              <span v-else>Xác nhận</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import CirculationService from "../services/circulation.service";
import AuthService from "../services/auth.service";
import emptyImage from "@/assets/empty.png";

export default {
  name: "CirculationHistory",

  data() {
    return {
      emptyImage,
    };
  },

  setup() {
    const circulations = ref([]);
    const currentFilter = ref("all");
    const stats = ref({ confirmed: 0, borrowed: 0, returned: 0, overdue: 0 });
    const loading = ref(true);
    const confirmLoading = ref(null);
    const cancelLoading = ref(null);
    const modalProcessing = ref(false);

    const filters = [
      { label: "Tất cả", value: "all", btnClass: "btn-outline-primary" },
      {
        label: "Chờ duyệt",
        value: "pending",
        btnClass: "btn-outline-secondary",
      },
      {
        label: "Chờ nhận",
        value: "confirmed",
        btnClass: "btn-outline-warning",
      },
      {
        label: "Đang mượn",
        value: "borrowed",
        btnClass: "btn-outline-primary",
      },
      { label: "Đã trả", value: "returned", btnClass: "btn-outline-success" },
      { label: "Quá hạn", value: "overdue", btnClass: "btn-outline-danger" },
    ];

    const selectedCirculation = ref(null);
    const confirmModalRef = ref(null);

    const filteredCirculations = computed(() => {
      let arr;
      if (currentFilter.value === "all") {
        arr = circulations.value.filter((c) => c.status !== "CANCELED");
      } else {
        arr = circulations.value.filter(
          (c) => getStatus(c) === currentFilter.value
        );
      }
      return arr.slice().reverse();
    });

    function formatDate(dateStr) {
      if (!dateStr) return "-";
      return new Date(dateStr).toLocaleDateString("vi-VN");
    }

    function getStatus(c) {
      if (c.status === "PENDING") return "pending";
      if (c.status === "RETURNED") return "returned";
      if (c.status === "CONFIRMED") return "confirmed";
      if (c.status === "CANCELED") return "canceled";

      const today = new Date();
      const dueDate = new Date(c.dueDate);

      if (c.status === "BORROWED" && today > dueDate) return "overdue";
      if (c.status === "BORROWED") return "borrowed";

      return c.status.toLowerCase();
    }

    function getStatusText(c) {
      const status = getStatus(c);
      const map = {
        pending: "Chờ thủ thư duyệt",
        confirmed: "Chờ nhận sách",
        borrowed: "Đang mượn",
        returned: "Đã trả",
        overdue: "Quá hạn",
        canceled: "Đã hủy",
      };
      return map[status] || "";
    }

    function getStatusClass(c) {
      return getStatus(c);
    }

    function getDaysLeftHTML(c) {
      const status = getStatus(c);
      const today = new Date();
      const due = new Date(c.dueDate);
      const daysLeft = Math.ceil((due - today) / (1000 * 60 * 60 * 24));

      if (status === "borrowed" && daysLeft > 0) {
        return `<strong class="text-success ms-2">⏰ Còn ${daysLeft} ngày</strong>`;
      } else if (status === "overdue") {
        return `<strong class="text-danger ms-2">⚠️ Trễ ${Math.abs(
          daysLeft
        )} ngày</strong>`;
      }
      return "";
    }

    function getBookTitle(c) {
      return c.book?.[0]?.title || "Đang tải thông tin sách...";
    }

    function getBookAuthor(c) {
      return c.book?.[0]?.author || "Chưa có thông tin";
    }

    function getBookImage(c) {
      const imgPath = c.book?.[0]?.img;
      if (!imgPath) {
        return "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=400&fit=crop";
      }
      return imgPath.startsWith("/")
        ? `http://localhost:3000${imgPath}`
        : imgPath;
    }

    function applyFilter(filter) {
      currentFilter.value = filter;
    }

    async function loadCirculations() {
      loading.value = true;
      try {
        const currentReader = AuthService.getCurrentReader();
        if (!currentReader?.id) {
          alert("⚠️ Vui lòng đăng nhập lại");
          return;
        }

        const res = await CirculationService.getByReader(currentReader.id);
        circulations.value = res.data?.data || [];

        updateStats();
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu:", err);
        alert("❌ Không thể tải dữ liệu. Vui lòng thử lại!");
      } finally {
        loading.value = false;
      }
    }

    function updateStats() {
      stats.value = { confirmed: 0, borrowed: 0, returned: 0, overdue: 0 };
      circulations.value.forEach((c) => {
        const status = getStatus(c);
        if (status !== "canceled")
          stats.value[status] = (stats.value[status] || 0) + 1;
      });
    }

    function showConfirmModal(c) {
      selectedCirculation.value = c;
      const modal = new bootstrap.Modal(confirmModalRef.value);
      modal.show();
    }

    async function confirmReceive(c) {
      if (!c) return;
      confirmLoading.value = c.id;
      try {
        await CirculationService.confirmBorrow({
          circulationId: c.id,
        });
        c.status = "BORROWED";
        updateStats();
        alert("✅ Đã xác nhận nhận sách thành công!");
      } catch (err) {
        console.error("Lỗi khi xác nhận:", err);
        alert("❌ Không thể xác nhận. Vui lòng thử lại!");
      } finally {
        confirmLoading.value = null;
      }
    }

    async function cancelBorrow(id) {
      if (!confirm("Bạn có chắc muốn hủy mượn sách này không?")) return;
      cancelLoading.value = id;
      try {
        await CirculationService.cancelBorrow({ circulationId: id });
        const c = circulations.value.find((c) => c.id === id);
        if (c) c.status = "CANCELED";
        updateStats();
        alert("✅ Đã hủy mượn sách thành công!");
      } catch (err) {
        console.error("Lỗi khi hủy:", err);
        alert("❌ Không thể hủy mượn. Vui lòng thử lại!");
      } finally {
        cancelLoading.value = null;
      }
    }

    function hideModal() {
      const modal = bootstrap.Modal.getInstance(confirmModalRef.value);
      if (modal) modal.hide();
    }

    onMounted(() => {
      loadCirculations();
    });

    return {
      circulations,
      stats,
      filters,
      currentFilter,
      loading,
      confirmLoading,
      cancelLoading,
      modalProcessing,
      filteredCirculations,
      selectedCirculation,
      confirmModalRef,
      formatDate,
      getStatusText,
      getStatusClass,
      getDaysLeftHTML,
      getBookTitle,
      getBookAuthor,
      getBookImage,
      applyFilter,
      showConfirmModal,
      confirmReceive,
      cancelBorrow,
      hideModal,
    };
  },
};
</script>

<style scoped>
body {
  background: #f8f9fa;
  min-height: 100vh;
}
.navbar-brand {
  font-weight: 700;
  color: #667eea;
}
.page-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 40px 0;
  margin-bottom: 40px;
  border-radius: 0 0 30px 30px;
}
.stats-card {
  background: white;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  text-align: center;
  transition: transform 0.3s;
}
.stats-card:hover {
  transform: translateY(-5px);
}
.stats-card .number {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 10px 0;
}
.stats-card.confirmed .number {
  color: #f59e0b;
}
.stats-card.borrowed .number {
  color: #3b82f6;
}
.stats-card.returned .number {
  color: #10b981;
}
.stats-card.overdue .number {
  color: #ef4444;
}

.circulation-card {
  background: white;
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  transition: all 0.3s;
}
.circulation-card:hover {
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
}
.circulation-card .book-img {
  width: 100px;
  height: 140px;
  object-fit: cover;
  border-radius: 10px;
}
.status-badge {
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}
.status-badge.confirmed {
  background: #fef3c7;
  color: #92400e;
}
.status-badge.borrowed {
  background: #dbeafe;
  color: #1e40af;
}
.status-badge.returned {
  background: #d1fae5;
  color: #065f46;
}
.status-badge.overdue {
  background: #fee2e2;
  color: #991b1b;
}
.status-badge.canceled {
  background: #f3f4f6;
  color: #6b7280;
}
.btn-confirm {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border: none;
  color: white;
  padding: 8px 20px;
  border-radius: 20px;
  font-weight: 600;
  transition: all 0.3s;
}
.btn-confirm:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(16, 185, 129, 0.4);
}
.btn-confirm:disabled,
.btn-danger:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.filter-tabs {
  background: white;
  border-radius: 15px;
  padding: 10px;
  margin-bottom: 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
}
.filter-tabs .btn {
  border-radius: 10px;
  margin: 0 5px;
  font-weight: 600;
}
.empty-state {
  text-align: center;
  padding: 60px 20px;
}
.empty-state img {
  width: 200px;
  opacity: 0.5;
  margin-bottom: 20px;
  border-radius: 10px;
}
</style>
