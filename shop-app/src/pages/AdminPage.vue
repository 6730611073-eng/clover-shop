<template>
  <q-page padding style="max-width: 1100px; margin: 0 auto">
    <div class="text-h5 text-weight-bold q-mb-md">จัดการร้าน</div>

    <q-tabs v-model="tab" align="left" active-color="primary" class="q-mb-md">
      <q-tab name="products" label="สินค้า" no-caps />
      <q-tab name="orders" label="ออเดอร์" no-caps />
    </q-tabs>

    <q-tab-panels v-model="tab" animated class="bg-transparent">

      <q-tab-panel name="products" class="q-pa-none">
        <q-banner v-if="store.error" rounded class="bg-red-1 text-negative q-mb-md">
          {{ store.error }}
          <template #action><q-btn flat no-caps label="ลองใหม่" @click="store.fetchProducts()" /></template>
        </q-banner>

        <q-table
          flat
          bordered
          title="รายการสินค้า"
          :rows="store.items"
          :columns="productColumns"
          row-key="id"
          :loading="store.loading"
          :filter="filter"
          no-data-label="ยังไม่มีสินค้า"
        >
          <template #top-right>
            <q-input v-model="filter" dense outlined placeholder="ค้นหา" class="q-mr-md">
              <template #append><q-icon name="search" /></template>
            </q-input>
            <q-btn unelevated color="primary" no-caps icon="add" label="เพิ่มสินค้า" @click="openForm(null)" />
          </template>
          <template #body-cell-color="props">
            <q-td :props="props">
              <div :style="{ background: props.row.color, width: '24px', height: '24px', borderRadius: '6px', border: '1px solid #ccc', display: 'inline-block' }" />
            </q-td>
          </template>
          <template #body-cell-actions="props">
            <q-td :props="props">
              <q-btn flat round dense icon="edit" aria-label="แก้ไข" @click="openForm(props.row)" />
              <q-btn flat round dense color="negative" icon="delete_outline" aria-label="ลบ" @click="onDelete(props.row)" />
            </q-td>
          </template>
        </q-table>
      </q-tab-panel>


      <q-tab-panel name="orders" class="q-pa-none">
        <q-banner v-if="orderStore.error" rounded class="bg-red-1 text-negative q-mb-md">
          {{ orderStore.error }}
          <template #action><q-btn flat no-caps label="ลองใหม่" @click="orderStore.fetchOrders()" /></template>
        </q-banner>
        <q-table
          flat
          bordered
          title="ออเดอร์ทั้งหมด"
          :rows="orderStore.items"
          :columns="orderColumns"
          row-key="id"
          :loading="orderStore.loading"
          no-data-label="ยังไม่มีออเดอร์"
        />
      </q-tab-panel>
    </q-tab-panels>

    <ProductFormDialog v-model="showForm" :product="editing" />
  </q-page>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useProductStore } from '../stores/productStore'
import { useOrderStore } from '../stores/orderStore'
import ProductFormDialog from '../components/ProductFormDialog.vue'
import { errMsg } from '../api'

const $q = useQuasar()
const store = useProductStore()
const orderStore = useOrderStore()

const tab = ref('products')
const filter = ref('')
const showForm = ref(false)
const editing = ref(null)

const productColumns = [
  { name: 'id', label: 'ID', field: 'id', align: 'left', sortable: true },
  { name: 'name', label: 'ชื่อสินค้า', field: 'name', align: 'left', sortable: true },
  { name: 'category', label: 'หมวดหมู่', field: 'category', align: 'left', sortable: true },
  { name: 'price', label: 'ราคา', field: 'price', align: 'right', sortable: true, format: (v) => `฿${v.toLocaleString('th-TH')}` },
  { name: 'color', label: 'สี', field: 'color', align: 'center' },
  { name: 'actions', label: 'จัดการ', field: 'actions', align: 'center' },
]
const orderColumns = [
  { name: 'id', label: 'ออเดอร์', field: 'id', align: 'left', sortable: true, format: (v) => `#${v}` },
  { name: 'username', label: 'ลูกค้า', field: 'username', align: 'left' },
  { name: 'items', label: 'รายการ', field: (o) => o.items.map((i) => `${i.name} (${i.size}) x${i.qty}`).join(', '), align: 'left' },
  { name: 'total', label: 'รวม', field: 'total', align: 'right', format: (v) => `฿${v.toLocaleString('th-TH')}` },
  { name: 'createdAt', label: 'เวลา', field: 'createdAt', align: 'left', format: (v) => new Date(v).toLocaleString('th-TH') },
]

const openForm = (row) => {
  editing.value = row
  showForm.value = true
}

const onDelete = (row) => {
  $q.dialog({
    title: 'ลบสินค้า',
    message: `ต้องการลบ "${row.name}" ใช่ไหม`,
    cancel: { label: 'ยกเลิก', flat: true },
    ok: { label: 'ลบ', color: 'negative' },
    persistent: true,
  }).onOk(async () => {
    $q.loading.show({ message: 'กำลังลบ...' })
    try {
      await store.deleteProduct(row.id)
      $q.notify({ type: 'positive', message: 'ลบสินค้าแล้ว' })
    } catch (e) {
      $q.notify({ type: 'negative', message: errMsg(e) })
    } finally {
      $q.loading.hide()
    }
  })
}

watch(tab, (t) => {
  if (t === 'orders') orderStore.fetchOrders()
})
onMounted(() => store.fetchProducts())
</script>
