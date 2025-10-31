<script setup lang="ts">
import { watchEffect, onMounted, ref } from "vue";
import QRCode from 'qrcode'
import {Button, NavBar, Popup} from "vant";

interface Props {
    texts_to_show: string[]
}
const props = defineProps<Props>()

const previews = ref<string[]>([])
const isShowPopupQrCode = ref<boolean>(false)

watchEffect(async () => {
    console.log('props.texts_to_show', props.texts_to_show)
    if (props.texts_to_show) {
        previews.value = await Promise.all(
            props.texts_to_show.map(async (text) => {
                return await QRCode.toDataURL(text, { width: 120, margin: 1 })
            })
        )
        console.log('previews.value', previews.value)
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
        <NavBar title="QR code" />
        <div class="qr-code-wrapper has-text-centered my-3">
            <div v-for="(src, i) in previews" :key="i">
                <img :src="src" alt="QR preview"/>
                <p>Thông tin mã QR code</p>
            </div>
        </div>
    </Popup>
</template>

<style scoped>
</style>
