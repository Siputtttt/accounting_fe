<script setup>
import { inject } from 'vue'

const props = defineProps(['item', 'depth']);

const handleEditItem = inject('handleEditItem')

const handleEdit = () => {
    if (handleEditItem) {
        handleEditItem(props.item.id)
    }
}
</script>

<template>
    <div :style="{ marginLeft: `${1.5 * depth}rem` }" class="d-flex align-items-center mb-2 py-2 w-100 bg-menuItems">

        <span class="flex-grow-1">{{ item.name }}</span>

        <button class="btn btn-sm btn-outline-primary ms-2" @click="handleEdit">
            <i class="bi bi-pencil"></i>
        </button>
    </div>
</template>


<style scoped>
.bg-menuItems {
    background-color: #c7cacd00 !important;
    border-radius: 0.5rem !important;
    padding: 0.5rem !important;
    margin-bottom: 0.5rem !important;
    border: 1px solid #e9ecef !important;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.06) !important;
}
</style>