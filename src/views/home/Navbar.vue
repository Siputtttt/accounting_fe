<!-- Komponen Navbar.vue -->
<script setup>
import { ref } from "vue";

const props = defineProps({
  brandName: {
    type: String,
    default: "Sximo",
  },
  navItems: {
    type: Array,
    default: () => [
      { name: "Home", type: "link" },
      { name: "About", type: "link" },
      { name: "Auth", type: "dropdown", items: ["Login", "Register"] },
    ],
  },
  descriptionTitle: {
    type: String,
    default: "Sximo",
  },
  descriptionText: {
    type: String,
    default: "Platform modern untuk manajemen aplikasi Anda",
  },
});

const MenuCollapse = ref(false);
const DropdownCollapse = ref(false);

const toggleMenu = () => {
  MenuCollapse.value = !MenuCollapse.value;
};
</script>

<template>
  <!-- Navbar -->
  <nav
    class="navbar navbar-expand-lg glass-navbar rounded-4 shadow my-4 mx-auto px-4"
    style="width: 85%; max-width: 1200px"
  >
    <div class="container-fluid">
      <a
        class="navbar-brand fw-bold text-white d-flex align-items-center ps-sm-3"
        href="#"
      >
        <i class="fas fa-sparkle me-2"></i>{{ brandName }}
      </a>

      <button
        class="navbar-toggler"
        type="button"
        @click="toggleMenu"
        :aria-expanded="MenuCollapse.toString()"
        aria-controls="navbarNav"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div
        id="navbarNav"
        class="collapse navbar-collapse"
        :class="{ show: MenuCollapse }"
      >
        <ul class="navbar-nav ms-auto">
          <li
            v-for="(item, index) in navItems"
            :key="index"
            class="nav-item mx-lg-2 my-1 my-lg-0"
            @mouseover="item.type === 'dropdown' ? (DropdownCollapse = true) : null"
            @mouseleave="item.type === 'dropdown' ? (DropdownCollapse = false) : null"
          >
            <a class="nav-link fw-bold text-white py-2" href="#">
              {{ item.name }}
              <i v-if="item.type === 'dropdown'" class="bi bi-chevron-down ms-1"></i>
              <div class="nav-underline"></div>
            </a>

            <ul
              v-if="item.type === 'dropdown'"
              class="dropdown-menu bg-dark mt-0 border-0"
              :class="{ show: DropdownCollapse }"
            >
              <li v-for="(subItem, subIndex) in item.items" :key="subIndex">
                <a class="dropdown-item text-white py-2" href="#">{{ subItem }}</a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.glass-navbar {
  background: rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.18);
}

.dropdown-item:hover {
  background-color: #00000096;
  transition: all 0.9s ease-in-out;
}
</style>
