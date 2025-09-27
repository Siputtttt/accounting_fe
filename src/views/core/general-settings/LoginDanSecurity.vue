<script setup>
import { ref, onMounted, getCurrentInstance } from "vue";
import { useStore } from "@/store";
import { reactive } from "vue";
import { useMessageStore } from "@/store/messageStore";

const loading = ref(true);
const store = useStore();
const props = defineProps(["items"]);
const localItems = reactive({ ...props.items });
const groups = ref([]);
const { proxy } = getCurrentInstance();
const messageStore = useMessageStore();

const save = async () => {
  try {
    const response = await store.postData({
      url: "api/core/setting",
      params: localItems,
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (response.data.status === 1) {
      const appData = response.data.data;

      messageStore.reloadMenus();
      proxy.$messageSuccess(
        proxy,
        "Success",
        response.data.message || "Login & Security saved successfully."
      );
    } else {
      proxy.$messageError(
        proxy,
        "Failed",
        response.data.message || "Failed to save Login & Security."
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

const fetchData = async () => {
  loading.value = true;
  try {
    const usersResponse = await store.getData({
      url: "api/core/users",
      headers: {
        "Content-Type": "application/json",
      },
      responseType: "json",
    });
    groups.value = usersResponse.data.data.groups;

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
  <div class="card p-4">
    <div class="card-body">
      <div class="row">
        <div class="col-md-6">
          <div class="mb-3">
            <label class="form-label fw-bold">Email System</label>
            <div>
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="radio"
                  v-model="localItems.cnf_mail"
                  :value="'php'"
                  id="phpMail"
                  name="emailSystem"
                />
                <label class="form-check-label" for="phpMail">
                  PHP Mail System
                </label>
              </div>
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="radio"
                  v-model="localItems.cnf_mail"
                  :value="'swift'"
                  id="swiftMail"
                  name="emailSystem"
                />
                <label class="form-check-label" for="swiftMail">
                  SWIFT Mail (Required Configuration)
                </label>
              </div>
            </div>
          </div>

          <div class="mb-3">
            <label class="form-label fw-bold">Default Group Registration</label>
            <BFormSelect size="sm" v-model="localItems.cnf_group">
              <option disabled value="">Select group</option>
              <option
                v-for="group in groups"
                :key="group.group_id"
                :value="group.group_id"
              >
                {{ group.name }}
              </option>
            </BFormSelect>
          </div>

          <div class="mb-3">
            <label class="form-label fw-bold">Registration</label>
            <div>
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="radio"
                  id="auto"
                  name="registration"
                  v-model="localItems.cnf_activation"
                  :value="'auto'"
                />
                <label class="form-check-label" for="auto">
                  Automatic activation
                </label>
              </div>
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="radio"
                  id="manual"
                  name="registration"
                  v-model="localItems.cnf_activation"
                  :value="'manual'"
                />
                <label class="form-check-label" for="manual">
                  Manual activation
                </label>
              </div>
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="radio"
                  id="activation"
                  name="registration"
                  v-model="localItems.cnf_activation"
                  :value="'activation'"
                />
                <label class="form-check-label" for="activation">
                  Email with activation link
                </label>
              </div>
            </div>
          </div>

          <div class="mb-3">
            <label class="form-label fw-bold">Google reCaptcha</label>
            <BFormInput type="text" size="sm" placeholder="valid_site_key" />
          </div>

          <div class="mb-3">
            <label class="form-label fw-bold">Secret key</label>
            <BFormInput
              type="text"
              v-model="localItems.cnf_recaptchaprivatekey"
              size="sm"
              placeholder="valid_secret_key"
            />
          </div>

          <div class="mb-3">
            <label class="form-label fw-bold">Google Maps API Key</label>
            <BFormInput
              type="text"
              v-model="localItems.cnf_maps"
              size="sm"
              placeholder="valid_map_secret_key"
            />
          </div>
        </div>

        <div class="col-md-6">
          <div class="mb-3">
            <label class="form-label fw-bold">UI</label>
            <div class="form-check">
              <input
                class="form-check-input"
                type="checkbox"
                id="allowReg"
                v-model="localItems.cnf_regist"
                true-value="true"
                false-value="false"
              />
              <label class="form-check-label" for="allowReg">
                Allow Registration
              </label>
            </div>
            <div class="form-check">
              <input
                class="form-check-input"
                type="checkbox"
                id="allowFrontend"
                v-model="localItems.cnf_front"
                true-value="true"
                false-value="false"
              />
              <label class="form-check-label" for="allowFrontend">
                Allow Frontend
              </label>
            </div>
            <div class="form-check">
              <input
                class="form-check-input"
                type="checkbox"
                id="useRecaptcha"
                v-model="localItems.cnf_recaptcha"
                true-value="true"
                false-value="false"
              />
              <label class="form-check-label" for="useRecaptcha">
                Google reCaptcha
              </label>
            </div>
          </div>

          <div class="mb-3">
            <label class="form-label fw-bold">Restricted IP Address</label>
            <small class="text-muted d-block mb-1"
              >Example:
              <span class="text-danger"
                >192.116.134, 194.111.606.21</span
              ></small
            >
            <BFormTextarea
              size="sm"
              rows="6"
              v-model="localItems.cnf_restrictip"
            ></BFormTextarea>
          </div>

          <div class="mb-3">
            <label class="form-label fw-bold">Allowed IP Address</label>
            <small class="text-muted d-block mb-1"
              >Example:
              <span class="text-danger"
                >192.116.134, 194.111.606.21</span
              ></small
            >
            <BFormTextarea
              size="sm"
              rows="6"
              v-model="localItems.cnf_allowip"
            ></BFormTextarea>
            <div class="form-text">
              If Allowed IP is not empty then it will be priority and ignored
              RESTRICTED IP
            </div>
          </div>
        </div>
      </div>

      <div class="text-end mt-3">
        <button class="btn btn-outline-success btn-sm" @click="save">
          Save Changes
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card-title {
  font-size: 1.25rem;
}
</style>
