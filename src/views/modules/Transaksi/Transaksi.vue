<script setup>
import { getCurrentInstance, ref, onMounted, reactive, computed, watch } from 'vue';
import { useStore } from '@/store';
import { useRouter } from 'vue-router';
import ItemsTransaction from './ItemsTransaction.vue';
import { PerfectScrollbar } from 'vue3-perfect-scrollbar';
import FormCustomer from './FormCustomer.vue';
import InvoicePrint from './InvoicePrint.vue';

const { proxy } = getCurrentInstance();
const router = useRouter();
const store = useStore();

const loading = ref(false);
const filter = ref('');
const perPage = ref(10);
const currentPage = ref(1);
const selected = ref([]);
const transaction = ref([]);
const itemsRented = ref([]);
const status = ref([]);
const statusPayment = ref([]);
const modalTransactions = ref(false);
const formInvoice = ref([]);
const itemTransaction = ref([]);
const customerList = ref([]);
const modalCustomer = ref(false);
const modalPrint = ref(false);
const items = ref([]);

const columns = [
    { key: 'no', label: 'No', sortable: false, tdClass: 'text-center', thClass: 'text-center', thStyle: { width: '50px' } },
    { key: 'id', label: 'ID', sortable: false, tdClass: 'text-center', thClass: 'text-center', thStyle: { width: '50px' } },
    { key: 'no_invoice', label: 'No Invoice', sortable: true },
    { key: 'status_payment', label: 'Status Pembayaran', sortable: false },
    { key: 'status_rental', label: 'Status Rental', sortable: false },
    { key: 'total_amount', label: 'Total', sortable: false, thClass: 'text-center' },
    { key: 'status', label: 'Status', sortable: false },
];

const selectedCustomer = computed(() => {
    if (!formInvoice.value || !formInvoice.value.customer_id) return null;
    return customerList.value.find((c) => String(c.id) === String(formInvoice.value.customer_id)) || null;
});

watch(
    () => modalTransactions,
    (val) => {}
);

const printInvoice = async (item) => {
    edit(item);
    if (item.status != 'confirmed') {
        proxy.$messageError(proxy, 'Failed', 'Invoice belum dikonfirmasi, silahkan konfirmasi terlebih dahulu. lalu simpan');
        return;
    }
    modalPrint.value = true;
};
const edit = async (item) => {
    loading.value = true;
    try {
        const response = await store.getData({
            url: `api/Invoice/getInvoiceById?id=${item.id}`,
        });
        if (response.data.status === 'success') {
            items.value = response.data.data.items_transaction;
            formInvoice.value = response.data.data.invoice;

            if (!formInvoice.value.date) {
                formInvoice.value.date = new Date().toISOString().split('T')[0];
                formInvoice.value.return_date = new Date().toISOString().split('T')[0];
            }

            modalTransactions.value = true;
        } else {
            proxy.$noticeAxios(proxy, response);
        }
    } catch (err) {
        proxy.$noticeAxios(proxy, err.response);
    } finally {
        loading.value = false;
    }
};

const add = async () => {
    loading.value = true;
    try {
        const response = await store.getData({
            url: `api/Invoice/getInvoice?t=rented`,
        });
        if (response.data.status === 'success') {
            formInvoice.value = response.data.data.invoice;
            itemTransaction.value = response.data.data.items_transaction;

            if (!formInvoice.value.date) {
                formInvoice.value.date = new Date().toISOString().split('T')[0];
                formInvoice.value.return_date = new Date().toISOString().split('T')[0];
            }

            modalTransactions.value = true;
            fetchData();
        } else {
            proxy.$noticeAxios(proxy, response);
        }
    } catch (err) {
        proxy.$noticeAxios(proxy, err.response);
    } finally {
        loading.value = false;
    }
};

