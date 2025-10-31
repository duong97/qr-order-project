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
    Tag,
    showNotify,
    showConfirmDialog,
} from "vant";
import {useTableStore} from "@/store/TableStore";
import Table from "@/interface/Table";
import ShowQrCode from "@/components/ShowQrCode.vue";
import QrBatchDownloader from "@/components/QrBatchDownloader.vue";

const showPopup = ref(false);
const loading = ref(false);
const tableStore = useTableStore();
const emptyTable = {
    id: undefined,
    name: "",
    code: "",
};
const currentTable = ref<Table>({...emptyTable});

const loadTableList = () => tableStore.adminList();

const createOrUpdate = async () => {
    loading.value = true;
    const result = await tableStore.createOrUpdate(toRaw(currentTable.value));
    loading.value = false;

    if (result.success) {
        showNotify({ type: "success", message: "Lưu thành công!" });
        showPopup.value = false;
        currentTable.value = { id: undefined, name: "" };
        await loadTableList();
    } else {
        showNotify({ type: "warning", message: result.message });
    }
};

const showPopupUpdate = (table: Table) => {
    showPopup.value = true;
    currentTable.value = { ...table };
};

const showPopupCreate = () => {
    showPopup.value = true;
    currentTable.value = structuredClone(emptyTable);
};

const deleteTable = async (id: number) => {
    await showConfirmDialog({
        confirmButtonText: "Xóa",
        confirmButtonColor: "red",
        cancelButtonText: "Hủy",
        title: "Xác nhận",
        message: "Thao tác này không thể hoàn lại, bạn có chắc muốn xóa?",
    })
        .then(async () => {
            const result = await tableStore.delete(id);
            if (result.success) {
                showNotify({ type: "success", message: "Đã xóa!" });
            } else {
                showNotify({
                    type: "warning",
                    message: result.message || "Lỗi không xác định",
                });
            }
            await loadTableList();
        })
        .catch((err) => {
            console.log(err);
        });
};

const getRequireMessage = () => "Không được để trống";

onMounted(loadTableList);
</script>

<template>
    <div class="m-2">
        <h2 class="subtitle is-7">
            Dùng để quản lý danh sách các bàn hoặc kênh (vd kênh online, tại quầy, app food,...)
        </h2>
        <Button type="primary" size="small" @click="showPopupCreate()" class="mr-2">
            Thêm mới
        </Button>
        <QrBatchDownloader />
    </div>

    <List>
        <TransitionGroup name="list">
            <Cell
                v-for="(item, index) in tableStore.items"
                :key="item.id"
            >
                <template #title>
                    {{ (index + 1) + '. ' }}
                    <Tag type="primary" plain>{{ item.code }}</Tag>
                    {{ item.name }}
                </template>
                <template #extra>
                    <Button
                        @click="deleteTable(item.id)"
                        size="mini"
                        plain
                        type="danger"
                        icon="cross"
                        class="mr-2"
                    />
                    <Button
                        @click="showPopupUpdate(item)"
                        size="mini"
                        plain
                        type="warning"
                        icon="edit"
                        class="mr-2"
                    />
                    <ShowQrCode :texts_to_show="['test ne']"></ShowQrCode>
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
        <NavBar :title="currentTable.id ? `Cập nhật bàn #${currentTable.id}` : 'Thêm mới'" />
        <Form @submit="createOrUpdate">
            <CellGroup inset>
                <Field
                    v-model="currentTable.name"
                    label="Tên"
                    placeholder="A1..."
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
