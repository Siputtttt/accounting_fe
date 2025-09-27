<script setup>
defineProps({
  categories: Array,
  opened: [Number, Object],
  activeCategorySlug: String,
  activeContentSlug: String,
});

const emit = defineEmits(["toggle", "doc-clicked"]);

const isActiveContent = (contentSlug, activeSlug) => {
  return contentSlug === activeSlug;
};

const isOpened = (index, opened) => {
  return opened === index;
};

const handleClick = (content, parent) => {
  emit("doc-clicked", { content, parent });
};
</script>

<template>
  <ul class="list-group list-group-flush">
    <li
      v-for="(categorie, index) in categories"
      :key="categorie.name"
      class="list-group-item category-item"
    >
      <div
        class="d-flex justify-content-between align-items-center category-header"
        @click="emit('toggle', index)"
      >
        <h7
          class="mb-0 cursor-pointer"
          :class="{
            '': categorie.slug === activeCategorySlug,
            'text-secondary': categorie.slug !== activeCategorySlug,
          }"
        >
          <i
            :class="{
              '': categorie.slug === activeCategorySlug,
              'text-secondary': categorie.slug !== activeCategorySlug,
            }"
          ></i>
          {{ categorie.name }}
        </h7>
        <i
          class="cursor-pointer"
          :class="[
            'bi',
            opened === index ? 'bi-chevron-up' : 'bi-chevron-down',
            'toggle-icon',
          ]"
        ></i>
      </div>

      <transition name="fade">
        <ul
          v-if="opened === index && categorie.children.length"
          class="list-group list-group-flush mt-2 ps-3"
        >
          <li
            v-for="categoriesChild in categorie.children"
            :key="categoriesChild.name"
            class="list-group-item content-item"
          >
            <div class="fw-semibold">{{ categoriesChild.name }}</div>

            <ul
              v-if="categoriesChild.content && categoriesChild.content.length"
              class="ps-3"
            >
              <li
                v-for="content in categoriesChild.content"
                :key="content.slug"
                class="list-group-item content-item"
              >
                <RouterLink
                  :to="`/docs/${categorie.slug}/${categoriesChild.slug}/${content.slug}`"
                  class="text-decoration-none d-block py-1 content-link"
                  @click="handleClick(content, categoriesChild)"
                >
                  <i class="bi bi-file-earmark-text me-2 text-secondary"></i>
                  {{ content.labels }}
                </RouterLink>
              </li>
            </ul>
          </li>
        </ul>
      </transition>
    </li>
  </ul>
</template>

<style scoped>
.list-group-item {
  background-color: white !important;
  border: 0;
  padding: 0.5rem 1rem;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.4s ease;
  overflow: hidden;
}

.fade-enter-from,
.fade-leave-to {
  max-height: 0;
  opacity: 0;
  transform: translateY(-5px);
}

.fade-enter-to,
.fade-leave-from {
  max-height: 500px;
  opacity: 1;
  transform: translateY(0);
}

.cursor-pointer {
  cursor: pointer;
}
</style>
