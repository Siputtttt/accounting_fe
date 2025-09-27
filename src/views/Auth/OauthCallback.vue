<script setup>
import { useRouter, useRoute } from "vue-router";
import { useStore } from "@/store";
import { getCurrentInstance, onMounted, ref } from "vue";
import SximoModal from "@/components/core/SxModal.vue";

const { proxy } = getCurrentInstance();
const router = useRouter();
const route = useRoute();
const store = useStore();
const isSubmitting = ref(false);
const SxModal = ref(null);
const pendingProfile = ref({});

onMounted(() => {
  const register = route.query.register;
  const profileRaw = route.query.profile;
  const tokenQuery = route.query.token;

  if (tokenQuery && profileRaw) {
    try {
      const profile = JSON.parse(decodeURIComponent(profileRaw));
      store.setUser(profile);
      store.setToken(tokenQuery);
      router.push({ name: "dashboard" });
    } catch (error) {
      console.error("Gagal login:", error);
      router.push({ name: "auth" });
    }
  } else if (register === "true" && profileRaw) {
    try {
      const parsed = JSON.parse(decodeURIComponent(profileRaw));

      if (!parsed.username) {
        parsed.username = parsed.email?.split("@")[0];
      }

      pendingProfile.value = parsed;
      SxModal.value?.show();
    } catch (error) {
      console.error("Failed decode profile:", error);
      router.push({ name: "auth" });
    }
  } else {
    router.push({ name: "auth" });
  }
});

const confirmRegister = async (event) => {
  event.preventDefault();
  isSubmitting.value = true;
  try {
    const response = await store.postData({
      url: "api/registerSocial",
      params: {
        ...pendingProfile.value,
        provider: "google",
      },
      headers: {
        "Content-Type": "application/json",
      },
      responseType: "json",
    });

    if (response.data.status === 1) {
      const { token, profile } = response.data.data;

      store.setUser(profile);
      store.setToken(token);

      proxy.$messageSuccess(proxy, "Registration Success", response.data.message);
      setTimeout(() => toDashboard(), 1500);
    } else {
      proxy.$messageError(proxy, "Failed", response.data.message);
    }
  } catch (error) {
    console.error("Gagal register:", error);
    console.log(error.response?.data);
  } finally {
    SxModal.value?.hide();
    isSubmitting.value = false;
  }
};

const toDashboard = () => {
  router.push({ name: "dashboard" });
};

const closeModal = () => {
  router.push({ name: "auth" });
};
</script>

<template>
  <SximoModal ref="SxModal" modal-id="SxModal" title="Register" size="md">
    <template #body>
      <p>
        Email <strong>{{ pendingProfile.email }}</strong> is not registered in the
        system.<br />Do you want to create a new account?
      </p>
    </template>

    <template #footer>
      <button
        class="btn btn-sm rounded-3 btn-dark"
        :disabled="isSubmitting"
        @click="closeModal()"
      >
        Cancel
      </button>

      <button
        class="btn btn-sm rounded-3 btn-outline-dark"
        :disabled="isSubmitting"
        @click="confirmRegister"
      >
        <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2"></span>
        {{ isSubmitting ? "Creating..." : " Create" }}
      </button>
    </template>
  </SximoModal>
</template>
