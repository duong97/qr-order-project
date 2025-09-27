<script lang="ts">
import {defineComponent, ref, toRaw} from "vue";
import {
    Button,
    Cell,
    CellGroup,
    Checkbox,
    CheckboxGroup,
    DropdownItem,
    DropdownMenu,
    Field,
    Form,
    Image,
    List,
    NavBar,
    Picker,
    Popup,
    Uploader,
    showConfirmDialog,
    showNotify
} from "vant";
import Product from "@/interface/Product";
import {useCategoryStore} from "@/store/CategoryStore";
import {useProductStore} from "@/store/ProductStore";
import {useProductOptionStore} from "@/store/ProductOptionStore";
import {UploadImageApi} from "@/api/admin/UploadImageApi";
import {StringHelper} from "@/helpers/StringHelper";

interface SelectOption {
    text: string;
    value?: number;
}

const emptyProduct = {
    id: undefined,
    name: '',
    price: 0,
    description: '',
    thumbnail: '',
    categories: [],
    options: []
};

export default defineComponent({
    name: "qrt-admin-product-list",
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
        [DropdownMenu.name]: DropdownMenu,
        [DropdownItem.name]: DropdownItem,
        [CheckboxGroup.name]: CheckboxGroup,
        [Checkbox.name]: Checkbox,
        [Image.name]: Image,
        [Uploader.name]: Uploader,
        [showNotify.name]: showNotify,
        [showConfirmDialog.name]: showConfirmDialog,
    },
    data() {
        return {
            newProduct: { ...emptyProduct } as Product,
        }
    },
    setup() {
        const showPopup = ref(false);
        const loading = ref(false);
        const file = ref([]) as any;
        const categoryStore = useCategoryStore();
        const productOptionStore = useProductOptionStore();
        const productStore = useProductStore();
        const uploadApi = new UploadImageApi();

        return {
            showPopup,
            loading,
            file,
            categoryStore,
            productOptionStore,
            productStore,
            uploadApi,
        }
    },
    computed: {
        categoryList(): SelectOption[] {
            return this.categoryStore.items.map( (e) => {
                return {text: e.name, value: e.id}
            });
        },
        productOptionList(): SelectOption[] {
            return this.productOptionStore.items.map( (e) => {
                return {text: e.name, value: e.id}
            });
        },
    },
    mounted() {
        this.loadProductList();
        this.loadCategoryList();
        this.loadProductOptionList();
    },
    methods: {
        async loadProductList() {
            await this.productStore.fetch();
        },
        async loadCategoryList() {
            if (this.categoryStore.items.length === 0) {
                await this.categoryStore.adminList();
            }
        },
        async loadProductOptionList() {
            if (this.productOptionStore.items.length === 0) {
                await this.productOptionStore.fetch();
            }
        },
        async showPopupCreate() {
            this.showPopup = true;
            this.resetProduct();
        },
        async createOrUpdate() {
            if (!this.validate()) {
                return;
            }
            this.loading = true;
            // let thumb = {
            //     content: '',
            //     file: {
            //         name: '',
            //         type: '',
            //     }
            // };
            // if (this.file && Array.isArray(this.file) && this.file.length > 0) {
            //     thumb = this.file[0];
            // }

            // Upload image -> update db
            // @todo Fix create product has no id
            // const productThumbName = StringHelper.getProductThumbName(this.newProduct.id?.toString() || StringHelper.generateRandomString(10));
            // const fileExt = StringHelper.getFileExtension(thumb.file.name);
            // const uploadResult = await this.uploadApi.upload(thumb.content, productThumbName + fileExt, thumb.file.type);
            // if (uploadResult.success && uploadResult.fileUrl) {
            //     this.newProduct.thumbnail = uploadResult.fileUrl;
                this.newProduct.thumbnail = '';
                const result = await this.productStore.createOrUpdate({...toRaw(this.newProduct)});
                this.loading = false;

                if (result.success === true) {
                    showNotify({ type: 'success', message: "Lưu thành công!" });
                    this.showPopup = false;
                    this.resetProduct();
                    await this.loadProductList();
                } else {
                    showNotify({ type: 'warning', message: result.message });
                }
            // } else {
            //     showNotify({ type: 'warning', message: uploadResult.error });
            // }
        },
        validate() {
            if (!this.newProduct.categories) {
                showNotify({ type: 'warning', message: "Vui lòng chọn nhóm!" });
                return false;
            }

            return true;
        },
        resetProduct() {
            this.newProduct = { ...emptyProduct };
            this.file = [];
        },
        showPopupUpdate(product: Product) {
            this.showPopup = true;
            this.newProduct = product;
            if (product.thumbnail) {
                this.file = [{url: StringHelper.convertDriveLinkToDirectImageUrl(product.thumbnail), isImage: true}];
            } else {
                this.file = [];
            }
        },
        async deleteProduct(id: number) {
            await showConfirmDialog({
                confirmButtonText: "Xóa",
                confirmButtonColor: "red",
                cancelButtonText: "Hủy",
                title: 'Xóa món',
                message:
                    'Thao tác này không thể hoàn lại, bạn có chắc muốn xóa món này?',
            })
                .then(async () => {
                    // on confirm
                    const result = await this.productStore.delete(id);
                    if (result.success === true) {
                        showNotify({ type: 'success', message: "Đã xóa!" });
                        await this.loadProductList();
                    } else {
                        showNotify({ type: 'warning', message: result.message || 'Lỗi không xác định' });
                    }
                    await this.loadProductList();
                })
                .catch(() => {
                    // on cancel
                });
        },
        getRequireMessage() {
            return "Không được để trống";
        },
        onDeleteImage() {
            // @todo
            // Loading popup when submitting
            // hide welcome if admin
            // fix click outside when preview image of product on desktop screen
            // upload take time to deploy -> find better solution
            this.file = [];
            this.newProduct.thumbnail = '';
        }
    }
})
</script>

