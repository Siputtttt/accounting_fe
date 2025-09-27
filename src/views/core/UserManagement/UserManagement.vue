<script setup>
import { ref, onMounted, getCurrentInstance, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "@/store";
const store = useStore();
import debounce from "lodash.debounce";
import profileImage from "@/assets/img/profile.jpg";
import SximoModal from "@/components/core/SxModal.vue";
import SximoPagination from "@/components/core/SxPagination.vue";

const { proxy } = getCurrentInstance();
const defaultAvatar = profileImage;
const avatarPreview = ref(defaultAvatar);
const data = ref({});
const users = ref([]);
const groups = ref([]);
const SxModal = ref(null);
const SxModalGroup = ref(null);
const selectedUsers = ref([]);
const selectedGroups = ref([]);
const isSubmitting = ref(false);
const isLoading = ref(false);
const currentPage = ref(1);
const searchQueryUser = ref("");
const searchQueryGroups = ref("");
const pagination_users = ref({});
const pagination_groups = ref({});
const isEdit = ref(false);
const route = useRoute();
const router = useRouter();
const activeTab = ref(route.query.tab || "user-management");

const allSelected = computed(() => {
  return (
    users.value.length > 0 &&
    selectedUsers.value.length === users.value.length &&
    users.value.every((u) => selectedUsers.value.includes(u.id))
  );
});

const allSelectedGroups = computed(() => {
  return (
    groups.value.length > 0 &&
    selectedGroups.value.length === groups.value.length &&
    groups.value.every((u) => selectedGroups.value.includes(u.group_id))
  );
});

const form = ref({
  group_id: "",
  username: "",
  first_name: "",
  last_name: "",
  active: "",
  email: "",
  password: "",
  avatar: null,
});

const formGroup = ref({
  name: "",
  description: "",
  level: "",
  backend: "0",
});

const errors = ref({});

const clearError = (field) => {
  errors.value[field] = false;
};

const tabItems = ref([
  {
    title: "User Management",
    key: "user-management",
  },
  {
    title: "Group Management",
    key: "group-management",
  },
]);

onMounted(() => {
  fetchData();
  fetchGroups();
  activeTab.value = route.query.tab || "user-management";
});

const debouncedSearch = debounce(() => {
  currentPage.value = 1;
  fetchData();
}, 500);

const debounceSearchGroups = debounce(() => {
  currentPage.value = 1;
  fetchGroups();
}, 500);

watch([searchQueryUser], () => {
  debouncedSearch();
});

watch([searchQueryGroups], () => {
  debounceSearchGroups();
});

watch(activeTab, (newTab) => {
  router.replace({ query: { ...route.query, tab: newTab } });
});

const fetchData = async () => {
  isLoading.value = true;
  try {
    const response = await store.getData({
      url: `api/core/users?page=${currentPage.value}&search=${searchQueryUser.value}`,
    });

    if (response.data.status === true) {
      data.value = response.data.data;
      pagination_users.value = data.value.pagination_users;
      users.value = data.value.users;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  } finally {
    isLoading.value = false;
  }
};

const fetchGroups = async () => {
  try {
    const response = await store.getData({
      url: `api/core/users/groups?page=${currentPage.value}&search=${searchQueryGroups.value}`,
    });

    if (response.data.status === true) {
      data.value = response.data.data;
      pagination_groups.value = data.value.pagination_groups;
      groups.value = data.value.groups;
    }
  } catch (error) {
    console.error("Error fetching groups:", error);
  }
};

const openEdit = (item, type = "user") => {
  resetFormUser();
  resetFormGroup();
  isEdit.value = true;

  if (type === "user") {
    if (item.avatar) {
      avatarPreview.value = `${store.baseUrl}storage/${item.avatar}`;
    } else {
      avatarPreview.value = defaultAvatar;
    }
    form.value = {
      id: item.id,
      group_id: item.group_id,
      username: item.username,
      first_name: item.first_name,
      last_name: item.last_name,
      active: item.active,
      email: item.email,
      password: "",
      password_confirmation: "",
      avatar: item.avatar,
    };
    openModal("user");
  } else {
    formGroup.value = {
      group_id: item.group_id,
      name: item.name,
      description: item.description,
      backend: item.backend,
      level: item.level,
    };
    openModal("group");
  }
};

const openCreate = () => {
  resetFormUser();
  isEdit.value = false;
  openModal("user");
};

const openCreateGroup = () => {
  resetFormGroup();
  isEdit.value = false;
  openModal("group");
};

const openModal = (target = "user") => {
  if (target === "user") {
    SxModal.value?.show();
    SxModalGroup.value?.hide();
  } else if (target === "group") {
    SxModalGroup.value?.show();
    SxModal.value?.hide();
  }
};

const closeModal = (target = "all") => {
  if (target === "user") {
    SxModal.value?.hide();
  } else if (target === "group") {
    SxModalGroup.value?.hide();
  } else {
    SxModal.value?.hide();
    SxModalGroup.value?.hide();
  }
};

const toggleAll = (e) => {
  if (users.value.length === 0) {
    selectedUsers.value = [];
    return;
  }

  if (e.target.checked) {
    selectedUsers.value = users.value.map((u) => u.id);
  } else {
    selectedUsers.value = [];
  }
};

const toggleAllGroups = (e) => {
  if (groups.value.length === 0) {
    selectedGroups.value = [];
    return;
  }

  if (e.target.checked) {
    selectedGroups.value = groups.value.map((u) => u.group_id);
  } else {
    selectedGroups.value = [];
  }
};

const clearSearch = (target = "user") => {
  if (target === "user") {
    searchQueryUser.value = "";
  } else {
    searchQueryGroups.value = "";
  }
  currentPage.value = 1;
};

const submitForm = async (event) => {
  event.preventDefault();

  errors.value = {};

  if (!isEdit.value) {
    if (
      !form.value.group_id ||
      !form.value.username ||
      !form.value.first_name ||
      !form.value.email ||
      !form.value.password ||
      !form.value.password_confirmation
    ) {
      errors.value = {
        group_id: !form.value.group_id,
        username: !form.value.username,
        first_name: !form.value.first_name,
        email: !form.value.email,
        password: !form.value.password,
        password_confirmation: !form.value.password_confirmation,
      };

      proxy.$swal.fire({
        icon: "error",
        title: "Register Failed",
        text: "All fields must be filled",
        toast: true,
        position: "top-end",
        timer: 3000,
        showConfirmButton: false,
        timerProgressBar: true,
      });
      return;
    }
  } else {
    if (
      !form.value.group_id ||
      !form.value.username ||
      !form.value.first_name ||
      !form.value.email
    ) {
      errors.value = {
        group_id: !form.value.group_id,
        username: !form.value.username,
        first_name: !form.value.first_name,
        email: !form.value.email,
      };

      proxy.$swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "All required fields must be filled",
        toast: true,
        position: "top-end",
        timer: 3000,
        showConfirmButton: false,
        timerProgressBar: true,
      });
      return;
    }
  }

  isSubmitting.value = true;

  try {
    const response = await store.postData({
      url: "api/core/users?task=save",
      params: {
        ...form.value,
      },
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.data.status == true) {
      proxy.$swal.fire({
        icon: "success",
        title: "Success",
        text: response.data.message,
        toast: true,
        position: "top-end",
        timer: 3000,
        showConfirmButton: false,
        timerProgressBar: true,
      });
      fetchData();
      closeModal("user");
    } else {
      proxy.$swal.fire({
        icon: "error",
        title: isEdit.value ? "Update User Failed" : "Create User Failed",
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
      title: "Error",
      text: "An error occurred while submitting the form. Please try again.",
      toast: true,
      position: "top-end",
      timer: 3000,
      showConfirmButton: false,
      timerProgressBar: true,
    });
  } finally {
    isSubmitting.value = false;
  }
};

const deleteGroup = async () => {
  isSubmitting.value = true;

  try {
    for (let id of selectedGroups.value) {
      const response = await store.postData({
        url: `api/core/groups?task=delete&group_id=${id}`,
        params: { id },
        headers: {
          "Content-Type": "application/json",
        },
        responseType: "json",
      });

      if (!response.status) {
        throw new Error(response.message || "Failed to delete user.");
      }
    }

    await fetchData();
    selectedGroups.value = [];

    proxy.$swal.fire({
      icon: "success",
      title: "Success",
      text: "Selected groups have been deleted.",
      toast: true,
      position: "top-end",
      timer: 3000,
      showConfirmButton: false,
      timerProgressBar: true,
    });
  } catch (error) {
    console.error(error);
    proxy.$swal.fire({
      icon: "error",
      title: "Error",
      text: error.message || "An error occurred while deleting groups.",
      toast: true,
      position: "top-end",
      timer: 3000,
      showConfirmButton: false,
      timerProgressBar: true,
    });
  } finally {
    isSubmitting.value = false;
  }
};

const deleteSelected = async () => {
  isSubmitting.value = true;

  try {
    for (let id of selectedUsers.value) {
      const response = await store.postData({
        url: `api/core/users?task=delete&id=${id}`,
        params: { id },
        headers: {
          "Content-Type": "application/json",
        },
        responseType: "json",
      });

      if (!response.status) {
        throw new Error(response.message || "Failed to delete user.");
      }
    }

    await fetchData();
    selectedUsers.value = [];

    proxy.$swal.fire({
      icon: "success",
      title: "Success",
      text: "Selected users have been deleted.",
      toast: true,
      position: "top-end",
      timer: 3000,
      showConfirmButton: false,
      timerProgressBar: true,
    });
  } catch (error) {
    console.error(error);
    proxy.$swal.fire({
      icon: "error",
      title: "Error",
      text: error.message || "An error occurred while deleting users.",
      toast: true,
      position: "top-end",
      timer: 3000,
      showConfirmButton: false,
      timerProgressBar: true,
    });
  } finally {
    isSubmitting.value = false;
  }
};

const confirmDelete = () => {
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
        deleteSelected();
      }
    });
};

