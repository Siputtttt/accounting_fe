import { defineStore } from 'pinia';

export const useMessageStore = defineStore('message', {
    state: () => ({
        triggerSubmit: 0,
        triggerMinimize: false,
    }),
    actions: {
        reloadMenus() {
            this.triggerSubmit = Date.now();
        },
        triggerReset() {
            this.triggerSubmit = false;
        },
        toggleMinimize(val) {
            console.log(val);
            this.triggerMinimize = val;
        },
        resetToggleMinimize(val) {
            this.triggerMinimize = val;
        },
    },
});
