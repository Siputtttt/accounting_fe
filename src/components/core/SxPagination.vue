<script setup>
import { ref, computed, watch } from "vue";

const props = defineProps({
  modelValue: {
    type: Number,
    required: true,
  },
  totalPages: {
    type: Number,
    required: true,
  },
  size: {
    type: String,
    default: "md", // sm, md, lg
  },
  btnVariant: {
    type: String,
    default: "btn-outline-dark",
  },
});

const emit = defineEmits(["update:modelValue"]);

const page = ref(props.modelValue);
const jumpPage = ref(props.modelValue);

watch(
  () => props.modelValue,
  (val) => {
    page.value = val;
    jumpPage.value = val;
  }
);

const btnSize = computed(() => {
  return props.size === "sm" ? "btn-sm" : props.size === "lg" ? "btn-lg" : "";
});

const inputSizeClass = computed(() => {
  return props.size === "sm"
    ? "input-group-sm"
    : props.size === "lg"
    ? "input-group-lg"
    : "";
});

const goToPage = (val) => {
  let pageNum = parseInt(val);
  if (!pageNum || pageNum < 1) pageNum = 1;
  if (pageNum > props.totalPages) pageNum = props.totalPages;

  emit("update:modelValue", pageNum);
};
</script>

<template>
  <div class="d-flex align-items-center gap-2 flex-wrap">
    <button
      :class="['btn rounded-3 align-self-center', btnVariant, btnSize]"
      :disabled="page === 1"
      @click="goToPage(page - 1)"
    >
      &lt; Prev
    </button>

    <span style="font-style: italic; font-size: 12px">
      Page {{ page }} of {{ totalPages }}
    </span>

    <button
      :class="['btn rounded-3 align-self-center', btnVariant, btnSize]"
      :disabled="page === totalPages"
      @click="goToPage(page + 1)"
    >
      Next &gt;
    </button>

    <div :class="['input-group', inputSizeClass]" style="width: 90px">
      <input
        type="number"
        class="form-control form-control-sm rounded-3 me-2"
        v-model.number="jumpPage"
        :max="totalPages"
        :min="1"
        @keyup.enter="goToPage(jumpPage)"
        placeholder="Jump to"
      />
      <button
        :class="['btn rounded-3 align-self-center', btnSize, btnVariant]"
        @click="goToPage(jumpPage)"
      >
        Go
      </button>
    </div>
  </div>
</template>

<style scoped>
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  appearance: textfield;
  -moz-appearance: textfield;
}
</style>
