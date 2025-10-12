<script setup>
import { ref, defineProps, getCurrentInstance, watch } from 'vue';
import { useMessageStore } from '@/store/messageStore';

import vSelect from 'vue-select';
import { useStore } from '@/store';
import 'vue-select/dist/vue-select.css';
import module from '@/router/module';
import Icons from './SxIcons.vue';

const messageStore = useMessageStore();
const selectedValue = ref(null);
const moduleOld = selectedValue.value;
const modalIcons = ref(false);
const loading = ref(false);
const store = useStore();
const { proxy } = getCurrentInstance();
const modelValue = ref('');
const props = defineProps({
    fectMenu: Function,
    modules: {
        type: Array,
        required: true,
    },
    groups: {
        type: Array,
        required: true,
    },
});

const form = ref({
    id: null,
    menu_name: '',
    menu_type: 'internal',
    module: '',
    position: 'top',
    menu_icons: '',
    active: '1',
    access_data: {},
    allow_guest: null,
});

const cancelForm = () => {
    form.value = {
        id: null,
        menu_name: '',
        menu_type: 'internal',
        module: null,
        position: 'top',
        menu_icons: '',
        active: '1',
        access_data: {},
        allow_guest: 0,
    };
    selectedValue.value = null;
};

const setForm = async (item) => {
    loading.value = true;
    try {
        const response = await store.getData({
            url: `api/core/menus/edit?id=${item}`,
            headers: {
                'Content-Type': 'application/json',
            },
            responseType: 'json',
        });
        form.value = response.data.data.menu;
        form.value.allow_guest = parseInt(form.value.allow_guest);
        selectedValue.value = form.value.module;

        loading.value = false;
    } catch (error) {
        proxy.$swal.fire({
            icon: 'error',
            title: 'Edit Failed',
            text: 'Something went wrong. Please try again.',
            toast: true,
            position: 'top-end',
            timer: 3000,
            showConfirmButton: false,
            timerProgressBar: true,
        });
    }
};

const submitForm = async () => {
    loading.value = true;
    form.value.task = 'save_menu';
    form.value.allow_guest = form.value.allow_guest ? '1' : '0';
    form.value.menu_icons = `${modelValue.value}`;
    if (selectedValue.value !== moduleOld) {
        form.value.module = selectedValue.value.module_name;
        if (form.value.module == null) {
            form.value.module = selectedValue.value;
        }
    }
    const response = await store.postData({
        url: 'api/core/menus',
        params: form.value,
        headers: {
            'Content-Type': 'application/json',
        },
        responseType: 'json',
    });
    if (response.data.status) {
        proxy.$swal.fire({
            icon: 'success',
            title: 'Success',
            text: response.data.message,
            toast: true,
            position: 'top-end',
            timer: 3000,
            showConfirmButton: false,
            timerProgressBar: true,
        });

        messageStore.reloadMenus();

        if (props.fectMenu) {
            props.fectMenu();
        }

        form.value = {
            menu_name: '',
            menu_type: 'internal',
            module_name: null,
            position: 'top',
            icon_class: '',
            status: '1',
            access_data: {},
            public: 0,
        };
    } else {
        proxy.$swal.fire({
            icon: 'error',
            title: 'Failed',
            text: response.data.message,
            toast: true,
            position: 'top-end',
            timer: 3000,
            showConfirmButton: false,
            timerProgressBar: true,
        });
    }

    loading.value = false;
};

const deleteForm = async () => {
    form.value.task = 'delete';

    const result = await proxy.$swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
    });
    if (result.isConfirmed) {
        const response = await store.postData({
            url: 'api/core/menus',
            params: form.value,
            headers: {
                'Content-Type': 'application/json',
            },
            responseType: 'json',
        });
        if (response.data.status) {
            proxy.$swal.fire({
                icon: 'success',
                title: 'Success',
                text: response.data.message,
                toast: true,
                position: 'top-end',
                timer: 3000,
                showConfirmButton: false,
                timerProgressBar: true,
            });
            if (props.fectMenu) {
                props.fectMenu();
            }
        } else {
            proxy.$swal.fire({
                icon: 'error',
                title: 'Failed',
                text: response.data.message,
                toast: true,
                position: 'top-end',
                timer: 3000,
                showConfirmButton: false,
                timerProgressBar: true,
            });
        }
    }
};