const confirmDeleteGroup = () => {
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
        deleteGroup();
      }
    });
};

const submitFormGroup = async (event) => {
  event.preventDefault();

  if (!formGroup.value.name || !formGroup.value.level) {
    errors.value = {
      name: !formGroup.value.name,
      level: !formGroup.value.level,
    };

    proxy.$swal.fire({
      icon: "error",
      title: "Update Failed",
      text: "All required fields must be filled",
      toast: true,
      position: "top-end",
      timer: 3000,
      showConfirmButton: false,
      timerProgressBar: true,
    });
    return;
  }

  isSubmitting.value = true;

  try {
    const response = await store.postData({
      url: "api/core/groups?task=save",
      params: {
        ...formGroup.value,
      },
      headers: {
        "Content-Type": "application/json",
      },
      responseType: "json",
    });

    if (response.data.status == true) {
      proxy.$swal.fire({
        icon: "success",
        title: "Success",
        text: response.data.message,
        toast: true,
        position: "top-end",
        timer: 3000,
        showConfirmButton: false,
        timerProgressBar: true,
      });
      fetchData();
      closeModal("group");
    } else {
      proxy.$swal.fire({
        icon: "error",
        title: "Create Group Failed",
        text: response.data.message || "An error occurred while creating the group.",
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
      title: "Error",
      text: "An error occurred while submitting the form. Please try again.",
      toast: true,
      position: "top-end",
      timer: 3000,
      showConfirmButton: false,
      timerProgressBar: true,
    });
  } finally {
    isSubmitting.value = false;
  }
};

const handleUpload = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    form.value.avatar = e.target.result;
    avatarPreview.value = e.target.result;
  };
  reader.readAsDataURL(file);
};

