<script setup>
import { getCurrentInstance, ref , onMounted , reactive  } from "vue";
import { useStore } from "@/store";
import { useRouter } from "vue-router";
import draggable from 'vuedraggable'

const { proxy } = getCurrentInstance();
const router = useRouter(); 
const store = useStore(); 
const config = defineProps(['config'])
let row = reactive( config) 
//const tables = reactive(row,confi
const modalEditor =ref(false)
const formaterValue = ref('')
const option_as = [
    {value: '', text: 'None'}, 
    {value: 'date', text: 'date'},
      {value: 'image', text: 'Image'},
    {value: 'link', text: 'Link'},
    {value: 'checkbox', text: 'Checkbox'},
    {value: 'files', text: 'Files'},
    {value: 'function', text: 'Function'},
    {value: 'database', text: 'Database'},
]
const option_format = [
    {value: 'hidden', text: 'Hidden'}, 
    {value: 'text', text: 'Text'},
    {value: 'date', text: 'Date'},
    {value: 'datetime', text: 'Datetime'},
    {value: 'time', text: 'Time'},
    {value: 'select', text: 'Select Option'},
    {value: 'textarea', text: 'Textarea'},
    {value: 'editor', text: 'Textarea + Editor'},
    {value: 'checkbox', text: 'Checkbox'},
    {value: 'radio', text: 'Radio'},
    {value: 'files', text: 'Upload Files'},
    {value: 'image', text: 'Upload Image'},
    {value: 'number', text: 'Number'},
    {value: 'email', text: 'Email'},
    {value: 'url', text: 'Url ( Link )'},
    {value: 'tel', text: 'Phone'},
    {value: 'color', text: 'Color'},
    {value: 'range', text: 'Range'},
]
const option_align = [
    {value: 'left', text: 'Left'}, 
    {value: 'center', text: 'Center'},
    {value: 'right', text: 'right'} 
]
const option_pagination = [
    {value: 'server', text: 'Server Side'}, 
    {value: 'live', text: 'Live'} 
]
const option_ordertype = [
    {value: 'asc', text: 'Ascending'}, 
    {value: 'desc', text: 'Descending'} 
]
const option_size = [
    {value: '1', text: '1'}, 
    {value: '2', text: '2'}, 
    {value: '3', text: '3'}, 
    {value: '4', text: '4'}, 
    {value: '5', text: '5'}, 
    {value: '6', text: '6'}, 
    {value: '7', text: '7'}, 
    {value: '8', text: '8'}, 
    {value: '9', text: '9'}, 
    {value: '10', text: '10'},
    {value: '11', text: '11'}, 
    {value: '12', text: '12'} 
]
 
const emit = defineEmits(["update"]);

onMounted(() => { 
    fetchData()
})
const fetchData = async (event) => { 
  const response = await store.getData({
      url     :  'api/core/modules/permission'  
  })  

  if (response.data.status === 1) { 
    console.log(response.data)
  }
}
const save = async (event) => {
    event.preventDefault();
    let form = {
        rows :  JSON.stringify(row.config) ,
        task : 'save_config'
    }

    const response = await store.postData({
      url: "api/core/modules",
      params: form,
      headers: {
        "Content-Type": "application/json",
      },
      responseType: "json",
    });
    if (response.data.status === 1) {
        console.log(form)
        proxy.$swal.fire({
            icon: "success",
            title: "Success",
            text: 'All Change(s) Has been save , successful',
            toast: true,
            position: "top-end",
            timer: 3000,
            showConfirmButton: false,
            timerProgressBar: true,
        });
    }
}
const reStatement = async (event) => {
    event.preventDefault();
    let form = {
        rows :  JSON.stringify(row.config) ,
        task : 'save_statement'
    }

    const response = await store.postData({
      url: "api/core/modules",
      params: form,
      headers: {
        "Content-Type": "application/json",
      },
      responseType: "json",
    });
    if (response.data.status === 1) { 
         proxy.$swal.fire({ 
            text: response.data.message,
            icon: "success"
        });
        proxy.$messageSuccess(  proxy ,  'Success' ,response.data.message +' . Please wait for reloading ...' ) 
        emit('update') 
    } else {
         proxy.$messageError(  proxy ,  'Error' ,response.data.message )     
    }
}
const preview  = async (item) => {
    window.open(url, '_blank').focus();
}

const editor = async (item) => {
    console.log( item )
    formaterValue.value = item 
    modalEditor.value = true
}
const rebuild  = async (item) => {
    const result = await proxy.$swal.fire({
        title: "Rebuild File ?",
        text: "This action will replace all created file(s). any change(s) from those file will lose . Are you sure?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Continue!",
    });

    if (result.isConfirmed) {
        const response = await store.getData({
            url     :  'api/core/modules/rebuild?id='+ item  
        })  

        if (response.data.status === 1) { 
            console.log(response)
        }
    }
}

