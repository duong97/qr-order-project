<script setup lang="ts">
import {Button, Popup, Cell, Field, showNotify} from "vant";
import {ref} from "vue";
import {PublicApi} from "@/api/public/PublicApi";
import {useTableStore} from "@/store/TableStore";

const isShowPopupRequest = ref<boolean>(false);
const note = ref<string>("");
const publicApi = new PublicApi();
const tableStore = useTableStore();

function submitRequest() {
    isShowPopupRequest.value = false;
    publicApi.createRequest({
        tableId: tableStore.currentTable?.id || 0,
        note: note.value,
        type: 1
    }).then(res => {
        if (res?.success) {
            note.value = "";
            showNotify({ type: "success", message: "Lời nhắn của bạn đã được gửi!" });
        } else {
            showNotify({ type: "warning", message: "Có lỗi khi gửi, vui lòng thử lại trong giây lát!" });
        }
    });
}
</script>

<template>
    <div class="qrt-request">
        <Button icon="bell" type="warning" size="small" @click="isShowPopupRequest = !isShowPopupRequest" />

        <Popup v-model:show="isShowPopupRequest" class="request-popup" round>
            <Cell>
                <Field
                    v-model="note"
                    label="Ghi chú"
                    placeholder="Nhập lời nhắn..."
                />

                <div class="mt-2">
                    <Button size="small" plain @click="isShowPopupRequest = !isShowPopupRequest" class="mr-2">Đóng</Button>
                    <Button size="small" type="warning" @click="submitRequest" class="mb-2 pl-5 pr-5">Gửi</Button>
                </div>
            </Cell>
        </Popup>
    </div>
</template>

<style scoped>
.qrt-request {
    position: fixed;
    bottom: calc(var(--van-submit-bar-height) + 10px);
    right: 10px;
}
.qrt-request .request-popup {
    padding: 20px;
}
</style>