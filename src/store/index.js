import { defineStore } from 'pinia';
import router from '../router';
import axios from 'axios';

export const useStore = defineStore('main', {
    state: () => ({
        token: localStorage.getItem('token') || sessionStorage.getItem('token'),
        profile: JSON.parse(localStorage.getItem('profile') || sessionStorage.getItem('profile')),
        baseUrl: 'http://127.0.0.1:8000/',
        // baseUrl: "http://203.194.113.219/srv/sximov7/",
    }),

    actions: {
        async getData({ url, config }) {
            const endpoint = this.baseUrl + url;
            const options = {
                ...this.getAuthHeaders(),
                ...config,
            };

            try {
                return await axios.get(endpoint, options);
            } catch (error) {
                this.handleError(error);
                throw error;
            }
        },

        async postData({ url, params }, config = {}) {
            const endpoint = this.baseUrl + url;
            const payload = params;
            let options = config;
            options.headers = {
                ...options.headers,
                ...this.getAuthHeaders().headers,
            };

            try {
                return await axios.post(endpoint, payload, options);
            } catch (error) {
                this.handleError(error);
                throw error;
            }
        },

        async putData({ url, params }) {
            const endpoint = this.baseUrl + url;
            const options = this.getAuthHeaders();
            let payload = params;
            try {
                if (payload instanceof FormData) {
                    payload.append('_method', 'PUT');
                } else {
                    payload = { ...payload, _method: 'PUT' };
                }
                return await axios.post(endpoint, payload, options);
            } catch (error) {
                this.handleError(error);
                throw error;
            }
        },

        async deleteData({ url, config }) {
            const _url = this.baseUrl + url;
            const _config = {
                ...this.getAuthHeaders(),
                ...config,
            };

            try {
                return await axios.delete(_url, _config);
            } catch (error) {
                this.handleError(error);
                throw error;
            }
        },

        getAuthHeaders() {
            return {
                headers: {
                    Authorization: 'Bearer ' + this.token,
                },
            };
        },

        handleError(error) {
            if (error.response && error.response.status === 401) {
                this.logout();
            } else {
                console.error('API Error:', error);
            }
        },

        setUser(profile, rememberMe = false) {
            this.profile = profile;
            const storage = rememberMe ? localStorage : sessionStorage;
            storage.setItem('profile', JSON.stringify(profile));
        },

        setToken(token, rememberMe = false) {
            this.token = token;
            const storage = rememberMe ? localStorage : sessionStorage;
            storage.setItem('token', token);
        },

        logout() {
            this.clearUserData();
            router.push('/auth/login');
        },

        clearUserData() {
            this.token = null;
            this.profile = null;
            localStorage.removeItem('token');
            localStorage.removeItem('profile');
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('profile');
        },
    },
});
