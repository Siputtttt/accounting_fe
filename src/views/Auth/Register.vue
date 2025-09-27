<script setup>
import { ref, getCurrentInstance } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "@/store";

const { proxy } = getCurrentInstance();
const router = useRouter();
const store = useStore();
const info = localStorage.getItem("info") ? JSON.parse(localStorage.getItem("info")) : "";
const errors = ref({});

const form = ref({
  username: "",
  first_name: "",
  last_name: "",
  group_id: 3,
  active: 1,
  email: "",
  password: "",
  password_confirmation: "",
});

const toLogin = () => {
  router.push({ name: "auth" });
};

const clearError = (field) => {
  errors.value[field] = false;
};

const isSubmitting = ref(false);

const handleRegister = async (event) => {
  event.preventDefault();
  isSubmitting.value = true;
  errors.value = {};

  try {
    const response = await store.postData({
      url: "api/register",
      params: form.value,
      headers: {
        "Content-Type": "application/json",
      },
      responseType: "json",
    });

    if (response.data.status === 1) {
      proxy.$messageSuccess(proxy, "Registration Success", response.data.message);
      setTimeout(() => toLogin(), 1500);
    } else {
      proxy.$messageError(proxy, "Failed", response.data.message);
    }
  } catch (error) {
    const fieldErrors = error.response?.data?.errors || {};
    const message = error.response?.data?.message || "Unknown error";

    let firstErrorMessage = null;

    for (const field in fieldErrors) {
      if (Object.prototype.hasOwnProperty.call(fieldErrors, field)) {
        const msg = fieldErrors[field][0];
        errors.value[field] = msg;

        if (!firstErrorMessage) {
          firstErrorMessage = msg;
        }
      }
    }

    proxy.$messageError(proxy, "Error", firstErrorMessage || message);
  } finally {
    isSubmitting.value = false;
  }
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
      <h3 class="text-center">Create an account</h3>
      <p class="text-center">Enter your email and password below to log in</p>

      <form @submit.prevent="handleRegister">
        <div class="mb-3 mt-4">
          <label for="username" class="form-label">Username</label>
          <input
            type="text"
            class="form-control form-control-sm rounded-3"
            :class="{ 'is-invalid': errors.username }"
            @input="clearError('username')"
            id="username"
            v-model="form.username"
            placeholder="Username"
          />
        </div>
        <div class="row">
          <div class="mb-3 col-6">
            <label for="first_name" class="form-label">First Name</label>
            <input
              type="first_name"
              class="form-control form-control-sm rounded-3"
              :class="{ 'is-invalid': errors.first_name }"
              @input="clearError('first_name')"
              id="first_name"
              v-model="form.first_name"
              placeholder="First Name"
            />
          </div>
          <div class="mb-3 col-6">
            <label for="last_name" class="form-label">Last Name</label>
            <input
              type="last_name"
              class="form-control form-control-sm rounded-3"
              :class="{ 'is-invalid': errors.last_name }"
              @input="clearError('last_name')"
              id="last_name"
              v-model="form.last_name"
              placeholder="Last Name"
            />
          </div>
        </div>
        <div class="mb-3">
          <label for="email" class="form-label">Email address</label>
          <input
            type="email"
            class="form-control form-control-sm rounded-3"
            :class="{ 'is-invalid': errors.email }"
            @input="clearError('email')"
            id="email"
            v-model="form.email"
            placeholder="Admin@example.com"
          />
        </div>
        <div class="mb-3">
          <label for="password" class="form-label">Password</label>
          <input
            type="password"
            class="form-control form-control-sm rounded-3"
            :class="{ 'is-invalid': errors.password }"
            @input="clearError('password')"
            id="password"
            v-model="form.password"
            placeholder="Password"
          />
        </div>
        <div class="mb-3">
          <label for="password_confirmation" class="form-label">Confirm Password</label>
          <input
            type="password"
            class="form-control form-control-sm rounded-3"
            :class="{ 'is-invalid': errors.password_confirmation }"
            @input="clearError('password_confirmation')"
            id="password_confirmation"
            v-model="form.password_confirmation"
            placeholder="Re-type password"
          />
        </div>

        <button
          :disabled="isSubmitting"
          type="submit"
          class="btn btn-sm rounded-3 btn-dark w-100 mt-3"
        >
          <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2"></span>
          {{ isSubmitting ? "Creating..." : "Create Account" }}
        </button>
      </form>
      <p class="text-center mt-2">
        Already have an account?
        <span @click="toLogin" class="pointer text-primary"> Log in</span>
      </p>
    </div>
  </div>
</template>

<style scoped>
.pointer {
  cursor: pointer;
}
</style>
