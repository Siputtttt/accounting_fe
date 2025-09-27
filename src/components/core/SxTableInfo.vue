<script setup>
import { ref, getCurrentInstance } from 'vue'
import { useStore } from "@/store";

const emit = defineEmits(['onDeleteSuccess', 'onDeleteField', 'onSaveField']);
const props = defineProps({
    tableData: {
        type: Object,
        default: () => ({ table_info: {}, columns: [] }),
    },
    typeData: {
        type: Array,
        default: () => [],
    },
    storageEngine: {
        type: Array,
        default: () => [],
    }
})
const { proxy } = getCurrentInstance();
const store = useStore();
const loading = ref(false);
const form = ref({});
const modal = ref(false);
const data_edit = ref({});

const copyToClipboard = () => {
    if (props.tableData?.table_info?.create_table) {
        navigator.clipboard.writeText(props.tableData.table_info.create_table)
            .then(() => {
                proxy.$messageSuccess(proxy, "Success", "Code copied to clipboard");
            })
            .catch(err => {
                proxy.$messageError(proxy, "Error", "Failed to copy code to clipboard");
            })
    }
}

const deleteTable = async () => {
    loading.value = true;
    form.value.table_name = props.tableData.table_info.table_name;
    form.value.action_task = "delete";

    const result = await proxy.$swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
    });
    if (result.isConfirmed) {
        const response = await store.postData({
            url: `api/core/database`,
            params: form.value,
            headers: {
                "Content-Type": "application/json",
            },
            responseType: "json",
        });
        if (response.data.status === 1) {
            loading.value = false;
            emit('onDeleteSuccess');
            proxy.$messageSuccess(proxy, "Success", response.data.message);
        }
    } else {
        proxy.$swal.fire({
            icon: "error",
            title: "Failed",
            text: response.data.message,
            toast: true,
            position: "top-end",
            timer: 3000,
            showConfirmButton: false,
            timerProgressBar: true,
        });
    }
    loading.value = false;
}

const addField = async () => {
    data_edit.value = {
        table: props.tableData.table_info.table_name,
        Field: '',
        field_type: '',
        field_length: '',
        Default: '',
        key: false,
        null: false,
        auto_increment: false
    }

    modal.value = true
}

const editField = async (column) => {
    modal.value = true

    const match = column.Type.match(/^(\w+)(?:\((.+)\))?/);
    const field_Type = match ? match[1] : column.Type;
    const field_length = match && match[2] ? match[2] : '';

    data_edit.value = {
        ...column,
        table: props.tableData.table_info.table_name,
        field_type: field_Type,
        field_length: field_length,
        key: column.Key === 'PRI',
        null: column.Null === 'NO',
        auto_increment: column.Extra === 'auto_increment'
    };
}

const saveField = async () => {
    loading.value = true;
    data_edit.value.action_task = "editField";
    try {
        const response = await store.postData({
            url: `api/core/database`,
            params: data_edit.value,
            headers: {
                "Content-Type": "application/json",
            },
            responseType: "json",
        });
        if (response.data.status === 1) {
            modal.value = false;
            proxy.$messageSuccess(proxy, "Success", response.data.message);
            emit('onSaveField', data_edit.value.table);
        }
    } catch (error) {
        proxy.$messageSuccess(proxy, "Validation error", error.response.data.message);
    } finally {
        loading.value = false;
    }
}

const deleteField = async (column) => {
    data_edit.value.action_task = "deleteField";
    data_edit.value.table = props.tableData.table_info.table_name;
    data_edit.value.Field = column.Field;

    loading.value = true;
    const result = await proxy.$messageConfirm(proxy);
    if (result.isConfirmed) {
        try {
            const response = await store.postData({
                url: `api/core/database`,
                params: data_edit.value,
                headers: {
                    "Content-Type": "application/json",
                },
                responseType: "json",
            });
            if (response.data.status === 1) {
                emit('onDeleteField', data_edit.value.table);
                proxy.$messageSuccess(proxy, "Success", response.data.message);
            }
        } catch (error) {
            proxy.$messageSuccess(proxy, "Validation error", error.response.data.message);
        }
    }
    loading.value = false;
}
</script>

