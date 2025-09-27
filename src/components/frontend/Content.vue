<script setup>
import { onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "@/store";

const store = useStore();
const route = useRoute();
const loading = ref(false);
const content = ref(null);

const fetchContent = async (slug) => {
  loading.value = true;
  try {
    const response = await store.getData({
      url: `api/docs/${slug}`,
    });
    if (response.data.status) {
      content.value = response.data.data.content;
    }
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  if (route.params.contentSlug) {
    fetchContent(route.params.contentSlug);
  }
});

watch(
  () => route.params.contentSlug,
  (newSlug) => {
    if (newSlug) {
      fetchContent(newSlug);
    }
  }
);
</script>

<template>
  <div>
    <div v-if="loading" class="loading-overlay">
      <i class="fa fa-spinner fa-spin fa-3x text-primary"></i>
    </div>

    <div v-else-if="content" class="content-wrapper">
      <h2 class="title">{{ content.title }}</h2>
      <div v-html="content.note"></div>
    </div>

    <div
      v-else
      class="text-center d-flex justify-content-center align-items-center"
      style="height: 100vh"
    >
      <p class="lead">Select a documentation from the left</p>
    </div>
  </div>
</template>

<style scoped>
.content-wrapper {
  padding: 1.5rem;
  background-color: #fff;
  border-radius: 0.5rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}

.title {
  font-size: 1.75rem;
  font-weight: 600;
  color: #333;
}

.note {
  font-size: 1rem;
}

.body-content {
  font-size: 1rem;
  line-height: 1.7;
  color: #444;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>

<style>
p img {
  max-width: 100%;
  height: auto;
}
</style>
