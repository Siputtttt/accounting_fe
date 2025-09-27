<script setup>
import { onMounted, ref, getCurrentInstance } from "vue";
import profileImage from "@/assets/img/profile.jpg";
import { useStore } from "@/store";

const errors = ref({});
const { proxy } = getCurrentInstance();
const store = useStore();
const isSubmitting = ref(false);
const profile = ref(
  JSON.parse(localStorage.getItem("profile")) || sessionStorage.getItem("profile")
);
const defaultAvatar = profileImage;
const avatarPreview = ref(defaultAvatar);
const data = ref({});
const imageSizeOption = ref("4x4");

const getImageSize = () => {
  switch (imageSizeOption.value) {
    case "2x2":
      return { width: "75px", height: "75px" };
    case "3x3":
      return { width: "113px", height: "113px" };
    case "4x4":
      return { width: "150px", height: "150px" };
    case "5x5":
      return { width: "188px", height: "188px" };
    case "6x6":
      return { width: "225px", height: "225px" };
    case "7x7":
      return { width: "263px", height: "263px" };
    default:
      return { width: "113px", height: "113px" };
  }
};

const formPersonalInfo = ref({
  id: "",
  email: "",
  username: "",
  first_name: "",
  last_name: "",
  avatar: null,
});

const formChangePassword = ref({
  current_password: "",
  new_password: "",
  new_password_confirmation: "",
});

const clearError = (field) => {
  errors.value[field] = false;
};

onMounted(() => {
  fetchData();
});

const fetchData = async () => {
  try {
    const response = await store.getData({
      url: `api/core/profile`,
    });
    if (response.data.status === 1) {
      data.value = response.data.data;

      if (data.value.avatar) {
        avatarPreview.value = `${store.baseUrl}storage/${data.value.avatar}`;
      } else {
        avatarPreview.value = defaultAvatar;
      }

      formPersonalInfo.value = {
        id: data.value.id,
        email: data.value.email,
        username: data.value.username,
        first_name: data.value.first_name,
        last_name: data.value.last_name,
        avatar: data.value.avatar,
      };
    } else {
      avatarPreview.value = defaultAvatar;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    avatarPreview.value = defaultAvatar;
  }
};

const personalInfoFields = [
  // {
  //   label: "User ID",
  //   model: "id",
  //   type: "text",
  //   placeholder: "Enter User ID",
  // },
  {
    label: "Username",
    model: "username",
    type: "text",
    placeholder: "Enter Username",
  },
  {
    label: "First Name",
    model: "first_name",
    type: "text",
    placeholder: "Enter First Name",
  },
  {
    label: "Last Name",
    model: "last_name",
    type: "text",
    placeholder: "Enter Last Name",
  },
  {
    label: "Email Address",
    model: "email",
    type: "email",
    placeholder: "Enter Email",
  },
];

const changePasswordFields = [
  {
    label: "Current Password",
    model: "current_password",
    type: "password",
    placeholder: "Enter Current Password",
  },
  {
    label: "New Password",
    model: "new_password",
    type: "password",
    placeholder: "Enter New Password",
  },
  {
    label: "Confirm Password",
    model: "new_password_confirmation",
    type: "password",
    placeholder: "Enter Confirm Password",
  },
];

const tabItems = ref([
  {
    title: "Personal Info",
    key: "personal-info",
  },
  {
    title: "Change Password",
    key: "change-password",
  },
]);

const save = async () => {
  errors.value = {};

  if (
    !formPersonalInfo.value.username ||
    !formPersonalInfo.value.first_name ||
    !formPersonalInfo.value.last_name ||
    !formPersonalInfo.value.email
  ) {
    errors.value = {
      username: !formPersonalInfo.value.username,
      first_name: !formPersonalInfo.value.first_name,
      last_name: !formPersonalInfo.value.last_name,
      email: !formPersonalInfo.value.email,
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

  isSubmitting.value = true;
  try {
    const response = await store.postData({
      url: "api/core/profile?task=savePersonalInfo",
      params: { ...formPersonalInfo.value },
      headers: { "Content-Type": "application/json" },
    });

    if (response.data.status === true) {

      localStorage.setItem("profile", JSON.stringify(response.data.data));
      await proxy.$swal.fire({
        icon: "success",
        title: "Success",
        text: "Profile updated successfully",
        toast: true,
        position: "top-end",
        timer: 3000,
        showConfirmButton: false,
        timerProgressBar: true,
      });
    } else {
      proxy.$swal({
        icon: "error",
        title: "Error",
        text: response.data.message || "An unexpected error occurred.",
        toast: true,
        position: "top-end",
        timer: 3000,
        showConfirmButton: false,
        timerProgressBar: true,
      });
    }
  } catch (error) {
    if (error.response && error.response.status === 422) {
      proxy.$swal({
        icon: "error",
        title: "Validation Error",
        text: error.response.data.message || "Please check your input.",
        toast: true,
        position: "top-end",
        timer: 3000,
        showConfirmButton: false,
        timerProgressBar: true,
      });
    } else {
      proxy.$swal({
        icon: "error",
        title: "Error",
        text: error.response.data.message || "An unexpected error occurred.",
        toast: true,
        position: "top-end",
        timer: 3000,
        showConfirmButton: false,
        timerProgressBar: true,
      });
      console.error("Error saving settings:", error);
    }
  } finally {
    isSubmitting.value = false;
  }
};

const handleUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target.result;
      avatarPreview.value = base64;
      formPersonalInfo.value.avatar = base64;
    };
    reader.readAsDataURL(file);
  }
};

