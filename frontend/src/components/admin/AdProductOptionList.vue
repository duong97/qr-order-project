<script lang="ts">
import {defineComponent, ref, toRaw} from "vue";
import {
    Button,
    Popup,
    Form,
    CellGroup,
    Field,
    NavBar,
    Picker,
    List,
    Cell,
    RadioGroup,
    Radio,
    Divider,
    Switch,
    showNotify,
    showConfirmDialog
} from "vant";
import ProductOption from "@/interface/ProductOption";
import {useProductOptionStore} from "@/store/ProductOptionStore";

const emptyOptionItem = {
    name: '',
    price: 0,
}

const emptyProductOption = {
    id: undefined,
    name: '',
    multiple: false,
    items: [
        { ...emptyOptionItem }
    ],
}

export default defineComponent({
    name: "qrt-admin-product-option-list",
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
        [RadioGroup.name]: RadioGroup,
        [Radio.name]: Radio,
        [Divider.name]: Divider,
        [Switch.name]: Switch,
        [showNotify.name]: showNotify,
        [showConfirmDialog.name]: showConfirmDialog,
    },
    data() {
        return {
            newProductOption: { ...emptyProductOption } as ProductOption,
        }
    },
    setup() {
        const showPopup = ref(false);
        const loading = ref(false);
        const productOptionStore = useProductOptionStore();

        return {
            showPopup,
            loading,
            productOptionStore,
        }
    },
    mounted() {
        this.loadProductOptionList();
    },
    methods: {
        loadProductOptionList() {
            this.productOptionStore.fetch();
        },
        async createOrUpdate() {
            if (!this.validate()) {
                return;
            }

            this.loading = true;
            const result = await this.productOptionStore.createOrUpdate(toRaw(this.newProductOption));
            this.loading = false;

            if (result.success === true) {
                showNotify({ type: 'success', message: "Lưu thành công!" });
                this.showPopup = false;
                // Reset popup info
                this.resetProductOption();
                // Reload list
                await this.loadProductOptionList();
            } else {
                showNotify({ type: 'warning', message: result.message });
            }
        },
        validate() {
            if (this.newProductOption.items.length <= 0) {
                showNotify({ type: 'warning', message: "Cần phải có ít nhất 1 option!" });
                return false;
            }

            return true;
        },
        async showPopupCreate() {
            this.showPopup = true;
            this.resetProductOption();
        },
        resetProductOption() {
            this.newProductOption = { ...emptyProductOption };
            this.newProductOption.items = [
                { ...emptyOptionItem }
            ];
        },
        showPopupUpdate(productOption: ProductOption) {
            this.showPopup = true;
            this.newProductOption = productOption;
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
                    const result = await this.productOptionStore.delete(id);
                    if (result.success === true) {
                        showNotify({ type: 'success', message: "Đã xóa!" });
                        await this.loadProductOptionList();
                    } else {
                        showNotify({ type: 'warning', message: result.message || 'Lỗi không xác định' });
                    }
                    await this.loadProductOptionList();
                })
                .catch(() => {
                    // on cancel
                });
        },
        getRequireMessage() {
            return "Không được để trống";
        },
        addOptionRow() {
            this.newProductOption.items.push({ ...emptyOptionItem });
        },
        removeOptionRow(index: number) {
            this.newProductOption.items.splice(index, 1);
        },
        reloadDefaultCheckedOption(index: number) {
            // Khi change switch mặc định check của option
            if (this.newProductOption.multiple) {
                return;
            }
            // Nếu option là chọn 1 thì default check chỉ được 1 item
            for (let i = 0; i < this.newProductOption.items.length; i++) {
                const option = this.newProductOption.items[i];
                if (option && i !== index && option.default) {
                    // Tắt các option khác, chỉ bật option hiện tại
                    option.default = false;
                }
            }
        },
    }
})
</script>

<template>
    <div class="m-2">
        <h2 class="subtitle is-7">
          Các tuỳ chọn/biến thể gắn với món (vd: Size, Đường, Đá, Topping).
        </h2>
        <van-button type="primary" size="small" @click="showPopupCreate">
            Thêm tuỳ chọn
        </van-button>
    </div>
    <van-list>
        <TransitionGroup name="list">
            <van-cell
                v-for="(item, index) in this.productOptionStore.items"
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
        style="background: var(--van-background)"
    >
        <van-nav-bar title="Thêm topping / tùy chọn" />
        <van-form @submit="createOrUpdate">
            <p class="m-3">Thông tin chính:</p>
            <div>
                <van-field
                    v-model="newProductOption.name"
                    label="Tên"
                    placeholder="Lượng đường..."
                    :rules="[{ required: true, message: getRequireMessage }]"
                />
                <van-field name="radio" label="Loại">
                    <template #input>
                        <van-radio-group
                            v-model="newProductOption.multiple"
                            direction="horizontal"
                            @change="reloadDefaultCheckedOption(0)"
                        >
                            <van-radio :name="false">Chọn 1</van-radio>
                            <van-radio :name="true">Chọn nhiều</van-radio>
                        </van-radio-group>
                    </template>
                </van-field>
            </div>

            <van-divider>o</van-divider>
            <div class="m-3 stretch">
                <p>Các option:</p>
                <van-button @click="addOptionRow" icon="plus" type="primary" plain size="mini">
                    Thêm option
                </van-button>
            </div>
            <TransitionGroup name="move">
                <div v-for="(item, index) in this.newProductOption.items" :key="index">
                    <van-cell-group inset>
                        <template #title>
                            <div class="stretch">
                                <span>
                                    #{{ index + 1 }}
                                </span>
                                <van-button @click="removeOptionRow(index)" icon="cross" type="danger" plain size="mini" />
                            </div>
                        </template>
                        <van-field
                            v-model="item.name"
                            label="Tên option"
                            placeholder="100% đường..."
                            :rules="[{ required: true, message: getRequireMessage }]"
                        />
                        <van-field
                            v-model="item.price"
                            type="number"
                            label="Đơn giá"
                            placeholder="5000"
                            :rules="[{ required: true, message: getRequireMessage }]"
                        />
                        <van-cell center title="Mặc định check">
                            <van-switch v-model="item.default" size="20px" @change="reloadDefaultCheckedOption(index)"/>
                        </van-cell>
                    </van-cell-group>
                </div>
            </TransitionGroup>

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