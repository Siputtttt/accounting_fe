<script setup>
import { ref, computed } from "vue";
import { useStore } from "@/store";
import { useRouter } from "vue-router";

const loading = ref(true);
const store = useStore();
const open = ref(false);
const route = useRouter(); 
const toggle = () => (open.value = !open.value);

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});

const hasChildren = computed(() => {
  return Array.isArray(props.item.children) && props.item.children.length > 0;
});
</script>

<template>
	<li :class="{ active: route.name === item.module_name }">
		<div>
			<!-- top title -->
			<a v-if="item.position == 'top'" href="#" class="nav-link d-flex justify-content-between align-items-center"
				@click.prevent="toggle">
				<div class="d-flex align-items-center gap-2 fw-bold pt-2  pb-2">
					<span>{{ item.name_title }}</span>
				</div>
			</a>

			<!-- Parent without children -->
			<router-link v-else-if="!hasChildren && item.position != 'top'" :to="item.module"
				class="nav-link d-flex justify-content-between align-items-center" @click="$emit('link-click')">
				<div class="d-flex align-items-center gap-2 ms-2">
					<i v-if="item.menu_icons" :class="item.menu_icons"></i>
					<span>{{ item.name_title }}</span>
				</div>
			</router-link>

			<!-- Parent with children -->
			<a v-else href="#" class="nav-link d-flex justify-content-between align-items-center ms-2"
				@click.prevent="toggle">
				<div class="d-flex align-items-center gap-2">
					<i v-if="item.menu_icons" :class="item.menu_icons"></i>
					<span>{{ item.name_title }}</span>
				</div>
				<i :class="open ? 'bi bi-chevron-up' : 'bi bi-chevron-down'" class="chevron"></i>
			</a>
		</div>

    <!-- Recursive children -->
    <ul v-if="hasChildren && open" class="nav flex-column ms-3">
      <SidebarItem
        v-for="child in item.children"
        :key="child.id"
        :item="child"
        @link-click="$emit('link-click')"
      />
    </ul>
  </li>
</template>
<style scoped>
.nav-link {
  transition: background-color 0.3s ease, color 0.3s ease;
  cursor: pointer;
}

.hover-link:hover {
  background-color: #f1f1f1;
  color: #000;
}
.chevron {
	font-size: 10px !important;
}
ul.nav {
  padding-left: 0;
  list-style: none;
}
</style>