<template>
    <div class="m-2">
        <h2 class="subtitle is-7">Danh sách chi tiết từng món (vd: Dưa hấu, Nước mía, Phở bò)</h2>
        <van-button type="primary" size="small" @click="showPopupCreate">
            Thêm món
        </van-button>
    </div>
    <van-list>
        <TransitionGroup name="list">
            <van-cell
                v-for="(item, index) in productStore.items"
                :key="item.id"
                :title="(index + 1) + '. ' + item.name"
            >
                <template #extra>
                    <van-button @click="showPopupUpdate(item)" size="mini" plain type="warning" icon="edit" class="mr-2"/>
                    <van-button @click="deleteProduct(item.id)" size="mini" plain type="danger" icon="cross"/>
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
        <van-nav-bar :title="newProduct.id ? 'Cập nhật thông tin món' : 'Thêm món'" />
        <van-form @submit="createOrUpdate">
            <van-cell-group inset>
                <van-field
                    v-model="newProduct.name"
                    label="Tên"
                    placeholder="Nước dừa..."
                    :rules="[{ required: true, message: getRequireMessage }]"
                />
                <van-field
                    type="number"
                    v-model.number="newProduct.price"
                    label="Đơn giá"
                    placeholder="50000"
                    :rules="[{ required: true, message: getRequireMessage }]"
                />
                <van-field
                    v-model="newProduct.description"
                    label="Mô tả"
                    placeholder="Mô tả chi tiết về món ăn"
                    :rules="[{ required: true, message: getRequireMessage }]"
                />
              <van-field
                  label="Danh mục"
                  style="display: flex; align-items: center;"
              >
                <template #input>
                  <van-checkbox-group shape="square" v-model="newProduct.categories">
                    <van-checkbox
                        v-for="category in categoryList"
                        :name="category.value"
                        :key="category.value"
                        class="m-2"
                    >
                      {{ category.text }}
                    </van-checkbox>
                  </van-checkbox-group>
                </template>
              </van-field>
                <van-field
                    label="Tùy chọn"
                    style="display: flex; align-items: center;"
                >
                    {{ newProduct.options }}
                    <template #input>
                        <van-checkbox-group shape="square" v-model="newProduct.options">
                            <van-checkbox
                                v-for="option in productOptionList"
                                :name="option.value"
                                :key="option.value"
                                class="m-2"
                            >
                                {{ option.text }}
                            </van-checkbox>
                        </van-checkbox-group>
                    </template>
                </van-field>
            </van-cell-group>

            <van-field name="Thumbnail" label="Thumbnail">
                <template #input>
                    <van-uploader
                        @delete="onDeleteImage"
                        v-model="file"
                        :multiple="false"
                        max-count="1" />
                </template>
            </van-field>

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