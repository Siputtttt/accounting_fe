<script setup>
import { ref, getCurrentInstance } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "@/store";

const { proxy } = getCurrentInstance();
const router = useRouter();
const store = useStore();
const isLoading = ref(false);
const info = localStorage.getItem("info") ? JSON.parse(localStorage.getItem("info")) : "";
const storedEmail = localStorage.getItem("reset_email") || "";
const storedOtp = localStorage.getItem("otp_token") || "";

const clearError = (field) => {
  errors.value[field] = false;
};

const errors = ref({
  password: null,
  password_confirmation: null,
});

const changePasswordFields = [
  {
    label: "New Password",
    model: "password",
    type: "password",
    placeholder: "Enter New Password",
  },
  {
    label: "Confirm Password",
    model: "password_confirmation",
    type: "password",
    placeholder: "Enter Confirm Password",
  },
];

const formResetPassword = ref({
  password: "",
  password_confirmation: "",
});

const resetPassword = async (event) => {
  event.preventDefault();
  isLoading.value = true;

  try {
    const response = await store.postData({
      url: "api/reset-password",
      params: {
        ...formResetPassword.value,
        email: storedEmail,
        otp_token: storedOtp,
      },
      headers: {
        "Content-Type": "application/json",
      },
      responseType: "json",
    });

    const data = response.data;

    if (data.status === 1) {
      localStorage.removeItem("reset_email");
      localStorage.removeItem("otp_token");

      proxy.$messageSuccess(
        proxy,
        "Success",
        data.message || "Password reset successfully."
      );
      router.push({ name: "auth" });
    } else {
      errors.value.password = data.message;
      errors.value.password_confirmation = data.message;
      proxy.$messageError(proxy, "Error", data.message);
    }
  } catch (error) {
    const message = error.response?.data?.message;
    errors.value.password = message;
    errors.value.password_confirmation = message;
    proxy.$messageError(proxy, "Error", message);
  } finally {
    isLoading.value = false;
  }
};

function navigateToLogin() {
  router.push({ name: "auth" });
}
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
      <h3 class="text-center">New Password</h3>
      <p class="text-center">Enter your new password</p>
      <div class="mb-3">
        <div v-for="field in changePasswordFields" :key="field.model" class="mb-3">
          <label :for="field.model" class="form-label">{{ field.label }}</label>
          <input
            :type="field.type"
            class="form-control form-control-sm rounded-3"
            :id="field.model"
            :placeholder="field.placeholder"
            v-model="formResetPassword[field.model]"
            :class="{ 'is-invalid': !!errors[field.model] }"
            @input="clearError(field.model)"
          />
        </div>
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
          @click="resetPassword"
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
