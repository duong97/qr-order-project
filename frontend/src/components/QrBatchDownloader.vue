<script setup lang="ts">
import { ref } from 'vue'
import {Button} from "vant";
import {QrCodeHelper} from "@/helpers/QrCodeHelper";
import QrData from "@/interface/QrData";

interface Props {
    qrData: QrData[],
    btnLabel?: string,
}
const props = defineProps<Props>()
const progress = ref(-1)

async function downloadAllQRCodes() {
    await QrCodeHelper.download(props.qrData, "Danh sách QR Code", progress)
}
</script>

<template>
    <Button
        @click="downloadAllQRCodes"
        :disabled="progress >= 0"
        size="small"
        type="default"
        icon="down"
    >
        {{ progress >= 0 ? `Đang xử lý... ${progress}%` : props.btnLabel || 'Tải toàn bộ QR (.zip)' }}
    </Button>
</template>