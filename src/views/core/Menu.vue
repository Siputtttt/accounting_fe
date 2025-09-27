<script setup>
import { ref, onMounted, provide, getCurrentInstance } from 'vue';
import { useStore } from '@/store';
import { useMessageStore } from '@/store/messageStore';
import { useRouter } from 'vue-router';

import VueTreeDnd from 'vue-tree-dnd';
import MenuItemRenderer from '@/components/core/SxMenuItemRender.vue';
import MenuForm from '@/components/core/SxMenuForm.vue';

const messageStore = useMessageStore();
const loading = ref(true);
const store = useStore();
const form = ref({});
const menus = ref([]);
const modules = ref([]);
const groups = ref([]);
const menuFormRef = ref(null);
const { proxy } = getCurrentInstance();

const moveHandler = (event) => {
    const { id, targetId, position } = event;
    console.log('Move event:', id, targetId, position);

    const findItemById = (tree, id) => {
        for (let item of tree) {
            if (item.id === id) return item;
            if (item.children) {
                const found = findItemById(item.children, id);
                if (found) return found;
            }
        }
        return null;
    };

    const removeItemById = (tree, id) => {
        for (let i = 0; i < tree.length; i++) {
            if (tree[i].id === id) {
                return tree.splice(i, 1)[0];
            }
            if (tree[i].children) {
                const removed = removeItemById(tree[i].children, id);
                if (removed) return removed;
            }
        }
        return null;
    };

    const findParentAndIndex = (tree, targetId, parent = null) => {
        for (let i = 0; i < tree.length; i++) {
            const item = tree[i];
            if (item.id === targetId) {
                return { parent, index: i };
            }
            if (item.children) {
                const found = findParentAndIndex(item.children, targetId, item);
                if (found) return found;
            }
        }
        return null;
    };

    const insertRelativeToTarget = (tree, item, targetId, position) => {
        for (let i = 0; i < tree.length; i++) {
            if (tree[i].id === targetId) {
                if (position === 'BEFORE') {
                    tree.splice(i, 0, item);
                } else if (position === 'AFTER') {
                    tree.splice(i + 1, 0, item);
                }
                return true;
            }
            if (tree[i].children) {
                const inserted = insertRelativeToTarget(tree[i].children, item, targetId, position);
                if (inserted) return true;
            }
        }
        return false;
    };

    const findLevelById = (tree, id, level = 1) => {
        for (let item of tree) {
            if (item.id === id) return level;
            if (item.children) {
                const childLevel = findLevelById(item.children, id, level + 1);
                if (childLevel) return childLevel;
            }
        }
        return null;
    };

    const originalParentAndIndex = findParentAndIndex(menus.value, id);

    const itemToMove = removeItemById(menus.value, id);
    if (!itemToMove) {
        proxy.$swal.fire({
            icon: 'error',
            title: 'Move Failed',
            text: 'Item not found',
            toast: true,
            position: 'top-end',
            timer: 3000,
            showConfirmButton: false,
            timerProgressBar: true,
        });
        return;
    }

    if (!targetId) {
        menus.value.push(itemToMove);
        return;
    }

    const targetItem = findItemById(menus.value, targetId);
    if (!targetItem) {
        proxy.$swal.fire({
            icon: 'error',
            title: 'Move Failed',
            text: 'Target item not found',
            toast: true,
            position: 'top-end',
            timer: 3000,
            showConfirmButton: false,
            timerProgressBar: true,
        });
        return;
    }

    const targetLevel = findLevelById(menus.value, targetId);

    const getLevelDepth = (item, level = 1) => {
        console.log(item, level);
        if (item.children && item.children.length > 0) {
            console.log(Math.max(level, ...item.children.map((child) => getLevelDepth(child, level + 1))));
            return Math.max(level, ...item.children.map((child) => getLevelDepth(child, level + 1)));
        }
        return level;
    };

    if (targetLevel >= 3 && (position === 'FIRST_CHILD' || position === 'LAST_CHILD')) {
        proxy.$swal.fire({
            icon: 'error',
            title: 'Move Failed',
            text: 'You can only have up to 3 levels. Please adjust your structure.',
            toast: true,
            position: 'top-end',
            timer: 3000,
            showConfirmButton: false,
            timerProgressBar: true,
        });

        if (originalParentAndIndex) {
            const { parent, index } = originalParentAndIndex;
            if (parent) {
                parent.children.splice(index, 0, itemToMove);
            } else {
                menus.value.splice(index, 0, itemToMove);
            }
        }
        return;
    }

    if (itemToMove.children && itemToMove.children.length > 0) {
        let isValid = true;
        itemToMove.children.forEach((child) => {
            const childLevel = getLevelDepth(child, 2);
            if (childLevel > 3) {
                isValid = false;
            }
        });

        if (!isValid) {
            proxy.$swal.fire({
                icon: 'error',
                title: 'Move Failed',
                text: 'Child items cannot exceed 3 levels. Please adjust your structure.',
                toast: true,
                position: 'top-end',
                timer: 3000,
                showConfirmButton: false,
                timerProgressBar: true,
            });

            if (originalParentAndIndex) {
                const { parent, index } = originalParentAndIndex;
                if (parent) {
                    parent.children.splice(index, 0, itemToMove);
                } else {
                    menus.value.splice(index, 0, itemToMove);
                }
            }
            return;
        }
    }

    switch (position) {
        case 'FIRST_CHILD':
            targetItem.children = targetItem.children || [];
            targetItem.children.unshift(itemToMove);
            break;

        case 'LAST_CHILD':
            targetItem.children = targetItem.children || [];
            targetItem.children.push(itemToMove);
            if (!targetItem.expanded) {
                targetItem.expanded = true;
            }
            break;

        case 'LEFT': {
            const parentAndIndex = findParentAndIndex(menus.value, targetId);
            if (parentAndIndex) {
                const { parent, index: targetIndex } = parentAndIndex;
                if (parent && parent.children) {
                    const grandParent = findParentAndIndex(menus.value, parent.id);
                    if (grandParent && grandParent.parent && grandParent.parent.children) {
                        const siblings = grandParent.parent.children;
                        const index = siblings.findIndex((child) => child.id === parent.id);
                        siblings.splice(index + 1, 0, itemToMove);
                    } else {
                        const index = menus.value.findIndex((child) => child.id === parent.id);
                        menus.value.splice(index + 1, 0, itemToMove);
                    }
                } else {
                    const rootIndex = menus.value.findIndex((child) => child.id === targetId);
                    menus.value.splice(rootIndex, 0, itemToMove);
                }
            }
            break;
        }

        case 'RIGHT':
        case 'BEFORE':
        case 'AFTER':
            insertRelativeToTarget(menus.value, itemToMove, targetId, position === 'RIGHT' ? 'AFTER' : position);
            break;

        default:
            console.warn('Posisi tidak dikenali:', position);
            break;
    }
};

