 export default [ 
 {
    path: '/Album',
    name: 'Album',
    component: () => import(`@/views/modules/Album/Album.vue`),
    meta: { layout: 'dashboard', public: true, auth: false },
},

 {
    path: '/Photo',
    name: 'Photo',
    component: () => import(`@/views/modules/Photo/Photo.vue`),
    meta: { layout: 'dashboard', public: true, auth: false },
},

 {
    path: '/eselon',
    name: 'eselon',
    component: () => import(`@/views/modules/eselon/Eselon.vue`),
    meta: { layout: 'dashboard', public: true, auth: false },
},
 ] 