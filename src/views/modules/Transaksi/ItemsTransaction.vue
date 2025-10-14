<script setup>
import { getCurrentInstance, defineProps, toRef, ref, onMounted, reactive, computed } from 'vue';
import { useStore } from '@/store';

const { proxy } = getCurrentInstance();
const props = defineProps(['invoice', 'itemsRented']);
const store = useStore();

const loading = ref(false);
const filter = ref('');
const perPage = ref(10);
const currentPage = ref(1);
const selected = ref([]);
const modalItem = ref(false);
const item = ref([]);
const itemRented = toRef(props, 'itemsRented');

const form = ref({
    action_task: 'save_item_rented',
    id: '',
    invoice_id: props.invoice.id,
    item_id: '',
    quantity: '',
});

const columnsItems = [
    { key: 'no', label: 'No', sortable: false, tdClass: 'text-center', thClass: 'text-center', thStyle: { width: '50px' } },
    { key: 'id', label: 'ID', sortable: false, tdClass: 'text-center', thClass: 'text-center', thStyle: { width: '50px' } },
    { key: 'name', label: 'Nama Item', sortable: true },
    { key: 'price', label: 'Harga', sortable: true, tdClass: 'text-center', thClass: 'text-center' },
    { key: 'quantity', label: 'Jumlah', sortable: true, tdClass: 'text-center', thClass: 'text-center' },
    { key: 'amount', label: 'Total', sortable: true, tdClass: 'text-center', thClass: 'text-center' },
];

const totalAmount = computed(() => {
    return item.value.reduce((acc, cur) => acc + (parseFloat(cur.amount) || 0), 0);
});

const addItem = () => {
    form.value = {
        action_task: 'save_item_rented',
        id: '',
        invoice_id: props.invoice.id,
        item_id: '',
        quantity: '',
    };
    modalItem.value = true;
};

const edit = (item) => {
    form.value = {
        action_task: 'save_item_rented',
        id: item.id,
        invoice_id: props.invoice.id,
        item_id: item.item_id,
        quantity: item.quantity,
    };
    modalItem.value = true;
};
const saveItem = async () => {
    loading.value = true;

    try {
        const response = await store.postData({
            url: 'api/Transaksi',
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
                url: 'api/Transaksi/' + selected.value,
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
            url: 'api/Transaksi/getItems?id=' + props.invoice.id,
        });
        if (response.data.status === 'success') {
            item.value = response.data.data.items_transaction;

            proxy.$messageSuccess(proxy, 'Success', response.data.message);
            modalItem.value = false;
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
    <div class="toolbar-nav border-0">
        <div class="row justify-content-between align-items-center gap-2">
            <div class="col-md-6 d-flex align-items-center gap-3">
                <button type="button" class="btn btn-sm btn-light border" @click="addItem"><i class="bi bi-plus"></i> Tambah Item</button>
                <button type="button" class="btn btn-sm btn-light border" @click="fetchData">
                    <i class="bi bi-arrow-clockwise"></i>
                </button>
                <button type="button" class="btn btn-sm btn-light border" @click="removeById">
                    <i class="bi bi-trash3"></i>
                </button>
            </div>
            <div class="col-md-3">
                <BFormInput v-model="filter" size="sm" type="search" placeholder="Cari" />
            </div>
        </div>
    </div>

    <div class="table-responsive border rounded-3 position-relative" style="min-height: 400px" id="printedArea">
        <BTable striped hover :fields="columnsItems" :items="item" :filter="filter" :per-page="perPage" :current-page="currentPage" @row-clicked="edit">
            <template #cell(no)="data">
                {{ (currentPage - 1) * perPage + data.index + 1 }}
            </template>
            <template #cell(id)="data">
                <div class="text-center">
                    <BFormCheckbox v-model="selected" :value="data.item.id" unchecked-value="0"> </BFormCheckbox>
                </div>
            </template>
            <template #cell(price)="data">
                <div class="text-center">
                    {{ $formatCurrency(data.item.price) }}
                </div>
            </template>
            <template #cell(amount)="data">
                <div class="text-center">
                    {{ $formatCurrency(data.item.amount) }}
                </div>
            </template>
        </BTable>
        <b-overlay :show="loading" no-wrap></b-overlay>
    </div>
    <div class="d-flex justify-content-end mt-3">
        <BPagination v-model="currentPage" :total-rows="item.length" :per-page="perPage" align="right" size="sm" />
    </div>
    <div class="d-flex justify-content-end mt-2 pe-3">
        <strong>Total: {{ $formatCurrency(totalAmount) }}</strong>
    </div>

    <BModal v-model="modalItem" title="Transaksi" size="md" no-header no-footer :no-close-on-backdrop="true">
        <BForm @submit.prevent="saveItem">
            <BFormGroup label="Item" label-for="no" class="mb-3">
                <v-select :options="itemRented" v-model="form.item_id" label="name" :reduce="(option) => option.id" placeholder="Pilih Item" size="sm">
                    <template #option="{ name, units, units_label, price }"> {{ name }} - {{ units_label }} (Rp {{ price }}) </template>
                </v-select>
            </BFormGroup>
            <BFormGroup label="Jumlah" label-for="no" class="mb-3">
                <BFormInput size="sm" id="no" v-model="form.quantity" type="number" required />
            </BFormGroup>
            <div class="text-right d-flex justify-content-end gap-2 mt-5">
                <button type="button" class="btn btn-sm btn-outline-warning" style="font-size: 11px" @click="modalItem = false"><i class="bi bi-x-circle me-1"></i> Batal</button>
                <button type="submit" class="btn btn-sm btn-outline-success" style="font-size: 11px"><i class="bi bi-save me-1"></i> Simpan</button>
            </div>
        </BForm>
    </BModal>
</template>