const saveInvoice = async () => {
    const result = await proxy.$messageConfirmed(proxy, {
        title: 'Konfirmasi Invoice',
        text: 'Apakah Anda yakin ingin menyimpan data ini?',
        icon: 'question',
        buttons: [
            { text: 'Batal', variant: 'secondary' },
            { text: 'Hapus', variant: 'danger', action: () => true },
        ],
    });

    formInvoice.value.action_task = 'save_transaction';
    try {
        loading.value = true;
        if (result.isConfirmed) {
            const response = await store.postData({
                url: 'api/Invoice',
                params: formInvoice.value,
                headers: {
                    'Content-Type': 'application/json',
                },
                responseType: 'json',
            });
            if (response.data.status === 'success') {
                fetchData();
                edit(formInvoice.value);
                proxy.$messageSuccess(proxy, 'Success', response.data.message);
            }
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
                url: 'api/Invoice/' + selected.value,
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

const fetchDataCustomer = async () => {
    loading.value = true;
    try {
        const response = await store.getData({
            url: 'api/Customer',
        });
        if (response.data.status === 'success') {
            customerList.value = response.data.data.customer_list;
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
            url: `api/Transaksi?it=rented`,
        });
        if (response.data.status === 'success') {
            transaction.value = response.data.data.transaction;
            itemsRented.value = response.data.data.items;
            status.value = response.data.data.status;
            statusPayment.value = response.data.data.status_payment;
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
    fetchDataCustomer();
});
</script>
<template>
    <div class="wrapper">
        <div class="header-nav">
            <h3><i class="bi bi-layout-sidebar"></i> Trasaksi Penyewaan</h3>
        </div>
        <div class="toolbar-nav mb-3">
            <div class="row justify-content-between align-items-center">
                <div class="col-md-6">
                    <!-- <div class="mr-2 tool-icon card" @click="modalItem = true">
                        <i class="bi bi-file-earmark-plus"></i>
                    </div> -->
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
                <div class="col-md-3">
                    <BFormInput v-model="filter" size="sm" type="search" placeholder="Cari" />
                </div>
            </div>
        </div>
        <div class="page">
            <div class="card p-3">
                <div class="d-flex justify-content-end mb-3">
                    <button class="btn btn-sm btn-light border mr-2" @click="add"><i class="bi bi-plus"></i> Tambah Transaksi</button>
                </div>

                <div class="table-responsive border rounded-3 position-relative" style="min-height: 400px" id="printedArea">
                    <BTable striped hover :fields="columns" :items="transaction" :filter="filter" :per-page="perPage" :current-page="currentPage" @row-clicked="edit">
                        <template #cell(no)="data">
                            {{ (currentPage - 1) * perPage + data.index + 1 }}
                        </template>
                        <template #cell(id)="data">
                            <div class="text-center">
                                <BFormCheckbox v-model="selected" :value="data.item.id" unchecked-value="0"> </BFormCheckbox>
                            </div>
                        </template>
                        <template #cell(total_amount)="data">
                            <div class="text-center">
                                {{ $formatCurrency(data.item.total_amount) }}
                            </div>
                        </template>
                        <template #cell(status)="data">
                            <div>
                                <span v-if="data.item.status == 'draft'" class="badge bg-warning">{{ data.item.status }}</span>
                                <span v-if="data.item.status == 'confirmed'" class="badge bg-success">{{ data.item.status }}</span>
                                <span v-if="data.item.status == 'pending'" class="badge bg-info">{{ data.item.status }}</span>
                                <span v-if="data.item.status == 'canceled'" class="badge bg-danger">{{ data.item.status }}</span>
                            </div>
                        </template>
                    </BTable>
                    <b-overlay :show="loading" no-wrap></b-overlay>
                </div>
                <div class="d-flex justify-content-end mt-3">
                    <BPagination v-model="currentPage" :total-rows="transaction.length" :per-page="perPage" align="right" size="sm" />
                </div>
            </div>
        </div>

        <BModal v-model="modalTransactions" title="Transaksi" size="lg" no-header no-footer :no-close-on-backdrop="true">
            <BForm @submit.prevent="saveInvoice">
                <PerfectScrollbar style="max-height: 80vh" class="px-3 py-2">
                    <div class="row">
                        <div class="col-md-6">
                            <BFormGroup label="No. Invoice" label-for="no" class="mb-3">
                                <BFormInput size="sm" id="no" v-model="formInvoice.no_invoice" type="text" required />
                            </BFormGroup>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-6">
                            <BFormGroup label="Tanggal Penyewaan" label-for="no" class="mb-3">
                                <BFormInput size="sm" id="no" v-model="formInvoice.date" type="date" required />
                            </BFormGroup>
                        </div>
                        <div class="col-md-6">
                            <BFormGroup label="Tanggal Pengembalian" label-for="date" class="mb-3">
                                <BFormInput size="sm" id="date" v-model="formInvoice.return_date" type="date" required />
                            </BFormGroup>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-6">
                            <BFormGroup label="Status Invoice" label-for="no" class="mb-3">
                                <div class="d-flex flex-wrap gap-3">
                                    <BFormRadioGroup v-model="formInvoice.status" :options="status" value-field="id" text-field="name" />
                                </div>
                            </BFormGroup>
                        </div>
                        <div class="col-md-6">
                            <BFormGroup label="Status Pembayaran" label-for="no" class="mb-3">
                                <div class="d-flex flex-wrap gap-3">
                                    <BFormRadioGroup v-model="formInvoice.status_payment" :options="statusPayment" value-field="id" text-field="name" />
                                </div>
                            </BFormGroup>
                            <div v-if="formInvoice.status_payment == 'dp'" class="row">
                                <BFormGroup label="Ukuran DP" label-for="dp" class="mb-3">
                                    <BFormInput size="sm" id="dp" v-model="formInvoice.amount" type="text" v-rupiah required />
                                </BFormGroup>
                            </div>
                        </div>
                    </div>

                    <div class="section-title pointer" v-b-toggle.customer-collapse @click="formInvoice.customer_id != null">
                        <span>Pelanggan</span>
                    </div>

                    <BCollapse id="customer-collapse" class="mt-3 mb-5">
                        <div class="row align-items-end">
                            <div class="col-md-8">
                                <BFormGroup label="Nama Customer" label-for="customer_name" class="mb-3">
                                    <div class="input-group input-group-sm">
                                        <v-select :options="customerList" v-model="formInvoice.customer_id" label="name" :reduce="(option) => option.id" placeholder="Pilih Customer" class="flex-grow-1" />
                                        <button type="button" class="btn btn-sm btn-outline-primary d-flex align-items-center gap-1 px-2" @click="modalCustomer = true">
                                            <i class="bi bi-plus-circle"></i>
                                            <span class="d-none d-sm-inline fs-6">Tambah</span>
                                        </button>
                                    </div>
                                </BFormGroup>
                            </div>
                        </div>
                        <div v-if="selectedCustomer" class="mt-3">
                            <div class="card border rounded-3 shadow-sm">
                                <div class="card-body p-3">
                                    <div class="d-flex justify-content-between align-items-center mb-2">
                                        <h6 class="mb-0 fw-bold text-dark">
                                            <i class="bi bi-person-badge text-primary me-2"></i>
                                            {{ selectedCustomer.name }}
                                        </h6>
                                        <span class="badge px-2 py-1" :class="selectedCustomer.type === 'individual' ? 'bg-info text-light' : 'bg-secondary'">
                                            {{ selectedCustomer.type === 'individual' ? 'Pribadi' : 'Perusahaan' }}
                                        </span>
                                    </div>

                                    <hr class="my-2" />

                                    <div class="row small text-muted">
                                        <div class="col-md-6 mb-2">
                                            <i class="bi bi-telephone text-success me-2"></i>
                                            <span>{{ selectedCustomer.phone || '-' }}</span>
                                        </div>
                                        <div class="col-md-6 mb-2">
                                            <i class="bi bi-envelope text-danger me-2"></i>
                                            <span>{{ selectedCustomer.email || '-' }}</span>
                                        </div>
                                        <div class="col-12">
                                            <i class="bi bi-geo-alt text-warning me-2"></i>
                                            <span>{{ selectedCustomer.address || '-' }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </BCollapse>

                    <BModal v-model="modalCustomer" title="Customer" size="md" no-footer>
                        <FormCustomer @close="modalCustomer = false" @fetchDataCustomer="fetchDataCustomer" />
                    </BModal>

                    <ItemsTransaction v-if="modalTransactions" :invoice="formInvoice" :itemsRented="itemsRented" />
                </PerfectScrollbar>

                <div class="text-right d-flex justify-content-end gap-2 mt-5">
                    <button type="button" class="btn btn-sm btn-outline-primary" style="font-size: 11px" @click="printInvoice(formInvoice)"><i class="bi bi-printer"></i> Print</button>
                    <button type="button" class="btn btn-sm btn-outline-warning" style="font-size: 11px" @click="modalTransactions = false"><i class="bi bi-x-circle me-1"></i> Cancel</button>
                    <button type="submit" class="btn btn-sm btn-outline-success" style="font-size: 11px"><i class="bi bi-save me-1"></i> Save</button>
                </div>
            </BForm>

            <BModal v-if="modalTransactions" v-model="modalPrint" title="Preview Invoice" size="xl" no-header no-footer no-close-on-backdrop scrollable>
                <InvoicePrint :invoice="formInvoice" :items="items" :customer="selectedCustomer" />
                <div class="text-right d-flex justify-content-end gap-2 mt-5">
                    <button type="button" class="btn btn-sm btn-warning" style="font-size: 11px" @click="modalPrint = false"><i class="bi bi-x-circle me-1"></i> Batal</button>
                </div>
            </BModal>
        </BModal>
    </div>
</template>
<style scoped>
.section-title {
    width: 100%;
    text-align: center;
    border-bottom: 1px solid #ccc;
    line-height: 0.1em;
    margin: 20px 0 30px;
}

.section-title span {
    background: #fff;
    padding: 0 10px;
    color: #666;
    font-size: 14px;
}
</style>
