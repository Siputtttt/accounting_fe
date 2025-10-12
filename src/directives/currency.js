// directives/currency.js
export default {
    mounted(el, binding, vnode) {
        // Format awal kalau sudah ada nilai
        if (binding.value) {
            el.value = formatCurrency(binding.value);
        }

        el.addEventListener('input', (e) => {
            let raw = e.target.value.replace(/\D/g, '');
            if (!raw) raw = '0';

            const numericValue = parseInt(raw, 10);

            // Emit ke v-model sebagai integer
            el.dispatchEvent(
                new CustomEvent('update:modelValue', {
                    detail: numericValue,
                    bubbles: true, // penting biar naik ke Vue listener
                })
            );

            console.log('Emit update:modelValue:', numericValue, typeof numericValue);

            // Update tampilan input
            e.target.value = formatCurrency(numericValue);
        });
    },

    updated(el, binding) {
        // Kalau value dari luar berubah (misalnya reset form)
        if (binding.value = binding.oldValue) {
            el.value = binding.value ? 'Rp ' + binding.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') : '';
        }
    },
};

function formatCurrency(value) {
    if (!value) return 'Rp 0';
    return 'Rp ' + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}
