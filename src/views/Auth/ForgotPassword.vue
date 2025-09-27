<script setup>
import { useRouter } from "vue-router";
import { useStore } from "@/store";
import { ref } from "vue";
import { getCurrentInstance } from "vue";

const router = useRouter();
const isLoading = ref(false);
const store = useStore();
const errors = ref({});
const { proxy } = getCurrentInstance();
const info = localStorage.getItem("info") ? JSON.parse(localStorage.getItem("info")) : "";

const form = ref({
  email: "",
});

const handleForgotPassword = async (event) => {
  event.preventDefault();

  isLoading.value = true;
  try {
    const response = await store.postData({
      url: `api/forgot-password`,
      params: form.value,
      headers: {
        "Content-Type": "application/json",
      },
      responseType: "json",
    });

    const data = response.data;
    if (data.status === 1) {
      localStorage.setItem("reset_email", form.value.email);
      proxy.$messageSuccess(proxy, "Success", data.message);
      router.push({ name: "otp" });
    } else {
      errors.value.email = true;
      proxy.$messageError(proxy, "Error", data.message);
    }
  } catch (error) {
    errors.value.email = true;
    const message = error.response?.data?.message;
    proxy.$messageError(proxy, "Error", message);
  } finally {
    isLoading.value = false;
  }
};

function navigateToLogin() {
  router.push({ name: "auth" });
}

const clearError = (field) => {
  errors.value[field] = false;
};
</script>

<template>
  <div class="d-flex justify-content-center align-items-center vh-100 bg-white">
    <div
      class="card p-4 shadow-sm"
      style="min-width: 350px; max-width: 400px; width: 100%; border-radius: 11px"
    >
      <p class="text-center">
        <img
          v-if="info.logo"
          :src="info.logo"
          alt="Sximo Logo"
          width="90"
          height="90"
          class="rounded-4"
        />
        <i v-else style="font-size: 72px" class="bi bi-stripe"></i>
      </p>
      <h3 class="text-center">Forgot Password</h3>
      <p class="text-center">Enter your email to reset your password</p>
      <div class="mb-3">
        <label for="email" class="form-label">Email address</label>
        <input
          type="email"
          class="form-control form-control-sm rounded-3"
          id="email"
          v-model="form.email"
          placeholder="Admin@example.com"
          :class="{ 'is-invalid': errors.email }"
          @input="clearError('email')"
        />
      </div>
      <div class="d-flex gap-2 justify-between">
        <button
          class="btn btn-sm rounded-3 btn-outline-dark w-100"
          outlined
          @click="navigateToLogin"
        >
          Cancel
        </button>
        <button
          :disabled="isLoading"
          type="submit"
          class="btn btn-sm rounded-3 btn-dark w-100"
          @click="handleForgotPassword"
          @keyup.enter="handleForgotPassword"
        >
          <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
          {{ isLoading ? "Submitting..." : "Submit" }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pointer {
  cursor: pointer;
}
</style>
