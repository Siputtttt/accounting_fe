<template>
  <teleport to="body">
    <div
      v-if="isVisible"
      class="modal fade"
      :class="{ 'show d-block': isVisible }"
      :id="modalId"
      tabindex="-1"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered" :class="sizeClass">
        <div class="modal-content">
          <!-- Modal Header -->
          <div class="modal-header">
            <h6 class="modal-title">{{ title }}</h6>
            <button type="button" class="btn btn-sm btn-close" @click="hide"></button>
          </div>

          <!-- Modal Body -->
          <div class="modal-body">
            <slot name="body" />
          </div>

          <!-- Modal Footer -->
          <div class="modal-footer">
            <slot name="footer">
              <button
                type="button"
                class="btn btn-sm btn-secondary rounded-3"
                @click="hide"
              >
                Close
              </button>
            </slot>
          </div>
        </div>
      </div>
    </div>

    <!-- Static Backdrop -->
    <div v-if="isVisible" class="modal-backdrop fade show"></div>
  </teleport>
</template>

<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  title: String,
  modalId: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    default: "", // '', 'sm', 'lg', 'xl'
  },
  modelValue: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue"]);

const isVisible = ref(props.modelValue);

const sizeClass = computed(() => {
  return props.size ? `modal-${props.size}` : "";
});

const show = () => {
  isVisible.value = true;
  emit("update:modelValue", true);
};

const hide = () => {
  isVisible.value = false;
  emit("update:modelValue", false);
  emit("close");
};

defineExpose({ show, hide });
</script>
