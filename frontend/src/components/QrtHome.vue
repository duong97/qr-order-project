<script setup lang="ts">
import config from '@/config'
import QrtItem from '@/components/QrtItem.vue'
import { Tabs, Tab, SubmitBar, Tag } from 'vant'
import { ref, onMounted, defineOptions } from 'vue'
import { useCartStore } from '@/store/CartStore'
import { useTableStore } from '@/store/TableStore'
import { useProductStore } from '@/store/ProductStore'
import { useCategoryStore } from '@/store/CategoryStore'
import QrtRequest from "@/components/QrtRequest.vue";

// Optional: preserve component name for devtools/keep-alive
defineOptions({ name: 'qrt-home' })

// state
const active = ref(1)

// stores
const cartStore = useCartStore()
const productStore = useProductStore()
const categoryStore = useCategoryStore()
const tableStore = useTableStore()

// actions
const loadProductList = async () => {
  await productStore.fetch()
}

const loadCategoryList = async () => {
  if (categoryStore.items.length === 0) {
    await categoryStore.fetch()
  }
}

onMounted(() => {
  loadProductList()
  loadCategoryList()
})
</script>

<template>
    <!-- BEGIN category tabs -->
    <Tabs v-model:active="active" scrollspy sticky>
        <Tab v-for="category in categoryStore.items" :title="category.name" :name="category.id" :key="category.id">
            <!-- BEGIN list items group by category -->
            <div class="box">
                <p class="title is-4">{{ category.name }}</p>
                <div v-for="item in productStore.items" :key="item.id">
                    <qrt-item :item="item" v-if="item.categories?.includes(category.id)"></qrt-item>
                </div>
            </div>
            <!-- END list items group by category -->
        </Tab>
    </Tabs>
    <!-- END category tabs -->

    <router-link :to="{ path: '/checkout' }">
        <SubmitBar
            :disabled="!cartStore.hasItems()"
            :price="cartStore.totalAmount() / 10"
            :decimal-length="config.decimalLength"
            :currency="config.currency"
            button-text="Checkout"
            button-type="success"
            label="Tổng tiền"
        >
            <Tag size="large" plain type="warning">{{ tableStore.tableName }}</Tag>
        </SubmitBar>
    </router-link>
    <!-- END button checkout -->

    <QrtRequest></QrtRequest>
</template>

<style scoped>
</style>
