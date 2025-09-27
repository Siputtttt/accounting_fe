<script setup>
import Navbar from "./Navbar.vue";
import HeroSection from "./HeroSection.vue";
import officeBuilding from "@/assets/img/office-building.jpg";
</script>

<template>
  <div class="main-wrapper">
    <div class="hero-container">
      <Navbar />
      <HeroSection
        :background-image="officeBuilding"
        title="Sximo LV"
        subtitle="Platform modern untuk manajemen aplikasi Anda"
        content-position="left"
      />
    </div>
  </div>
</template>

<style scoped>
.hero-container {
  position: relative;
  height: 100vh;
}

.navbar {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 10;
}

.hero-section {
  background-image: url("@/assets/img/office-building.jpg");
  background-size: cover;
  background-position: center;
  height: 100%;
  padding-top: 60px;
}
</style>