const remove  = async (item) => {
    const result = await proxy.$swal.fire({
        title: "Remove Module ?",
        text: "This action will remove all created file(s). Are you sure?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Continue!",
    });

    if (result.isConfirmed) { 
        const response = await store.getData({
            url     :  'api/core/modules/remove?id='+ item  
        })  
        if (response.data.status === 1) { 
            console.log(response)
        }
    }
}
</script>
<template>
    <div  >  
        <div class="mb-3 toolbar-nav" >
            <div class="row">
                <div class="col-md-6">
                    <button class="btn btn-sm btn-light"   @click="remove(row.config.module_name)">
                        Delete Module 
                    </button>
                </div>
                <div class="col-md-6 text-right" >
                    <button class="btn btn-sm btn-light" style="font-size: 10px; margin-right: 10px;" @click="rebuild(row.config.module_name)">
                         Rebuild Code(s)
                    </button>  
                    <router-link  style="font-size: 10px; margin-right: 10px;"  class="btn btn-sm btn-light"  :to="{ name: row.config.module_name }" target="_blank">
                        Preview Generated Module 
                    </router-link> 
                    <button class="btn btn-sm btn-light"  style="font-size: 10px;" @click="save"> Save All Change(s)</button>
                </div>
            </div>
        </div>

        <BTabs content-class="mt-3"> 

        

          <BTab title="Main Info">
            <div class="card">
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-6">
                            <BFormGroup label="Module Name" class="mb-3">
                                <BFormInput id="input-id" size="sm" v-model="row.config.module_title" />
                            </BFormGroup>
                            <BFormGroup label=" Note / Description "  class="mb-3">
                                <BFormInput id="input-id" size="sm"  v-model="row.config.module_note" />
                            </BFormGroup>
                            <BFormGroup label=" Class Controller "  class="mb-3">
                                <BFormInput id="input-id" size="sm" disabled  v-model="row.config.module_name"  />
                            </BFormGroup>
                            <BRow>
                                <BCol sm="6">
                                    <BFormGroup label=" Master Table "  class="mb-3">
                                        <BFormInput id="input-id" size="sm"  disabled v-model="row.config.module_db"  />
                                    </BFormGroup>
                                </BCol>
                                <BCol sm="6">
                                    <BFormGroup label=" Table Key "  class="mb-3">
                                        <BFormInput id="input-id" size="sm" disabled  v-model="row.config.module_db_key"  />
                                    </BFormGroup>
                                </BCol>
                            </BRow>
                            
                        </div>
                        <div class="col-md-6">
                            <BRow>
                                <BCol sm="6">
                                    <BFormGroup label=" Default Order "  class="mb-3">
                                        <BFormSelect  size="sm" class="mt-3"   v-model="row.config.settings.order_by"> 
                                        <BFormSelectOption v-for="field in row.config.forms" :value="field.field">{{  field.field }}</BFormSelectOption>
                                        </BFormSelect>
                                    </BFormGroup>
                                </BCol>
                                <BCol sm="6">
                                    <BFormGroup label="  Order Type "  class="mb-3">
                                        <BFormSelect  :options="option_ordertype"  size="sm" class="mt-3" v-model="row.config.settings.order_type" />
                                    </BFormGroup>
                                </BCol>
                                <BCol sm="3">
                                    <BFormGroup label="Display (Per Page)"  class="mb-3"> 
                                        <BFormInput   size="sm" placeholder="10" v-model="row.config.settings.display_row"   />                                        
                                    </BFormGroup>

                                </BCol>
                                <BCol sm="6">
                                    <BFormGroup label="Pagination Method"  class="mb-3">
                                        <BFormSelect    :options="option_pagination" size="sm"   v-model="row.config.settings.pagination_type"   />
                                    </BFormGroup>

                                </BCol> 
                            </BRow>
                            <p class="alert alert-info" style="font-size: 0.75rem;">
                                <b>Pagination Method Live : </b> <br />All data from database will be displaying in once request , and spliting by pagination <br /><br />
                                <b>Pagination Method Server : </b><br /> Data from database will be displaying  per page , and spliting by pagination <br />

                            </p>


                           
                            
                            
                        </div>
                    </div>
                </div>
            </div>
            


          </BTab>
          <BTab title="SQL ">
                <div class="card">
                    <div class="card-body"> 

                        <BFormGroup label="SQL Select Join" class="mb-3">
                            
                            <BFormTextarea size="sm"  v-model=" row.config.sql_select"   rows="5" />
                        </BFormGroup>
                        <BFormGroup label="SQL Where Condition" class="mb-3">
                            <BFormTextarea  size="sm"  v-model=" row.config.sql_where" rows="3" />
                        </BFormGroup>
                        <BFormGroup label="SQL Group" class="mb-3">
                            <BFormTextarea   size="sm"  v-model=" row.config.sql_group" rows="3" />
                        </BFormGroup>
                        <div class="alert alert-warning" style="font-size: 10px;">
                           <b>Warning !</b> Please make sure SQL where not empty , for prevent error when user attempt submit SEARCH
                        </div>
                        <BFormGroup class="mb-3">
                            <button type="button" class="btn btn-sm btn-outline-danger" @click="reStatement"> Re-Save Query Statement and Rebuild Model  </button>
                            
                        </BFormGroup>
                    </div>
                </div>

          </BTab>
          <BTab title="Table">

            <table class="table table-striped">
                <thead class="thead-light">
                <tr>
                    <th scope="col">Field</th>
                    <th scope="col">Table</th>
                    <th scope="col">label</th>
                    <th scope="col">Show</th>
                    <th scope="col">VD</th>   
                    <th scope="col">Search</th>                     
                    <th scope="col">ST</th>
                    <th scope="col">DW</th>
                    <th scope="col">Width</th>
                    <th scope="col">Align</th>
                    <th scope="col">Format As</th>
                    <th scope="col">Format Value</th>
                </tr>
                </thead>
                <draggable v-model=" row.config.tables" tag="tbody" item-key="name">
                <template #item="{ element }">
                    <tr>
                        <td>{{  element.field  }}</td>
                        <td>{{  element.alias  }}</td>
                        <td><BFormInput v-model="element.label"   size="sm" /> </td>
                        <td> 
                            <BFormCheckbox   v-model="element.view"   value="1"  unchecked-value="0" >  </BFormCheckbox> 
                        </td>
                        <td><BFormCheckbox   v-model="element.detail"   value="1"  unchecked-value="0" >  </BFormCheckbox> </td>
                        <td><BFormCheckbox   v-model="element.search"   value="1"  unchecked-value="0" >  </BFormCheckbox> </td>
                        <td><BFormCheckbox   v-model="element.sortable"   value="1"  unchecked-value="0" >  </BFormCheckbox> </td>
                        <td><BFormCheckbox   v-model="element.download"   value="1"  unchecked-value="0" >  </BFormCheckbox> </td>
                        <td style="width: 100px;;"><BFormInput v-model="element.width"   size="sm" /></td>
                        <td><BFormSelect v-model="element.align"  :options="option_align" size="sm"   /></td>
                        <td><BFormSelect v-model="element.format_as" :options="option_as"  size="sm"   /></td>
                        <td> 
                            <BInputGroup size="sm">
                                <BFormInput v-model="element.format_value"   size="sm" />
                                <BButton size="sm" text="Button" @click="editor('table')" variant="outline-secondary" ><i class="bi bi-info-circle"></i></BButton>
                            </BInputGroup> 
                        </td>
                    </tr> 
                </template>
                </draggable>
            </table>


            </BTab>
          <BTab title="Form">
                <BTabs content-class="mt-3"> 
                    
                    <BTab title="Form Config">
                        <table class="table table-striped">
                            <thead class="thead-dark">
                            <tr>
                                <th scope="col">Field</th>
                                <th scope="col">label</th>
                                <th scope="col">Col Size</th>
                                <th scope="col">Form Type</th>
                                <th scope="col">Form Option Value</th>
                                
                                <th scope="col">Validation ( Laravel Rules )</th>
                                <th scope="col">Show</th>
                                <th scope="col">Search</th>
                            </tr>
                            </thead>
                            <draggable v-model=" row.config.forms" tag="tbody" item-key="name">
                            <template #item="{ element }">
                                <tr>
                                <td scope="row">{{ element.field }}</td>
                                <td><BFormInput v-model="element.label"   size="sm" /></td>
                                <td><BFormSelect v-model="element.size"  :options="option_size" size="sm"   /></td>
                                <td><BFormSelect v-model="element.type"  :options="option_format" size="sm"   /></td>
                                <td>
                                    <BInputGroup size="sm">
                                        <BFormInput v-model="element.option"   size="sm"   />
                                        <BButton size="sm" text="Button" @click="editor('form')" variant="outline-secondary"  ><i class="bi bi-info-circle"></i></BButton>
                                    </BInputGroup>    
                                </td>
                                <td><BFormInput v-model="element.required"   size="sm" /></td>
                                <td><BFormCheckbox   v-model="element.view"   value="1"  unchecked-value="0" >  </BFormCheckbox></td>
                                <td><BFormCheckbox   v-model="element.search"   value="1"  unchecked-value="0" >  </BFormCheckbox></td>
                                
                                </tr>
                            </template>
                            </draggable>
                        </table>
                    </BTab>
                    <BTab title="Form Layout">
                        <div class="p-3" style="margin: 20px auto; width: 60%; background: #f0f0f0;">
                            <div class="row">
                                <template v-for="form in  row.config.forms">                            
                                    <BFormGroup v-if="form.view =='1'"  :label="form.label" class="mb-3 " :class="'col-md-'+form.size" >
                                        <BFormInput  size="sm" :placeholder="form.type"    />
                                    </BFormGroup>
                                    
                                </template>
                            </div>
                        </div>
                    
                    </BTab>
                </BTabs>
          </BTab>
          
          <BTab title="Permission"> 
            <div class="alert alert-warning">
                <b> Remember </b> : If you want users only able to access they own records , then Global must  unchecked state <br />
                When you using this feature , Database table must have <b>entry_by</b> field

            </div>
            <table class="table table-striper">
                <thead>
                    <tr>
                        <th>Group</th> 
                        <th>Global</th>
                        <th>View</th>
                        <th>Detail</th>
                        <th>Create</th>
                        <th>Edit</th>
                        <th>Remove</th>
                        <th>Print</th>
                        <th>Excel</th>
                        <th>CSV</th>
                    </tr>
                </thead>
                <tbody>
                <template v-for="permission in  row.config.access">
                    <tr>
                        <td>{{  permission.group}}</td>
                        <td><BFormCheckbox   v-model="permission.access.is_global"   value="1"  unchecked-value="0" >  </BFormCheckbox></td>
                        <td><BFormCheckbox   v-model="permission.access.is_view"   value="1"  unchecked-value="0" >  </BFormCheckbox></td>
                        <td><BFormCheckbox   v-model="permission.access.is_detail"   value="1"  unchecked-value="0" >  </BFormCheckbox></td>
                        <td><BFormCheckbox   v-model="permission.access.is_add"   value="1"  unchecked-value="0" >  </BFormCheckbox></td>
                        <td><BFormCheckbox   v-model="permission.access.is_edit"   value="1"  unchecked-value="0" >  </BFormCheckbox></td>
                        <td><BFormCheckbox   v-model="permission.access.is_delete"   value="1"  unchecked-value="0" >  </BFormCheckbox></td>
                        <td><BFormCheckbox   v-model="permission.access.is_print"   value="1"  unchecked-value="0" >  </BFormCheckbox></td>
                        <td><BFormCheckbox   v-model="permission.access.is_csv"   value="1"  unchecked-value="0" >  </BFormCheckbox></td>
                        <td><BFormCheckbox   v-model="permission.access.is_excel"   value="1"  unchecked-value="0" >  </BFormCheckbox></td> 
                    </tr>
                </template>
                </tbody>
            </table>
            
          </BTab>
        </BTabs>

        <BModal v-model="modalEditor" title="Format Editor" size="lg" no-footer> 
            <div class="border" style="min-height:400px; padding: 10px; background: #f7f7f7; font-size: 12px;   border-radius: 8px;  ">
                <BRow>
                     
                    <BCol cols="12 mt-3" v-if="formaterValue =='table'">
                        <b> Usage Params </b><br /><br />
                        1. Date = dd-yy-mm <br />
                        2. Image Or File  = /uploads/path_to_upload <br />
                        3. Link = http://domain.com ? <br />
                        4. Function = class:method:param1-param2 <br />
                        5. Radio Or Checkbox = value:text,value:text,... <br />
                        6. Database = table:id:field1-field2 <br /> <br />

                        All Field are accepted using tag {FieldName} . Example {opd_nama}
                    </BCol>

                    <BCol cols="12 mt-3" v-if="formaterValue =='form'">
                        <b> Radio & Checkbox Format Value </b>
                        <p class="alert alert-warning  mt-2">
                            Format : <b>value:text , value:text ,  ...</b> <br />
                            Exam : 0:In Active , 1 : Active , 2:Suspend 
                        </p>
                        <b> Upload File / Images </b>
                        <p class="alert alert-warning  mt-2">
                            Format : <b>/public/folderToUpload</b> <br />
                            Exam : /public/foto 
                        </p>
                        <b> Select Option </b>
                        <p class="alert alert-warning  mt-2">
                            <b> From Database </b><br />
                            Format : <b>database|tableName:primaryId:fieldToDisplay</b> <br />
                            Exam : database|users:id:name <br /><br />

                            <b> From Custom Value </b><br />
                            Format : <b>custom|value:text , value:text ,  ...</b> <br />
                            Exam : 0:In Active , 1 : Active , 2:Suspend 
                        </p>


                    </BCol>
                </BRow> 

            </div>
        </BModal>

       
   </div>
     
</template> 
<style scoped>
    .box-form {
        border: solid 1px #eee;
        border-radius: 8px;
        font-size: 0.85rem;
        margin-bottom: 10px;
        padding: 5px 15px;
    }
    .list-group-item {
        font-size: 0.85rem;
    }
</style>