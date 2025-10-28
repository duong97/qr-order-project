<script setup lang="ts">
import { ref, toRaw, onMounted } from "vue";
import {
    Button,
    Popup,
    Form,
    CellGroup,
    Field,
    NavBar,
    List,
    Cell,
    showNotify,
    showConfirmDialog,
} from "vant";
import { useCategoryStore } from "@/store/CategoryStore";
import type Category from "@/interface/Category";

const showPopup = ref(false);
const loading = ref(false);
const categoryStore = useCategoryStore();

const emptyCategory = {
    id: undefined,
    name: "",
};
const currentCategory = ref<Category>({...emptyCategory});

const loadCategoryList = () => categoryStore.adminList();

const createOrUpdate = async () => {
    loading.value = true;
    const result = await categoryStore.createOrUpdate(toRaw(currentCategory.value));
    loading.value = false;

    if (result.success) {
        showNotify({ type: "success", message: "Lưu thành công!" });
        showPopup.value = false;
        currentCategory.value = { id: undefined, name: "" };
        await loadCategoryList();
    } else {
        showNotify({ type: "warning", message: result.message });
    }
};

const showPopupUpdate = (category: Category) => {
    showPopup.value = true;
    currentCategory.value = { ...category };
};

const showPopupCreate = () => {
    showPopup.value = true;
    currentCategory.value = structuredClone(emptyCategory);
};

const deleteCategory = async (id: number) => {
    await showConfirmDialog({
        confirmButtonText: "Xóa",
        confirmButtonColor: "red",
        cancelButtonText: "Hủy",
        title: "Xác nhận",
        message: "Thao tác này không thể hoàn lại, bạn có chắc muốn xóa?",
    })
        .then(async () => {
            const result = await categoryStore.delete(id);
            if (result.success) {
                showNotify({ type: "success", message: "Đã xóa!" });
            } else {
                showNotify({
                    type: "warning",
                    message: result.message || "Lỗi không xác định",
                });
            }
            await loadCategoryList();
        });
};

const getRequireMessage = () => "Không được để trống";

onMounted(loadCategoryList);
</script>

<template>
    <div class="m-2">
        <h2 class="subtitle is-7">
            Gom nhóm món ăn theo loại (vd: Trái cây, Nước uống, Món chính, Tráng
            miệng, ...)
        </h2>
        <Button type="primary" size="small" @click="showPopupCreate()">
            Thêm danh mục
        </Button>
    </div>

    <List>
        <TransitionGroup name="list">
            <Cell
                v-for="(item, index) in categoryStore.items"
                :key="item.id"
                :title="(index + 1) + '. ' + item.name"
            >
                <template #extra>
                    <Button
                        @click="showPopupUpdate(item)"
                        size="mini"
                        plain
                        type="warning"
                        icon="edit"
                        class="mr-2"
                    />
                    <Button
                        @click="deleteCategory(item.id)"
                        size="mini"
                        plain
                        type="danger"
                        icon="cross"
                    />
                </template>
            </Cell>
        </TransitionGroup>
    </List>

    <Popup
        v-model:show="showPopup"
        :closeable="!loading"
        :close-on-click-overlay="!loading"
        teleport="#admin-index-container"
        position="bottom"
    >
        <NavBar :title="currentCategory.id ? `Cập nhật danh mục #${currentCategory.id}` : 'Thêm danh mục'" />
        <Form @submit="createOrUpdate">
            <CellGroup inset>
                <Field
                    v-model="currentCategory.name"
                    label="Tên"
                    placeholder="Thức uống..."
                    :rules="[{ required: true, message: getRequireMessage }]"
                />
            </CellGroup>
            <div style="margin: 16px">
                <Button
                    round
                    block
                    type="primary"
                    native-type="submit"
                    :loading="loading"
                    :disabled="loading"
                    loading-text="Đang lưu..."
                >
                    Lưu
                </Button>
            </div>
        </Form>
    </Popup>
</template>

<style scoped>

</style>
