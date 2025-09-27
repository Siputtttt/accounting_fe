<script setup>
import { useRouter } from "vue-router";
import { useStore } from "@/store";
import { ref } from "vue";
import { getCurrentInstance } from "vue";
import OtpInput from "vue3-otp-input";

const info = localStorage.getItem("info") ? JSON.parse(localStorage.getItem("info")) : "";
const storedEmail = localStorage.getItem("reset_email") || "";
const router = useRouter();
const isLoading = ref(false);
const store = useStore();
const { proxy } = getCurrentInstance();
const otp = ref("");

const handleSubmitOtp = async (event) => {
  event.preventDefault();

  if (otp.value.length < 4) return;

  isLoading.value = true;
  try {
    const response = await store.postData({
      url: "api/verify-otp",
      params: { otp: otp.value, email: storedEmail },
      headers: { "Content-Type": "application/json" },
      responseType: "json",
    });

    const data = response.data;
    if (data.status === 1) {
      localStorage.setItem("otp_token", data.otp_token);
      proxy.$messageSuccess(proxy, "Success", data.message);
      router.push({ name: "new-password" });
    } else {
      proxy.$messageError(proxy, "Error", data.message);
    }
  } catch (error) {
    proxy.$messageError(proxy, "Error", error.response?.data?.message);
  } finally {
    isLoading.value = false;
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
      <h3 class="text-center">OTP</h3>
      <p class="text-center">Enter the OTP sent to your email</p>
      <div class="d-flex justify-content-center align-items-center my-3">
        <OtpInput
          ref="otpInput"
          v-model:value="otp"
          :num-inputs="4"
          separator="-"
          input-type="numeric"
          input-classes="form-control otp-input rounded-3 border-1 shadow-sm"
          container-classes="d-flex gap-2"
          :should-auto-focus="true"
          :should-focus-order="true"
        />
      </div>

      <div class="d-flex justify-content-center">
        <button
          class="btn btn-sm btn-outline-dark rounded-3 w-50 mt-2"
          @click="handleSubmitOtp"
        >
          Sent
        </button>
      </div>
    </div>
  </div>
</template>

<style>
.cursor-pointer {
  cursor: pointer;
}

.otp-input {
  width: 40px;
  height: 40px;
  font-size: 13px;
  text-align: center;
  margin: 0 5px;
  border: 1px solid rgba(0, 0, 0, 0.3);
  border-radius: 4px;
}

.otp-input.is-complete {
  background-color: #e4e4e4;
}
</style>
