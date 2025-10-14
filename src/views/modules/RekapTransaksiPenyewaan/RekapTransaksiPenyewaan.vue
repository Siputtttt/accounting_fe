<script setup>
import { getCurrentInstance, ref, onMounted } from 'vue';
import { useStore } from '@/store';
import { useRouter } from 'vue-router';

const { proxy } = getCurrentInstance();
const router = useRouter();
const store = useStore();

const loading = ref(false);
const searchQuery = ref('');
const perPage = ref(10);
const currentPage = ref(1);
const transactions = ref([]);
const selected = ref([]);

const columns = [
    { key: 'no', label: 'No', sortable: false, tdClass: 'text-center', thClass: 'text-center', thStyle: { width: '50px' } },
    { key: 'name', label: 'Nama Item', sortable: true },
    { key: 'no_invoice', label: 'No. Invoice', sortable: true },
    { key: 'invoice_date', label: 'Tanggal Invoice', sortable: true },
    { key: 'return_date', label: 'Tanggal Pengembalian', sortable: true },
    { key: 'quantity', label: 'Jumlah', sortable: true },
    { key: 'amount', label: 'Total', sortable: true },
    { key: 'invoice_status', label: 'Status Invoice', sortable: true },
    { key: 'status_payment', label: 'Status Pembayaran', sortable: true }
];

const fetchData = async () => {
    loading.value = true;
    try {
        const response = await store.getData({
            url: `api/Transaksi/getTransaction?page=${currentPage.value}&search=${searchQuery.value}`,
        });
        if (response.data.status === 'success') {
            transactions.value = response.data.data.item_transactions;
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

const handleSearch = () => {
    currentPage.value = 1; // Reset ke halaman pertama saat mencari
    fetchData();
};

const translateStatus = (status) => {
    const statusMap = {
        confirmed: 'Dikonfirmasi',
        pending: 'Menunggu',
        cancelled: 'Dibatalkan',
    };
    return statusMap[status] || status;
};

const translatePaymentStatus = (status) => {
    const statusMap = {
        dp: 'Uang Muka',
        paid: 'Lunas',
        unpaid: 'Belum Bayar',
    };
    return statusMap[status] || status;
};

onMounted(() => {
    fetchData();
});
</script>
<template>
    <div class="wrapper">
        <div class="header-nav">
            <h3><i class="bi bi-layout-sidebar"></i> Daftar Transaksi Penyewaan</h3>
        </div>
        <div class="toolbar-nav mb-3">
            <div class="row gap-2 justify-content-between align-items-center">
                <div class="col-md-6">
                    <div class="tool-icon mr-2 card" @click="fetchData">
                        <i class="bi bi-arrow-clockwise"></i>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="d-flex gap-2">
                        <BFormInput 
                            v-model="searchQuery" 
                            size="sm" 
                            type="search" 
                            placeholder="Cari nomor invoice..." 
                            @keyup.enter="handleSearch"
                        />
                        <button 
                            class="btn btn-primary btn-sm" 
                            @click="handleSearch"
                            :disabled="loading"
                        >
                            <i class="bi bi-search me-1"></i>
                            Cari
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div class="page">
            <div class="card p-3">
                <div class="table-responsive border rounded-3 position-relative" style="min-height: 400px" id="printedArea">
                    <BTable striped hover :fields="columns" :items="transactions" :filter="filter" :per-page="perPage" :current-page="currentPage">
                        <template #cell(no)="data">
                            {{ (currentPage - 1) * perPage + data.index + 1 }}
                        </template>
                        <template #cell(invoice_date)="data">
                            {{ new Date(data.item.invoice_date).toLocaleDateString('id-ID') }}
                        </template>
                        <template #cell(return_date)="data">
                            {{ new Date(data.item.return_date).toLocaleDateString('id-ID') }}
                        </template>
                        <template #cell(amount)="data">
                            {{ proxy.$formatCurrency(data.item.amount) }}
                        </template>
                        <template #cell(invoice_status)="data">
                            <span
                                :class="[
                                    'badge',
                                    {
                                        'bg-success': data.item.invoice_status === 'confirmed',
                                        'bg-warning': data.item.invoice_status === 'pending',
                                        'bg-danger': data.item.invoice_status === 'cancelled',
                                    },
                                ]"
                            >
                                {{ translateStatus(data.item.invoice_status) }}
                            </span>
                        </template>
                        <template #cell(status_payment)="data">
                            <span
                                :class="[
                                    'badge',
                                    {
                                        'bg-warning': data.item.status_payment === 'pending',
                                        'bg-info': data.item.status_payment === 'dp',
                                        'bg-success': data.item.status_payment === 'paid',
                                        'bg-danger': data.item.status_payment === 'unpaid',
                                    },
                                ]"
                            >
                                {{ translatePaymentStatus(data.item.status_payment) }}
                            </span>
                        </template>
                    </BTable>
                    <b-overlay :show="loading" no-wrap></b-overlay>
                </div>
                <div class="d-flex justify-content-end mt-3">
                    <BPagination v-model="currentPage" :total-rows="transactions.length" :per-page="perPage" align="right" size="sm" />
                </div>
            </div>
        </div>
    </div>
</template>
