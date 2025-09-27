<script setup>
import { getCurrentInstance, ref , onMounted , reactive  } from "vue";
import { useStore } from "@/store";
import { useRouter } from "vue-router";
import ModuleConfig from "./ModuleConfig.vue";

const { proxy } = getCurrentInstance();
const router = useRouter(); 
const store = useStore();


 
const modal = ref(false)
const preview = ref(false)
const form_modal = ref(false)
const form_backup = ref(false)
const form_install = ref(false)
const config = ref([])
const tableDb = ref([])
const form = ref({
  module_title : '',
  module_note : '',
  module_type : '',
  module_name : '',
  module_db : '' ,
  task : 'save_create'
})

const option_type = ref([
  
    { text: 'Complete CRUD',  value: 'crud'  },
    { text: 'Blank Module',  value: 'blank'  },
    { text: 'Report Module ( Charts )',  value: 'report'  } 

]);
const fields = ref([
    { label: 'ID',  key: 'module_id'},
    { label: 'Module Name',  key: 'module_title',  sortable: true  },
    { label: 'Type',  key: 'module_type',  sortable: true },
    { label: 'Controller',  key: 'module_name',  sortable: true },
    { label: 'Database',  key: 'module_db',  sortable: true },
    { label: 'Author',  key: 'module_author',  sortable: true },    
    { label: 'Created',  key: 'module_created',  sortable: true } 

]);
const items = ref([])
const options = ref([])
const selected = ref([])

const fetchData = async (event) => { 
  const response = await store.getData({
      url     :  'api/core/modules'  
  })  

  if (response.data.status === 1) {
     items.value =  response.data.rows 
     tableDb.value = response.data.table
    console.log(items)
  }
}
function viewDetail(params) {
  config.value = params
  preview.value = true
    modal.value = true
   
   // alert(params)
}
function backup() {
    form_backup.value = true
}
function new_module() {
    form_modal.value = true
   // alert(params)
}
function install() {
    form_install.value = true
}
onMounted(() => { 
  fetchData()
})

