<script setup>
import { ref, onMounted, getCurrentInstance } from "vue";
import { useStore } from "@/store";
import { DotLottieVue } from "@lottiefiles/dotlottie-vue";

const { proxy } = getCurrentInstance();
const loading = ref(true);
const store = useStore();
const languageList = ref([]);
const showModal = ref(false);

const newLanguage = ref({
  name: "",
  folder: "",
  author: "",
});

const countries = [
  { name: "Indonesia", path: "id" },
  { name: "English", path: "en" },
  { name: "Japan", path: "jp" },
  { name: "China", path: "cn" },
  { name: "Australia", path: "au" },
  { name: "India", path: "in" },
  { name: "Korea", path: "kr" },
  { name: "Taiwan", path: "tw" },
  { name: "Vietnam", path: "vn" },
  { name: "Thailand", path: "th" },
  { name: "Malaysia", path: "my" },
  { name: "Philippines", path: "ph" },
  { name: "Singapore", path: "sg" },
  { name: "Hong Kong", path: "hk" },
  { name: "Bangladesh", path: "bd" },
];

const fetchData = async () => {};

const save = async () => {
  const { name, folder, author } = newLanguage.value;
  if (!name || !folder || !author) {
    Swal.fire("Warning", "Please fill in all fields", "warning");
    return;
  }

  try {
    const response = await store.postData({
      url: "api/sximo/settings/translation",
      params: {
        lang_name: name,
        lang_code: folder,
        author,
        data: {},
      },
    });

    if (response.data.status) {
      proxy.$swal.fire("Success", "Language saved successfully", "success");
      showModal.value = false;
      newLanguage.value = { name: "", folder: "", author: "" };
      await fetchData();
    } else {
      proxy.$swal.fire(
        "Error",
        response.data.message || "Failed to save language",
        "error"
      );
    }
  } catch (error) {
    proxy.$swal.fire("Error", error.message || "Unknown error", "error");
  }
};

const deleteLanguage = async (lang) => {
  const result = await proxy.$swal.fire({
    title: "Are you sure?",
    text: `You are about to delete "${lang.name}" language.`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!",
  });

  if (result.isConfirmed) {
    try {
      const response = await store.deleteData({
        url: `api/sximo/settings/translation/${lang.path}`,
      });

      if (response.data.status) {
        languageList.value = languageList.value.filter(
          (item) => item.folder !== lang.folder
        );
        proxy.$swal.fire("Deleted!", "Language has been deleted.", "success");
      } else {
        proxy.$swal.fire(
          "Error",
          response.data.message || "Failed to delete language",
          "error"
        );
      }
    } catch (error) {
      proxy.$swal.fire("Error", error.message || "An error occurred", "error");
    }
  }
};

const onLanguageSelect = (e) => {
  const selected = countries.find((country) => country.name === e.target.value);
  if (selected) {
    newLanguage.value.name = selected.name;
    newLanguage.value.folder = selected.path;
  }
};

onMounted(() => {
  // fetchData();
});
</script>

<template>
  <div class="card p-4 shadow">
    <div class="card-body">
      <div class="card shadow-sm rounded-3 py-2 px-2 mb-3">
        <div class="d-flex justify-content-between align-items-center">
          <div class="d-flex gap-2">
            <button
              class="btn btn-sm btn-outline-success rounded-3"
              @click="showModal = true"
            >
              <i class="bi bi-plus"></i> New
            </button>
          </div>
          <div class="d-flex gap-2">
            <input
              type="text"
              class="form-control form-control-sm rounded-3"
              placeholder="Search..."
              aria-label="Search"
              style="height: 2px"
            />
          </div>
        </div>
      </div>

      <div
        class="table-responsive border rounded-3 position-relative"
        style="overflow-x: auto; overflow-y: visible"
      >
        <table class="table mb-0">
          <thead class="table-light">
            <tr>
              <th>Name</th>
              <th>Path</th>
              <th>Author</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody v-if="languageList.length > 0">
            <tr v-for="(lang, index) in languageList" :key="index">
              <td>
                <b>{{ lang.name }}</b>
              </td>
              <td>{{ lang.path }}</td>
              <td>{{ lang.author }}</td>
              <td>
                <button
                  class="btn btn-sm btn-outline-danger"
                  @click="deleteLanguage(lang)"
                >
                  <i class="bi bi-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr>
              <td colspan="4">
                <div
                  class="d-flex flex-column justify-content-center align-items-center"
                  style="min-height: 200px; padding: 10px 0"
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
    </div>

    <div
      class="modal fade"
      :class="{ show: showModal }"
      :style="{ display: showModal ? 'block' : 'none' }"
      tabindex="-1"
      role="dialog"
    >
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Add New Language</h5>
            <button
              type="button"
              class="btn-close"
              @click="showModal = false"
            ></button>
          </div>

          <div class="modal-body">
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">Language Name</label>
                <select class="form-control" @change="onLanguageSelect">
                  <option value="">-- Select --</option>
                  <option
                    v-for="(country, index) in countries"
                    :key="index"
                    :value="country.name"
                  >
                    {{ country.name }}
                  </option>
                </select>
              </div>

              <div class="col-md-6 mb-3">
                <label class="form-label">Path</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="newLanguage.folder"
                  disabled
                />
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label">Author</label>
              <input
                type="text"
                class="form-control"
                v-model="newLanguage.author"
              />
            </div>
          </div>

          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-outline-success btn-sm"
              @click="save"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>

    <div
      class="modal-backdrop fade"
      :class="{ show: showModal }"
      v-show="showModal"
    ></div>
  </div>
</template>

<style scoped></style>
