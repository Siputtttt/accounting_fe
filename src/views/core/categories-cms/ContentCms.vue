<script setup>
import { ref, onMounted, getCurrentInstance, watch } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "@/store";
import SximoModal from "@/components/core/SxModal.vue";
import { DotLottieVue } from "@lottiefiles/dotlottie-vue";
import photoSetting from "@/assets/img/photo-setting.jpg";
import SximoPagination from "@/components/core/SxPagination.vue";
import debounce from "lodash.debounce";
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import "@vueup/vue-quill/dist/vue-quill.bubble.css";

const store = useStore();
const { proxy } = getCurrentInstance();
const preview = ref(false);
const router = useRouter();
const props = defineProps(["content", "items"]);
const searchQuery = ref("");
const SxModalContent = ref(null);
const isEdit = ref(false);
const imagesPreview = ref("");
const defaultPhoto = photoSetting;
const uploadFiles = ref([]);
const currentPage = ref(1);
const pagination_content = ref({});
const loading = ref(false);
const limit = ref(10);
const cid = ref("");
const content = ref([]);
const items = ref([]);

const form = ref({
  id: null,
  categories_id: "",
  title: "",
  slug: "",
  sinopsis: "",
  note: "",
  access_data: "",
  allow_guest: "1",
  labels: "",
  image: "",
});

const formErrors = ref({
  categories_id: false,
  title: false,
  sinopsis: false,
  labels: false,
  note: false,
});

const validateForm = () => {
  let valid = true;
  formErrors.value = {
    categories_id: !form.value.categories_id,
    title: !form.value.title,
    sinopsis: !form.value.sinopsis,
    labels: !form.value.labels,
    note: !form.value.note,
  };

  Object.values(formErrors.value).forEach((error) => {
    if (error) valid = false;
  });

  return valid;
};

const debouncedSearch = debounce(() => {
  currentPage.value = 1;
  fetchData();
}, 500);

watch(
  [searchQuery, cid, form],
  ([newForm]) => {
    debouncedSearch();
    for (const key in formErrors.value) {
      if (newForm[key]) formErrors.value[key] = false;
    }
  },
  { deep: true }
);

const openCreate = () => {
  resetForm();
  isEdit.value = false;
  openModal();
};

const openModal = () => {
  SxModalContent.value?.show();
};

const resetForm = () => {
  form.value = {
    id: null,
    categories_id: "",
    title: "",
    slug: "",
    sinopsis: "",
    note: "",
    access_data: "",
    allow_guest: "1",
    labels: "",
    image: "",
  };
  formErrors.value = {
    categories_id: false,
    title: false,
    sinopsis: false,
    labels: false,
    note: false,
    // image: false,
  };
  imagesPreview.value = "";
  uploadFiles.value = [];
};

const openEdit = (item) => {
  form.value = {
    id: item.id,
    categories_id: item.categories_id,
    title: item.title,
    slug: item.slug,
    sinopsis: item.sinopsis,
    note: item.note,
    access_data: item.access_data,
    allow_guest: item.allow_guest,
    labels: item.labels,
    image: item.image,
  };
  isEdit.value = true;
  imagesPreview.value = item.image || defaultPhoto;
  openModal();
};

const fetchData = async () => {
  loading.value = true;
  try {
    const response = await store.getData({
      url: `api/core/content?p=${currentPage.value}&l=${limit.value}&s=${searchQuery.value}&cid=${cid.value}`,
      headers: {
        "Content-Type": "application/json",
      },
      responseType: "json",
    });
    items.value = response.data.data.categories;
    content.value = response.data.data.content;
    pagination_content.value = response.data.data.pagination_content;

    preview.value = true;
  } catch (error) {
    proxy.$swal(error);
  } finally {
    loading.value = false;
  }
};

const saveContent = async () => {
  if (!validateForm()) {
    proxy.$swal.fire({
      icon: "warning",
      title: "Validation Error",
      text: "Please fill in all data.",
    });
    return;
  }

  const formData = new FormData();
  formData.append("task", "save");
  formData.append("categories_id", form.value.categories_id);
  formData.append("title", form.value.title);
  formData.append("slug", form.value.slug);
  formData.append("sinopsis", form.value.sinopsis);
  formData.append("note", form.value.note);
  formData.append("access_data", form.value.access_data);
  formData.append("allow_guest", form.value.allow_guest);
  formData.append("labels", form.value.labels);

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
      url: "api/core/content",
      params: formData,
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (response.data.status) {
      await proxy.$swal.fire({
        icon: "success",
        title: "Success",
        text: response.data.message,
        toast: true,
        position: "top-end",
        timer: 3000,
        showConfirmButton: false,
        timerProgressBar: true,
      });
      SxModalContent.value?.hide();
      resetForm();
      await fetchData();
      isEdit.value = false;
    } else {
      proxy.$swal.fire({
        icon: "error",
        title: isEdit.value ? "Update Content Failed" : "Create Content Failed",
        text: response.data.message || "An error occurred.",
        toast: true,
        position: "top-end",
        timer: 3000,
        showConfirmButton: false,
        timerProgressBar: true,
      });
    }
  } catch (error) {
    proxy.$swal.fire({
      icon: "error",
      title: "Error saving content",
      text: error.message || "An unexpected error occurred.",
    });
    console.error("Error saving content:", error);
  }
};