<template>
    <div class="d-flex gap-2 mt-2 justify-content-end">
        <b-button v-if="tableData.table_info?.table_name" size="sm" variant="outline-danger" @click="deleteTable">
            <span v-if="loading">
                <BSpinner small type="border" class="me-1" /> Deleting...
            </span>
            <span v-else>
                delete
            </span>
        </b-button>
    </div>

    <div class="code-block mt-2" v-if="tableData.table_info?.create_table">
        <div class="code-header">
            <h5>📄 SQL: CREATE TABLE</h5>
            <button @click="copyToClipboard" class="copy-btn">📋 Copy</button>
        </div>
        <pre><code>{{ tableData.table_info?.create_table }}</code></pre>
    </div>
    <div class="code-block " v-else>
        <div class="text-center">No Result</div>
    </div>

    <div class="table-container mt-4" v-if="tableData.columns?.length > 0">
        <div class="d-flex justify-content-between mb-3">
            <h5>🧩 Table Structure</h5>
            <BButton variant="outline-primary" size="sm" @click="addField">
                Add Field
            </BButton>
        </div>
        <div class="table-responsive">
            <table class="table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Field Name</th>
                        <th>Type</th>
                        <th>Nullable</th>
                        <th>Key</th>
                        <th>Default</th>
                        <th>Extra</th>
                        <th>action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(column, index) in tableData.columns" :key="index">
                        <td>{{ index + 1 }}</td>
                        <td><strong>{{ column.Field }}</strong></td>
                        <td><code>{{ column.Type }}</code></td>
                        <td>
                            <span :class="['badge', column.Null === 'YES' ? 'badge-success' : 'badge-danger']">
                                {{ column.Null }}
                            </span>
                        </td>
                        <td>
                            <span class="badge badge-secondary" v-if="column.Key">{{ column.Key }}</span>
                        </td>
                        <td>{{ column.Default ?? 'null' }}</td>
                        <td>
                            <span class="badge badge-info" v-if="column.Extra">{{ column.Extra }}</span>
                        </td>
                        <td>
                            <BButton size="sm" variant="outline-warning" class="me-1" @click="editField(column)">
                                ✏️ Edit
                            </BButton>
                            <BButton size="sm" variant="outline-danger" @click="deleteField(column)">
                                🗑️ Delete
                            </BButton>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    <b-modal id="modal-xl" v-model="modal" title="Form field" no-close-on-esc no-footer>
        <b-form @submit.prevent="saveField">
            <div class="mb-4">
                <label size="sm" for="range-2">Name Field</label>
                <b-form-input type="text" v-model="data_edit.Field" size="sm" required />
            </div>

            <div class="mb-4">
                <label size="sm" for="range-2">Type</label>
                <v-select v-model="data_edit.field_type" :options="typeData" placeholder="Select Type"
                    style="min-width: 150px" class="w-100" :reduce="option => option.value" label="text" />
            </div>

            <div class="mb-4">
                <label size="sm">Length</label>
                <b-form-input type="text" v-model="data_edit.field_length" size="sm" placeholder="e.g., 255" />
            </div>

            <div class="mb-4">
                <label size="sm">Default</label>
                <b-form-input type="text" v-model="data_edit.Default" size="sm" />
            </div>

            <div class="mb-4 d-flex gap-2">
                <b-form-checkbox id="checkbox-1" v-model="data_edit.key" name="checkbox-1" value="true"
                    unchecked-value="false">
                    Primary Key
                </b-form-checkbox>
                <b-form-checkbox id="checkbox-2" v-model="data_edit.null" name="checkbox-2" value="true"
                    unchecked-value="false">
                    Not Null
                </b-form-checkbox>
                <b-form-checkbox id="checkbox-3" v-model="data_edit.auto_increment" name="checkbox-3" value="true"
                    unchecked-value="false">
                    Auto Increment
                </b-form-checkbox>
            </div>
            <div class="mt-3 d-flex justify-content-start gap-2">
                <b-button variant="success" size="sm" type="submit">
                    <span v-if="loading">
                        <BSpinner small type="border" class="me-1" /> Saving...
                    </span>
                    <span v-else>
                        Save Change(s)
                    </span>
                </b-button>
            </div>
        </b-form>
    </b-modal>
</template>

<style scoped>
.code-block {
    background-color: #f9fafb;
    border: 1px solid #e2e8f0;
    padding: 1rem;
    border-radius: 8px;
    overflow-x: auto;
    white-space: pre-wrap;
    position: relative;
}

.code-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
}

.copy-btn {
    background-color: #edf2f7;
    border: none;
    color: #2d3748;
    padding: 6px 12px;
    font-size: 0.8rem;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.2s ease;
}

.copy-btn:hover {
    background-color: #e2e8f0;
}

.table-container {
    background: #ffffff;
    padding: 1rem;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.table-container h5 {
    margin-bottom: 1rem;
    color: #2d3748;
}

.table {
    width: 100%;
    border-collapse: collapse;
    font-family: 'Segoe UI', sans-serif;
}

.table thead {
    background-color: #edf2f7;
}

.table th,
.table td {
    border: 1px solid #e2e8f0;
    padding: 10px 14px;
    text-align: left;
}

.table tbody tr:hover {
    background-color: #f7fafc;
}

.badge {
    display: inline-block;
    padding: 0.25em 0.5em;
    border-radius: 0.25rem;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
}

.badge-success {
    background-color: #c6f6d5;
    color: #22543d;
}

.badge-danger {
    background-color: #fed7d7;
    color: #742a2a;
}

.badge-secondary {
    background-color: #e2e8f0;
    color: #4a5568;
}

.badge-info {
    background-color: #bee3f8;
    color: #2a4365;
}

@media (max-width: 768px) {
    .table-container {
        padding: 0.5rem;
    }

    .table-container h5 {
        font-size: 1rem;
    }

    .table td,
    .table th {
        font-size: 0.75rem;
        padding: 6px;
    }
}
</style>
