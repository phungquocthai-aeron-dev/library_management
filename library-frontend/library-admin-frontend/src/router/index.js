import { createRouter, createWebHistory } from "vue-router";
import AuthService from "@/services/auth.service"; // service để check login

const routes = [
  {
    path: "/",
    component: () => import("@/layouts/MainLayout.vue"),
    redirect: "",
    children: [
      {
        path: "",
        name: "home",
        component: () => import("@/views/Book.vue"),
      },
      {
        path: "circulation",
        name: "circulation",
        component: () => import("@/views/Circulation.vue"),
      },
    ],
  },

  {
    path: "/auth",
    component: () => import("@/layouts/AuthLayout.vue"),
    children: [
      {
        path: "login",
        name: "login",
        component: () => import("@/views/Login.vue"),
      },
    ],
  },

  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("@/views/NotFound.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition;
    return { top: 0 };
  },
});

// // --- Navigation Guard ---
// router.beforeEach((to, from, next) => {
//   const requiresAuth = to.meta.requiresAuth;

//   if (requiresAuth && !AuthService.getCurrentReader()) {
//     next({ name: "home" });
//   } else {
//     next();
//   }
// });

export default router;
