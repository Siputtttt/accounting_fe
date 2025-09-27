<script setup>
import { ref, watch, reactive, getCurrentInstance } from 'vue'
import { useStore } from "@/store";

const props = defineProps({
    show: Boolean,
    form: Object,
    typeData: {
        type: Array,
        default: () => [],
    },
    storageEngine: {
        type: Array,
        default: () => [],
    },
})

const emit = defineEmits(['update:show', 'save'])
const { proxy } = getCurrentInstance();
const store = useStore();
const modal_form = ref(props.show)
const loading = ref(false)
const message = ref('')
const errors = reactive({});

watch(() => props.show, (newVal) => {
    modal_form.value = newVal
})

watch(modal_form, (val) => {
    emit('update:show', val)
})


const form = reactive({
    id: null,
    name: "",
    storage_engine: "MyISAM",
    engine: "MyISAM",
    active: 1,
    columns: [],
})

const tableFields = [
    { key: "name", label: "Name" },
    { key: "type", label: "Type" },
    { key: "length", label: "Length" },
    { key: "default", label: "Default" },
    { key: "primary_key", label: "Primary Key" },
    { key: "not_null", label: "Not Null" },
    { key: "auto_increment", label: "Auto Increment" },
    { key: "actions", label: "Actions" }
];

const addRow = () => {
    form.columns.push({
        name: '',
        type: '',
        length: '',
        default: '',
        primary_key: false,
        not_null: false,
        auto_increment: false
    })
}

const removeRow = (index) => {
    form.columns.splice(index, 1)
}

const saveDb = async (event) => {
    event.preventDefault();
    loading.value = true;

    // validation
    if (!errors.columns) errors.columns = reactive([]);
    errors.columns.length = 0;
    form.columns.forEach((item, index) => {
        const fieldErrors = {};

        if (!item.type || item.type === "") {
            fieldErrors.type = 'Tipe is required';
        }

        if (item.type === "varchar" && (!item.length || item.length === "")) {
            fieldErrors.length = 'Type varchar requires length';
        }

        if (Object.keys(fieldErrors).length > 0) {
            errors.columns[index] = fieldErrors;
        } else {
            errors.columns[index] = {};
        }
    });
    // end validation

    const hasErrors = errors.columns.some(
        err => err && Object.keys(err).length > 0
    );
    if (hasErrors) {
        loading.value = false;
        return
    }

    const formData = new FormData();
    formData.append("action_task", "save");
    formData.append("table_name", form.name);
    formData.append("engine", form.storage_engine);


    form.columns.forEach((item, index) => {
        if (item.name !== "") {
            formData.append(`columns[${index}][name]`, item.name);
            formData.append(`columns[${index}][type]`, item.type);
            formData.append(`columns[${index}][length]`, item.length ?? "");
            formData.append(`columns[${index}][default]`, item.default ?? "");
            formData.append(`columns[${index}][primary_key]`, item.primary_key ?? false);
            formData.append(`columns[${index}][not_null]`, item.not_null ?? false);
            formData.append(`columns[${index}][auto_increment]`, item.auto_increment ?? false);
        }
    });
    try {
        const response = await store.postData({
            url: "api/core/database",
            params: formData,
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        if (response.data.status === 1) {
            emit("save");

            const message = response.data.message;
            proxy.$messageSuccess(proxy, "Success", message);
        } else {
            const message = response.data.message;
            proxy.$messageError(proxy, "Error", message);
        }
    } catch (error) {
        errors.value = {};
        message.value = "";

        const backendErrors = error.response?.data?.errors || {};
        message.value = error.response?.data?.message || "Unknown error";

        console.log("API ss:", error.response?.data?.message);
        for (const field in backendErrors) {
            if (Object.prototype.hasOwnProperty.call(backendErrors, field)) {
                errors.value[field] = backendErrors[field][0];
            }
        }
        proxy.$messageError(proxy, "Error", message.value);
    } finally {
        modal_form.value = false
        loading.value = false;
    }
}
</script>

<template>
    <b-modal id="modal-xl" size="xl" v-model="modal_form" title="Form Data" no-close-on-backdrop no-close-on-esc
        no-footer>
        <b-form @submit.prevent="saveDb">
            <div class="mb-4 col-sm-5">
                <label size="sm" for="range-2">Name Table</label>
                <b-form-input type="text" :class="errors?.value?.table_name ? 'is-invalid' : ''" :value="form.name"
                    @input="e => form.name = String(e.target.value).toLowerCase().replace(/[^a-z0-9_]/g, '')"
                    size="sm" />
                <span class="invalid-feedback" v-if="errors?.value?.table_name"> {{ errors?.value?.table_name }}
                </span>
            </div>
            <div class="mb-4 col-sm-5">
                <label size="sm" for="range-2">Storage Engine</label>
                <b-form-select v-model="form.storage_engine" size="sm" :options="props.storageEngine"></b-form-select>
            </div>

            <b-button variant="primary" size="sm" class="mb-2" @click="addRow">+ Add Column</b-button>

            <b-table :items="form.columns" style="min-height: 200px;" :fields="tableFields" bordered responsive>
                <template #cell(name)="data">
                    <b-form-input :class="errors.columns?.[data.index]?.name ? 'is-invalid' : ''"
                        v-model="data.item.name" size="sm" required />
                </template>
                <template #cell(type)="data">
                    <v-select :class="['w-100', errors.columns?.[data.index]?.type ? 'is-invalid' : '']"
                        v-model="data.item.type" :options="typeData" placeholder="Select Type" style="min-width: 150px"
                        class="w-100" :reduce="option => option.value" label="text" />
                    <div class="invalid-feedback" v-if="errors.columns?.[data.index]?.type">
                        {{ errors.columns[data.index].type }}
                    </div>
                </template>
                <template #cell(length)="data">
                    <b-form-input v-model="data.item.length" type="text" size="sm"
                        :class="errors.columns?.[data.index]?.length ? 'is-invalid' : ''" />
                    <div class="invalid-feedback" v-if="errors.columns?.[data.index]?.length">
                        {{ errors.columns[data.index].length }}
                    </div>
                </template>
                <template #cell(default)="data">
                    <b-form-input v-model="data.item.default" size="sm" />
                </template>
                <template #cell(primary_key)="data">
                    <b-form-checkbox v-model="data.item.primary_key" class="text-center p-0"
                        size="lg"></b-form-checkbox>
                </template>
                <template #cell(not_null)="data">
                    <b-form-checkbox v-model="data.item.not_null" class="text-center p-0" size="lg"></b-form-checkbox>
                </template>
                <template #cell(auto_increment)="data">
                    <b-form-checkbox v-model="data.item.auto_increment" class="text-center p-0"
                        size="lg"></b-form-checkbox>
                </template>
                <template #cell(actions)="data">
                    <b-button size="sm" variant="danger" @click="removeRow(data.index)">
                        Hapus
                    </b-button>
                </template>
            </b-table>

            <div class="mt-3 d-flex justify-content-start gap-2">
                <b-button variant="success" size="sm" type="submit">
                    <span v-if="loading">
                        <BSpinner small type="border" class="me-1" /> Saving...
                    </span>
                    <span v-else>
                        Save Change(s)
                    </span>
                </b-button>
            </div>
        </b-form>
    </b-modal>
</template>