const resetFormUser = () => {
  form.value = {
    group_id: "",
    username: "",
    first_name: "",
    last_name: "",
    active: 0,
    email: "",
    password: "",
    password_confirmation: "",
    avatar: null,
  };
  errors.value = {};
  avatarPreview.value = defaultAvatar;
};

const resetFormGroup = () => {
  formGroup.value = {
    group_id: "",
    name: "",
    description: "",
    backend: "",
    level: "",
  };
};

const getRowNumber = (index, type = "user") => {
  const perPage =
    type === "user"
      ? pagination_users.value?.per_page
      : pagination_groups.value?.per_page;

  return index + 1 + (currentPage.value - 1) * perPage;
};
</script>

<template>
  <div class="wrapper">
    <div class="header-nav">
      <h3><i class="bi bi-layout-sidebar"></i> Users & Group Management</h3>
    </div>
    <div class="page">
      <BTabs content-class="tabs-card" v-model="activeTab">
        <BTab
          v-for="(tab, index) in tabItems"
          :key="index"
          :title="tab.title"
          :value="tab.key"
        >
          <BCard>
            <template v-if="tab.key === 'user-management'">
              <div class="">
                <div class="toolbar-nav rounded-3 py-2 px-2 mb-3">
                  <div class="d-flex justify-content-between align-items-center">
                    <!-- Kiri: Aksi -->
                    <div class="d-flex gap-2">
                      <button
                        class="btn btn-sm btn-outline-dark rounded-3"
                        @click="openCreate"
                      >
                        <i class="bi bi-plus"></i> New
                      </button>

                      <button
                        class="btn btn-sm btn-outline-danger rounded-3"
                        :disabled="selectedUsers.length === 0 || isSubmitting"
                        @click="confirmDelete"
                      >
                        <i class="bi bi-trash3"></i>
                        <span
                          v-if="isSubmitting"
                          class="spinner-border spinner-border-sm me-2"
                        ></span>
                        {{ isSubmitting ? "Deleting..." : "Delete" }}
                      </button>
                      <div class="dropdown">
                        <button
                          class="btn btn-sm btn-outline-secondary dropdown-toggle rounded-3"
                          type="button"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          Bulk Action
                        </button>
                        <ul class="dropdown-menu">
                          <li><a class="dropdown-item" href="#">Export CSV</a></li>
                          <li><a class="dropdown-item" href="#">Import CSV</a></li>
                          <li><a class="dropdown-item" href="#">Copy Selected</a></li>
                          <li>
                            <a class="dropdown-item" @click="clearSearch('user')"
                              >Clear Search</a
                            >
                          </li>
                          <li class="dropdown-divider"></li>
                          <li><a class="dropdown-item" href="#">Remove Selected</a></li>
                        </ul>
                      </div>
                    </div>

                    <!-- Kanan: Clear & Search -->

                    <div class="d-flex gap-2">
                      <!-- <a href="" class="btn btn-sm btn-outline-primary rounded-3"
                      ><i class="bi bi-funnel"></i> Clear</a
                    > -->
                      <input
                        type="text"
                        class="form-control form-control-sm rounded-3"
                        placeholder="Search..."
                        aria-label="Search"
                        style="height: 2px"
                        v-model="searchQueryUser"
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
                        <th class="text-center">
                          <input
                            type="checkbox"
                            class="form-check-input"
                            style="transform: scale(1.1)"
                            @change="toggleAll($event)"
                            :checked="allSelected"
                            :disabled="users.length === 0"
                          />
                        </th>
                        <th class="text-center">No</th>
                        <th class="text-center">Action</th>
                        <th>Avatar</th>
                        <th>Group</th>
                        <th>Username</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                        <th>Active</th>
                      </tr>
                    </thead>
                    <tbody v-if="isLoading">
                      <tr v-for="n in 10" :key="'skeleton-row-' + n">
                        <td v-for="m in 10" :key="'skeleton-cell-' + m">
                          <BPlaceholder width="100%" animation="wave" />
                        </td>
                      </tr>
                    </tbody>
                    <tbody v-else-if="users.length > 0">
                      <tr
                        v-for="(user, index) in users"
                        :key="user.id"
                        class="align-middle"
                      >
                        <td class="text-center">
                          <input
                            type="checkbox"
                            class="form-check-input"
                            style="transform: scale(1.1)"
                            :value="user.id"
                            v-model="selectedUsers"
                          />
                        </td>

                        <td class="text-center">{{ getRowNumber(index, "user") }}</td>

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
                                <a
                                  class="dropdown-item"
                                  @click.prevent="openEdit(user, 'user')"
                                  ><i class="bi bi-pencil-square"></i> Edit</a
                                >
                              </li>
                            </ul>
                          </div>
                        </td>
                        <td>
                          <img
                            :src="
                              user.avatar
                                ? `${store.baseUrl}storage/${user.avatar}`
                                : defaultAvatar
                            "
                            alt="Default Preview"
                            class="rounded-circle"
                            style="
                              width: 35px;
                              height: 35px;
                              object-fit: cover;
                              border: 2px solid #dee2e6;
                            "
                          />
                        </td>
                        <td>
                          {{ user.group_name }}
                        </td>
                        <td>{{ user.username }}</td>
                        <td>{{ user.first_name }}</td>
                        <td>{{ user.last_name }}</td>
                        <td>{{ user.email }}</td>
                        <td>
                          <span
                            :class="{
                              'badge text-bg-success': user.active == 1,
                              'badge text-bg-warning': user.active == 0,
                              'badge text-bg-danger': user.active == 2,
                            }"
                          >
                            {{
                              user.active == 0
                                ? "Inactive"
                                : user.active == 1
                                ? "Active"
                                : "Banned"
                            }}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                    <tbody v-else>
                      <tr>
                        <td colspan="10">
                          <div
                            class="d-flex flex-column justify-content-center align-items-center"
                            style="padding: 10px 0"
                          >
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
                  v-if="pagination_users"
                  :modelValue="currentPage"
                  :totalPages="pagination_users?.last_page || 1"
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
              </div>
            </template>

            <template v-if="tab.key === 'group-management'">
              <div class="">
                <div class="toolbar-nav rounded-3 py-2 px-2 mb-3">
                  <div class="d-flex justify-content-between align-items-center">
                    <!-- Kiri: Aksi -->
                    <div class="d-flex gap-2">
                      <button
                        class="btn btn-sm btn-outline-dark rounded-3"
                        @click="openCreateGroup"
                      >
                        <i class="bi bi-plus"></i> New
                      </button>

                      <button
                        class="btn btn-sm btn-outline-danger rounded-3"
                        :disabled="selectedGroups.length === 0 || isSubmitting"
                        @click="confirmDeleteGroup"
                      >
                        <i class="bi bi-trash3"></i>
                        <span
                          v-if="isSubmitting"
                          class="spinner-border spinner-border-sm me-2"
                        ></span>
                        {{ isSubmitting ? "Deleting..." : "Delete" }}
                      </button>
                      <div class="dropdown">
                        <button
                          class="btn btn-sm btn-outline-secondary dropdown-toggle rounded-3"
                          type="button"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          Bulk Action
                        </button>
                        <ul class="dropdown-menu">
                          <li><a class="dropdown-item" href="#">Export CSV</a></li>
                          <li><a class="dropdown-item" href="#">Import CSV</a></li>
                          <li><a class="dropdown-item" href="#">Copy Selected</a></li>
                          <li>
                            <a class="dropdown-item" @click="clearSearch('group')"
                              >Clear Search</a
                            >
                          </li>
                          <li class="dropdown-divider"></li>
                          <li><a class="dropdown-item" href="#">Remove Selected</a></li>
                        </ul>
                      </div>
                    </div>

                    <!-- Kanan: Clear & Search -->
                    <div class="d-flex gap-2">
                      <!-- <a href="" class="btn btn-sm btn-outline-primary rounded-3"
                      ><i class="bi bi-funnel"></i> Clear</a
                    > -->
                      <input
                        type="text"
                        class="form-control form-control-sm rounded-3"
                        placeholder="Search..."
                        v-model="searchQueryGroups"
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
                        <th class="text-center">
                          <input
                            type="checkbox"
                            class="form-check-input"
                            style="transform: scale(1.1)"
                            @change="toggleAllGroups($event)"
                            :checked="allSelectedGroups"
                            :disabled="groups.length === 0"
                          />
                        </th>
                        <th class="text-center">No</th>

                        <th class="text-center">Action</th>
                        <th>ID</th>
                        <th>Group Name</th>
                        <th>Description</th>
                        <th>Level</th>
                      </tr>
                    </thead>
                    <tbody v-if="isLoading">
                      <tr v-for="n in 10" :key="'skeleton-row-' + n">
                        <td v-for="m in 10" :key="'skeleton-cell-' + m">
                          <BPlaceholder width="100%" animation="wave" />
                        </td>
                      </tr>
                    </tbody>
                    <tbody v-else-if="groups.length > 0">
                      <tr
                        v-for="(group, index) in groups"
                        :key="index"
                        class="align-middle"
                      >
                        <td class="text-center">
                          <input
                            type="checkbox"
                            class="form-check-input"
                            style="transform: scale(1.1)"
                            :value="group.group_id"
                            v-model="selectedGroups"
                          />
                        </td>
                        <td class="text-center">{{ getRowNumber(index, "group") }}</td>
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
                                <a
                                  class="dropdown-item"
                                  @click.prevent="openEdit(group, 'group')"
                                  ><i class="bi bi-pencil-square"></i> Edit</a
                                >
                              </li>
                            </ul>
                          </div>
                        </td>
                        <td>{{ group.group_id }}</td>
                        <td>{{ group.name }}</td>
                        <td>{{ group.description ? group.description : "-" }}</td>
                        <td>{{ group.level }}</td>
                      </tr>
                    </tbody>
                    <tbody v-else>
                      <tr>
                        <td colspan="7">
                          <div
                            class="d-flex flex-column justify-content-center align-items-center"
                            style="padding: 10px 0"
                          >
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
                  v-if="pagination_groups"
                  :modelValue="currentPage"
                  :totalPages="pagination_groups?.last_page || 1"
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
              </div>
            </template>
          </BCard>
        </BTab>
      </BTabs>
    </div>

    <!-- Modal untuk User -->
    <SximoModal
      ref="SxModal"
      modalId="SxModal"
      :title="isEdit ? 'Edit User' : 'New User'"
      size="lg"
    >
      <template #body>
        <div class="row mb-3">
          <div class="col-12 d-flex flex-column align-items-center text-center">
            <label for="avatar" class="form-label">Avatar</label>

            <img
              :src="avatarPreview"
              alt="Avatar Preview"
              class="rounded-circle mb-3"
              style="
                width: 120px;
                height: 120px;
                object-fit: cover;
                border: 2px solid #dee2e6;
              "
            />

            <label for="avatar-upload" class="btn btn-sm rounded-3 btn-outline-dark mt-2">
              <i class="fas fa-plus"></i> Choose
            </label>

            <input
              id="avatar-upload"
              type="file"
              class="d-none rounded-3"
              @change="handleUpload"
              accept="image/*"
            />
          </div>
        </div>
        <div class="row mb-3">
          <div class="col-6">
            <label for="group_id" class="form-label">Group ID</label>
            <select
              v-model="form.group_id"
              id="group_id"
              class="form-select form-select-sm rounded-3"
              aria-label="Group ID"
              :class="{ 'is-invalid': errors?.group_id }"
              @change="clearError('group_id')"
            >
              <option value="" v-if="!isEdit">Select Group</option>
              <option
                v-for="group in groups"
                :key="group.group_id"
                :value="group.group_id"
              >
                {{ group.name }}
              </option>
            </select>
          </div>
          <div class="col-6">
            <label for="username" class="form-label">Username</label>
            <input
              v-model="form.username"
              type="text"
              id="username"
              class="form-control form-control-sm rounded-3"
              placeholder="Username"
              :class="{ 'is-invalid': errors?.username }"
              @input="clearError('username')"
            />
          </div>
        </div>
        <div class="row mb-3">
          <div class="col-6">
            <label for="first_name" class="form-label">First Name</label>
            <input
              v-model="form.first_name"
              type="text"
              id="first_name"
              class="form-control form-control-sm rounded-3"
              placeholder="First Name"
              :class="{ 'is-invalid': errors?.first_name }"
              @input="clearError('first_name')"
            />
          </div>
          <div class="col-6">
            <label for="last_name" class="form-label">Last Name</label>
            <input
              v-model="form.last_name"
              type="text"
              id="last_name"
              class="form-control form-control-sm rounded-3"
              placeholder="Last Name"
            />
          </div>
        </div>
        <div class="row mb-3">
          <div class="col-6">
            <label for="email" class="form-label">Email</label>
            <input
              v-model="form.email"
              type="email"
              id="email"
              class="form-control form-control-sm rounded-3"
              placeholder="Email"
              :class="{ 'is-invalid': errors?.email }"
              @input="clearError('email')"
            />
          </div>
          <div class="col-6">
            <label class="form-label d-block">Status</label>

            <div class="form-check form-check-inline">
              <input
                class="form-check-input"
                type="radio"
                id="status-active"
                value="1"
                v-model="form.active"
              />
              <label class="form-check-label" for="status-active">Active</label>
            </div>

            <div class="form-check form-check-inline">
              <input
                class="form-check-input"
                type="radio"
                id="status-inactive"
                value="0"
                v-model="form.active"
              />
              <label class="form-check-label" for="status-inactive">Inactive</label>
            </div>

            <div class="form-check form-check-inline">
              <input
                class="form-check-input"
                type="radio"
                id="status-banned"
                value="2"
                v-model="form.active"
              />
              <label class="form-check-label" for="status-banned">Banned</label>
            </div>
          </div>
        </div>
        <div class="row mb-4">
          <div class="col-6">
            <label for="password" class="form-label">New Password</label>
            <input
              v-model="form.password"
              type="password"
              id="password"
              class="form-control form-control-sm rounded-3"
              placeholder="New Password"
              :class="{ 'is-invalid': errors?.password }"
              @input="clearError('password')"
            />
          </div>
          <div class="col-6">
            <label for="password_confirmation" class="form-label"
              >Password Confirmation</label
            >
            <input
              v-model="form.password_confirmation"
              type="password"
              id="password_confirmation"
              class="form-control form-control-sm rounded-3"
              placeholder="Password Confirmation"
              :class="{ 'is-invalid': errors.password_confirmation }"
              @input="clearError('password_confirmation')"
            />
          </div>
        </div>
      </template>

      <template #footer>
        <button class="btn btn-sm rounded-3 btn-dark" @click="closeModal('user')">
          Cancel
        </button>

        <button class="btn btn-sm rounded-3 btn-outline-dark" @click="submitForm">
          Save
        </button>
      </template>
    </SximoModal>

    <!-- Modal untuk Group -->
    <SximoModal
      ref="SxModalGroup"
      modalId="SxModalGroup"
      :title="isEdit ? 'Edit Group' : 'New Group'"
    >
      <template #body>
        <div class="row mb-3">
          <div class="col-6">
            <label for="name" class="form-label">Group Name</label>
            <input
              v-model="formGroup.name"
              type="text"
              id="name"
              class="form-control form-control-sm rounded-3"
              placeholder="Group Name"
              :class="{ 'is-invalid': errors.name }"
              @input="clearError('name')"
            />
          </div>
          <div class="col-6">
            <label for="level" class="form-label">Level</label>
            <input
              v-model="formGroup.level"
              type="text"
              id="level"
              class="form-control form-control-sm rounded-3"
              placeholder="Level"
              :class="{ 'is-invalid': errors.level }"
              @input="clearError('level')"
            />
          </div>
        </div>
        <div class="row mb-3">
          <div class="col-12">
            <label for="description" class="form-label">Description</label>
            <textarea
              class="form-control form-control-sm rounded-3"
              v-model="formGroup.description"
              placeholder="Description"
              rows="3"
              id="textarea"
            ></textarea>
          </div>
        </div>
      </template>

      <template #footer>
        <button class="btn btn-sm rounded-3 btn-dark" @click="closeModal('group')">
          Cancel
        </button>

        <button class="btn btn-sm rounded-3 btn-outline-dark" @click="submitFormGroup">
          Save
        </button>
      </template>
    </SximoModal>
  </div>
</template>

<style scoped></style>
