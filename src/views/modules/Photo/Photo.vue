<script setup>
import { getCurrentInstance, ref, onMounted, reactive } from "vue";
import { useStore } from "@/store";
import { useRouter } from "vue-router";

const { proxy } = getCurrentInstance();
const router = useRouter();
const store = useStore();

const loading = ref(true);
/* Modal Variant */
const modal = ref(false);
const downloadModal = ref(false);
const searchModal = ref(false);
/* Cruds stuff */
const columns = ref([]);
const forms = ref([]);
const form_type = ref([
  "text",
  "email",
  "number",
  "date",
  "url",
  "color",
  "tel",
  "range",
  "time",
  "datetime-local",
]);
const rows = ref([]);
const options = ref([]);
const posts = ref([]);
const totalRows = ref(1000);
const perPage = ref(10);
const currentPage = ref(1);
const filter = ref("");
const sortBy = ref("");
// const is_edit = ref(0);
const selected = ref([]);
const access = ref([]);
const download = ref({ startRows: 0, endRows: 100, type: "csv" });
const toSearch = ref([]);
const textSearch = ref("");

onMounted(() => {
  fetchData();
});
const fetchData = async (event) => {
  loading.value = true;
  try {
    const response = await store.getData({
      url: `api/Photo?s=${textSearch.value}`,
    });
    if (response.data.status === 1) {
      columns.value = response.data.columns;
      forms.value = response.data.forms;
      posts.value = response.data.items;
      options.value = response.data.options;
      //   console.log(options.value);
      perPage.value = response.data.setting.display_row;
      sortBy.value = response.data.setting.ordery_by;
      rows.value = response.data.rows;
      totalRows.value = response.data.rows.length;
      access.value = response.data.access;
      loading.value = false;
    }
    toSearch.value = [];
  } catch (err) {
    proxy.$noticeAxios(proxy, err.response);
    loading.value = false;
    router.push("/dashboard");
  }
};
const add = async (event) => {
  loading.value = true;
  const response = await store.getData({
    url: `api/Photo/create`,
  });
  if (response.data.status === 1) {
    posts.value = response.data.data;
    modal.value = true;
    loading.value = false;
  } else {
    proxy.$swal.message("Someting Goes Wrong");
  }
  modal.value = true;
};
const edit = async (item) => {
  //   if (is_edit.value == 1) {
  loading.value = true;
  const response = await store.getData({
    url: `api/Photo/edit?id=${item.id}`,
  });
  if (response.data.status === 1) {
    posts.value = response.data.data;
    modal.value = true;
    loading.value = false;
  } else {
    proxy.$swal.message("Someting Goes Wrong");
  }
};
// };
const onSubmit = async (event) => {
  event.preventDefault();

  try {
    const response = await store.postData({
      url: "api/Photo",
      params: posts.value,
      headers: {
        "Content-Type": "application/json",
      },
      responseType: "json",
    });
    if (response.data.status === 1) {
      proxy.$messageSuccess(proxy, "Success", response.data.message);
      modal.value = false;
      fetchData();
    }
  } catch (error) {
    proxy.$messageSuccess(proxy, "Validation error", error.response.data.message);
  }
};

const doDownload = async (event) => {
  loading.value = true;

  try {
    const response = await store.getData({
      url: `api/Photo/download?dw=${download.value.startRows}&e=${download.value.endRows}&t=${download.value.type}&s=${textSearch.value}`,
    });
    proxy.$export(response.data, "Photo.xls");
    proxy.$messageSuccess(proxy, "Success", response.data.message);
    downloadModal.value = false;
    loading.value = false;
  } catch (err) {
    loading.value = false;
    console.log(err);
  }
};

