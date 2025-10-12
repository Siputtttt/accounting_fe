<script setup>
import { getCurrentInstance, ref, onMounted, reactive, watch } from 'vue';
import { useStore } from '@/store';
import { useRouter } from 'vue-router';

const { proxy } = getCurrentInstance();
const router = useRouter();
const store = useStore();

const loading = ref(false);
const filter = ref('');
const perPage = ref(10);
const currentPage = ref(1);
const itemRented = ref([]);
const unitsLabel = ref([]);
const selected = ref([]);
const modalItem = ref(false);

const form = ref({
    action_task: 'save_items',
    id: '',
    name: '',
    units: '',
    units_label: 'harian',
    price: '',
});

const columns = [
    { key: 'no', label: 'No', sortable: false, tdClass: 'text-center', thClass: 'text-center', thStyle: { width: '50px' } },
    { key: 'id', label: 'ID', sortable: false, tdClass: 'text-center', thClass: 'text-center', thStyle: { width: '50px' } },
    { key: 'name', label: 'Nama Item', sortable: true },
    { key: 'units', label: 'Unit', sortable: true },
    { key: 'price', label: 'Harga Sewa', sortable: true },
    { key: 'amount', label: 'Total', sortable: true },
    // { key: 'action', label: 'Aksi', sortable: false },
];

const edit = (item) => {
    form.value = {
        action_task: 'save_items',
        id: item.id,
        name: item.name,
        units: item.units,
        price: proxy.$formatCurrency(item.price),
        units_label: item.units_label,
    };
    modalItem.value = true;
};

const save = async () => {
    loading.value = true;

	form.value.price = parseInt(form.value.price.replace(/\D/g, "")) || 0;
    try {
        const response = await store.postData({
            url: 'api/Penyewaan',
            params: form.value,
            headers: {
                'Content-Type': 'application/json',
            },
            responseType: 'json',
        });
        if (response.data.status === 'success') {
            fetchData();
            proxy.$messageSuccess(proxy, 'Success', response.data.message);
            modalItem.value = false;
        }
    } catch (err) {
        proxy.$noticeAxios(proxy, err.response);
    } finally {
        loading.value = false;
    }
};
const reset = () => {
    form.value = {
        action_task: 'save_items',
        id: '',
        name: '',
        units: '',
        units_label: 'harian',
        price: '',
    };
    modalItem.value = false;
};

const removeById = async (event) => {
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
                url: 'api/Penyewaan/' + selected.value,
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
            url: `api/Penyewaan`,
        });
        if (response.data.status === 'success') {
            itemRented.value = response.data.data.item_rented;
            unitsLabel.value = response.data.data.units_label;
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
            <h3><i class="bi bi-layout-sidebar"></i> Item Penyewaan</h3>
        </div>
        <div class="toolbar-nav mb-3">
            <div class="row justify-content-between align-items-center">
                <div class="col-md-6">
                    <div class="mr-2 tool-icon card" @click="modalItem = true">
                        <i class="bi bi-file-earmark-plus"></i>
                    </div>
                    <div class="tool-icon mr-2 card" @click="fetchData">
                        <i class="bi bi-arrow-clockwise"></i>
                    </div>
                    <div v-if="selected.length > 0" class="mr-2 tool-icon card" @click="removeById">
                        <i class="bi bi-trash3"></i>
                    </div>
                </div>
                <!-- <div class="col-md-3">
					<BFormCheckbox v-if="access.is_edit == '1'" v-model="is_edit" value="1" unchecked-value="0">Enable
						Edit Mode </BFormCheckbox>
				</div> -->
                <!-- <div class="col-md-3">
                    <BFormInput
                        v-model="filter"
                        size="sm"
                        type="search"
                        placeholder="Type to Search"
                    />
                </div> -->
            </div>
        </div>
        <div class="page">
            <div class="card p-3">
                <div class="table-responsive border rounded-3 position-relative" style="min-height: 400px" id="printedArea">
                    <BTable striped hover :fields="columns" :items="itemRented" :filter="filter" :per-page="perPage" :current-page="currentPage" @row-clicked="edit">
                        <template #cell(no)="data">
                            {{ (currentPage - 1) * perPage + data.index + 1 }}
                        </template>
                        <template #cell(name)="data">
                            {{ data.item.name }} <span class="text-muted" style="font-size: 8px">({{ data.item.units_label }})</span>
                        </template>
                        <template #cell(price)="data">
                            {{ $formatCurrency(data.item.price) }}
                        </template>
                        <template #cell(amount)="data">
                            {{ $formatCurrency(data.item.amount) }}
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
                    <BPagination v-model="currentPage" :total-rows="itemRented.length" :per-page="perPage" align="right" size="sm" />
                </div>
            </div>
        </div>
        <BModal v-model="modalItem" title="Form Merek Kendaraan" size="md" no-footer :no-close-on-backdrop="true" @hide="reset">
            <BForm @submit.prevent="save">
                <BFormGroup label="Nama" label-for="name" class="mb-3">
                    <BFormInput size="sm" id="name" v-model="form.name" type="text" required />
                </BFormGroup>
                <BFormGroup label="Unit" label-for="units" class="mb-3">
                    <BFormInput size="sm" id="units" v-model="form.units" type="number" required />
                </BFormGroup>
                <BFormGroup label="Harga Sewa" label-for="price" class="mb-3">
                    <BFormInput size="sm" id="price" v-model="form.price" v-rupiah required />
                </BFormGroup>
                <BFormGroup label="Satuan" label-for="satuan" class="mb-3">
                    <BFormSelect size="sm" class="mt-3" v-model="form.units_label">
                        <option v-for="(label, key) in unitsLabel" :key="key" :value="key" v-selected="key == form.units_label">
                            {{ label }}
                        </option>
                    </BFormSelect>
                </BFormGroup>

                <div class="sx-modal-footer mt-5">
                    <div class="text-right d-flex justify-content-end gap-2">
                        <button type="button" class="btn btn-sm btn-outline-warning" style="font-size: 11px" @click="modalItem = false"><i class="bi bi-x-circle me-1"></i> Cancel</button>

                        <button type="submit" class="btn btn-sm btn-outline-success" style="font-size: 11px"><i class="bi bi-save me-1"></i> Save</button>
                    </div>
                </div>
            </BForm>
        </BModal>
    </div>
</template>
