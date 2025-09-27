<template>
    <div>
      <Topbar @toggleSidebar="sidebarOpen = !sidebarOpen" />
      <div class="d-flex">
        <Sidebar :isOpen="sidebarOpen" />
        <main class="flex-grow-1 p-3 ms-md-0" :class="{ 'ms-0': !sidebarOpen && windowWidth < 768, 'ms-md-0': true }" style="margin-left: 250px;">
          <slot />
        </main>
      </div>
    </div>
  </template>
  
  <script setup>
  import Sidebar from './Sidebar.vue'
  import Topbar from './Topbar.vue'
  import { ref, onMounted, onBeforeUnmount } from 'vue'
  
  const sidebarOpen = ref(false)
  const windowWidth = ref(window.innerWidth)
  
  const handleResize = () => {
    windowWidth.value = window.innerWidth
  }
  
  onMounted(() => window.addEventListener('resize', handleResize))
  onBeforeUnmount(() => window.removeEventListener('resize', handleResize))
  </script>
  