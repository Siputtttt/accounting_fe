<script setup> 
import { getCurrentInstance, ref  } from "vue";
const operators = ref([
    {value :'=' , text : '='},
    {value :'!=' , text : '!='},
    {value :'>' , text : '>'},
    {value :'<' , text : '<'},
    {value :'<>' , text : '<>'},
    {value :'LIKE' , text : 'LIKE'}
])
const form_type = ref(['select','radio'])
const props = defineProps({
  option: {
    type: Object,
    required: true,
  },
  form: {
    type: Object,
    required: true,
  },
  toSearch: {
    type: Object,
    required: true,
  } 
}); 
//console.log(params)
const oprs = ref([])
const posts = ref([])
const emit = defineEmits(["update"]);


const onSubmit = (val) => {      
    props.form.map( i => { 
        if( i.search =='1' &&  typeof  posts.value[i.key]  != 'undefined') { 
             props.toSearch.push( { field :i.key , oprs: oprs.value[i.key],  value: posts.value[i.key]  })
        }   
    }) 
    if(emit("update", props.toSearch)) {
        props.toSearch.value = {}
    }
   
};
const onReset = (val) => {
    props.toSearch.value = {}
    oprs.value = {}
    posts.value = {}
    props.toSearch.value = {}
    console.log(props.toSearch.value )
    emit("update", props.toSearch);
}

</script>
<template>
    <div> 
        <template v-for="f in form">
            <BRow class="mb-3" v-if="f.search == 1"> 
                <BCol md="4"  >
                    <span style="font-size: 12px;">
                        {{  f.label }}
                    </span>
                </BCol>
                <BCol md="3">
                    <BFormSelect  size="sm"  v-model="oprs[f.key]"   :options="operators"  />
                </BCol>
                <BCol md="5">
                    <template  v-if="form_type.includes(f.type)"  >  
                        <BFormSelect :options="props.option[f.key]" size="sm" v-model="posts[f.key]"    /> 
                    </template>
                    <template v-else >
                        <BFormInput  style="margin-left: 5px;"  size="sm"   v-model="posts[f.key]"   type="search"    />
                    </template> 
                </BCol>
            </BRow> 
        </template>
        <hr />
         <BRow class="mb-3">
            <BCol md="6">
                <button type="button" class="btn btn-sm btn-outline-danger"  style="font-size: 11px;" @click="onReset"  > Reset Search </button> 
            </BCol>
            <BCol md="6">
                <button type="button" class="btn btn-sm btn-outline-success float-end"  style="font-size: 11px;" @click="onSubmit"  > Search  Now </button> 
            </BCol> 
        </BRow>
    </div>
</template>