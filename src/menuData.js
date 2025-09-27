// src / menuData.js;
export default [
    {
        title: 'Dashboard',
        link: '/dashboard',
        icon: 'fa-solid fa-house',
    },
    {
        title: 'Management',
        icon: 'fa-solid fa-gear',
        children: [
            {
                title: 'Users',
                icon: 'fa-solid fa-users',
                children: [
                    {
                        title: 'List Users',
                        link: '/users/list',
                        icon: 'fa-solid fa-list',
                    },
                ],
            },
            {
                title: 'Roles',
                link: '/roles',
                icon: 'fa-solid fa-user-shield',
            },
        ],
    },

    {
        title: 'Settings',
        link: '/core/settings',
        icon: 'fa-solid fa-sliders',
    },
];
