<script setup>
import { getCurrentInstance, ref, onMounted, reactive, watch } from "vue";
import { useStore } from "@/store";
import { useRouter } from "vue-router";
import SxTableData from "@/components/core/SxTableData.vue";
import SxTableResult from "@/components/core/SxTableResult.vue";
import SxTableInfo from "@/components/core/SxTableInfo.vue";
import SxTableForm from "@/components/core/SxTableForm.vue";

const { proxy } = getCurrentInstance();
const router = useRouter();
const store = useStore();
const data = ref({});
const typeData = reactive({});
const modal_form = ref(false);
const columns = ref([]);
const storage_engine = ref([]);
const errors = reactive({});
const message = ref("");
const loading = ref(false);
const active_tab = ref(0);
const table_data = ref([]);
const query_text = ref("")
const table_result = ref([])

const form = reactive({
    id: null,
    name: "",
    storage_engine: "MyISAM",
    engine: "MyISAM",
    active: 1,
    columns: [],
});

const addRow = () => {
    form.columns.push({
        name: "",
        type: "",
        length: "",
        default: "",
        primary_key: 0,
        not_null: 0,
        auto_increment: 0,
    });
};
// const cancelForm = () => {
//     form.id = null;
//     form.name = "";
//     form.storage_engine = "InnoDB";
//     form.charset = "utf8mb4";
//     form.collate = "utf8mb4_general_ci";
//     form.engine = "InnoDB";
//     form.active = 1;
//     form.allow_guest = 0;
// }

// const setForm = async (item) => {
//     modalDatabase.value = true;
//     form.id = item.id;
//     form.name = item.name;
//     form.storage_engine = item.storage_engine;
//     form.charset = item.charset;
//     form.collate = item.collate;
//     form.engine = item.engine;
//     form.active = item.active;
//     form.allow_guest = item.allow_guest;
// }


const removeRow = async (index) => {
    form.columns.splice(index, 1);
}

const getTable = async (table) => {
    loading.value = true;
    try {
        const response = await store.getData({
            url: `api/core/database/getTable?table=${table}`,
            headers: {
                "Content-Type": "application/json",
            },
            responseType: "json",
        });
        if (response && response.data.data) {
            table_data.value = response.data.data

            proxy.$messageSuccess(proxy, "Success", response.data.message);
        }
    } catch (error) {
        proxy.$messageSuccess(proxy, "error", error.response.data.message);
    } finally {
        loading.value = false;
    }
};

const query = async () => {
    loading.value = true;
    const data = {
        query_text: query_text.value,
        action_task: "query"
    }
    try {
        const response = await store.postData({
            url: "api/core/database",
            params: data,
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        if (response.data.status === 1) {
            table_result.value = response.data.data
            active_tab.value = 0;

            proxy.$messageSuccess(proxy, "Success", response.data.message);
        }
    } catch (error) {
        proxy.$messageSuccess(proxy, "error", error.response.data.message);
    } finally {
        loading.value = false;
    }
}
const fetchData = async () => {
    loading.value = true;
    try {
        const response = await store.getData({
            url: "api/core/database",
            headers: {
                "Content-Type": "application/json",
            },
            responseType: "json",
        });
        if (response && response.data.data) {
            active_tab.value = 0
            data.value = response.data.data.table
            typeData.value = response.data.data.type_data
            storage_engine.value = response.data.data.engine

            proxy.$messageSuccess(proxy, "Success", response.data.message);
        }
    } catch (error) {

    } finally {
        loading.value = false;
    }
};
watch(
    () => form.columns.map(col => col.name),
    (newNames, oldNames) => {
        newNames.forEach((val, index) => {
            const cleaned = String(val).toLowerCase().replace(/[^a-z]/g, '');
            if (val !== cleaned) {
                form.columns[index].name = cleaned;
            }
        });
    }
);
onMounted(() => {
    fetchData()
});
</script>
<template>
    <div class="wrapper">
        <div class="header-nav">
            <h3><i class="bi bi-layout-sidebar"></i> Database Manajement System ( Build In ) </h3>
        </div>

        <div class="toolbar-nav">
            <div class="row">
                <div class="col-md-6  ">
                    <div class=" mr-2 tool-icon" @click="modal_form = true"><i class="bi bi-database-add"></i> Table
                    </div>
                    <div class=" mr-2 tool-icon"><i class="bi bi-database-check"></i> Editor </div>
                    <div class=" mr-2 tool-icon" @click="query"><i class="bxi bi-play-circle"></i> Execute </div>
                    <div class=" mr-2 tool-icon"><i class="bi bi-code-square text-mute"></i> Build Module
                    </div>
                    <div class=" mr-2 tool-icon" @click="fetchData"><i class="bi bi-arrow-clockwise"></i> Refresh
                    </div>
                </div>
            </div>
        </div>

        <SxTableForm v-model:show="modal_form" :form="form" :type-data="typeData.value" :storage-engine="storage_engine"
            @save="fetchData" />
        <div class="page ">
            <BRow class=" box-database">
                <BCol cols="2" class="" style="background: #fff; border-right:solid 1px #e5e7eb; ">
                    <div class="sidemenu">
                        <div class="header-nav">
                            <h3> <i class="bi bi-database"></i> Table Lists</h3>
                        </div>
                        <ul class="db-list">
                            <template v-for="table in data" :key="table">
                                <li>
                                    <span @click="getTable(table)" class="pointer">
                                        <i class="bi bi-files"></i>
                                        {{ table }}</span>
                                </li>
                            </template>
                        </ul>
                    </div>
                </BCol>
                <BCol cols="10">
                    <div class="content-menu">
                        <BFormTextarea size="sm" v-model="query_text" placeholder="Enter Query Statement" rows="7"
                            style="padding: 10px;" />
                    </div>
                    <div class="content-menu-data">
                        <BTabs v-model="active_tab">
                            <BTab title="Results">
                                <SxTableResult :table-data="table_result" />
                            </BTab>
                            <BTab title="Table Data">
                                <SxTableData :table-data="table_data" />
                            </BTab>
                            <BTab title="Info">
                                <div v-if="loading" class="d-flex justify-content-center align-items-center"
                                    style="height: 300px;">
                                    <b-spinner label="Loading..." variant="primary" />
                                </div>
                                <div v-else>
                                    <SxTableInfo :table-data="table_data" :type-data="typeData.value"
                                        :storage-engine="storage_engine.value" @onDeleteSuccess="fetchData"
                                        @onDeleteField="getTable" @onSaveField="getTable" />
                                </div>
                            </BTab>

                        </BTabs>
                    </div>
                </BCol>
            </BRow>
        </div>
    </div>
</template>
<style scoped>
.box-database {
    margin: -15px;
}

.sidemenu {
    position: sticky;
    top: 0;
    min-height: calc(100vh - 146px);
    z-index: 10;
}

.content-menu {
    padding-top: 10px;
}

.content-menu-data {
    border-top: solid 1px #e5e7eb;
    padding: 10px;
    min-height: calc(100vh - 320px);
    margin: 15px -15px -15px -11px;
    background: #fff;
    font-size: 0.75rem;
}

ul.db-list {
    margin: 0;
    padding: 0;
    list-style: none;
    font-size: 0.775rem;
}

ul.db-list li {
    padding: 3px 5px;
}

ul.db-list li a {
    text-decoration: none;
    color: #3b3b3b;
    display: block;
}

ul.db-list li a i {
    margin-right: 5px;
    color: #2E5894;
    font-weight: 600;
}
</style>