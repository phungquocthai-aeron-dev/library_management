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
                <img :src="getBookImage(c)" :alt="getBookTitle(c)"
                class="book-img"
              </div>

              <!-- Cột 2: Thông tin sách và người dùng -->
              <div class="col-md-3">
                <h5 class="mb-1">{{ getBookTitle(c) }}</h5>
                <p class="text-muted mb-1">{{ getBookAuthor(c) }}</p>
                <small
                  >Người mượn: {{ c.reader?.fullName }} (ID:
                  {{ c.reader?._id }})</small
                ><br />
                <small v-if="c.staff"
                  >Nhân viên duyệt: {{ c.staff?.fullName }}</small
                >
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
                      c.returnDate &&
                      c.returnDate !== "1970-01-01T00:00:00.000Z"
                        ? formatDate(c.returnDate)
                        : "-"
                    }}</strong>
                  </div>
                </div>

                <!-- Nút hành động -->
                <div class="mt-2 text-end">
                  <!-- Chờ nhận -->
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

                  <!-- Chờ duyệt -->
                  <button
                    v-if="c.status === 'PENDING'"
                    class="btn btn-primary btn-sm me-2"
                    @click="approveBorrow(c)"
                    :disabled="approveLoading === c.id"
                  >
                    <span v-if="approveLoading === c.id">
                      <span
                        class="spinner-border spinner-border-sm me-1"
                      ></span>
                      Đang xử lý...
                    </span>
                    <span v-else>📄 Duyệt</span>
                  </button>

                  <!-- Hủy mượn -->
                  <button
                    v-if="['CONFIRMED', 'PENDING'].includes(c.status)"
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
                    v-if="['borrowed', 'overdue'].includes(getStatus(c))"
                    class="btn btn-success btn-sm me-2"
                    @click="returnBook(c)"
                    :disabled="returnLoading === c.id"
                    style="border-radius: 20px"
                  >
                    <span v-if="returnLoading === c.id">
                      <span
                        class="spinner-border spinner-border-sm me-1"
                      ></span>
                      Đang xử lý...
                    </span>
                    <span v-else>📦 Xác nhận trả sách</span>
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
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import CirculationService from "../services/circulation.service";
import emptyImage from "@/assets/empty.png";
import AuthService from "../services/auth.service";

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
    const approveLoading = ref(null);
    const returnLoading = ref(null);

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
      return c.book?.title || "Đang tải thông tin sách...";
    }

    function getBookAuthor(c) {
      return c.book?.author || "Chưa có thông tin";
    }

    function getBookImage(c) {
      const imgPath = c.book?.img;
      if (!imgPath)
        return "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=400&fit=crop";
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
        const res = await CirculationService.findAll();
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

    async function confirmReceive(c) {
      if (!c) return;
      confirmLoading.value = c.id;
      try {
        await CirculationService.confirmBorrow({ circulationId: c.id });
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

    async function approveBorrow(c) {
      if (!c) return;
      approveLoading.value = c.id;
      try {
        // Lấy nhân viên hiện tại
        const currentStaff = AuthService.getCurrentReader(); // hoặc getCurrentStaff() nếu backend tách reader/staff
        if (!currentStaff)
          throw new Error("Không tìm thấy thông tin nhân viên");

        await CirculationService.approveBorrow({
          circulationId: c.id,
          staffId: currentStaff._id, // dùng ID thật
        });
        c.status = "CONFIRMED";
        c.staff = currentStaff; // hiển thị tên nhân viên duyệt
        updateStats();
        alert("✅ Phiếu mượn đã được duyệt!");
      } catch (err) {
        console.error("Lỗi khi duyệt phiếu:", err);
        alert("❌ Không thể duyệt phiếu. Vui lòng thử lại!");
      } finally {
        approveLoading.value = null;
      }
    }

    async function returnBook(c) {
      if (!c) return;
      if (!confirm("Bạn có chắc đã trả sách này?")) return;

      returnLoading.value = c.id;
      try {
        await CirculationService.returnBook({
          circulationId: c.id,
          returnDate: new Date().toISOString(), // hoặc ngày hiện tại
        });
        c.status = "RETURNED";
        c.returnDate = new Date().toISOString();
        updateStats();
        alert("✅ Đã xác nhận trả sách thành công!");
      } catch (err) {
        console.error("Lỗi khi trả sách:", err);
        alert("❌ Không thể trả sách. Vui lòng thử lại!");
      } finally {
        returnLoading.value = null;
      }
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
      approveLoading,
      filteredCirculations,
      formatDate,
      getStatus,
      getDaysLeftHTML,
      getBookTitle,
      getBookAuthor,
      getBookImage,
      applyFilter,
      confirmReceive,
      cancelBorrow,
      approveBorrow,
      returnBook,
    };
  },
};
</script>

<style scoped>
/* Header */
.page-header {
  background: #f8f9fa;
  padding: 30px 0;
  margin-bottom: 20px;
  border-bottom: 1px solid #e5e5e5;
}

/* Stats cards */
.stats-card {
  padding: 20px;
  border-radius: 12px;
  color: white;
  text-align: center;
  font-weight: bold;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
.stats-card .number {
  font-size: 24px;
  margin-top: 5px;
}
.stats-card.confirmed {
  background: #ffc107;
}
.stats-card.borrowed {
  background: #0d6efd;
}
.stats-card.returned {
  background: #198754;
}
.stats-card.overdue {
  background: #dc3545;
}

/* Filter Tabs */
.filter-tabs button {
  margin: 5px;
  border-radius: 20px;
  padding: 8px 20px;
}

/* Circulation Cards */
.circulation-card {
  background: #fff;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 15px;
  border: 1px solid #eee;
  transition: 0.2s;
}
.circulation-card:hover {
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.1);
}

/* Book Image */
.book-img {
  width: 90px;
  object-fit: cover;
  border-radius: 8px;
}

/* Empty state */
.empty-state {
  text-align: center;
  margin-top: 40px;
}
.empty-state img {
  width: 180px;
  opacity: 0.8;
}

/* Buttons */
.btn-confirm {
  background: #198754;
  color: white;
  border-radius: 20px;
}
.btn-confirm:hover {
  background: #157347;
}
</style>
