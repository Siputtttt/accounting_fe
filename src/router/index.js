import { createRouter, createWebHistory } from 'vue-router';
import { useStore } from '@/store';
import moduleRoutes from './module';
import customRoutes from './custom';
import coreRoutes from './core';
import themeRoutes from '@/views/Theme/elima/route';
import defaultRoutes from '@/views/Theme/default/route';

const routes = [...moduleRoutes, ...customRoutes, ...coreRoutes, ...themeRoutes, ...defaultRoutes];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
    linkActiveClass: 'active',
    linkExactActiveClass: 'exact-active',
});

router.beforeEach((to, from, next) => {
    const store = useStore();
    const token = store.token;

    const info = localStorage.getItem('info') ? JSON.parse(localStorage.getItem('info')) : null;

    if (to.path === '/homepage' && info?.frontend === 'false') {
        return next({ path: '/auth/login' });
    }

    if (to.path === '/auth/register' && info?.registration === 'false') {
        return next({ path: '/auth/login' });
    }

    const resetEmail = localStorage.getItem('reset_email');
    const otpToken = localStorage.getItem('otp_token');

    if (to.name === 'otp' && !resetEmail) {
        return next({ name: 'forgot-password' });
    }

    if (to.name === 'new-password' && (!resetEmail || !otpToken)) {
        return next({ name: 'otp' });
    }

    if (to.matched.some((record) => record.meta.auth)) {
        if (!token) {
            return next({ path: '/auth/login' });
        } else {
            return next();
        }
    }

    if (to.path === '/auth/login' && token) {
        return next({ path: '/dashboard' });
    }

    next();
});

export default router;