const changePassword = async () => {
  errors.value = {};
  if (
    !formChangePassword.value.current_password ||
    !formChangePassword.value.new_password ||
    !formChangePassword.value.new_password_confirmation
  ) {
    errors.value = {
      current_password: !formChangePassword.value.current_password,
      new_password: !formChangePassword.value.new_password,
      new_password_confirmation: !formChangePassword.value.new_password_confirmation,
    };

    proxy.$swal.fire({
      icon: "error",
      title: "Update Failed",
      text: "All fields must be filled",
      toast: true,
      position: "top-end",
      timer: 3000,
      showConfirmButton: false,
      timerProgressBar: true,
    });
    return;
  }

  if (
    formChangePassword.value.new_password !==
    formChangePassword.value.new_password_confirmation
  ) {
    proxy.$swal({
      icon: "error",
      title: "Error",
      text: "New password and confirm password do not match.",
      toast: true,
      position: "top-end",
      timer: 3000,
      showConfirmButton: false,
      timerProgressBar: true,
    });
    return;
  }

  try {
    const response = await store.postData({
      url: "api/core/profile?task=changePassword",
      params: { ...formChangePassword.value },
      headers: { "Content-Type": "application/json" },
    });

    if (response.data.status === true) {
      proxy.$swal({
        icon: "success",
        title: "Success",
        text: "Password updated successfully.",
        toast: true,
        position: "top-end",
        timer: 3000,
        showConfirmButton: false,
        timerProgressBar: true,
      });

      formChangePassword.value = {
        current_password: "",
        new_password: "",
        new_password_confirmation: "",
      };
    } else {
      proxy.$swal({
        icon: "error",
        title: "Error",
        text: response.data.message || "An unexpected error occurred.",
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
      title: "Error",
      text: error.response.data.message || "An unexpected error occurred.",
      toast: true,
      position: "top-end",
      timer: 3000,
      showConfirmButton: false,
      timerProgressBar: true,
    });
  }
};
</script>

<template>
  <div class="wrapper">
    <div class="header-nav">
      <h3><i class="bi bi-layout-sidebar"></i> Account Profile</h3>
    </div>
    <div class="page">
      <BTabs content-class="tabs-card">
        <BTab v-for="(tab, index) in tabItems" :key="index" :title="tab.title">
          <template v-if="tab.key === 'personal-info'">
            <div class="card shadow-sm rounded-3">
              <div class="row p-4 align-items-center">
                <div class="col-md-4 d-flex flex-column align-items-center">
                  <img
                    :src="avatarPreview"
                    alt="Avatar Preview"
                    class="rounded-circle mb-3"
                    :style="{
                      ...getImageSize(),
                      objectFit: 'cover',
                      border: '2px solid #ccc',
                    }"
                  />

                  <label
                    for="avatar-upload"
                    class="btn btn-sm btn-outline-dark mt-2 rounded-3"
                  >
                    <i class="fas fa-upload me-2"></i>Upload Image
                  </label>

                  <input
                    id="avatar-upload"
                    type="file"
                    class="d-none"
                    @change="handleUpload"
                    accept="image/*"
                  />
                </div>

                <div class="col-md-8">
                  <div class="row">
                    <div
                      v-for="field in personalInfoFields"
                      :key="field.model"
                      class="mb-3 col-md-6"
                    >
                      <label :for="field.model" class="form-label">{{
                        field.label
                      }}</label>
                      <input
                        :type="field.type"
                        class="form-control form-control-sm rounded-3"
                        :id="field.model"
                        v-model="formPersonalInfo[field.model]"
                        :placeholder="field.placeholder"
                        :class="{
                          'is-invalid': errors[field.model],
                        }"
                        @input="clearError(field.model)"
                      />
                    </div>
                  </div>
                  <button
                    class="btn btn-sm btn-outline-dark w-25 mt-3 float-end rounded-3"
                    @click="save(formPersonalInfo.id)"
                    :disabled="isSubmitting"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </template>

          <template v-else-if="tab.key === 'change-password'">
            <div class="card shadow-sm rounded-3">
              <div class="p-4">
                <div
                  v-for="field in changePasswordFields"
                  :key="field.model"
                  class="mb-3 col-md-6"
                >
                  <label :for="field.model" class="form-label">{{ field.label }}</label>
                  <input
                    :type="field.type"
                    class="form-control form-control-sm rounded-3"
                    :id="field.model"
                    :placeholder="field.placeholder"
                    v-model="formChangePassword[field.model]"
                    :class="{
                      'is-invalid': errors[field.model],
                    }"
                    @input="clearError(field.model)"
                  />
                </div>
                <div class="d-flex col-md-6">
                  <button
                    class="btn btn-sm btn-outline-dark w-25 mt-3 float-end rounded-3"
                    @click="changePassword(formChangePassword.id)"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </template>
        </BTab>
      </BTabs>
    </div>
  </div>
</template>

<style scoped></style>
