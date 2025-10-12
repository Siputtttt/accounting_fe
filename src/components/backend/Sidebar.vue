<script setup>
import {
  ref,
  onMounted,
  onBeforeUnmount,
  getCurrentInstance,
  computed,
  watch,
} from "vue";
import { useRouter } from "vue-router";
import { useStore } from "@/store";
import SidebarItem from "./SidebarItem.vue";
import { useMessageStore } from "@/store/messageStore";
import { PerfectScrollbar  } from 'vue3-perfect-scrollbar';
import 'vue3-perfect-scrollbar/style.css';
import MenuData from './menuData.js'


const { proxy } = getCurrentInstance();
const messageStore = useMessageStore();
const isOpen = ref(true);
const logo = ref("");
const isMobile = ref(false);
const isMinimized = ref(false);
const store = useStore();
const router = useRouter();
const profile = ref({});
const menus = ref([]);
const props = defineProps(["info", "isExpanded"]);
const info = ref({
  appname: "Sximo Builder v.7",
});
 

const checkScreenSize = () => {
  isMobile.value = window.innerWidth < 768;
  isOpen.value = !isMobile.value;
};

const confirmLogout = async () => {
  const result = await proxy.$swal.fire({
    title: "Are you sure?",
    text: "Get Out from the system!",
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

const fetchMenu = async () => {
  try {
    const response = await store.getData({
      url: "api/core/menus",
      headers: {
        "Content-Type": "application/json",
      },
      responseType: "json",
    });
    if (response && response.data.data) {
      const apiMenus = response.data.data;
      const mergedMenus = [...MenuData, ...apiMenus];

      localStorage.setItem("menus", JSON.stringify(mergedMenus));
      menus.value = JSON.parse(localStorage.getItem("menus"));
    }
  } catch (error) {}
};

watch(
  () => messageStore.triggerSubmit,
  (newVal) => {
    if (newVal) {
      fetchMenu();
    }
  }
);

onMounted(() => {
  fetchMenu();
  menus.value = JSON.parse(localStorage.getItem("menus"));

  checkScreenSize();
  window.addEventListener("resize", checkScreenSize);

  const storedProfile =
    localStorage.getItem("profile") || sessionStorage.getItem("profile");

  if (storedProfile) {
    profile.value = JSON.parse(storedProfile);
    profile.value.avatar = `${store.baseUrl}storage/${profile.value.avatar}`;
  }
});


onBeforeUnmount(() => {
  window.removeEventListener("resize", checkScreenSize);
});

const shortName = computed(() => {
  const first = profile.value.first_name?.charAt(0) || "";
  const last = profile.value.last_name?.charAt(0) || "";
  return `${first}${last}`.toUpperCase();
});

const toProfile = () => {
  router.push({ name: "profile" });
};

const toUserManagement = () => {
  router.push({ name: "user-management" });
};
const onHoverIn = () => {
  emit('toggleSidebar') 
};
const onHoverOut = () => {
  emit('toggleSidebar') 
};
</script>

<template>
  <div >
    <transition name="slide">
      <!--
        <div 
        class="sidebar "  
        @mouseenter="$emit('toggleSidebar')"
        @mouseleave="$emit('toggleSidebar')"
        :class="{ expanded: isExpanded }"
        >-->
        <div 
        class="sidebar "    :class="{ expanded: isExpanded }"
        > 

        <PerfectScrollbar> 
        <div class="sidebar-menu">
          <ul class="nav flex-column">
            <SidebarItem
              v-for="(item, index) in menus"
              :key="index"
              :item="item"
              :minimized="isMinimized"
            />
          </ul>
        </div> 
      </PerfectScrollbar>
        <ul class="nav nav-pills botton-menu" style="display: none;">
          <li class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              data-bs-toggle="dropdown"
              href="#"
              role="button"
              aria-expanded="false"
            >
              <img :src="profile.avatar" width="30" class="profile-pic" />
              <span
                ><b class="pb"> {{ shortName }} </b>
                {{ profile.username }}</span
              >
            </a>
            <ul class="dropdown-menu" style="margin-left: 20px !important">
              <li>
                <a class="dropdown-item" @click="toProfile" href="javascript:;"
                  ><i class="bi bi-person-circle mr-3"></i>
                  Profile
                </a>
              </li>
              <li>
                <hr class="dropdown-divider" />
              </li>
              <li>
                <router-link to="/core/settings" class="dropdown-item">
                  <i class="bi bi-sliders"></i> General Settings
                </router-link>
              </li>
              <li>
                <router-link to="/core/content" class="dropdown-item">
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
                <a class="dropdown-item pointer" @click="toUserManagement"
                  ><i class="bi bi-person-lock"></i> Users & Group Management
                </a>
              </li>
              <li>
                <hr class="dropdown-divider" />
              </li>
              <li>
                <a class="dropdown-item" href="#" @click="confirmLogout()"
                  ><i class="bi bi-unlock"></i> Logout</a
                >
              </li>
            </ul>
          </li>
        </ul>
        
      </div>
    </transition>
  </div>
</template>
<style scoped>
 
.chevron {
  font-size: 10px !important;
}

.botton-menu {
  border-top: solid 1px #ddd;
}
.ps {
  height: calc(100vh - 108px);
}
</style>
