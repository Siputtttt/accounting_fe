export default [
    {
        path: '/LaporanPenyewaan',
        name: 'LaporanPenyewaan',
        component: () => import(`@/views/modules/RekapTransaksiPenyewaan/RekapTransaksiPenyewaan.vue`),
        meta: { layout: 'dashboard', public: true, auth: false },
    },
];
