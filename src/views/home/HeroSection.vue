<!-- Komponen HeroSection.vue -->
<script setup>
const props = defineProps({
  backgroundImage: String,
  title: {
    type: String,
    default: "Sximo LV",
  },
  subtitle: {
    type: String,
    default: "Platform modern untuk manajemen aplikasi Anda",
  },
  contentPosition: {
    type: String,
    default: "left",
  },
});
</script>

<template>
  <div class="hero-section">
    <div class="hero-bg w-100 h-100">
      <img
        :src="backgroundImage"
        alt="Hero Background"
        class="w-100 h-100 object-fit-cover"
      />
    </div>

    <div class="">
      <div class="container">
        <div class="row justify-content-start">
          <div class="col-12 col-md-6">
            <div class="text-white mt-20 cals-sans" :class="`text-${contentPosition}`">
              <h1 class="display-1">{{ title }}</h1>
              <p class="lead">{{ subtitle }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hero-section {
  height: 100vh;
  min-height: 600px;
  overflow: hidden;
}

.mt-20 {
  margin-top: 10rem !important;
}
</style>
