<script setup lang="ts">
import { watchEffect, onMounted, ref } from "vue";
import QRCode from 'qrcode'
import {Button, NavBar, Popup} from "vant";
import Table from "@/interface/Table";
import {QrCodeHelper} from "@/helpers/QrCodeHelper";

interface Props {
    table?: Table
}
const props = defineProps<Props>()

const previews = ref<string[]>([])
const isShowPopupQrCode = ref<boolean>(false)

// @todo show xử lý qr code là link của bàn
// @todo xử lý tạo 1 config
const downloadTableQr = async () => {
    if (props.table?.id) {
        await QrCodeHelper.download(
            [{content: (props.table.orderLink || '').toString(), label: `${props.table.code} - ${props.table.name}`}],
            `QR code ${props.table.code} ${props.table.name}`
        )
    }
}

watchEffect(async () => {
    if (props.table?.orderLink) {
        previews.value = await Promise.all(
            [(props.table.orderLink || '').toString()].map(async (text) => {
                // @todo later: đưa size vào config
                return await QRCode.toDataURL(text, { width: 120, margin: 1 })
            })
        )
    }
})
</script>

<template>
    <Button
        @click="isShowPopupQrCode = !isShowPopupQrCode"
        size="mini"
        plain
        icon="info-o"
    />

    <Popup
        v-model:show="isShowPopupQrCode"
        position="bottom"
        teleport="body"
    >
        <NavBar :title="`QR code ${table?.name} - ${table?.code}`" />
        <div class="qr-code-wrapper has-text-centered my-3">
            <div v-for="(src, i) in previews" :key="i">
                <img :src="src" alt="QR preview"/>
                <p class="mt-1">
                    <Button type="primary" icon="down" size="small" @click="downloadTableQr">Tải xuống</Button>
                </p>
            </div>
        </div>
    </Popup>
</template>

<style scoped>
</style>
