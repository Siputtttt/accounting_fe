<script setup>
import { ref, onMounted, watch, getCurrentInstance } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "@/store";
import { useMessageStore } from "@/store/messageStore";

const { proxy } = getCurrentInstance();
const store = useStore();
const router = useRouter();
const messageStore = useMessageStore();
const profile = ref({});
const info = ref([]);
defineProps(["isExpanded"]);
const confirmLogout = async () => {
  const result = await proxy.$swal.fire({
    title: "Are you sure?",
    text: "Leave from the application system!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, Continue!",
  });

  if (result.isConfirmed) {
    store.logout();
    await router.push("/auth/login");
  }
};
const goWeb = async () => {
  router.push("/");
};
const fetchInfo = async () => {
  try {
    const response = await store.getData({
      url: "api/info",
      headers: {
        "Content-Type": "application/json",
      },
      responseType: "json",
    });
    if (response && response.data.data) {
      localStorage.setItem("info", JSON.stringify(response.data.data));
      info.value = response.data.data;
    }
  } catch (error) {}
};

const infoAlert = async () => {
  const result = await proxy.$swal.fire({
    title: "About Sximo Builder NET",
    icon: "info",
    html: `
      Version 1.0.0 Build On May 30 , 2025. <br />
      <i class="bi bi-c-circle"></i> 2013 - 2025  <a href="#" autofocus>ELima Group Coorporate </a> <br />
      Bandung -  Indonesia .
    `,
  });

  if (result.isConfirmed) {
  }
};

watch(
  () => messageStore.triggerSubmit,
  (newVal) => {
    if (newVal) {
      fetchInfo();
      messageStore.triggerReset();
    }
  }
);
onMounted(() => {
  const infoApp = localStorage.getItem("info") || sessionStorage.getItem("info");
  info.value = JSON.parse(infoApp);

  const storedProfile =
    localStorage.getItem("profile") || sessionStorage.getItem("profile");

  if (storedProfile) {
    profile.value = JSON.parse(storedProfile);
    profile.value.avatar = `${store.baseUrl}storage/${profile.value.avatar}`;
  }
});
</script>
<template>
  <BNavbar v-b-color-mode="'light'" class="topbar">
    <BNavbarBrand tag="h5" class="mb-0">
      <router-link to="/dashboard">
        <img :src="info.logo" width="35" />
        <span>{{ info.appname }}</span>
      </router-link>
    </BNavbarBrand>
    <BNavbarToggle target="nav-collapse" />
    <BCollapse id="nav-collapse" is-nav>
      <button
        class="btn btn-sm me-3 btn-expanded"
        @click="$emit('toggleSidebar')"
        size="sm"
      >
        <i :class="isExpanded ? 'bi bi-list' : 'bi bi-chevron-right'"></i>
      </button>

      <button class="btn btn-sm me-3" @click="goWeb" size="sm">
        <i class="bi bi-globe2"></i>
      </button>

      <BFormInput class="me-2 top-search" size="sm" placeholder="Search" />
    </BCollapse>
    <ul class="nav nav-pills sximo-menu">
      <li class="nav-item dropdown">
        <a
          class="nav-link dropdown-toggle"
          data-bs-toggle="dropdown"
          href="#"
          role="button"
          aria-expanded="false"
          data-bs-offset="[10, 20]"
        >
          <i class="bi bi-grid"></i>
        </a>

        <ul class="dropdown-menu dropdown-menu-end shadow" style="margin-top: 11px">
          <li>
            <router-link to="/core/settings" class="dropdown-item">
              <i class="bi bi-sliders"></i> General Settings
            </router-link>
          </li>
          <li>
            <hr class="dropdown-divider" />
          </li>
          <li>
            <router-link to="/core/user-management" class="dropdown-item">
              <i class="bi bi-person-lock"></i> Users & Group Management
            </router-link>
          </li>
          <li>
            <router-link to="/core/categories" class="dropdown-item">
              <i class="bi bi-file"></i> Posts / Articles CMS
            </router-link>
          </li>

          <li>
            <router-link to="/core/menus" class="dropdown-item">
              <i class="bi bi-layout-text-sidebar"></i> Menu Management
            </router-link>
          </li>
          <li>
            <hr class="dropdown-divider" />
          </li>
          <li>
            <router-link to="/core/module" class="dropdown-item">
              <i class="bi bi-bootstrap-fill"></i> Module ( CRUD ) Generator
            </router-link>
          </li>
          <li>
            <router-link to="/core/repositories" class="dropdown-item">
              <i class="bi bi-files"></i> Repositories
            </router-link>
          </li>
          <li>
            <router-link to="/core/database" class="dropdown-item">
              <i class="bi bi-database"></i> Database
            </router-link>
          </li>
          <li>
            <router-link to="/core/media" class="dropdown-item">
              <i class="bi bi-card-image"></i> Media / images
            </router-link>
          </li>
          <li>
            <hr class="dropdown-divider" />
          </li>
          <li>
            <router-link to="/core/audit" class="dropdown-item">
              <i class="bi bi-clock-history"></i> Audit Trail
            </router-link>
          </li>
          <li>
            <hr class="dropdown-divider" />
          </li>
          <li>
            <a class="dropdown-item" href="#" @click="infoAlert()"
              ><i class="bi bi-info-circle"></i> About Sximo Builder</a
            >
          </li>
        </ul>
      </li>
    </ul>
    <router-link to="/profile">
      <img :src="profile.avatar" width="30" class="profile-pic" />
    </router-link>
    <button class="btn btn-sm me-3 btn-expanded" @click="confirmLogout" size="sm">
      <i class="bi bi-power"></i>
    </button>
  </BNavbar>
</template>

<style>
p {
  line-height: 1.8rem;
}
</style>
<style scoped>
.topbar {
  height: 56px;
  border-bottom: solid 1px #d4d4d4;
  position: fixed;
  width: 100%;
  z-index: 50;
  top: 0;
  background: #f9fafb;
}
h5.navbar-brand {
  font-size: 14px;
  font-weight: 600;
  width: 220px;
}
h5.navbar-brand img {
  margin-right: 5px;
}
h5.navbar-brand a {
  text-decoration: none;
  color: #000;
}
.btn-expanded {
  border: 0 !important;
  color: #000 !important;
}
.top-search {
  width: 250px;
  border-radius: 50px;
  background: #fff;
  border: solid 1px #d4d4d4;
}

.profile-pic {
  border-radius: 50px;
  border: solid 1px #ddd;
  margin-right: 10px;
}

.sximo-menu ul li a {
  font-size: 0.85rem;
  padding: 6px 10px 6px 15px;
}
.sximo-menu ul li a i {
  font-size: 14px;
  color: #2e5894;
  padding-right: 5px;
}
</style>
