export default [
    {
        path: '/homepage',
        name: 'homepage',
        component: () => import(`@/views/Theme/default/Index.vue`),
        meta: { layout: 'homepage', public: true, auth: false },
    },
    // {
    //     path: '/docs/:categorySlug?/:contentSlugChild?/:contentSlug?',
    //     name: 'documentation',
    //     component: () => import(`@/views/Theme/default/Documentation.vue`),
    //     meta: { layout: 'homepage', public: true, auth: false },
    // },
];
