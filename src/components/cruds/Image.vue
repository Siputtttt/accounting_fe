<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
    modelValue: String,
    label: String,
    size: { type: [Number, String], default: 12 },
});

const emit = defineEmits(['update:modelValue']);
const imageData = ref(props.modelValue || '');

watch(() => props.modelValue, (newVal) => {
    imageData.value = newVal;
});

const onFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            imageData.value = e.target.result;
            emit('update:modelValue', imageData.value);
        };
        reader.readAsDataURL(file);
    }
};
</script>
<template>
    <b-form-group :label="label" class="mb-3" :class="'col-md-' + size">
        <!-- <label>{{ label }}</label>
        <img v-if="imageData" :src="imageData" class="img-fluid mt-2" style="max-height: 200px;" />
        <input type="file" class="form-control form-control-sm" @change="onFileChange" /> -->

        <!-- Preview Gambar -->
        <div v-if="imageData" class="mb-2">
            <img :src="imageData" :alt="imageData" class="img-thumbnail" style="max-height: 200px;" />
        </div>

        <!-- Input File -->
        <b-form-file accept="image/*" size="sm" @change="onFileChange" />
    </b-form-group>
</template>
