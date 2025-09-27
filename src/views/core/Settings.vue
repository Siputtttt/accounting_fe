<script setup>
import { onMounted, ref, getCurrentInstance } from "vue";
import { useStore } from "@/store";
import EmailConfiguration from "./general-settings/EmailConfiguration.vue";
import GeneralSettings from "./general-settings/GeneralSettings.vue";
import LoginDanSecurity from "./general-settings/LoginDanSecurity.vue";
import Translation from "./general-settings/Translation.vue";

const store = useStore();

const items = ref([]);
const emails = ref([]);
const loading = ref(true);
const { proxy } = getCurrentInstance();
const preview = ref(false);

const fetchData = async () => {
  loading.value = true;
  try {
    const response = await store.getData({
      url: "api/core/setting",
      headers: {
        "Content-Type": "application/json",
      },
      responseType: "json",
    });
    items.value = response.data.data;
    emails.value = response.data.emails;
    preview.value = true;
    loading.value = false;
  } catch (error) {
    loading.value = false;
    proxy.$swal(error);
  }
};

onMounted(() => {
  fetchData();
});
</script>

<template>
  <div class="wrapper">
    <div class="header-nav">
      <h3><i class="bi bi-layout-sidebar"></i> General Settings</h3>
    </div>
    <div class="page general-setting">
      <BTabs >
        <BTab title="Settings">
          <GeneralSettings v-if="preview" :items="items" />
        </BTab>
        
        <BTab title="Login And Security">
          <LoginDanSecurity v-if="preview" :items="items" />
        </BTab>
        <BTab title="Emails">
          <EmailConfiguration v-if="preview" :items="emails" />
        </BTab>
        <!-- <BTab title="Translation" lazy>
          <Translation />
        </BTab> -->
      </BTabs>
    </div>
  </div>
</template>
<style scoped>
  .general-setting .card {
    border-top: 0 !important;
  }
</style>
