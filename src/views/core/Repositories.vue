<script setup>
import { getCurrentInstance, ref , onMounted , reactive  } from "vue";
import { useStore } from "@/store";
import { useRouter } from "vue-router"; 

const { proxy } = getCurrentInstance();
const router = useRouter(); 
const store = useStore();


</script>
<template>
    <div class="wrapper">
        <div class="header-nav">
        <h3><i class="bi bi-layout-sidebar"></i> Repositories </h3>
        </div>
      
        <div class="toolbar-nav">

        </div>

        <div class="page"> 


            </div>
    </div>
</template>