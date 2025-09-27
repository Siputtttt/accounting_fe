import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import { createBootstrap } from 'bootstrap-vue-next';
import VueSweetalert2 from 'vue-sweetalert2';
import vSelect from 'vue-select';
import sximoHelpers from './util/sximo';
import { useStore } from '@/store';

const components = import.meta.glob('./components/cruds/*.vue', {
    eager: true,
});

import 'vuefinder/dist/style.css';
import VueFinder from 'vuefinder/dist/vuefinder';

import 'vue-select/dist/vue-select.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle.js';
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '@fortawesome/fontawesome-free/css/all.css';
import 'sweetalert2/dist/sweetalert2.min.css';
import './assets/main.css';
import './assets/font.css';

const app = createApp(App);
const pinia = createPinia();
app.use(pinia);
app.use(createBootstrap());
app.use(VueSweetalert2);
app.use(sximoHelpers);
app.use(VueFinder);
app.component('v-select', vSelect);

for (const path in components) {
    const component = components[path].default;
    const name = path
        .split('/')
        .pop()
        .replace(/\.\w+$/, ''); // hapus .vue
    app.component(name, component);
}
//app.mount('#app');

const store = useStore();
async function preloadInfo() {
    try {
        const response = await store.getData({
            url: 'api/info',
            headers: { 'Content-Type': 'application/json' },
            responseType: 'json',
        });

        const info = response.data.data;
        localStorage.setItem('info', JSON.stringify(info));
    } catch (error) {
        console.error('Gagal preload info:', error);
    }
}

preloadInfo().then(async () => {
    const router = (await import('@/router')).default;
    app.use(router);
    app.mount('#app');

    const loader = document.getElementById('loader');
    const appRoot = document.getElementById('app');
    if (loader && appRoot) {
        loader.style.display = 'none';
        appRoot.style.display = 'block';
    }
});
