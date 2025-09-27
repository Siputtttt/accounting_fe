<script setup>
import { ref, onMounted , getCurrentInstance, reactive } from "vue";
const { proxy } = getCurrentInstance();
import { useStore } from "@/store"; 
const props = defineProps(["items"]);
const localItems = reactive({ ...props.items });   
const store = useStore(); 

const saveData = async () => { 
    let posts = {
      regEmail : localItems.regEmail ,
      resetEmail : localItems.resetEmail ,
      action_task : 'emails'

    }
    try {
        const response = await store.postData({
          url: "api/core/setting",
          params: posts,
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (response.data.status) { 
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
        proxy.$messageError(
            proxy,
            "Failed",
            error.message || "Error saving settings"
          ); 
        console.error("Error saving settings:", error);
    }

};
 

onMounted(() => {});
</script>

<template>
  <div class="card p-4 ">
    <div class="card-body">
      <div class="row">
        <div class="col-md-6 mb-4">
          <label class="form-label fw-bold">Register New</label>
          <div class="editor-quill">
            <textarea
              class="form-control form-control-sm"
              rows="20"
              v-model="localItems.regEmail"
            ></textarea> 
          </div>
          <button
            @click="saveData"
            class="btn btn-outline-success btn-sm mt-3"
          >
            Save Changes
          </button>
        </div>

        <div class="col-md-6 mb-4">
          <label class="form-label fw-bold">Forget Password</label>
          <div class="editor-quill">

            <textarea
              class="form-control form-control-sm"
              rows="20"
              v-model="localItems.resetEmail"
            ></textarea> 
          </div>
          <button
            @click="saveData"
            class="btn btn-outline-success btn-sm mt-3"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.editor-quill {
  width: 100%;
  min-height: 200px;
  background-color: white;
  overflow: hidden;
}
</style>
