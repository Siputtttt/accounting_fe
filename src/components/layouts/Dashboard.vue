<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import Sidebar from '../Sidebar.vue';

const isMobile = ref(false);

const checkScreenSize = () => {
    isMobile.value = window.innerWidth < 768;
};

onMounted(() => {
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
});

onBeforeUnmount(() => {
    window.removeEventListener('resize', checkScreenSize);
});
</script>

<template>
    <div class="d-flex">
        <Sidebar />
        <div :class="{ 'ms-0': isMobile, 'ms-250': !isMobile }" class="main-content ms-md-250">
            <router-view />
        </div>
    </div>
</template>

<style scoped>
.ms-250 {
    margin-left: 250px;
}
</style>
