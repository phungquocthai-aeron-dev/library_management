<template>
  <div class="container py-4">
    <h2>Quản lý Sách</h2>

    <!-- Search + Add -->
    <div class="d-flex gap-2 mb-3">
      <button @click="openAdd" class="btn btn-success">Thêm sách</button>
    </div>

    <!-- Loading & Error -->
    <p v-if="loading">Đang tải...</p>
    <p v-if="error" class="text-danger">{{ error }}</p>

    <!-- Table -->
    <table v-else class="table table-bordered table-striped align-middle">
      <thead class="table-dark">
        <tr>
          <th>Ảnh</th>
          <th>Tên</th>
          <th>Tác giả</th>
          <th>Năm</th>
          <th>Giá</th>
          <th>Số lượng</th>
          <th>NXB</th>
          <th>Hiển thị</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="b in books" :key="b.id">
          <td>
            <img
              :src="b.img ? baseUrl + b.img : '/placeholder.png'"
              width="45"
              @error="imgError"
            />
          </td>
          <td>{{ b.title }}</td>
          <td>{{ b.author }}</td>
          <td>{{ b.pubYear }}</td>
          <td>{{ formatPrice(b.price) }}</td>
          <td>{{ b.quantity }}</td>
          <td>{{ b.publisher?.name || "N/A" }}</td>
          <td>{{ b.isActive ? "Hiển thị" : "Ẩn" }}</td>
          <td>
            <button @click="openEdit(b)" class="btn btn-primary btn-sm">
              Sửa
            </button>
            <button @click="openDelete(b)" class="btn btn-danger btn-sm">
              Xóa
            </button>
          </td>
        </tr>

        <tr v-if="books.length === 0">
          <td colspan="9" class="text-center">Không có dữ liệu</td>
        </tr>
      </tbody>
    </table>

    <!-- Modal Add/Edit -->
    <div class="modal d-block" v-if="showModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              {{ isEdit ? "Cập nhật sách" : "Thêm sách mới" }}
            </h5>
            <button
              type="button"
              class="btn-close"
              @click="closeModal"
            ></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="submitForm">
              <div class="mb-2">
                <input
                  v-model="form.title"
                  placeholder="Tên sách"
                  required
                  class="form-control"
                />
              </div>
              <div class="mb-2">
                <input
                  v-model="form.author"
                  placeholder="Tác giả"
                  required
                  class="form-control"
                />
              </div>
              <div class="mb-2">
                <input
                  type="number"
                  v-model="form.pubYear"
                  placeholder="Năm xuất bản"
                  required
                  class="form-control"
                />
              </div>
              <div class="mb-2">
                <input
                  type="number"
                  v-model="form.price"
                  placeholder="Giá"
                  required
                  class="form-control"
                />
              </div>
              <div class="mb-2">
                <input
                  type="number"
                  v-model="form.quantity"
                  placeholder="Số lượng"
                  required
                  class="form-control"
                />
              </div>
              <div class="mb-2">
                <input
                  v-model="form.publisherId"
                  placeholder="Nhà XB (ID)"
                  class="form-control"
                />
              </div>
              <div class="mb-2">
                <input type="file" @change="fileChange" class="form-control" />
              </div>
              <div class="form-check mb-2">
                <input
                  type="checkbox"
                  v-model="form.isActive"
                  class="form-check-input"
                  id="isActive"
                />
                <label class="form-check-label" for="isActive">Hiển thị</label>
              </div>

              <div class="d-flex justify-content-end gap-2">
                <button
                  type="button"
                  @click="closeModal"
                  class="btn btn-secondary"
                >
                  Hủy
                </button>
                <button type="submit" class="btn btn-primary">
                  {{ isEdit ? "Cập nhật" : "Thêm mới" }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Confirm Delete -->
    <div class="modal d-block" v-if="showDelete" tabindex="-1">
      <div class="modal-dialog modal-sm">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Xóa sách?</h5>
            <button
              type="button"
              class="btn-close"
              @click="closeDelete"
            ></button>
          </div>
          <div class="modal-body">
            <p>
              Bạn có chắc xóa "<b>{{ bookDelete?.title }}</b
              >"?
            </p>
          </div>
          <div class="modal-footer">
            <button @click="closeDelete" class="btn btn-secondary">Hủy</button>
            <button @click="deleteBook" class="btn btn-danger">Xóa</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BookService from "../services/book.service";

export default {
  data() {
    return {
      books: [],
      loading: false,
      error: null,
      baseUrl: "http://localhost:3000",

      searchQuery: "",
      timer: null,

      showModal: false,
      showDelete: false,
      isEdit: false,

      form: {
        id: "",
        title: "",
        author: "",
        price: "",
        quantity: "",
        pubYear: "",
        publisherId: "",
        isActive: true,
        img: null,
      },

      bookDelete: null,
    };
  },

  mounted() {
    this.fetchBooks();
  },

  methods: {
    async fetchBooks() {
      this.loading = true;
      try {
        const res = await BookService.getAll();
        this.books = res.data.data || [];
      } catch (e) {
        this.error = "Không thể tải dữ liệu.";
      }
      this.loading = false;
    },

    handleSearch() {
      clearTimeout(this.timer);
      this.timer = setTimeout(async () => {
        if (!this.searchQuery.trim()) return this.fetchBooks();

        const res = await BookService.search(this.searchQuery);
        this.books = res.data || [];
      }, 400);
    },

    openAdd() {
      this.isEdit = false;
      this.resetForm();
      this.showModal = true;
    },

    openEdit(b) {
      this.isEdit = true;
      this.form = { ...b, img: null };
      this.showModal = true;
    },

    closeModal() {
      this.showModal = false;
      this.resetForm();
    },

    openDelete(b) {
      this.bookDelete = b;
      this.showDelete = true;
    },

    closeDelete() {
      this.showDelete = false;
      this.bookDelete = null;
    },

    fileChange(e) {
      this.form.img = e.target.files[0];
    },

    async submitForm() {
      const fd = new FormData();
      Object.keys(this.form).forEach((k) => {
        if (this.form[k] !== null) fd.append(k, this.form[k]);
      });

      try {
        if (this.isEdit) {
          await BookService.update(this.form.id, fd);
          alert("Cập nhật thành công");
        } else {
          await BookService.create(fd);
          alert("Thêm thành công");
        }
        this.closeModal();
        this.fetchBooks();
      } catch (err) {
        alert("Lỗi: " + (err.response?.data?.message || err));
      }
    },

    async deleteBook() {
      try {
        await BookService.hardDelete(this.bookDelete.id);
        alert("Xóa thành công");
        this.closeDelete();
        this.fetchBooks();
      } catch {
        alert("Không thể xóa");
      }
    },

    imgError(e) {
      e.target.src = "/placeholder.png";
    },

    resetForm() {
      this.form = {
        title: "",
        author: "",
        price: "",
        quantity: "",
        pubYear: "",
        publisherId: "",
        isActive: true,
        img: null,
      };
    },

    formatPrice(v) {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(v);
    },
  },
};
</script>

<style scoped>
.container {
  padding: 20px;
}
.actions {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}
.error {
  color: red;
}

/* Table */
.table {
  width: 100%;
  border-collapse: collapse;
}
.table th,
.table td {
  padding: 10px;
  border-bottom: 1px solid #ddd;
}

/* Modal */
.modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal-box {
  background: white;
  padding: 20px;
  border-radius: 6px;
  width: 400px;
}
.modal-box.small {
  width: 300px;
}
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 15px;
}
</style>