const deleteConten = async (id) => {
  const formData = new FormData();
  formData.append("task", "delete");
  formData.append("id", id);

  try {
    const response = await store.postData({
      url: "api/core/content",
      params: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
      responseType: "json",
    });

    if (response.data.status) {
      proxy.$swal.fire({
        icon: "success",
        title: "Success",
        text: "Selected content has been deleted.",
        toast: true,
        position: "top-end",
        timer: 3000,
        showConfirmButton: false,
        timerProgressBar: true,
      });
      SxModalContent.value?.hide();
      resetForm();
      await fetchData();
      isEdit.value = false;
    } else {
      proxy.$swal.fire({
        icon: "error",
        title: "Error",
        text:
          response.data.message || "An error occurred while deleting content.",
        toast: true,
        position: "top-end",
        timer: 3000,
        showConfirmButton: false,
        timerProgressBar: true,
      });
    }
  } catch (error) {
    proxy.$swal({
      icon: "error",
      title: "Error deleting content",
      text: error.message || "An unexpected error occurred.",
    });
    console.error("Error deleting content:", error);
  }
};

const confirmDelete = (id) => {
  proxy.$swal
    .fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    })
    .then((result) => {
      if (result.isConfirmed) {
        deleteConten(id);
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

const onModalHide = () => {
  resetForm();
  isEdit.value = false;
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
  fetchData();
});
</script>

<template>
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
      <div class="d-flex ms-auto">
        <BFormSelect size="sm" style="width: 150px" v-model="cid">
          <option value="">-- Select Category --</option>
          <option
            v-for="category in items"
            :key="category.id"
            :value="category.id"
          >
            {{ category.name }}
          </option>
        </BFormSelect>
      </div>
      <div class="d-flex gap-2" style="width: 200px">
        <input
          type="text"
          class="form-control form-control-sm rounded-3"
          placeholder="Search..."
          aria-label="Search"
          v-model="searchQuery"
        />
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
          <th>Nama Categories</th>
          <th>Title</th>
          <th>Slug / Alias</th>
          <th>Sinopsis</th>
          <th class="text-center">Image</th>
        </tr>
      </thead>
      <tbody v-if="!loading && content.length">
        <tr v-for="(item, index) in content" :key="item.id">
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
          <td>{{ item.name_categories }}</td>
          <td>{{ item.title }}</td>
          <td>{{ item.slug }}</td>
          <td>{{ item.sinopsis }}</td>

          <td class="text-center">
            <img
              :src="item.image"
              alt=""
              style="width: 50px; height: auto; object-fit: cover"
            />
          </td>
        </tr>
      </tbody>

      <tbody v-if="!loading && !content.length">
        <tr>
          <td colspan="10">
            <div
              class="d-flex flex-column justify-content-center align-items-center"
              style="min-height: 500px; padding: 10px 0"
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
    </table>
  </div>

  <SximoPagination
    v-if="pagination_content"
    :modelValue="currentPage"
    :totalPages="pagination_content.last_page || 1"
    :btnVariant="'btn-outline-dark'"
    @update:modelValue="
      (newPage) => {
        currentPage = newPage;
        fetchData();
      }
    "
    class="float-end"
    :size="'sm'"
  />

  <SximoModal
    ref="SxModalContent"
    modalId="SxModalContent"
    :title="isEdit ? 'Edit Content' : 'Add Content'"
    size="lg"
    @hide="onModalHide"
    style="min-height: 600px"
  >
    <template #body>
      <div
        class="modal-body-scrollable"
        style="max-height: 80vh; overflow-y: auto; padding-right: 10px"
      >
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
          <label for="logo-upload" class="btn btn-sm btn-outline-primary mt-2">
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
        <div class="row">
          <div class="col-md-6">
            <div class="mb-3">
              <label class="form-label">Categories</label>
              <BFormSelect v-model="form.categories_id" size="sm">
                <option disabled value="">Select a category</option>
                <option
                  v-for="category in items"
                  :key="category.id"
                  :value="category.id"
                >
                  {{ category.name }}
                </option>
              </BFormSelect>
            </div>
          </div>
          <div class="col-md-6">
            <div class="mb-3">
              <label class="form-label">Title</label>
              <input
                v-model="form.title"
                type="text"
                :class="[
                  'form-control form-control-sm',
                  formErrors.title ? 'is-invalid' : '',
                ]"
                placeholder="Title"
              />
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6">
            <div class="mb-3">
              <label class="form-label">Sinopsis</label>
              <input
                v-model="form.sinopsis"
                type="text"
                :class="[
                  'form-control form-control-sm',
                  formErrors.sinopsis ? 'is-invalid' : '',
                ]"
                placeholder="Sinopsis"
              />
            </div>
          </div>
          <div class="col-md-6">
            <div class="mb-3">
              <label class="form-label">Labels</label>
              <input
                v-model="form.labels"
                type="text"
                :class="[
                  'form-control form-control-sm',
                  formErrors.labels ? 'is-invalid' : '',
                ]"
                placeholder="Labels"
              />
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-md-6">
            <div class="mb-3">
              <label class="form-label">Allow Guest</label>
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="checkbox"
                  id="guestCheck"
                  v-model="form.allow_guest"
                  :true-value="1"
                  :false-value="0"
                />
                <label class="form-check-label" for="guestCheck">Yes</label>
              </div>
            </div>
          </div>
        </div>

        <div class="d-flex flex-column align-items-center mt-3">
          <div class="mb-3">
            <label class="form-label">Note</label>
            <QuillEditor
              toolbar="full"
              rows="6"
              v-model:content="form.note"
              contentType="html"
              theme="snow"
              :class="[
                'form-control form-control-sm',
                formErrors.note ? 'is-invalid' : '',
              ]"
              style="min-height: 200px; background-color: white"
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
      <button
        class="btn btn-sm rounded-3 btn-outline-success"
        @click="saveContent"
      >
        Save
      </button>
    </template>
  </SximoModal>
</template>

<style scoped></style>