const onSubmit  = async (event) => {
  event.preventDefault();
   
    const response = await store.postData({
      url: "api/core/modules",
      params: form.value,
      headers: {
        "Content-Type": "application/json",
      },
      responseType: "json",
    });
    if (response.data.status === 1) { 
        proxy.$swal.fire({
            icon: "success",
            title: "Success",
            text: response.data.message,
            toast: true,
            position: "top-end",
            timer: 3000
        });
        fetchData()
    }

}
const reloadData = async (event) => {
    fetchData()
    modal.value = false
}
const onBackup  = async (event) => {
    const result = await proxy.$swal.fire({
            title: "Backup Module ?",
            text: "Make zip for selected module ",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Continue!",
        });

        if (result.isConfirmed) {

        }
   
}
const onReset  = async (event) => {

}
</script>
<template>
    <div class="wrapper">
     <div class="header-nav ">
       <h3> <i class="bi bi-layout-sidebar"></i> Module Generator </h3>
  
     </div>
     
      <div class="toolbar-nav">
        <div class="row">
          <div class="col-md-4 " >
            <div  class=" mr-2 tool-icon" @click="new_module"><i class="bi bi-file-earmark-plus"></i> New </div> 
            <div  class=" mr-2 tool-icon" @click="install"><i class="bi bi-clipboard-plus"></i> Install</div> 
            <div  class=" mr-2 tool-icon" @click="backup"><i class="bi bi-file-earmark-zip"></i> Backup</div> 
            <div  class=" mr-2 tool-icon" @click="fetchData"><i class="bi bi-arrow-clockwise"></i> Reload </div>  
          </div>

          <div class="col-md-3">
            <BFormSelect  :options="options" size="sm" />
          </div>
          <div class="col-md-2">
            <BFormSelect  :options="options" size="sm" />
          </div>
          <div class="col-md-2">
            <BFormSelect  :options="options" size="sm" />
          </div>
         
        </div>

      </div>
      <div class="page">
      <div
        class="table-responsive border rounded-3 position-relative"
        style="overflow-x: auto; overflow-y: visible"
      >
        <BTable  hover :items="items" :fields="fields" >
            <template #cell(module_id)="data">  
                <div class="text-center">                   
                    <BFormCheckbox v-model="selected"  :value="data.item.module_id"  unchecked-value="0" > </BFormCheckbox>  
                </div>             
            </template>
            <template #cell(module_title)="data">
              <div class="pointer" @click="viewDetail(data.item)">
                  <b>{{ data.item.module_title }}</b> 
              </div>
            </template>
          </BTable>
          </div>
    </div>

    <BModal v-model="modal" title="Manage Module Configuration" size="xl" no-footer ref="configModal"> 
      <div style="min-height:400px">
        <ModuleConfig v-if="preview" :config="config" @update="reloadData" />
      </div>


    </BModal>
    <BModal v-model="form_modal" title="Create New Module" size="md" no-footer> 
      <div style="min-height:400px">
        <BForm   @submit.prevent="onSubmit"> 
            <BFormGroup label="1. Module Title" class="mb-3">
                <BFormInput  size="sm" v-model="form.module_title" required  />
            </BFormGroup>
            <BFormGroup label="2. Module Note" class="mb-3">
                <BFormInput  v-model="form.module_note"  size="sm" required  />
            </BFormGroup>
            <BFormGroup label="3. Choose Module Template" class="mb-3">
              <BFormRadioGroup 
                v-model="form.module_type"
                :options="option_type"
                name="radio-options"
                size="sm"
                required stacked 
              /> 
              
            </BFormGroup>
            <BFormGroup label="4. Controller Class" class="mb-3" description="Make sure no white space">
                <BFormInput  v-model="form.module_name"  size="sm" required  />
            </BFormGroup>
            <BFormGroup label="5. Table Base" class="mb-3" description="Database table as base Model ">
              <BFormSelect  size="sm" :options="tableDb" class="mt-3" required  v-model="form.module_db"    />
            </BFormGroup>
            <div class="sx-modal-footer">
              <BFormGroup  class="mb-3">
                <button type="submit" class="btn btn-sm btn-outline-danger"  style="font-size: 11px;"  > Create & Generate</button>
              </BFormGroup>
            </div>
        </BForm>
        </div>
    </BModal>

        <BModal v-model="form_backup" title="Backup Module as zip installer" size="md" no-footer> 
          <div style="min-height:400px">
            <p class="alert alert-s text-center" style="line-height: 1.2rem; font-size: 0.75rem;">
              What's this ?  Zip Package is a tool for backup your module as installer . <br />
              You can backup current module and install the modules to other application based Sximo builder - Edition Laravel<br /> 
            All module zipped are stored at <b>uploads/zip folder</b> , you can download them.
            <br /> <br /><b class="text-danger"> This Feature only work on vue dev mode </b>
            </p>
            <hr />
            
            <b>1. Application & Data Info </b>
            <div class="p-2">
            
                <BFormGroup label="Application Name" class="mt-2 mb-3" description="This will be zip name">
                    <BFormInput     size="sm" required  />
                </BFormGroup>
                <BFormGroup label="SQL Statement" class="mb-3" description="Make sure no white space">
                    <BFormInput    size="sm" required  />
                </BFormGroup>
            </div>

            <p class="mb-5">
              <b>2. Additional Vue Files ( Frontend )</b>
            </p>  
            <p class="mb-5">
              <b>3. Additional Laravel Files ( Backend ) </b>
            </p> 
           <div class="sx-modal-footer">
                <BButton variant="outline-info" size="sm" >Backup as zip Installer</BButton>
           </div>
          </div>
        </BModal>
        <BModal v-model="form_install" title="Install Application ( Module )" size="md" no-footer> 
          <div >
            <p class="alert alert-s text-center" style="line-height: 1.2rem; font-size: 0.75rem;">
             Install Zip Package as a module application  . <br /> <br /> 
             <b class="text-danger"> This Feature only work on vue dev mode </b>
            </p>
            <hr />

            <BFormFile size="sm" label="Select zip install " accept=".zip" />
            <BFormGroup   class="mt-3  " >
                <BButton variant="outline-success" size="sm" >Upload & Install</BButton>
            </BFormGroup>


          </div>
        </BModal>
 

   </div>
     
   </template> 
   <style>
  .text-right {
    text-align: right;
  }
  </style>