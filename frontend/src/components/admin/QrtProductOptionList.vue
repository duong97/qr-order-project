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
    RadioGroup,
    Radio,
    Divider,
    Switch,
    showNotify,
    showConfirmDialog,
} from "vant";
import ProductOption from "@/interface/ProductOption";
import { useProductOptionStore } from "@/store/ProductOptionStore";

const emptyOptionItem = {
    name: "",
    price: 0,
};

const emptyProductOption = {
    id: undefined,
    name: "",
    multiple: false,
    items: [{ ...emptyOptionItem }],
};

const showPopup = ref(false);
const loading = ref(false);
const newProductOption = ref<ProductOption>({ ...emptyProductOption });
const productOptionStore = useProductOptionStore();

const getRequireMessage = () => "Không được để trống";

const loadProductOptionList = async () => {
    await productOptionStore.fetch();
};

const validate = () => {
    if (newProductOption.value.items.length <= 0) {
        showNotify({ type: "warning", message: "Cần phải có ít nhất 1 option!" });
        return false;
    }
    return true;
};

const createOrUpdate = async () => {
    if (!validate()) return;

    loading.value = true;
    const result = await productOptionStore.createOrUpdate(toRaw(newProductOption.value));
    loading.value = false;

    if (result.success === true) {
        showNotify({ type: "success", message: "Lưu thành công!" });
        showPopup.value = false;
        resetProductOption();
        await loadProductOptionList();
    } else {
        showNotify({ type: "warning", message: result.message });
    }
};

const showPopupCreate = () => {
    showPopup.value = true;
    resetProductOption();
};

const resetProductOption = () => {
    newProductOption.value = { ...emptyProductOption, items: [{ ...emptyOptionItem }] };
};

const showPopupUpdate = (productOption: ProductOption) => {
    showPopup.value = true;
    newProductOption.value = { ...productOption };
};

const deleteCategory = async (id: number) => {
    await showConfirmDialog({
        confirmButtonText: "Xóa",
        confirmButtonColor: "red",
        cancelButtonText: "Hủy",
        title: "Xóa nhóm",
        message: "Thao tác này không thể hoàn lại, bạn có chắc muốn xóa nhóm này?",
    })
        .then(async () => {
            const result = await productOptionStore.delete(id);
            if (result.success === true) {
                showNotify({ type: "success", message: "Đã xóa!" });
                await loadProductOptionList();
            } else {
                showNotify({ type: "warning", message: result.message || "Lỗi không xác định" });
            }
        });
};

const addOptionRow = () => {
    newProductOption.value.items.push({ ...emptyOptionItem });
};

const removeOptionRow = (index: number) => {
    newProductOption.value.items.splice(index, 1);
};

const reloadDefaultCheckedOption = (index: number) => {
    if (newProductOption.value.multiple) return;

    newProductOption.value.items.forEach((option, i) => {
        if (i !== index && option.default) option.default = false;
    });
};

onMounted(loadProductOptionList);
</script>

<template>
    <div class="m-2">
        <h2 class="subtitle is-7">
            Các tuỳ chọn/biến thể gắn với món (vd: Size, Đường, Đá, Topping).
        </h2>
        <Button type="primary" size="small" @click="showPopupCreate">Thêm tuỳ chọn</Button>
    </div>

    <List>
        <TransitionGroup name="list">
            <Cell
                v-for="(item, index) in productOptionStore.items"
                :key="item.id"
                :title="(index + 1) + '. ' + item.name"
            >
                <template #extra>
                    <Button @click="showPopupUpdate(item)" size="mini" plain type="warning" icon="edit" class="mr-2" />
                    <Button @click="deleteCategory(item.id)" size="mini" plain type="danger" icon="cross" />
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
        style="background: var(--van-background)"
    >
        <NavBar title="Thêm topping / tùy chọn" />
        <Form @submit="createOrUpdate">
            <p class="m-3">Thông tin chính:</p>
            <div>
                <Field
                    v-model="newProductOption.name"
                    label="Tên"
                    placeholder="Lượng đường..."
                    :rules="[{ required: true, message: getRequireMessage }]"
                />
                <Field name="radio" label="Loại">
                    <template #input>
                        <RadioGroup
                            v-model="newProductOption.multiple"
                            direction="horizontal"
                            @change="reloadDefaultCheckedOption(0)"
                        >
                            <Radio :name="false">Chọn 1</Radio>
                            <Radio :name="true">Chọn nhiều</Radio>
                        </RadioGroup>
                    </template>
                </Field>
            </div>

            <Divider>o</Divider>
            <div class="m-3 stretch">
                <p>Các option:</p>
                <Button @click="addOptionRow" icon="plus" type="primary" plain size="mini">Thêm option</Button>
            </div>

            <TransitionGroup name="move">
                <div v-for="(item, index) in newProductOption.items" :key="index">
                    <CellGroup inset>
                        <template #title>
                            <div class="stretch">
                                <span>#{{ index + 1 }}</span>
                                <Button @click="removeOptionRow(index)" icon="cross" type="danger" plain size="mini" />
                            </div>
                        </template>

                        <Field
                            v-model="item.name"
                            label="Tên option"
                            placeholder="100% đường..."
                            :rules="[{ required: true, message: getRequireMessage }]"
                        />
                        <Field
                            v-model="item.price"
                            type="number"
                            label="Đơn giá"
                            placeholder="5000"
                            :rules="[{ required: true, message: getRequireMessage }]"
                        />
                        <Cell center title="Mặc định check">
                            <Switch v-model="item.default" size="20px" @change="reloadDefaultCheckedOption(index)" />
                        </Cell>
                    </CellGroup>
                </div>
            </TransitionGroup>

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

.move-move,
.move-enter-active,
.move-leave-active {
    transition: all 0.5s ease;
}
.move-enter-from,
.move-leave-to {
    opacity: 0;
    transform: translateX(30px);
}
.move-leave-active {
    position: absolute;
}

.stretch {
    display: flex;
    justify-content: space-between;
}
</style>
