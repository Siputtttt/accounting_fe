<script setup>
import { ref, onMounted } from "vue";
const info = ref([]);
onMounted(() => {
  const infoApp = localStorage.getItem("info") || sessionStorage.getItem("info");
  info.value = JSON.parse(infoApp);
});
</script>
<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-light bg-light fixed-top sximo-nav">
      <div class="container">
        <a class="navbar-brand" href="#">
          <img :src="info.logo" width="25" />
          Sximo Builder NET
        </a>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <router-link to="/home" class="nav-link">Home</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/screenshoot" class="nav-link">ScreenShoot</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/docs" class="nav-link">Documentation</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/docs" class="nav-link">Discussion</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/docs" class="nav-link">Ticketing</router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </div>
</template>

<style scoped>
.sximo-nav {
  border-bottom: solid 1px #d4d4d4;
  background: #fff;
}
</style>
