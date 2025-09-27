<script setup>
import { onMounted, ref, watch, nextTick } from "vue";
import { useStore } from "@/store";
import { useRoute } from "vue-router";
import Categories from "@/components/frontend/Categories.vue";
import Content from "@/components/frontend/Content.vue";

const loading = ref(false);
const store = useStore();
const route = useRoute();
const categories = ref([]);
const activeCategorySlug = ref(null);
const activeContentSlug = ref(null);
const opened = ref({});

const fetchData = async () => {
  loading.value = true;
  try {
    const response = await store.getData({
      url: `api/docs`,
    });
    if (response.data.status) {
      categories.value = response.data.data.categories;
    }
    loading.value = false;
  } catch (err) {
    loading.value = false;
  }
};

const toggle = (index) => {
  opened.value = opened.value === index ? null : index;
};

const handleClick = (content, categorie) => {
  console.log("clicked", content, categorie);
};

function scrollToActiveIndicator() {
  nextTick(() => {
    const activeLink = document.querySelector(".content-link.router-link-active");
    const indicator = document.getElementById("active-indicator");

    if (activeLink && indicator) {
      const offset = activeLink.offsetTop;
      indicator.style.top = `${offset}px`;
    }
  });
}

onMounted(async () => {
  await fetchData();

  activeCategorySlug.value = route.params.categorySlug;
  activeContentSlug.value = route.params.contentSlug;

  const index = categories.value.findIndex(
    (cat) => cat.slug === activeCategorySlug.value
  );
  opened.value = index;

  scrollToActiveIndicator();
});

watch(
  () => route.params,
  (params) => {
    activeCategorySlug.value = params.categorySlug;
    activeContentSlug.value = params.contentSlug;

    const index = categories.value.findIndex(
      (cat) => cat.slug === activeCategorySlug.value
    );
    opened.value = index;

    scrollToActiveIndicator();
  },
  { immediate: true }
);
</script>

<template>
  <div class="container-fluid px-5" style="height: 100vh; overflow: hidden">
    <nav class="navbar fixed-top bg-dark navbar-dark px-5 py-3">
      <div class="container-fluid px-4">
        <a class="navbar-brand" href="#">Documentation</a>
      </div>
    </nav>

    <div
      class="row mx-auto"
      style="margin-top: 80px; height: calc(100vh - 80px); overflow: hidden"
    >
      <div class="col-md-3 h-100 border-end px-4 py-3">
        <Categories
          :categories="categories"
          :opened="opened"
          :activeCategorySlug="activeCategorySlug"
          :activeContentSlug="activeContentSlug"
          @toggle="toggle"
          @doc-clicked="handleClick"
        />
      </div>

      <div class="col-md-9 h-100 px-4 py-4">
        <Content />
      </div>
    </div>
  </div>
</template>
