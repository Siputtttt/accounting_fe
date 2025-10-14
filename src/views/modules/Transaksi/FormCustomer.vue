<script setup>
import { ref, getCurrentInstance } from 'vue';
import { useStore } from '@/store';

const emit = defineEmits(['close']);
const { proxy } = getCurrentInstance();
const store = useStore();
const loading = ref(false);

const form = ref({
    action_task: 'save_customer',
    id: '',
    name: '',
    phone: '',
    email: '',
    address: '',
    type: 'individual',
});

const customerType = [
    { value: 'individual', text: 'Pribadi' },
    { value: 'company', text: 'Perusahaan' },
]

const saveCustomer = async () => {
    loading.value = true;

    try {
        const response = await store.postData({
            url: 'api/Customer',
            params: form.value,
            headers: {
                'Content-Type': 'application/json',
            },
            responseType: 'json',
        });
        if (response.data.status === 'success') {
            proxy.$messageSuccess(proxy, 'Success', response.data.message);
            emit('close');
            emit('fetchDataCustomer');
        }
    } catch (err) {
        proxy.$noticeAxios(proxy, err.response);
    } finally {
        loading.value = false;
    }
}
</script>

<template>
    <BForm @submit.prevent="saveCustomer">
        <BFormGroup label="Nama" label-for="name" class="mb-3">
            <BFormInput size="sm" id="name" v-model="form.name" type="text" required />
        </BFormGroup>

        <BFormGroup label="Telepon" label-for="customer_phone" class="mb-3">
            <BFormInput size="sm" id="customer_phone" v-model="form.phone" type="text" placeholder="08xxxxxxx" />
        </BFormGroup>

        <BFormGroup label="Email" label-for="customer_email" class="mb-3">
            <BFormInput size="sm" id="customer_email" v-model="form.email" type="email" placeholder="Email" />
        </BFormGroup>

        <BFormGroup label="Alamat" label-for="customer_address" class="mb-3">
            <BFormInput size="sm" id="customer_address" v-model="form.address" type="text" placeholder="Alamat" />
        </BFormGroup>

        <BFormGroup label="Tipe" label-for="customer_type" class="mb-3">
            <BFormSelect size="sm" id="customer_type" v-model="form.type" :options="customerType" required />
        </BFormGroup>

        <div class="text-right d-flex justify-content-end gap-2 mt-5">
            <button type="button" class="btn btn-sm btn-outline-warning" style="font-size: 11px"><i class="bi bi-x-circle me-1"></i> Cancel</button>
            <button type="submit" class="btn btn-sm btn-outline-success" style="font-size: 11px" :disabled="loading"><i class="bi bi-save me-1"></i> Save</button>
        </div>
    </BForm>
</template>
