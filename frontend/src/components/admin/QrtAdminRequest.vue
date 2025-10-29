<script setup lang="ts">
import { ref, onMounted } from "vue";
import {
    Button,
    Popup,
    List,
    Cell,
    Tag,
    Badge, NavBar,
} from "vant";
import {useRequestStore} from "@/store/RequestStore";
import {formatTime } from '@/utils/format'
import {initRequestSocket} from "@/plugin/requestSocket";

const requestStore = useRequestStore();
const isShowPopupRequestAdmin = ref<boolean>(false);

onMounted(() => {
    requestStore.fetch();
    initRequestSocket();
});
</script>

<template>
    <div>
        <Badge :content="requestStore.items.length || null">
            <Button icon="fire" type="warning" size="mini" plain @click="isShowPopupRequestAdmin = !isShowPopupRequestAdmin" />
        </Badge>

        <Popup v-model:show="isShowPopupRequestAdmin" class="request-admin-popup" position="bottom" teleport="body">
            <NavBar title="Yêu cầu hỗ trợ" />
            <List>
                <TransitionGroup name="list">
                    <Cell
                        v-for="(item) in requestStore.items"
                        :key="item.id"
                        :label="item.note"
                        :value="formatTime(item.createdAt)"
                    >
                        <template #title>
                            <Tag type="primary" plain>{{ item.table?.name }}</Tag>
                        </template>
                    </Cell>
                </TransitionGroup>
            </List>
        </Popup>
    </div>
</template>

<style scoped>
.request-admin-popup {
    max-height: 80vh;
}
</style>
