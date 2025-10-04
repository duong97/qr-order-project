<script setup lang="ts">
import { ref, computed, toRaw, onMounted } from "vue";
import {
    Button,
    Cell,
    CellGroup,
    Checkbox,
    CheckboxGroup,
    Field,
    Form,
    List,
    NavBar,
    Popup,
    Uploader,
    showConfirmDialog,
    showNotify,
} from "vant";
import type Product from "@/interface/Product";
import { useCategoryStore } from "@/store/CategoryStore";
import { useProductStore } from "@/store/ProductStore";
import { useProductOptionStore } from "@/store/ProductOptionStore";
import { StringHelper } from "@/helpers/StringHelper";

interface SelectOption {
    text: string;
    value?: number;
}

const emptyProduct: Product = {
    id: undefined,
    name: "",
    price: 0,
    description: "",
    thumbnail: "",
    categories: [],
    options: [],
};

const newProduct = ref<Product>({ ...emptyProduct });
const showPopup = ref(false);
const loading = ref(false);
const file = ref<any[]>([]);
const categoryStore = useCategoryStore();
const productOptionStore = useProductOptionStore();
const productStore = useProductStore();

const categoryList = computed<SelectOption[]>(() =>
    categoryStore.items.map((e) => ({ text: e.name, value: e.id }))
);

const productOptionList = computed<SelectOption[]>(() =>
    productOptionStore.items.map((e) => ({ text: e.name, value: e.id }))
);

const loadProductList = async () => await productStore.fetch();

const loadCategoryList = async () => {
    if (categoryStore.items.length === 0) await categoryStore.adminList();
};

const loadProductOptionList = async () => {
    if (productOptionStore.items.length === 0) await productOptionStore.fetch();
};

onMounted(() => {
    loadProductList();
    loadCategoryList();
    loadProductOptionList();
});

const showPopupCreate = () => {
    showPopup.value = true;
    resetProduct();
};

const validate = () => {
    if (!newProduct.value.categories?.length) {
        showNotify({ type: "warning", message: "Vui lòng chọn nhóm!" });
        return false;
    }
    return true;
};

const createOrUpdate = async () => {
    if (!validate()) return;
    loading.value = true;

    // @todo upload image (tạm tắt để test)
    newProduct.value.thumbnail = "";
    const result = await productStore.createOrUpdate({ ...toRaw(newProduct.value) });
    loading.value = false;

    if (result.success) {
        showNotify({ type: "success", message: "Lưu thành công!" });
        showPopup.value = false;
        resetProduct();
        await loadProductList();
    } else {
        showNotify({ type: "warning", message: result.message });
    }
};

const resetProduct = () => {
    newProduct.value = { ...emptyProduct };
    file.value = [];
};

const showPopupUpdate = (product: Product) => {
    showPopup.value = true;
    newProduct.value = { ...product };
    if (product.thumbnail) {
        file.value = [
            {
                url: StringHelper.convertDriveLinkToDirectImageUrl(product.thumbnail),
                isImage: true,
            },
        ];
    } else {
        file.value = [];
    }
};

const deleteProduct = async (id: number) => {
    await showConfirmDialog({
        confirmButtonText: "Xóa",
        confirmButtonColor: "red",
        cancelButtonText: "Hủy",
        title: "Xóa món",
        message: "Thao tác này không thể hoàn lại, bạn có chắc muốn xóa món này?",
    })
        .then(async () => {
            const result = await productStore.delete(id);
            if (result.success) {
                showNotify({ type: "success", message: "Đã xóa!" });
            } else {
                showNotify({
                    type: "warning",
                    message: result.message || "Lỗi không xác định",
                });
            }
            await loadProductList();
        });
};

const getRequireMessage = () => "Không được để trống";

const onDeleteImage = () => {
    file.value = [];
    newProduct.value.thumbnail = "";
};
</script>

<template>
    <div class="m-2">
        <h2 class="subtitle is-7">
            Danh sách chi tiết từng món (vd: Dưa hấu, Nước mía, Phở bò)
        </h2>
        <Button type="primary" size="small" @click="showPopupCreate">
            Thêm món
        </Button>
    </div>

    <List>
        <TransitionGroup name="list">
            <Cell
                v-for="(item, index) in productStore.items"
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
                        @click="deleteProduct(item.id)"
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
        <NavBar :title="newProduct.id ? 'Cập nhật thông tin món' : 'Thêm món'" />
        <Form @submit="createOrUpdate">
            <CellGroup inset>
                <Field
                    v-model="newProduct.name"
                    label="Tên"
                    placeholder="Nước dừa..."
                    :rules="[{ required: true, message: getRequireMessage }]"
                />
                <Field
                    type="number"
                    v-model.number="newProduct.price"
                    label="Đơn giá"
                    placeholder="50000"
                    :rules="[{ required: true, message: getRequireMessage }]"
                />
                <Field
                    v-model="newProduct.description"
                    label="Mô tả"
                    placeholder="Mô tả chi tiết về món ăn"
                    :rules="[{ required: true, message: getRequireMessage }]"
                />

                <Field label="Danh mục" style="display: flex; align-items: center;">
                    <template #input>
                        <CheckboxGroup shape="square" v-model="newProduct.categories">
                            <Checkbox
                                v-for="category in categoryList"
                                :name="category.value"
                                :key="category.value"
                                class="m-2"
                            >
                                {{ category.text }}
                            </Checkbox>
                        </CheckboxGroup>
                    </template>
                </Field>

                <Field label="Tùy chọn" style="display: flex; align-items: center;">
                    <template #input>
                        <CheckboxGroup shape="square" v-model="newProduct.options">
                            <Checkbox
                                v-for="option in productOptionList"
                                :name="option.value"
                                :key="option.value"
                                class="m-2"
                            >
                                {{ option.text }}
                            </Checkbox>
                        </CheckboxGroup>
                    </template>
                </Field>
            </CellGroup>

            <Field name="Thumbnail" label="Thumbnail">
                <template #input>
                    <Uploader
                        @delete="onDeleteImage"
                        v-model="file"
                        :multiple="false"
                        max-count="1"
                    />
                </template>
            </Field>

            <div style="margin: 16px;">
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
