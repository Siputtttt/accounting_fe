<script setup>
import { getCurrentInstance, onMounted, ref, computed } from "vue";
import { useStore } from "@/store";
import { useRouter } from "vue-router";

const { proxy } = getCurrentInstance();
const router = useRouter();
const rememberMe = ref(false);
const store = useStore();
const info = localStorage.getItem("info") ? JSON.parse(localStorage.getItem("info")) : "";
const errors = ref({});
const isSubmitting = ref(false);

const form = ref({
  email: "",
  password: "",
});

const filteredSosmeds = computed(() => {
  const info = localStorage.getItem("info")
    ? JSON.parse(localStorage.getItem("info"))
    : null;
  const socialite = info?.socialite ?? {};

  const sosmeds = [
    {
      name: "Twitter",
      icon: "fab fa-x-twitter",
      url: store.baseUrl + "login/twitter",
    },
    {
      name: "Google",
      icon: "fab fa-google",
      url: store.baseUrl + "login/google",
    },
    {
      name: "Facebook",
      icon: "fab fa-facebook-f",
      url: store.baseUrl + "login/facebook",
    },
    {
      name: "Instagram",
      icon: "fab fa-instagram",
      url: store.baseUrl + "login/instagram",
    },
  ];

  return sosmeds.filter((sosmed) => {
    const key = sosmed.name.toLowerCase();
    return socialite[key];
  });
});

const clearError = (field) => {
  errors.value[field] = false;
};

const toRegister = () => {
  router.push({ name: "register" });
};

const toForgot = () => {
  router.push({ name: "forgot-password" });
};
const handleLogin = async (event) => {
  event.preventDefault();

  isSubmitting.value = true;

  try {
    const response = await store.postData({
      url: "api/login",
      params: form.value,
      headers: { "Content-Type": "application/json" },
      responseType: "json",
    });

    if (response.data.status === 1) {
      const payload = {
        data: response.data.data.profile,
        token: response.data.data.token,
      };

      store.setUser(payload.data, rememberMe.value);
      store.setToken(payload.token, rememberMe.value);

      if (rememberMe.value) {
        localStorage.setItem("token", payload.token);
        localStorage.setItem("profile", JSON.stringify(payload.data));
      } else {
        localStorage.setItem("token", payload.token);
        localStorage.setItem("profile", JSON.stringify(payload.data));
      }

      try {
        const infoResponse = await store.getData({
          url: "api/info",
          config: {
            headers: {
              "Content-Type": "application/json",
            },
            responseType: "json",
          },
        });

        const info = infoResponse.data?.data;
        if (info) {
          localStorage.setItem("info", JSON.stringify(info));
        }
      } catch (infoError) {
        console.warn("Gagal mengambil ulang info:", infoError);
      }

      router.push("/dashboard");
    } else {
      proxy.$messageError(proxy, "Failed", response.data.message);
    }
  } catch (error) {
    const backendErrors = error.response?.data?.errors || {};
    const message = error.response?.data?.message || "Unknown error";

    for (const field in backendErrors) {
      if (Object.prototype.hasOwnProperty.call(backendErrors, field)) {
        errors.value[field] = backendErrors[field][0];
      }
    }

    proxy.$messageError(proxy, "Error", message);
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
      <h3 class="text-center">Log in to your account</h3>
      <p class="text-center">Enter your email and password below to log in</p>
      <form @submit.prevent="handleLogin">
        <div class="mb-3 mt-4">
          <label for="email" class="form-label">Email address</label>
          <input
            type="email"
            class="form-control form-control-sm rounded-3"
            id="email"
            v-model="form.email"
            :class="{ 'is-invalid': errors.email }"
            @input="clearError('email')"
            placeholder="Admin@example.com"
          />
        </div>
        <div class="mb-3">
          <label for="password" class="form-label">Password</label>
          <input
            type="password"
            class="form-control form-control-sm rounded-3"
            id="password"
            v-model="form.password"
            :class="{ 'is-invalid': errors.password }"
            @input="clearError('password')"
            placeholder="Password"
          />
        </div>
        <div class="mb-3">
          <BFormCheckbox v-model="rememberMe"> Remember Me </BFormCheckbox>
        </div>

        <button
          :disabled="isSubmitting"
          type="submit"
          class="btn btn-sm rounded-3 btn-dark w-100"
        >
          <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2"></span>
          {{ isSubmitting ? "Logging..." : "Login" }}
        </button>

        <p class="text-center my-1"><small>Or</small></p>

        <div
          id="icon-sosmed"
          class="d-flex gap-2 align-content-center justify-content-center"
        >
          <a
            v-for="sosmed in filteredSosmeds"
            :key="sosmed.name"
            :href="sosmed.url"
            class="btn btn-sm rounded-3 btn-outline-dark align-items-center justify-content-center"
            :class="filteredSosmeds.length > 1 ? 'w-100' : ''"
          >
            <i :class="sosmed.icon"></i>
          </a>
        </div>

        <p class="text-center mt-3" @click="toForgot" style="cursor: pointer">
          Forgot Password?
        </p>

        <p class="text-center" v-if="info?.registration === 'true'">
          Don't have an account?
          <span @click="toRegister" class="pointer text-primary">Sign in</span>
        </p>
      </form>
    </div>
  </div>
</template>