const doSearch = async (event) => {
  searchModal.value = false;
  textSearch.value = proxy.$searchParam(toSearch.value, forms.value);
  fetchData();
};
const doPrint = async (event) => {
  proxy.$printArea("printedArea", "Photo");
};
const remove = async (event) => {
  if (selected.value.length <= 0) {
    proxy.$swal.fire({
      title: "Ops , Something wrong!",
      text: "Please select checkbox !",
      icon: "warning",
    });
    return false;
  }

  const result = await proxy.$swal.fire({
    title: "Delete Item ?",
    text: "Are you sure?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, Continue!",
  });

  if (result.isConfirmed) {
    const response = await store.deleteData({
      url: "api/Photo/" + selected.value,
      headers: {
        "Content-Type": "application/json",
      },
      responseType: "json",
    });
    if (response.data.status === 1) {
      fetchData();
      selected.value = [];
      proxy.$swal.fire({
        text: response.data.message,
        icon: "success",
      });
    }
  }
};
</script>
<template>
  <div class="wrapper">
    <div class="header-nav">
      <h3><i class="bi bi-layout-sidebar"></i> Photo</h3>
    </div>
    <div class="toolbar-nav">
      <div class="row align-items-center gx-3 gy-2">
        <!-- Bagian icon -->
        <div class="col-12 col-md-6 d-flex flex-wrap align-items-center gap-2">
          <div v-if="access.is_add == '1'" class="tool-icon" @click="add">
            <i class="bi bi-file-earmark-plus"></i>
          </div>
          <div v-if="access.is_delete == '1'" class="tool-icon" @click="remove">
            <i class="bi bi-trash3"></i>
          </div>
          <div v-if="access.is_print == '1'" class="tool-icon" @click="doPrint">
            <i class="bi bi-printer"></i>
          </div>
          <div
            v-if="access.is_excel == '1'"
            class="tool-icon"
            @click="downloadModal = true"
          >
            <i class="bi bi-file-earmark-excel"></i>
          </div>
          <div class="tool-icon" @click="searchModal = true">
            <i class="bi bi-search"></i>
          </div>
          <div class="tool-icon" @click="fetchData">
            <i class="bi bi-arrow-clockwise"></i>
          </div>
        </div>

        <!-- Select Album -->
        <div class="col-12 col-md-3">
          <BFormSelect
            v-model="selectedAlbum"
            @change="fetchData"
            size="sm"
            class="w-100"
            :options="options.id_album"
          >
          </BFormSelect>
        </div>

        <!-- Input Search -->
        <div class="col-12 col-md-3">
          <BFormInput
            v-model="filter"
            size="sm"
            type="search"
            placeholder="Type to Search"
            class="w-100"
          />
        </div>
      </div>
    </div>

    <div class="page">
      <div class="alert alert-warning alert-search" v-if="textSearch != ''"></div>
      <div
        class="table-responsive border rounded-3 position-relative"
        style="overflow-x: auto; overflow-y: visible"
        id="printedArea"
      >
        <div class="photo-grid">
          <div class="" v-for="(row, index) in rows" :key="index">
            <div class="box-photos" @click="edit(row)">
              <img
                :src="store.baseUrl + `storage/screenshoots/${row.photo}`"
                :alt="`Gallery Image ${index + 1}`"
                style="cursor: pointer"
              />
            </div>
          </div>
        </div>
      </div>
      <BRow>
        <BCol md="12">
          <BPagination
            v-model="currentPage"
            :total-rows="totalRows"
            :per-page="perPage"
            size="sm"
            class="my-0"
          />
        </BCol>
      </BRow>
    </div>
    <BModal
      v-model="modal"
      title="Form Photo"
      size="md"
      no-footer
      :no-close-on-backdrop="true"
    >
      <div>
        <BForm @submit.prevent="onSubmit">
          <div class="row">
            <template v-for="(form, index) in forms" :key="index">
              <template v-if="form_type.includes(form.type)">
                <BFormGroup
                  :label="form.label"
                  class="mb-3"
                  :class="'col-md-' + form.size"
                >
                  <BFormInput
                    size="sm"
                    v-model="posts[form.key]"
                    :type="form.type"
                    :required="form.validation != '' ? true : false"
                  />
                </BFormGroup>
              </template>
              <template v-if="form.type == 'textarea'">
                <BFormGroup
                  :label="form.label"
                  class="mb-3"
                  :class="'col-md-' + form.size"
                >
                  <BFormTextarea
                    size="sm"
                    v-model="posts[form.key]"
                    placeholder="Enter something..."
                    rows="3"
                    :required="form.validation != '' ? true : false"
                  />
                </BFormGroup>
              </template>
              <template v-if="form.type == 'editor'">
                <BFormGroup
                  :label="form.label"
                  class="mb-3"
                  :class="'col-md-' + form.size"
                >
                </BFormGroup>
              </template>
              <template v-if="form.type == 'radio'">
                <BFormGroup
                  :label="form.label"
                  class="mb-3"
                  :class="'col-md-' + form.size"
                >
                  <BFormRadioGroup
                    v-model="posts[form.key]"
                    :options="options[form.key]"
                    name="radio-options"
                    size="sm"
                    :required="form.validation != '' ? true : false"
                  />
                </BFormGroup>
              </template>
              <template v-if="form.type == 'select'">
                <BFormGroup
                  :label="form.label"
                  class="mb-3"
                  :class="'col-md-' + form.size"
                >
                  <BFormSelect
                    :options="options[form.key]"
                    size="sm"
                    v-model="posts[form.key]"
                    :required="form.validation != '' ? true : false"
                  />
                </BFormGroup>
              </template>
              <template v-if="form.type == 'files'">
                <BFormGroup
                  :label="form.label"
                  class="mb-3"
                  :class="'col-md-' + form.size"
                >
                  <File v-model="posts[form.key]" size="sm" />
                </BFormGroup>
              </template>
              <template v-if="form.type == 'image'">
                <BFormGroup
                  :label="form.label"
                  class="mb-3"
                  :class="'col-md-' + form.size"
                >
                  <Image v-model="posts[form.key]" size="sm" />
                </BFormGroup>
              </template>
              <template v-if="form.type == 'checkbox'">
                <BFormGroup
                  :label="form.label"
                  class="mb-3"
                  :class="'col-md-' + form.size"
                >
                  <b-form-checkbox-group
                    v-model="posts[form.key]"
                    :options="options[form.key]"
                    name="radio-options"
                    size="sm"
                    :required="form.validation != '' ? true : false"
                  />
                </BFormGroup>
              </template>
            </template>
          </div>
          <div class="sx-modal-footer">
            <div class="text-right">
              <button
                type="submit"
                class="btn btn-sm btn-outline-dark"
                style="font-size: 11px"
              >
                Save Change(s)
              </button>
            </div>
          </div>
        </BForm>
      </div>
    </BModal>
    <!-- Download Modal -->
    <BModal v-model="downloadModal" title="Download Setting" size="md" no-footer>
      <Download :download="download" @update="doDownload" />
    </BModal>
    <!-- Search Modal -->
    <BModal v-model="searchModal" title="Search Setting" size="md" no-footer>
      <Search :option="options" :form="forms" :toSearch="toSearch" @update="doSearch" />
    </BModal>
    <b-overlay :show="loading" no-wrap></b-overlay>
  </div>
</template>

<style scoped>
.photo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(125px, 1fr));
  gap: 10px;
  padding: 10px;
  background: #ffffff;
}

.box-photos {
  width: 100%;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  border-radius: 6px;
  position: relative;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}

.box-photos:hover {
  transform: scale(1.03);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.box-photos img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease, filter 0.3s ease;
  display: block;
}

.box-photos:hover img {
  transform: scale(1.1);
}
</style>
