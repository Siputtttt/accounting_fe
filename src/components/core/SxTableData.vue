<script setup>
import { computed, defineProps } from "vue";

const props = defineProps({
    tableData: {
        type: Object,
        default: () => ({ data_table: [], columns: [] }),
    },
});

const fields = computed(() => {
    if (props.tableData.columns?.length) {
        return props.tableData.columns.map(col => col.Field);
    }
    return [];
});
</script>

<template>
    <div v-if="props.tableData.data_table?.length > 0" class="table-scroll-container">
        <b-table :items="props.tableData.data_table" :fields="fields" striped hover responsive
            class="min-w-max"></b-table>
    </div>
    <div class="block mt-2" v-else>
        <div class="text-center">No Result</div>
    </div>
</template>

<style scoped>
.block {
    background-color: #f9fafb;
    border: 1px solid #e2e8f0;
    padding: 1rem;
    border-radius: 8px;
    overflow-x: auto;
    font-family: 'Courier New', Courier, monospace;
    white-space: pre-wrap;
    position: relative;
}
.table-scroll-container {
    overflow-x: auto;
    overflow-y: auto;
    max-height: 500px;
    max-width: 100%;
    border: 1px solid #dee2e6;
}

.min-w-max {
    min-width: max-content;
}
</style>