watch(selectedValue, (val) => {
    modelValue.value = '';
    form.value.module_name = val;
    modelValue.value = form.value.menu_icons;
    console.log(form.value);
});

defineExpose({
    setForm,
});
</script>

<template>
    <div class="mb-4">
        <label for="name" class="form-label">Name / Title</label>
        <input type="text" class="form-control form-control-sm" id="name" v-model="form.menu_name" />
    </div>
    <div class="mb-4">
        <label class="form-label">Menu Type</label>
        <div class="d-flex justify-content-start gap-3">
            <div class="form-check">
                <input class="form-check-input" type="radio" name="type" id="radioDefault1" v-model="form.menu_type" value="internal" />
                <label class="form-check-label" for="radioDefault1"> Internal </label>
            </div>
            <div class="form-check">
                <input class="form-check-input" type="radio" name="type" id="radioDefault2" v-model="form.menu_type" value="external" />
                <label class="form-check-label" for="radioDefault2"> External </label>
            </div>
        </div>
    </div>
    <div class="mb-4">
        <label class="form-label">Controller / Route</label>
        <v-select :options="modules" v-model="selectedValue" label="module_name" placeholder="Select Controller" size="sm" />
    </div>
    <div class="mb-4">
        <label class="form-label">Podition</label>
        <div class="d-flex justify-content-start gap-3">
            <div class="form-check">
                <input class="form-check-input" type="radio" name="position" id="topmenu" v-model="form.position" value="top" />
                <label class="form-check-label" for="topmenu"> Separator Menu </label>
            </div>
            <div class="form-check">
                <input class="form-check-input" type="radio" name="position" id="sidemenu" v-model="form.position" value="sidebar" />
                <label class="form-check-label" for="sidemenu"> Side Menu </label>
            </div>
        </div>
    </div>
    <div class="mb-4">
        <label for="name" class="form-label">Icon Class</label>
        <BInputGroup size="sm">
            <BFormInput v-model="modelValue" size="sm" />
            <BButton size="sm" text="Button" @click="modalIcons = true" variant="primary"><i class="bi bi-info-circle"></i></BButton>
        </BInputGroup>
        {{ modelValue }}
    </div>

    <BModal v-model="modalIcons" title="Choose Icon Menu" size="lg" no-footer scrollable="">
        <Icons v-model="modelValue" @close="modalIcons = false" />
    </BModal>

    <div class="mb-4">
        <label class="form-label">Status</label>
        <div class="d-flex justify-content-start gap-3">
            <div class="form-check">
                <input class="form-check-input" type="radio" name="status" id="active" v-model="form.active" value="1" />
                <label class="form-check-label" for="active"> Active </label>
            </div>
            <div class="form-check">
                <input class="form-check-input" type="radio" name="status" id="noneactive" v-model="form.active" value="0" />
                <label class="form-check-label" for="noneactive"> Non Active </label>
            </div>
        </div>
    </div>
    <div class="mb-4">
        <label class="form-label">Access</label>
        <div class="d-flex justify-content-start gap-3">
            <div class="form-check" v-for="group in groups" :key="group.id">
                <input class="form-check-input" type="checkbox" :name="'access[' + group.group_id + ']'" :id="group.group_id" v-model="form.access_data[group.group_id]" :value="group.group_id" :checked="form.access_data[group.group_id] == 1" :true-value="1" :false-value="0" />
                <label class="form-check-label" :for="group.group_id">
                    {{ group.name }}
                </label>
            </div>
        </div>
    </div>
    <div class="mb-4">
        <label class="form-label">Public</label>
        <div class="d-flex justify-content-start gap-3">
            <div class="form-check">
                <input class="form-check-input" type="checkbox" name="public" id="public" v-model="form.allow_guest" :true-value="1" :false-value="0" />
                <label class="form-check-label" for="public"> Yes </label>
            </div>
        </div>
    </div>
    <div class="d-flex gap-3">
        <BButton variant="outline-primary" size="sm" @click="submitForm" :disabled="loading">
            <span v-if="loading"> <BSpinner small type="border" class="me-1" /> Saving... </span>
            <span v-else>
                Save
            </span>
        </BButton>
        <BButton variant="outline-warning" size="sm" @click="cancelForm" v-if="form.menu_id">
            Cancel
        </BButton>
        <BButton variant="outline-danger" size="sm" @click="deleteForm" v-if="form.menu_id">
            Delete
        </BButton>
    </div>
</template>
