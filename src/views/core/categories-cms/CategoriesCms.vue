<script setup>
import { ref, onMounted, getCurrentInstance, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "@/store";
import SximoModal from "@/components/core/SxModal.vue";
import photoSetting from "@/assets/img/photo-setting.jpg";
import ContentCms from "./ContentCms.vue";
import { DotLottieVue } from "@lottiefiles/dotlottie-vue";
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import "@vueup/vue-quill/dist/vue-quill.bubble.css";

const store = useStore();
const preview = ref(false);
const { proxy } = getCurrentInstance();
const route = useRoute();
const router = useRouter();
const SxModal = ref(null);
const loading = ref(true);
const imagesPreview = ref("");
const defaultPhoto = photoSetting;
const uploadFiles = ref([]);
const isEdit = ref(false);
const items = ref([]);
const page = ref(1);
const searchQuery = ref("");

let debounceTimeout;
watch(searchQuery, () => {
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(() => {
    page.value = 1;
    fetchData();
  }, 500);
});

const formErrors = ref({
  name: false,
  desc: false,
  active: false,
});

const validateForm = () => {
  let valid = true;
  formErrors.value = {
    name: !form.value.name,
    desc: !form.value.desc,
    active: !form.value.active,
  };

  Object.values(formErrors.value).forEach((error) => {
    if (error) valid = false;
  });
  return valid;
};

const form = ref({
  id: null,
  name: "",
  desc: "",
  active: "1",
  image: "",
});

const tabItems = ref([
  {
    title: "Content",
    key: "content",
  },
  {
    title: "Categories",
    key: "categories",
  },
]);

const resetForm = () => {
  form.value = {
    id: null,
    name: "",
    desc: "",
    active: "1",
    image: "",
  };
  imagesPreview.value = "";
  uploadFiles.value = [];
};

const onModalHide = () => {
  resetForm();
  isEdit.value = false;
  fetchData();
};

const fetchData = async () => {
  loading.value = true;
  try {
    const response = await store.getData({
      url: "api/core/categories",
      headers: {
        "Content-Type": "application/json",
      },
      responseType: "json",
    });
    items.value = response.data.data.categories;
    preview.value = true;
  } catch (error) {
    proxy.$swal(error);
  } finally {
    loading.value = false;
  }
};

const openModal = () => {
  SxModal.value?.show();
};

const save = async () => {
  if (!validateForm()) {
    proxy.$messageError(proxy, "Validation Error", "Please fill in all data.");
    return;
  }
  const formData = new FormData();
  formData.append("task", "save");
  formData.append("name", form.value.name);
  formData.append("desc", form.value.desc);
  formData.append("active", form.value.active);
  formData.append("parent_id", form.value.parent_id || 0);

  if (uploadFiles.value.length > 0) {
    const file = uploadFiles.value[0];
    const base64Image = await toBase64(file);
    formData.append("image", base64Image);
  }

  if (isEdit.value && form.value.id !== null) {
    formData.append("id", form.value.id);
  }

  try {
    const response = await store.postData({
      url: "api/core/categories",
      params: formData,
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (response.data.status) {
      proxy.$messageSuccess(
        proxy,
        "Success",
        response.data.message || "Category saved successfully."
      );

      SxModal.value?.hide();
      await fetchData();
      resetForm();
      isEdit.value = false;
    } else {
      proxy.$messageError(
        proxy,
        "Failed",
        response.data.message || "Failed to save category."
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

const deleteCategories = async (id) => {
  const formData = new FormData();
  formData.append("task", "delete");
  formData.append("id", id);

  try {
    const response = await store.postData({
      url: "api/core/categories",
      params: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
      responseType: "json",
    });

    if (response.data.status) {
      proxy.$messageError(
        proxy,
        "Success",
        response.data.message || "Category deleted successfully."
      );
      SxModal.value?.hide();
      await fetchData();
      resetForm();
      isEdit.value = false;
    } else {
      proxy.$messageError(
        proxy,
        "Failed",
        response.data.message || "Failed to delete category."
      );
    }
  } catch (error) {
    proxy.$messageError(
      proxy,
      "Failed",
      error.data.message || "Failed to delete category."
    );
  }
};

const confirmDelete = (id) => {
  proxy.$messageConfirm(proxy).then((result) => {
    if (result.isConfirmed) {
      deleteCategories(id);
    }
  });
};

const toBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

const openCreate = () => {
  form.value = {
    name: "",
    desc: "",
    active: "1",
    image: "",
    parent_id: 0,
  };
  isEdit.value = false;
  imagesPreview.value = "";
  openModal();
};

const openEdit = (item) => {
  form.value = {
    id: item.id,
    name: item.name,
    desc: item.desc,
    active: item.active ?? "1",
    image: item.image,
    parent_id: item.parent_id || 0,
  };
  isEdit.value = true;
  imagesPreview.value = item.image || defaultPhoto;
  openModal();
};

onMounted(() => {
  fetchData();
});

watch(
  form,
  (newVal) => {
    for (const key in formErrors.value) {
      if (newVal[key]) formErrors.value[key] = false;
    }
  },
  { deep: true }
);

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
</script>

<template>
  <div class="wrapper">
    <div class="header-nav">
      <h3><i class="bi bi-layout-sidebar"></i>Post</h3>
    </div>
    <div class="page">
      <BTabs content-class="mt-3">
        <BTab
          v-for="(tab, index) in tabItems"
          :key="index"
          :title="tab.title"
          :value="tab.key"
        >
          <template v-if="tab.key === 'categories'">
            <div class="toolbar-nav mb-4">
              <div class="d-flex align-items-center gap-2">
                <div class="d-flex gap-2">
                  <button
                    class="btn btn-sm btn-outline-dark rounded-3"
                    @click="openCreate"
                  >
                    <i class="bi bi-plus"></i> New
                  </button>
                </div>
              </div>
            </div>

            <div
              class="table-responsive border rounded-3 position-relative"
              style="overflow-x: auto; overflow-y: visible; min-height: 500px"
            >
              <div
                v-if="loading"
                class="d-flex justify-content-center align-items-center"
                style="
                  position: absolute;
                  inset: 0;
                  background-color: rgba(255, 255, 255, 0.8);
                  z-index: 1;
                "
              >
                <div class="spinner-border text-success" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
              </div>
              <table class="table mb-0">
                <thead class="table-light">
                  <tr>
                    <th class="text-center">No</th>
                    <th class="text-center">Action</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>Image</th>
                  </tr>
                </thead>

                <tbody v-if="!loading && items.length === 0">
                  <tr>
                    <td colspan="10">
                      <div
                        class="d-flex flex-column justify-content-center align-items-center"
                        style="
                          overflow-x: auto;
                          overflow-y: visible;
                          min-height: 500px;
                          padding: 10px 0;
                        "
                      >
                        <DotLottieVue
                          style="height: 130px; width: 130px"
                          autoplay
                          loop
                          src="https://lottie.host/b555b605-562e-4ce9-9762-1adacc149c45/1SskzF1vAL.lottie"
                        />
                        <span style="font-size: 14px; margin-top: 12px"
                          >No Data Found</span
                        >
                      </div>
                    </td>
                  </tr>
                </tbody>

                <tbody v-else>
                  <tr v-for="(item, index) in items" :key="item.id">
                    <td class="text-center">{{ index + 1 }}</td>
                    <td class="text-center">
                      <div class="btn-group">
                        <button
                          type="button"
                          class="btn btn-sm btn-outline-success dropdown-toggle rounded-3"
                          style="font-size: 10px"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          Option
                        </button>
                        <ul class="dropdown-menu">
                          <li>
                            <a class="dropdown-item" @click="openEdit(item)">
                              <i class="bi bi-pencil-square"></i> Edit
                            </a>
                          </li>
                        </ul>
                      </div>
                    </td>
                    <td>{{ item.name }}</td>
                    <td>
                      <div v-html="item.desc"></div>
                    </td>
                    <td>{{ item.active == 1 ? "Active" : "Inactive" }}</td>
                    <td>
                      <img
                        :src="item.image"
                        alt=""
                        style="width: 50px; height: auto; object-fit: cover"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </template>
          <template v-if="tab.key === 'content'">
            <ContentCms />
          </template>
        </BTab>
      </BTabs>
    </div>

    <SximoModal
      ref="SxModal"
      modalId="SxModal"
      :title="isEdit ? 'Edit Category' : 'Add Category'"
      size="lg"
      @hide="onModalHide"
      style="min-height: 600px"
    >
      <template #body>
        <div
          class="modal-body-scrollable"
          style="max-height: 80vh; overflow-y: auto; padding-right: 10px"
        >
          <div class="row">
            <div class="col-md-12 mb-3">
              <div class="p-4 d-flex flex-column align-items-center">
                <img
                  :src="imagesPreview || defaultPhoto"
                  alt="Logo Preview"
                  class="rounded mb-3"
                  style="
                    width: 150px;
                    height: 150px;
                    object-fit: contain;
                    border: 2px solid #ccc;
                  "
                />
                <label
                  for="logo-upload"
                  class="btn btn-sm btn-outline-primary mt-2"
                >
                  <i class="fas fa-upload me-2"></i>Upload Image
                </label>
                <input
                  id="logo-upload"
                  type="file"
                  class="d-none"
                  @change="onFileChange"
                  accept="image/*"
                />
              </div>
            </div>
            <div class="col-md-12 mb-3">
              <label class="form-label">Name</label>
              <input
                v-model="form.name"
                type="text"
                :class="[
                  'form-control form-control-sm',
                  formErrors.name ? 'is-invalid' : '',
                ]"
                placeholder="Category Name"
              />
            </div>
            <div class="col-md-12 mb-3">
              <label class="form-label">Status</label>
              <BFormSelect v-model="form.active" size="sm">
                <option disabled value="">-- Select Status --</option>
                <option value="1">Active</option>
                <option value="0">Inactive</option>
              </BFormSelect>
            </div>
            <div class="col-md-12 mb-3">
              <label class="form-label">Parent</label>
              <BFormSelect v-model="form.parent_id" size="sm">
                <option value="0">No Parent</option>
                <option
                  v-for="(item, index) in items.filter((i) => i.parent_id == 0)"
                  :key="index"
                  :value="item.id"
                >
                  {{ item.name }}
                </option>
              </BFormSelect>
            </div>
            <div class="col-md-12 mb-3">
              <label class="form-label">Description</label>
              <QuillEditor
                toolbar="essentials"
                v-model:content="form.desc"
                contentType="html"
                theme="snow"
                style="min-height: 200px; background-color: white"
                :class="[
                  'form-control form-control-sm',
                  formErrors.desc ? 'is-invalid' : '',
                ]"
              />
            </div>
          </div>
        </div>
      </template>
      <template #footer>
        <button
          v-if="isEdit"
          class="btn btn-sm rounded-3 btn-outline-danger"
          @click="confirmDelete(form.id)"
        >
          Delete
        </button>
        <button class="btn btn-sm rounded-3 btn-outline-success" @click="save">
          Save
        </button>
      </template>
    </SximoModal>
  </div>
</template>
<style scoped></style>
