 export default [ 
 {
    path: '/Customer',
    name: 'Customer',
    component: () => import(`@/views/modules/Customer/Customer.vue`),
    meta: { layout: 'dashboard', public: true, auth: false },
},

 {
    path: '/Item',
    name: 'Item',
    component: () => import(`@/views/modules/Item/Item.vue`),
    meta: { layout: 'dashboard', public: true, auth: false },
},

 {
    path: '/Invoice',
    name: 'Invoice',
    component: () => import(`@/views/modules/Invoice/Invoice.vue`),
    meta: { layout: 'dashboard', public: true, auth: false },
},

 {
    path: '/Transaksi',
    name: 'Transaksi',
    component: () => import(`@/views/modules/Transaksi/Transaksi.vue`),
    meta: { layout: 'dashboard', public: true, auth: false },
},
 ] 