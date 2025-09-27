<script setup>
import { ref, onMounted, getCurrentInstance, reactive } from "vue";
import { useStore } from "@/store";
import photoSetting from "@/assets/img/photo-setting.jpg";
import { useMessageStore } from "@/store/messageStore";
const { proxy } = getCurrentInstance();
const store = useStore();

const messageStore = useMessageStore();
const defaultPhoto = photoSetting;
const uploadFiles = ref([]);
const imagesPreview = ref("");
const props = defineProps(["items"]);
const localItems = reactive({ ...props.items });

const languages = [
  { value: "en", label: "English" },
  { value: "in", label: "Indonesian" },
];

const themes = [
  { value: "default", label: "Default" },
  { value: "premium", label: "Premium" },
];

const formatDate = [
  { value: "Y-m-d", label: "Y-m-d . Example : 2025-09-04" },
  { value: "Y/m/d", label: "Y/m/d . Example : 2025/04/25" },
  { value: "D-M-Y", label: "D-M-Y . Example : 04-09-2025" },
  { value: "D/M/Y", label: "D/M/Y . Example : 04/09/2025" },
  { value: "m-d-Y", label: "m-d-Y . Example : 09-04-2025" },
  { value: "m/d/Y", label: "m/d/Y . Example : 09/04/2025" },
];

const save = async () => {
  if (imagesPreview.value != "") {
    localItems.images = imagesPreview.value;
  }
  try {
    const response = await store.postData({
      url: "api/core/setting",
      params: localItems,
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (response.data.status) {
      const appData = response.data.data;

      messageStore.reloadMenus();
      proxy.$messageSuccess(
        proxy,
        "Success",
        response.data.message || "Settings saved successfully."
      );
    } else {
      proxy.$messageError(
        proxy,
        "Failed",
        response.data.message || "Failed to save Settings."
      );
    }
  } catch (error) {
    proxy.$swal({
      icon: "error",
      title: "Error saving settings",
      text: error.message || "An unexpected error occurred.",
    });
    console.error("Error saving settings:", error);
  }
};

const onFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    uploadFiles.value = [file];
    const reader = new FileReader();
    reader.onload = () => {
      imagesPreview.value = reader.result || "";
    };
    reader.readAsDataURL(file);
  }
};

onMounted(() => {
  imagesPreview.value = localItems.cnf_logo;
});
</script>

<template>
  <div class="card p-4">
    <div class="card-body">
      <div class="row">
        <div class="col-md-4 text-center">
          <div class="p-4 d-flex flex-column align-items-center">
            <img
              :src="imagesPreview || defaultPhoto"
              alt="Logo Preview"
              class="rounded mb-3"
              style="
                width: 200px;
                height: 200px;
                object-fit: contain;
                border: 2px solid #ccc;
              "
            />

            <label
              for="logo-upload"
              class="btn btn-sm btn-outline-primary mt-2"
            >
              <i class="fas fa-upload me-2"></i>Upload Image (PNG)
            </label>
            <BFormInput
              id="logo-upload"
              type="file"
              class="d-none"
              @change="onFileChange"
              accept="image/*"
            />
          </div>
          <small class="text-muted d-block mt-2">
            Please use the same dimension<br />Logo image, minimum 600 x 400 and
            format must <b>PNG</b>
          </small>
        </div>

        <div class="col-md-8">
          <div class="row">
            <div class="col-md-6 mb-3">
              <label class="form-label">Application Name</label>
              <BFormInput
                v-model="localItems.cnf_appname"
                type="text"
                size="sm"
              />
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label">Main Language</label>
              <BFormSelect v-model="localItems.cnf_lang" size="sm">
                <option disabled value="">Select Language</option>
                <option
                  v-for="item in languages"
                  :key="item.value"
                  :value="item.value"
                >
                  {{ item.label }}
                </option>
              </BFormSelect>
            </div>

            <div class="col-md-6 mb-3">
              <label class="form-label">Application Description</label>
              <input
                v-model="localItems.cnf_appdesc"
                type="text"
                class="form-control form-control-sm"
              />
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label">Frontend Template</label>
              <BFormSelect v-model="localItems.cnf_theme" size="sm">
                <option disabled value="">Select theme</option>
                <option
                  v-for="item in themes"
                  :key="item.value"
                  :value="item.value"
                >
                  {{ item.label }}
                </option>
              </BFormSelect>
            </div>

            <div class="col-md-6 mb-3">
              <label class="form-label">Company Name</label>
              <BFormInput
                v-model="localItems.cnf_comname"
                type="text"
                size="sm"
              />
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label">Date Format</label>
              <BFormSelect v-model="localItems.cnf_date" size="sm">
                <option disabled value="">Select Format</option>
                <option
                  v-for="item in formatDate"
                  :key="item.value"
                  :value="item.value"
                >
                  {{ item.label }}
                </option>
              </BFormSelect>
            </div>

            <div class="col-md-6 mb-3">
              <label class="form-label">UI</label>
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="checkbox"
                  v-model="localItems.cnf_multilang"
                  id="cnf_multilang"
                />
                <label class="form-check-label" for="cnf_multilang"
                  >Multi Language</label
                >
              </div>
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="checkbox"
                  v-model="localItems.cnf_front"
                  id="cnf_front"
                />
                <label class="form-check-label" for="cnf_front"
                  >Allow Frontend</label
                >
              </div>
            </div>

            <div class="col-md-6 mb-3">
              <label class="form-label">Meta Key</label>
              <BFormInput
                v-model="localItems.cnf_metakey"
                type="text"
                size="sm"
              />
            </div>

            <div class="col-md-6 mb-3">
              <label class="form-label">Email System</label>
              <BFormInput
                v-model="localItems.cnf_email"
                type="cnf_email"
                size="sm"
              />
            </div>

            <div class="col-md-6 mb-3">
              <label class="form-label">Meta Description</label>
              <BFormInput
                v-model="localItems.cnf_metadesc"
                type="text"
                size="sm"
              />
            </div>

            <div class="col-12 text-end">
              <button class="btn btn-outline-success btn-sm mt-3" @click="save">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
