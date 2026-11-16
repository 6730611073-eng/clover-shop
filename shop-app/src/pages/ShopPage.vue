<template>
  <q-page padding style="max-width: 1100px; margin: 0 auto">
    <div class="row items-center q-col-gutter-md q-mb-md">
      <div class="col-12 col-sm">
        <div class="text-h5 text-weight-bold">สินค้าทั้งหมด</div>
      </div>
      <div class="col-12 col-sm-5">
        <q-input v-model="search" dense outlined rounded clearable placeholder="ค้นหาสินค้า" bg-color="white">
          <template #prepend><q-icon name="search" /></template>
        </q-input>
      </div>
    </div>

    <div class="q-mb-md">
      <q-chip
        v-for="c in categories"
        :key="c"
        clickable
        :color="c === category ? 'dark' : 'white'"
        :text-color="c === category ? 'white' : 'dark'"
        @click="category = c"
      >
        {{ c }}
      </q-chip>
    </div>

    <div v-if="store.loading" class="row q-col-gutter-md">
      <div v-for="n in 8" :key="n" class="col-6 col-sm-4 col-md-3">
        <q-skeleton height="280px" />
      </div>
    </div>


    <q-banner v-else-if="store.error" rounded class="bg-red-1 text-negative">
      {{ store.error }}
      <template #action>
        <q-btn flat no-caps label="ลองใหม่" @click="store.fetchProducts()" />
      </template>
    </q-banner>


    <div v-else-if="filtered.length === 0" class="text-center text-grey-7 q-pa-xl">
      ไม่พบสินค้าที่ค้นหา ลองเปลี่ยนคำค้นหรือหมวดหมู่
    </div>


    <div v-else class="row q-col-gutter-md">
      <div v-for="p in filtered" :key="p.id" class="col-6 col-sm-4 col-md-3">
        <ProductCard :product="p" @select="openProduct" />
      </div>
    </div>

    <ProductDialog v-model="showDialog" :product="selected" @add="onAdd" />
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useProductStore } from '../stores/productStore'
import { useCartStore } from '../stores/cartStore'
import ProductCard from '../components/ProductCard.vue'
import ProductDialog from '../components/ProductDialog.vue'

const $q = useQuasar()
const store = useProductStore()
const cart = useCartStore()

const search = ref('')
const category = ref('ทั้งหมด')
const selected = ref(null)
const showDialog = ref(false)

const categories = computed(() => ['ทั้งหมด', ...new Set(store.items.map((p) => p.category))])
const filtered = computed(() => {
  const kw = (search.value || '').toLowerCase()
  return store.items.filter(
    (p) =>
      (category.value === 'ทั้งหมด' || p.category === category.value) &&
      p.name.toLowerCase().includes(kw),
  )
})

const openProduct = (p) => {
  selected.value = p
  showDialog.value = true
}
const onAdd = (size) => {
  cart.add(selected.value, size)
  $q.notify({ type: 'positive', message: `เพิ่ม ${selected.value.name} ไซส์ ${size} แล้ว`, timeout: 1500 })
}

onMounted(() => store.fetchProducts())
</script>
