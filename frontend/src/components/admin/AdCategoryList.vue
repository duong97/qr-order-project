<script lang="ts">
import {defineComponent, ref, toRaw} from "vue";
import {Button, Popup, Form, CellGroup, Field, NavBar, Picker, List, Cell, showNotify, showConfirmDialog} from "vant";
import {useCategoryStore} from "@/store/CategoryStore";
import Category from "@/interface/Category";

export default defineComponent({
    name: "qrt-admin-category-list",
    components: {
        [Button.name]: Button,
        [Popup.name]: Popup,
        [Form.name]: Form,
        [CellGroup.name]: CellGroup,
        [Field.name]: Field,
        [NavBar.name]: NavBar,
        [Picker.name]: Picker,
        [List.name]: List,
        [Cell.name]: Cell,
        [showNotify.name]: showNotify,
        [showConfirmDialog.name]: showConfirmDialog,
    },
    data() {
        return {
            newCategory: {
                id: undefined,
                name: '',
            } as Category,
        }
    },
    setup() {
        const showPopup = ref(false);
        const loading = ref(false);
        const categoryStore = useCategoryStore();

        return {
            showPopup,
            loading,
            categoryStore,
        }
    },
    mounted() {
        this.loadCategoryList();
    },
    methods: {
        loadCategoryList() {
            this.categoryStore.fetch();
        },
        async createOrUpdate() {
            this.loading = true;
            const result = await this.categoryStore.createOrUpdate(toRaw(this.newCategory));
            this.loading = false;

            if (result.success === true) {
                showNotify({ type: 'success', message: "Lưu thành công!" });
                this.showPopup = false;
                // Reset popup info
                this.newCategory.id = undefined;
                this.newCategory.name = '';
                // Reload list
                await this.loadCategoryList();
            } else {
                showNotify({ type: 'warning', message: result.message });
            }
        },
        showPopupUpdate(category: Category) {
            this.showPopup = true;
            this.newCategory.name = category.name;
            this.newCategory.id = category.id;
        },
        async deleteCategory(id: number) {
            await showConfirmDialog({
                confirmButtonText: "Xóa",
                confirmButtonColor: "red",
                cancelButtonText: "Hủy",
                title: 'Xóa nhóm',
                message:
                    'Thao tác này không thể hoàn lại, bạn có chắc muốn xóa nhóm này?',
            })
                .then(async () => {
                    // on confirm
                    const result = await this.categoryStore.delete(id);
                    if (result.success === true) {
                        showNotify({ type: 'success', message: "Đã xóa!" });
                        await this.loadCategoryList();
                    } else {
                        showNotify({ type: 'warning', message: result.message || 'Lỗi không xác định' });
                    }
                    await this.loadCategoryList();
                })
                .catch(() => {
                    // on cancel
                });
        },
        getRequireMessage() {
            return "Không được để trống";
        },
    }
})
</script>

<template>
    <div class="m-2">
        <h2 class="subtitle is-7">Danh sách các nhóm món. Mỗi món sẽ thuộc 1 nhóm. Ví dụ món "Trà sữa" sẽ thuộc nhóm "Đồ uống"...</h2>
        <van-button type="primary" size="small" @click="showPopup = !showPopup">
            Thêm nhóm
        </van-button>
    </div>
    <van-list>
        <TransitionGroup name="list">
            <van-cell
                v-for="(item, index) in this.categoryStore.items"
                :key="item.id"
                :title="(index + 1) + '. ' + item.name"
            >
                <template #extra>
                    <van-button @click="showPopupUpdate(item)" size="mini" plain type="warning" icon="edit" class="mr-2"/>
                    <van-button @click="deleteCategory(item.id)" size="mini" plain type="danger" icon="cross"/>
                </template>
            </van-cell>
        </TransitionGroup>
    </van-list>
    <van-popup
        v-model:show="showPopup"
        :closeable="!loading"
        :close-on-click-overlay="!loading"
        teleport="#admin-index-container"
        position="bottom"
    >
        <van-nav-bar title="Thêm nhóm" />
        <van-form @submit="createOrUpdate">
            <van-cell-group inset>
                <van-field
                    v-model="newCategory.name"
                    label="Tên"
                    placeholder="Thức uống..."
                    :rules="[{ required: true, message: getRequireMessage }]"
                />
            </van-cell-group>
            <div style="margin: 16px;">
                <van-button
                    round
                    block
                    type="primary"
                    native-type="submit"
                    :loading="loading"
                    :disabled="loading"
                    loading-text="Đang lưu..."
                >
                    Lưu
                </van-button>
            </div>
        </van-form>
    </van-popup>
</template>

<style scoped>
    .list-enter-active,
    .list-leave-active {
        transition: all 0.5s ease;
    }
    .list-enter-from,
    .list-leave-to {
        opacity: 0;
        transform: translateX(30px);
    }
</style>