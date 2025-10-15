<script setup>
import { getCurrentInstance, ref, onMounted } from 'vue';
import { useStore } from '@/store';
import { useRouter } from 'vue-router';

const { proxy } = getCurrentInstance();
const router = useRouter();
const store = useStore();

const loading = ref(false);
const filter = ref('');
const perPage = ref(10);
const currentPage = ref(1);
const branches = ref([]);
const selected = ref([]);
const modalBranch = ref(false);

const status = ref([
    { id: 0, name: 'Tidak Aktif' },
    { id: 1, name: 'Aktif' },
]);

const form = ref({
    id: '',
    name: '',
    code: '',
    address: '',
    phone: '',
    email: '',
    is_active: 1
});

const columns = [
    { key: 'no', label: 'No', sortable: false, tdClass: 'text-center', thClass: 'text-center', thStyle: { width: '50px' } },
    { key: 'id', label: 'ID', sortable: false, tdClass: 'text-center', thClass: 'text-center', thStyle: { width: '50px' } },
    { key: 'code', label: 'Kode Cabang', sortable: true },
    { key: 'name', label: 'Nama Cabang', sortable: true },
    { key: 'address', label: 'Alamat', sortable: true },
    { key: 'phone', label: 'Telepon', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'is_active', label: 'Status', sortable: true },
];

const edit = (item) => {
    form.value = {
        id: item.id,
        name: item.name,
        code: item.code,
        address: item.address,
        phone: item.phone,
        email: item.email,
        is_active: parseInt(item.is_active)
    };
    modalBranch.value = true;
};

const save = async () => {
    loading.value = true;
    try {
        const response = await store.postData({
            url: 'api/Branch',
            params: form.value,
            headers: {
                'Content-Type': 'application/json',
            },
            responseType: 'json',
        });
        if (response.data.status === 'success') {
            fetchData();
            proxy.$messageSuccess(proxy, 'Success', response.data.message);
            modalBranch.value = false;
        }
    } catch (err) {
        proxy.$noticeAxios(proxy, err.response);
    } finally {
        loading.value = false;
    }
};

const reset = () => {
    form.value = {
        id: '',
        name: '',
        code: '',
        address: '',
        phone: '',
        email: '',
        is_active: 1
    };
    modalBranch.value = false;
};

const removeById = async () => {
    if (selected.value.length <= 0) {
        proxy.$messageError(proxy, 'Error', 'Pilih data yang akan dihapus terlebih dahulu.');
        return false;
    }

    const result = await proxy.$messageConfirmed(proxy, {
        title: 'Konfirmasi Hapus',
        text: 'Apakah Anda yakin ingin menghapus data ini?',
        icon: 'question',
        buttons: [
            { text: 'Batal', variant: 'secondary' },
            { text: 'Hapus', variant: 'danger', action: () => true },
        ],
    });

    try {
        loading.value = true;
        if (result.isConfirmed) {
            const response = await store.deleteData({
                url: 'api/Branch/' + selected.value,
                headers: {
                    'Content-Type': 'application/json',
                },
                responseType: 'json',
            });
            if (response.data.status === 'success') {
                fetchData();
                selected.value = [];
                proxy.$messageSuccess(proxy, 'Success', response.data.message);
            }
        }
    } catch (err) {
        proxy.$noticeAxios(proxy, err.response);
    } finally {
        loading.value = false;
    }
};

const fetchData = async () => {
    loading.value = true;
    try {
        const response = await store.getData({
            url: `api/Branch`,
        });
        if (response.data.status === 'success') {
            branches.value = response.data.data.branches;
            proxy.$messageSuccess(proxy, 'Success', response.data.message);
        } else {
            proxy.$noticeAxios(proxy, response);
        }
    } catch (err) {
        proxy.$noticeAxios(proxy, err.response);
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    fetchData();
});
</script>

