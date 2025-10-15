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
const users = ref([]);
const selected = ref([]);
const modalUser = ref(false);
const branches = ref([]);
const groups = ref([]);

const status = ref([
    { id: '0', name: 'Tidak Aktif' },
    { id: '1', name: 'Aktif' },
    { id: '2', name: 'Belum Aktif' },
]);

const form = ref({
    id: '',
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    group_id: '', 
    branch_id: '',
    active: 1,
    password: '',
    password_confirmation: '',
});

const columns = [
    { key: 'no', label: 'No', sortable: false, tdClass: 'text-center', thClass: 'text-center', thStyle: { width: '50px' } },
    { key: 'id', label: 'ID', sortable: false, tdClass: 'text-center', thClass: 'text-center', thStyle: { width: '50px' } },
    { key: 'username', label: 'Username', sortable: true },
    { key: 'full_name', label: 'Nama Lengkap', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'group_name', label: 'Group', sortable: true },
    { key: 'branch_name', label: 'Cabang', sortable: true },
    { key: 'active', label: 'Status', sortable: true },
];

const edit = (item) => {
    
    form.value = {
        id: item.id,
        username: item.username,
        first_name: item.first_name,
        last_name: item.last_name,
        email: item.email,
        group_id: item.group_id || '',
        branch_id: item.branch_id,
        active: item.active,
        password: '',
        password_confirmation: '',
    };
    modalUser.value = true;
};

const save = async () => {
    loading.value = true;
    try {
        const response = await store.postData({
            url: 'api/UserManagement',
            params: form.value,
            headers: {
                'Content-Type': 'application/json',
            },
            responseType: 'json',
        });
        if (response.data.status === 'success') {
            fetchData();
            proxy.$messageSuccess(proxy, 'Success', response.data.message);
            modalUser.value = false;
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
        username: '',
        first_name: '',
        last_name: '',
        email: '',
        group_id: '',
        branch_id: '',
        active: 1,
        password: '',
        password_confirmation: '',
    };
    modalUser.value = false;
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
                url: 'api/UserManagement/' + selected.value,
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
            url: 'api/UserManagement',
        });
        if (response.data.status === 'success') {
            groups.value = response.data.data.groups;
            branches.value = response.data.data.branches;
            users.value = response.data.data.users.map((user) => ({
                ...user,
                full_name: `${user.first_name} ${user.last_name}`.trim(),
            }));
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
            <h3><i class="bi bi-people"></i> Manajemen User</h3>
        </div>
        <div class="toolbar-nav mb-3">
            <div class="row justify-content-between align-items-center">
                <div class="col-md-6">
                    <div class="mr-2 tool-icon card" @click="modalUser = true">
                        <i class="bi bi-person-plus"></i>
                    </div>
                    <div class="tool-icon mr-2 card" @click="fetchData">
                        <i class="bi bi-arrow-clockwise"></i>
                    </div>
                    <div v-if="selected.length > 0" class="mr-2 tool-icon card" @click="removeById">
                        <i class="bi bi-trash3"></i>
                    </div>
                </div>
                <div class="col-md-3">
                    <BFormInput v-model="filter" size="sm" type="search" placeholder="Cari..." />
                </div>
            </div>
        </div>
        <div class="page">
            <div class="card p-3">
                <div class="table-responsive border rounded-3 position-relative" style="min-height: 400px" id="printedArea">
                    <BTable striped hover :fields="columns" :items="users" :filter="filter" :per-page="perPage" :current-page="currentPage" @row-clicked="edit">
                        <template #cell(no)="data">
                            {{ (currentPage - 1) * perPage + data.index + 1 }}
                        </template>
                        <template #cell(active)="data">
                            <span :class="['badge', data.item.active === '1' ? 'bg-success' : 'bg-danger']">
                                {{ data.item.active === '1' ? 'Aktif' : 'Tidak Aktif' }}
                            </span>
                        </template>
                        <template #cell(branch_name)="data">
                            <span v-if="data.item.branch_name">{{ data.item.branch_name }}</span>
                            <span v-else class="text-muted">-</span>
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
                    <BPagination v-model="currentPage" :total-rows="users.length" :per-page="perPage" align="right" size="sm" />
                </div>
            </div>
        </div>

        <BModal v-model="modalUser" :title="form.id ? 'Edit User' : 'Tambah User'" size="lg" no-footer :no-close-on-backdrop="true" @hide="reset">
            <BForm @submit.prevent="save">
                <div class="row">
                    <div class="col-md-6">
                        <BFormGroup label="Username" label-for="username" class="mb-3">
                            <BFormInput size="sm" id="username" v-model="form.username" type="text" required />
                        </BFormGroup>
                        <BFormGroup label="Nama Depan" label-for="first_name" class="mb-3">
                            <BFormInput size="sm" id="first_name" v-model="form.first_name" type="text" required />
                        </BFormGroup>
                        <BFormGroup label="Nama Belakang" label-for="last_name" class="mb-3">
                            <BFormInput size="sm" id="last_name" v-model="form.last_name" type="text" />
                        </BFormGroup>
                        <BFormGroup label="Email" label-for="email" class="mb-3">
                            <BFormInput size="sm" id="email" v-model="form.email" type="email" required />
                        </BFormGroup>
                    </div>
                    <div class="col-md-6">
                        <BFormGroup label="Group" label-for="group" class="mb-3">
                            <BFormSelect size="sm" id="group" v-model="form.group_id" required>
                                <option value="">Pilih Group</option>
                                <option v-for="group in groups" :key="group.group_id" :value="group.group_id">
                                    {{ group.name }}
                                </option>
                            </BFormSelect>
                        </BFormGroup>
                        <BFormGroup label="Cabang" label-for="branch" class="mb-3">
                            <BFormSelect size="sm" id="branch" v-model="form.branch_id">
                                <option value="">Pilih Cabang</option>
                                <option v-for="branch in branches" :key="branch.id" :value="branch.id">
                                    {{ branch.name }}
                                </option>
                            </BFormSelect>
                        </BFormGroup>
                        <BFormGroup label="Status" label-for="status" class="mb-3">
                            <div class="d-flex flex-wrap gap-3">
                                <BFormRadioGroup v-model="form.active" :options="status" value-field="id" text-field="name" />
                            </div>
                        </BFormGroup>
                        <template v-if="!form.id">
                            <BFormGroup label="Password" label-for="password" class="mb-3">
                                <BFormInput size="sm" id="password" v-model="form.password" type="password" :required="!form.id" />
                            </BFormGroup>
                            <BFormGroup label="Konfirmasi Password" label-for="password_confirmation" class="mb-3">
                                <BFormInput size="sm" id="password_confirmation" v-model="form.password_confirmation" type="password" :required="!form.id" />
                            </BFormGroup>
                        </template>
                    </div>
                </div>

                <div class="sx-modal-footer mt-3">
                    <div class="text-right d-flex justify-content-end gap-2">
                        <button type="button" class="btn btn-sm btn-outline-warning" style="font-size: 11px" @click="modalUser = false"><i class="bi bi-x-circle me-1"></i> Batal</button>
                        <button type="submit" class="btn btn-sm btn-outline-success" style="font-size: 11px" :disabled="loading"><i class="bi bi-save me-1"></i> Simpan</button>
                    </div>
                </div>
            </BForm>
        </BModal>
    </div>
</template>
