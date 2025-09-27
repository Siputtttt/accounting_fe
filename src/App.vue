<script setup>
import { ref, onMounted, onBeforeUnmount, computed , watch } from "vue";
import { useStore } from "@/store";
import { useRoute } from "vue-router";
import { useMessageStore } from '@/store/messageStore'; 
//import Layout from "./components/backend/Layout.vue";
import Sidebar from "./components/backend/Sidebar.vue";
import Topbar from "./components/backend/Topbar.vue";

const isSidebarExpanded = ref(true)

const isMobile = ref(false);
const store = useStore();
const messageStore = useMessageStore();
const route = useRoute();
const activeSize = ref(true);
const info = ref([]);
const layout = computed(() => route.meta.layout || "auth");

const checkScreenSize = () => {
  let size =  window.innerWidth ; 
  if(  window.innerWidth < 768 ) { 
    isSidebarExpanded.value = false 
  }
};
watch(
  () => messageStore.triggerMinimize,  (newVal, oldVal) => { 
       isMobile.value = newVal  
  }
); 
onMounted(() => {
  const observer = new MutationObserver(() => {
    const sidebar = document.querySelector('.leftbar')
    isSidebarExpanded.value = sidebar?.classList.contains('expanded')
  })
  checkScreenSize()
})

onBeforeUnmount(() => {
  window.removeEventListener("resize", checkScreenSize);
});


</script>

<template>
  <div  >
    <template v-if="layout === 'auth'">
      <div class="w-100 vh-100 bg-white">
        <router-view />
      </div>
    </template>
    <template v-else-if="layout === 'homepage'">
      <div >
        <router-view />
      </div>
    </template>
    <template v-else>
      <Topbar :isExpanded="isSidebarExpanded" @toggleSidebar="isSidebarExpanded = !isSidebarExpanded" />
      <Sidebar :isExpanded="isSidebarExpanded" @toggleSidebar="isSidebarExpanded = !isSidebarExpanded" />
      <div  :class="{ expanded: isSidebarExpanded }">        
          <router-view />        
      </div>  
      
    </template>
  </div>
</template>

<style scoped>
 
</style>
