export default [
    {
        path: '/home',
        name: 'home',
        component: () => import(`@/views/Theme/elima/Index.vue`),
        meta: { layout: 'homepage', public: true, auth: false },
    },
    {
        path: '/docs',
        name: 'documentation',
        component: () => import(`@/views/Theme/elima/Docs.vue`),
        meta: { layout: 'homepage', public: true, auth: false },
    },
    {
        path: '/screenshoot',
        name: 'screenshoot',
        component: () => import(`@/views/Theme/elima/Screenshoot.vue`),
        meta: { layout: 'homepage', public: true, auth: false },
    },
];
