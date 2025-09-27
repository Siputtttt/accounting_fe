<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import Navbar from "./components/Navbar.vue";
import { PerfectScrollbar } from "vue3-perfect-scrollbar";
import "vue3-perfect-scrollbar/style.css";

const pages = [
  {
    id: 1,
    name: "Login Page",
    routeName: "login-page",
    image: "http://sximobuilder.net/srv/sximov7/storage/screenshoots/LoginPage.png",
    desc: "Halaman untuk pengguna masuk ke sistem menggunakan akun terdaftar.",
  },
  {
    id: 2,
    name: "Register Page",
    routeName: "register-page",
    image: "http://sximobuilder.net/srv/sximov7/storage/screenshoots/RegisterPage.png",
    desc: "Halaman untuk pengguna mendaftar akun baru.",
  },
  {
    id: 3,
    name: "Forgot Password Page",
    routeName: "forgot-password-page",
    image:
      "http://sximobuilder.net/srv/sximov7/storage/screenshoots/ForgotPasswordPage.png",
    desc:
      "Halaman untuk mengatur ulang kata sandi yang lupa dengan mengirimkan tautan pemulihan ke email terdaftar.",
  },
  {
    id: 4,
    name: "Profile Page",
    routeName: "profile-page",
    image: "http://sximobuilder.net/srv/sximov7/storage/screenshoots/ProfilePage.png",
    desc:
      "Halaman untuk melihat dan mengelola informasi pribadi pengguna, termasuk mengubah data akun dan pengaturan profil.",
  },
];
</script>

<template>
  <div class="sximo-main w-100 vh-100">
    <Navbar />
    <div class="container main-data">
      <div class="row g-4">
        <div v-for="page in pages" :key="page.name" class="col-12 col-md-4">
          <router-link :to="`/detail/${page.routeName}`" class="text-decoration-none">
            <div class="card custom-card overflow-hidden">
              <div class="img-wrapper">
                <img :src="page.image" :alt="page.name" class="img-fluid" />
              </div>
            </div>
            <div class="p-2">
              <h6 class="mb-1">{{ page.name }}</h6>
              <p class="small text-muted" style="line-height: normal">{{ page.desc }}</p>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
body {
  padding-top: 80px;
}

.main-data {
  background: #eff3fa !important;
  padding: 80px 0;
}

h6 {
  padding-top: 10px;
}

.custom-card {
  transition: transform 0.5s ease;
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
}

.custom-card:hover {
  transform: scale(1.03);
  z-index: 2;
}

.img-wrapper {
  overflow: hidden;
  height: 200px;
}

.img-wrapper img {
  transition: transform 0.5s ease;
  object-fit: cover;
  width: 100%;
  height: 100%;
}

.custom-card:hover .img-wrapper img {
  transform: scale(1.15);
}
</style>
