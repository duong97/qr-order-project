<script setup lang="ts">
import { ref } from 'vue'
import QRCode from 'qrcode'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import {Button} from "vant";

// Mảng string — ví dụ: tên bàn, mã đơn hàng, v.v.
// @todo xử lý tải danh sách mã qr table thật
// @todo xử lý hiện thông tin qr chi tiết hơn
const items = ref<string[]>([
    'Bàn 1',
    'Bàn 2',
    'Bàn 3',
])

const loading = ref(false)
const progress = ref(0)

async function downloadAllQRCodes() {
    loading.value = true
    progress.value = 0

    const zip = new JSZip()

    for (const [index, text] of items.value.entries()) {
        try {
            // Tạo ảnh QR base64
            const dataUrl = await QRCode.toDataURL(text, {
                width: 400,
                margin: 2,
            })
            // Cắt phần prefix "data:image/png;base64,"
            const base64Data = dataUrl.split(',')[1]

            // Thêm vào file zip
            zip.file(`qr-${index + 1}-${text}.png`, base64Data, { base64: true })

            progress.value = Math.round(((index + 1) / items.value.length) * 100)
        } catch (err) {
            console.error('Lỗi tạo QR:', err)
        }
    }

    // Tạo blob ZIP
    const blob = await zip.generateAsync({ type: 'blob' })
    saveAs(blob, 'qrcodes.zip')

    loading.value = false
}
</script>

<template>
    <Button
        @click="downloadAllQRCodes"
        :disabled="loading"
        size="small"
        type="default"
    >
        {{ loading ? `Đang xử lý... ${progress}%` : 'Tải toàn bộ QR (.zip)' }}
    </Button>
</template>