const saveReorderMenu = async () => {
    form.value.task = 'save_position';
    form.value.menu = menus.value;

    const response = await store.postData({
        url: 'api/core/menus',
        params: form.value,
        headers: {
            'Content-Type': 'application/json',
        },
        responseType: 'json',
    });
    if (response.data.status) {
        messageStore.reloadMenus();
        proxy.$swal.fire({
            icon: 'success',
            title: 'Success',
            text: response.data.message,
            toast: true,
            position: 'top-end',
            timer: 3000,
            showConfirmButton: false,
            timerProgressBar: true,
        });

        fetchData();

        form.value = {
            menu_name: '',
            menu_type: 'internal',
            module_name: null,
            position: 'top',
            icon_class: '',
            status: '1',
            access_data: {},
            public: 0,
        };
    } else {
        proxy.$swal.fire({
            icon: 'error',
            title: 'Failed',
            text: response.data.message,
            toast: true,
            position: 'top-end',
            timer: 3000,
            showConfirmButton: false,
            timerProgressBar: true,
        });
    }
};

const handleEditItem = (id) => {
    menuFormRef.value.setForm(id);
};
provide('handleEditItem', handleEditItem);

const fetchData = async () => {
    loading.value = true;
    try {
        const response = await store.getData({
            url: 'api/core/menus/create',
            headers: {
                'Content-Type': 'application/json',
            },
            responseType: 'json',
        });
        menus.value = response.data.data.menu;
        modules.value = response.data.data.module;
        groups.value = response.data.data.group;
        loading.value = false;
    } catch (error) {
        $swal(error);
    }
};

onMounted(() => {
    fetchData();
});
</script>

<template>
    <div class="wrapper">
        <div class="header-nav">
            <h3><i class="bi bi-layout-sidebar"></i> Menu Administration</h3>
        </div>

        <div class="page">
            <div class="row justify-content-center">
                <div class="col-sm-6">
                    <div class="shadow-sm border p-4 rounded-2" style="background: #f8f9fa">
                        <VueTreeDnd :component="MenuItemRenderer" v-model="menus" @move="moveHandler" />
                        <button type="button" class="btn btn-sm btn-outline-primary mt-3" @click="saveReorderMenu">
                            Reorder Menu
                        </button>
                    </div>
                </div>
                <div class="col-sm-5">
                    <div class="shadow-sm border p-4 rounded-2">
                        <MenuForm ref="menuFormRef" :modules="modules" :groups="groups" :fectMenu="fetchData" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.vue-tree-dnd-item {
    transition: transform 0.2s ease-in-out, opacity 0.2s ease-in-out;
}

.vue-tree-dnd-item.dragging {
    opacity: 0.7;
    transform: scale(2.05);
}

.vue-tree-dnd-item.dragging {
    background-color: rgba(0, 0, 0, 0.1);
}
.bg-menuItems {
    padding: 3px 15px;
    font-size: 10px !important;
}
.vs__search,
.vs__search:focus {
    font-size: 12px;
}
.v-select li a {
    font-size: 12px;
}
</style>
