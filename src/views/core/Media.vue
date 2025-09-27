<script setup>
import { getCurrentInstance, ref , onMounted , reactive  } from "vue";
import { useStore } from "@/store";
import { useRouter } from "vue-router"; 
 
const router = useRouter(); 
const store = useStore();

//const request =   store.baseUrl+'api/core/media' ;
const request = {
    // ----- CHANGE ME! -----
    // [REQUIRED] Url for development server endpoint
    baseUrl: store.baseUrl+'api/core/media' ,
    // ----- CHANGE ME! -----

    // Additional headers & params & body
    headers: { 
        "X-ADDITIONAL-HEADER": 'yes' ,
        "Authorization" : "Bearer " + localStorage.getItem('token')
    }, 
    transformRequest: req => {
      if (req.method === 'get') {
        req.params.vf = "1"
      }
      return req;
    },

    // XSRF Token header name
    xsrfHeaderName: "X-CSRF-TOKEN",
  }

const handleSelectButton = {
    // show select button
    active: true,
    // allow multiple selection
    multiple: false,
    // handle click event
    click: (items, event) => {
      if (!items.length) {
        alert('No item selected');
        return;
      }
      alert('Selected: ' + items[0].path);
      console.log(items, event);
    }
  } 
</script>
<template>
    <div class="wrapper">
       

        <div class="page p-0" > 
            <VueFinder id='my_vuefinder' :request="request"   :max-height="'600'" :max-file-size="5"></VueFinder>

            </div>
    </div>
</template>
<style >
.vuefinder .md\:w-8 {
    width: 1.3rem;
}
.vuefinder .vuefinder__main__relative {
    border-radius : 0;
}
.vuefinder__main__container {
    border:  none !important;
}
.vuefinder .vuefinder__breadcrumb__container { 
    background-color: #f9fafb;
} 
.vuefinder .min-h-32 {
    min-height: calc(100vh - 166px); 
}
</style>