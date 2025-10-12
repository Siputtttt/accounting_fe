<script setup>
import { defineProps, computed } from 'vue';
import { inAWordCurrency } from '@/util/helper';

const props = defineProps({
    invoice: Object,
    items: Array,
});

const totalAmount = computed(() => {
    return props.items.reduce((acc, cur) => acc + (parseFloat(cur.amount) || 0), 0);
});

const printInvoice = () => {
    const printContent = document.getElementById('printArea').innerHTML;
    const printWindow = window.open('', '', 'width=900,height=650');
    printWindow.document.write(`
    <html>
      <head>
        <title>Invoice #${props.invoice.no_invoice}</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 13px; padding: 20px; }
          .header { display: flex; justify-content: space-between; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px; }
          .fw-bold { font-weight: bold; }
          .table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          .table th, .table td { border: 1px solid #000; padding: 6px; }
          .table th { background: #f8f9fa; }
          .text-end { text-align: right; }
          .text-center { text-align: center; }
          .status { font-size: 20px; font-weight: bold; padding: 8px 15px; border: 2px solid #000; display: inline-block; margin-top: 10px; }
          .paid { color: green; border-color: green; }
          .unpaid { color: red; border-color: red; }
        </style>
      </head>
      <body>
        ${printContent}
      </body>
    </html>
  `);
    printWindow.document.close();
    printWindow.print();
};
</script>

<template>
    <div id="printArea">
        <!-- Header -->
        <table style="width: 100%; margin-bottom: 10px">
            <tr>
                <td style="padding: 5px">
                    <div class="fw-bold">GREEN HILL PARK</div>
                    <div>Jl. Ciwidey, Patengan</div>
                </td>
                <td style="text-align: right; padding: 5px">
                    Cimanggu, {{ new Date(props.invoice.date).toLocaleDateString() }}<br />
                    Kepada Yth,
                </td>
            </tr>
            <tr>
                <td colspan="2" style="padding: 5px; text-align: right">
                    No.Nota : <span class="fw-bold">{{ props.invoice.no_invoice }}</span>
                </td>
            </tr>
        </table>

        <!-- Status Pembayaran -->
        <div class="text-end">
            <span class="status" :class="props.invoice.status_payment === 'paid' ? 'paid' : 'unpaid'">
                {{ props.invoice.status_payment === 'paid' ? 'LUNAS' : 'BELUM LUNAS' }}
            </span>
        </div>

        <!-- Table Item -->
        <table class="table">
            <thead>
                <tr>
                    <th>No</th>
                    <th>Nama Item</th>
                    <th class="text-center">Jumlah</th>
                    <th class="text-end">Harga</th>
                    <th class="text-end">Total</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(row, i) in items" :key="row.id">
                    <td>{{ i + 1 }}</td>
                    <td>{{ row.name }}</td>
                    <td class="text-center">{{ row.quantity }}</td>
                    <td class="text-end">{{ $formatCurrency(row.price) }}</td>
                    <td class="text-end">{{ $formatCurrency(row.amount) }}</td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <th colspan="4" class="text-end">Total</th>
                    <th class="text-end">{{ $formatCurrency(totalAmount) }}</th>
                </tr>
            </tfoot>
        </table>

        <!-- Terbilang -->
        <div style="margin-top: 8px; font-style: italic">Terbilang : {{ inAWordCurrency(totalAmount) }} Rupiah</div>

        <!-- Tanda Tangan -->
        <table style="width: 100%; margin-top: 30px; border: none">
            <tr>
                <td style="text-align: left">Tanda Terima</td>
                <td style="text-align: right">Hormat Kami,</td>
            </tr>
        </table>

        <!-- Footer -->
        <div class="text-center" style="margin-top: 30px">
            <p>Terima kasih atas kepercayaan Anda.</p>
            <p class="small text-muted">Invoice ini dicetak otomatis, sah tanpa tanda tangan.</p>
        </div>
    </div>

    <!-- Tombol Print -->
    <div class="mt-3 text-end">
        <button class="btn btn-sm btn-outline-primary" @click="printInvoice"><i class="bi bi-printer"></i> Print</button>
    </div>
</template>