<template>
    <div class="wrapper">
        <div class="header-nav">
            <h3><i class="bi bi-building"></i> Daftar Cabang</h3>
        </div>
        <div class="toolbar-nav mb-3">
            <div class="row justify-content-between align-items-center">
                <div class="col-md-6">
                    <div class="mr-2 tool-icon card" @click="modalBranch = true">
                        <i class="bi bi-file-earmark-plus"></i>
                    </div>
                    <div class="tool-icon mr-2 card" @click="fetchData">
                        <i class="bi bi-arrow-clockwise"></i>
                    </div>
                    <div v-if="selected.length > 0" class="mr-2 tool-icon card" @click="removeById">
                        <i class="bi bi-trash3"></i>
                    </div>
                </div>
                <div class="col-md-3">
                    <BFormInput 
                        v-model="filter" 
                        size="sm" 
                        type="search" 
                        placeholder="Cari..." 
                    />
                </div>
            </div>
        </div>
        <div class="page">
            <div class="card p-3">
                <div class="table-responsive border rounded-3 position-relative" style="min-height: 400px" id="printedArea">
                    <BTable striped hover :fields="columns" :items="branches" :filter="filter" :per-page="perPage" :current-page="currentPage" @row-clicked="edit">
                        <template #cell(no)="data">
                            {{ (currentPage - 1) * perPage + data.index + 1 }}
                        </template>
                        <template #cell(is_active)="data">
                            <span :class="['badge', data.item.is_active === '1' ? 'bg-success' : 'bg-danger']">
                                {{ data.item.is_active === '1' ? 'Aktif' : 'Tidak Aktif' }}
                            </span>
                        </template>
                        <template #cell(id)="data">
                            <div class="text-center">
                                <BFormCheckbox v-model="selected" :value="data.item.id" unchecked-value="0"> </BFormCheckbox>
                            </div>
                        </template>
                    </BTable>
                    <b-overlay :show="loading" no-wrap></b-overlay>
                </div>
                <div class="d-flex justify-content-end mt-3">
                    <BPagination v-model="currentPage" :total-rows="branches.length" :per-page="perPage" align="right" size="sm" />
                </div>
            </div>
        </div>

        <BModal v-model="modalBranch" :title="form.id ? 'Edit Cabang' : 'Tambah Cabang'" size="lg" no-footer :no-close-on-backdrop="true" @hide="reset">
            <BForm @submit.prevent="save">
                <div class="row">
                    <div class="col-md-6">
                        <BFormGroup label="Kode Cabang" label-for="code" class="mb-3">
                            <BFormInput size="sm" id="code" v-model="form.code" type="text" required />
                        </BFormGroup>
                        <BFormGroup label="Nama Cabang" label-for="name" class="mb-3">
                            <BFormInput size="sm" id="name" v-model="form.name" type="text" required />
                        </BFormGroup>
                        <BFormGroup label="Email" label-for="email" class="mb-3">
                            <BFormInput size="sm" id="email" v-model="form.email" type="email" required />
                        </BFormGroup>
                    </div>
                    <div class="col-md-6">
                        <BFormGroup label="Telepon" label-for="phone" class="mb-3">
                            <BFormInput size="sm" id="phone" v-model="form.phone" type="text" required />
                        </BFormGroup>
                        <BFormGroup label="Alamat" label-for="address" class="mb-3">
                            <BFormTextarea
                                id="address"
                                v-model="form.address"
                                rows="3"
                                size="sm"
                                required
                            />
                        </BFormGroup>
                        <BFormGroup label="Status" label-for="status" class="mb-3">
                            <div class="d-flex flex-wrap gap-3">
                                <BFormRadioGroup v-model="form.is_active" :options="status" value-field="id" text-field="name" />
                            </div>
                        </BFormGroup>
                    </div>
                </div>

                <div class="sx-modal-footer mt-3">
                    <div class="text-right d-flex justify-content-end gap-2">
                        <button type="button" class="btn btn-sm btn-outline-warning" style="font-size: 11px" @click="modalBranch = false">
                            <i class="bi bi-x-circle me-1"></i> Batal
                        </button>
                        <button type="submit" class="btn btn-sm btn-outline-success" style="font-size: 11px" :disabled="loading">
                            <i class="bi bi-save me-1"></i> Simpan
                        </button>
                    </div>
                </div>
            </BForm>
        </BModal>
    </div>
</template>
