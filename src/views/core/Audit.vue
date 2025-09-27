<script setup>
import { getCurrentInstance, ref , onMounted , reactive  } from "vue";
import { useStore } from "@/store";
import { useRouter } from "vue-router"; 

const { proxy } = getCurrentInstance();
const router = useRouter(); 
const store = useStore();
const loading = ref(true);
const selected = ref([]);
const rows = ref([])
const columns = ref([
    {
        label: 'ID',
        key: 'log_id' 
    },
    {
        label: 'User',
        key: 'user_id',
        sortable: true,
    },
    {
        label: 'Module',
        key: 'module',
        sortable: true,
    },
    {
        label: 'Action/Task',
        key: 'action',
        sortable: true,
    },
    {
        label: 'Time',
        key: 'inserted',
        sortable: true,
    },
])
const filter = ref('')
const totalRows = ref(1000)
const perPage = ref(10)
const currentPage = ref(1)

const fetchData = async () => {
  loading.value = true;
  try {
    const response = await store.getData({
      url: "api/core/audit",
      headers: {
        "Content-Type": "application/json",
      },
      responseType: "json",
    });
    rows.value = response.data.data.rows; 
    loading.value = false;

  } catch (error) {
    loading.value = false;
    proxy.$swal(error);
  }
};

const edit = async () => {

}
const remove = async () => {
    if( selected.value.length <= 0 ) {
        proxy.$swal.fire({
            title: "Ops , Something wrong!",
            text: "Please select checkbox !",
            icon: "warning"
        });
        return false ;
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

    }
}

onMounted(() => {
  fetchData();
});

</script>
<template>
    <div class="wrapper">
        <div class="header-nav">
        <h3><i class="bi bi-layout-sidebar"></i> Audit Trail ( Log History ) </h3>
        </div>
      
        <div class="toolbar-nav">
            <div class="row">
                <div class="col-md-6  ">
                    
                    <div  class=" mr-2 tool-icon" @click="remove"><i class="bi bi-trash3"></i> </div>   
                    <div class="tool-icon mr-2"  @click="fetchData"><i class="bi bi-arrow-clockwise"></i></div> 
                </div>
                <div class="col-md-3 pt-2">  
                </div>
                <div class="col-md-3">
                    <BFormInput   v-model="filter"    type="search"  placeholder="Type to Search" />
                </div>  
            </div>


        </div>

        <div class="page"> 
            <div
                    class="table-responsive border rounded-3 position-relative"
                    style="overflow-x: auto; overflow-y: visible" id="printedArea"
                >
                <BTable hover   striped
                    :fields="columns" 
                    :items="rows"  
                    :filter="filter" 
                    :current-page="currentPage" 
                    :per-page="perPage" 
                    @rowClicked="edit">
                    <template #cell(log_id)="data">  
                        <div class="text-center">                   
                            <BFormCheckbox v-model="selected"  :value="data.item.log_id"  unchecked-value="0" > </BFormCheckbox>  
                        </div>             
                    </template>
                </BTable>
            </div> 
        </div>
         <b-overlay :show="loading" no-wrap></b-overlay>
    </div>
</template>