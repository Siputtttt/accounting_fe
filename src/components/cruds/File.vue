<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
    modelValue: String,
    label: { type: String, default: 'File' },
    size: { type: [Number, String], default: 12 },
})

const emit = defineEmits(['update:modelValue'])

const selectedFile = ref(null)
const fileUrl = ref(null)

function onFileChange(event) {
    const file = event.target.files[0]
    if (!file) return

    const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ]

    if (!allowedTypes.includes(file.type)) {
        alert('Hanya file PDF, Word, dan Excel yang diizinkan.')
        selectedFile.value = null
        fileUrl.value = null
        emit('update:modelValue', '') // clear modelValue
        event.target.value = ''
        return
    }

    selectedFile.value = file

    const reader = new FileReader()
    reader.onload = () => {
        emit('update:modelValue', reader.result) // Base64 ke parent
    }
    reader.readAsDataURL(file)

    if (file.type === 'application/pdf') {
        fileUrl.value = URL.createObjectURL(file)
    } else {
        fileUrl.value = null
    }
}

const isPdf = computed(() => {
    return selectedFile.value?.type === 'application/pdf'
})
</script>

<template>
    
        <div v-if="isPdf && fileUrl" class="mt-3">
            <iframe :src="fileUrl" width="100%"   style="border:1px solid #ccc;" />
        </div>
        <b-form-file @change="onFileChange" size="sm"
            accept=".pdf,.doc,.docx,.xls,.xlsx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" />
   
</template>
