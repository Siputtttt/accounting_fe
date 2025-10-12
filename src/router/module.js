 export default [ 
 {
    path: '/Penyewaan',
    name: 'Penyewaan',
    component: () => import(`@/views/modules/Penyewaan/Penyewaan.vue`),
    meta: { layout: 'dashboard', public: true, auth: false },
},

 {
    path: '/TransaksiPenyewaan',
    name: 'TransaksiPenyewaan',
    component: () => import(`@/views/modules/TransaksiPenyewaan/TransaksiPenyewaan.vue`),
    meta: { layout: 'dashboard', public: true, auth: false },
},

 {
    path: '/Customer',
    name: 'Customer',
    component: () => import(`@/views/modules/Customer/Customer.vue`),
    meta: { layout: 'dashboard', public: true, auth: false },
},
 ] 