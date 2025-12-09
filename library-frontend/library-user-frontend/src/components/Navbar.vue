<template>
  <nav
    class="navbar navbar-expand-lg navbar-light bg-white shadow-sm rounded sticky-top mb-4"
  >
    <div class="container">
      <router-link class="navbar-brand" :to="{ name: 'home' }">
        📚 Library System
      </router-link>

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarContent"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div
        class="collapse navbar-collapse d-flex justify-content-between align-items-center"
        id="navbarContent"
      >
        <div
          class="mx-auto position-relative"
          style="flex: 1; max-width: 500px"
        >
          <form
            class="d-flex align-items-center"
            @submit.prevent="handleSearch"
          >
            <div class="input-group">
              <input
                v-model="searchValue"
                class="form-control rounded-start-pill"
                type="search"
                placeholder="Tìm kiếm sách..."
              />
              <button
                type="button"
                @click="toggleVoiceSearch"
                :class="['btn', 'btn-voice', { active: isListening }]"
                :title="
                  isListening ? 'Đang nghe...' : 'Tìm kiếm bằng giọng nói'
                "
              >
                <i v-if="!isListening" class="fa-solid fa-microphone"></i>
                <i v-else class="fa-solid fa-circle" style="color: #dc3545"></i>
              </button>

              <button class="btn btn-primary rounded-end-pill" type="submit">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
              </button>
            </div>
          </form>

          <!-- Listening indicator -->
          <div v-if="isListening" class="listening-indicator">
            <span class="pulse-dot"></span>
            <span class="ms-2">Đang nghe... Hãy nói tên sách bạn muốn tìm</span>
          </div>

          <!-- Voice error -->
          <div v-if="voiceError" class="alert alert-warning alert-sm mt-2 mb-0">
            {{ voiceError }}
          </div>
        </div>

        <!-- Avatar / login buttons -->
        <div>
          <div v-if="!isLoggedIn">
            <router-link to="/auth/login" class="btn btn-outline-primary me-2">
              Đăng nhập
            </router-link>
            <router-link to="/auth/register" class="btn btn-primary">
              Đăng ký
            </router-link>
          </div>

          <div v-else class="dropdown">
            <img
              :src="defaultAvatar"
              class="rounded-circle border border-2 border-primary"
              alt="avatar"
              data-bs-toggle="dropdown"
              style="
                cursor: pointer;
                width: 40px;
                height: 40px;
                object-fit: cover;
              "
            />
            <ul class="dropdown-menu dropdown-menu-end">
              <li class="px-3 py-2 border-bottom">
                <strong>{{ currentUser?.fullName }}</strong>
              </li>
              <li>
                <router-link to="/profile" class="dropdown-item">
                  ⚙️ Tài khoản
                </router-link>
              </li>
              <li>
                <router-link to="/circulation" class="dropdown-item">
                  📘 Quản lý mượn trả
                </router-link>
              </li>
              <li>
                <button class="dropdown-item text-danger" @click="handleLogout">
                  🚪 Đăng xuất
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import AuthService from "@/services/auth.service";
import defaultAvatar from "@/assets/default-avatar.jpg";
import BookService from "@/services/book.service";

export default {
  data() {
    return {
      currentUser: AuthService.getCurrentReader(),
      defaultAvatar,
      searchValue: "",
      isListening: false,
      voiceError: "",
      recognition: null,
    };
  },
  computed: {
    isLoggedIn() {
      return AuthService.isLoggedIn();
    },
  },
  mounted() {
    this.initSpeechRecognition();
  },
  beforeUnmount() {
    if (this.recognition) {
      this.recognition.stop();
    }
  },
  methods: {
    async handleLogout() {
      await AuthService.logout();
      this.currentUser = null;
      this.$router.push({ name: "login" });
    },

    async handleSearch() {
      if (!this.searchValue) return;

      try {
        const res = await BookService.search(this.searchValue);
        console.log("Kết quả tìm kiếm:", res.data.data);

        this.$router.push({
          name: "searchResults",
          query: { q: this.searchValue },
        });
      } catch (err) {
        console.error("Lỗi tìm kiếm:", err);
      }
    },

    initSpeechRecognition() {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

      if (!SpeechRecognition) {
        console.warn("Trình duyệt không hỗ trợ Web Speech API");
        return;
      }

      this.recognition = new SpeechRecognition();
      this.recognition.lang = "vi-VN";
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.maxAlternatives = 1;

      this.recognition.onstart = () => {
        this.isListening = true;
        this.voiceError = "";
      };

      this.recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        this.searchValue = transcript;
        console.log("Kết quả nhận dạng giọng nói:", transcript);

        setTimeout(() => {
          this.handleSearch();
        }, 500);
      };

      this.recognition.onerror = (event) => {
        this.isListening = false;

        switch (event.error) {
          case "no-speech":
            this.voiceError = "Không phát hiện giọng nói. Vui lòng thử lại.";
            break;
          case "audio-capture":
            this.voiceError = "Không tìm thấy microphone.";
            break;
          case "not-allowed":
            this.voiceError = "Vui lòng cho phép truy cập microphone.";
            break;
          default:
            this.voiceError = `Lỗi nhận dạng: ${event.error}`;
        }

        setTimeout(() => {
          this.voiceError = "";
        }, 3000);
      };

      this.recognition.onend = () => {
        this.isListening = false;
      };
    },

    // Bật/tắt nhận dạng giọng nói
    toggleVoiceSearch() {
      if (!this.recognition) {
        this.voiceError =
          "Trình duyệt của bạn không hỗ trợ nhận dạng giọng nói";
        setTimeout(() => {
          this.voiceError = "";
        }, 3000);
        return;
      }

      if (this.isListening) {
        this.recognition.stop();
      } else {
        try {
          this.recognition.start();
        } catch (error) {
          console.error("Lỗi khởi động nhận dạng giọng nói:", error);
          this.voiceError = "Không thể khởi động nhận dạng giọng nói";
          setTimeout(() => {
            this.voiceError = "";
          }, 3000);
        }
      }
    },
  },
};
</script>

<style scoped>
.navbar-brand {
  font-weight: 700;
  color: #667eea;
  cursor: pointer;
}

.input-group {
  position: relative;
}

.btn-voice {
  background: white;
  border: 1px solid #ced4da;
  border-left: none;
  border-right: none;
  color: #6c757d;
  padding: 0.375rem 0.75rem;
  transition: all 0.3s ease;
}

.btn-voice:hover {
  background: #f8f9fa;
  color: #495057;
}

.btn-voice.active {
  background: #dc3545;
  color: white;
  border-color: #dc3545;
  animation: pulse-animation 1.5s ease-in-out infinite;
}

.listening-indicator {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #fff3cd;
  color: #856404;
  padding: 8px 12px;
  border-radius: 0.25rem;
  margin-top: 5px;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.pulse-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #dc3545;
  animation: pulse-animation 1.5s ease-in-out infinite;
}

.alert-sm {
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

@keyframes pulse-animation {
  0%,
  100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.7;
  }
}
</style>
