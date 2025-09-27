<script setup> 
const props = defineProps({
  download: {
    type: Object,
    required: true,
  } 
}); 
const emit = defineEmits(["update"]);

const doDownloads = (val) => {  
  emit("update", props);
};

</script>
<template>
    <div>
        
            <BRow>
                <BCol md="6"  >
                    <BFormGroup label="Start Row"  class="mb-3">
                        <BFormInput  size="sm" type="number" placeholder="0" v-model="props.download.startRows"  />
                    </BFormGroup>
                </BCol>
                <BCol md="6"  >
                    <BFormGroup label="End Rows Title" class="mb-3">
                        <BFormInput  size="sm"    placeholder="100" type="number"  v-model="props.download.endRows"/>
                    </BFormGroup>
                </BCol>
                <BCol md="12 mb-3">
                    <BFormRadio  name="some-radios" value="excel" v-model="props.download.type">  Excel Sheet </BFormRadio>
                    <BFormRadio   name="some-radios" value="csv"  v-model="props.download.type"> CSV ( Coma Separated Value ) </BFormRadio>
                </BCol>
                <BCol md="12 ">
                    <button type="button" class="btn btn-sm btn-success"  style="font-size: 11px;" @click="doDownloads"  > Download  Now </button> 
                </BCol>
            </BRow> 
    </div>
</template>