<template>
  <q-page padding style="max-width: 900px; margin: 0 auto">
    <div class="text-h5 text-weight-bold q-mb-md">ตะกร้าสินค้า</div>

    <div v-if="cart.items.length === 0" class="text-center q-pa-xl text-grey-7">
      <q-icon name="shopping_bag" size="64px" />
      <div class="q-my-md">ตะกร้ายังว่าง</div>
      <q-btn unelevated color="primary" no-caps label="ไปเลือกสินค้า" to="/" />
    </div>

    <template v-else>
      <q-table flat bordered :rows="rows" :columns="columns" row-key="key" hide-pagination :rows-per-page-options="[0]">
        <template #body-cell-qty="props">
          <q-td :props="props">
            <q-btn flat round dense icon="remove" aria-label="ลดจำนวน" @click="cart.changeQty(props.row.index, -1)" />
            <span class="q-mx-sm">{{ props.row.qty }}</span>
            <q-btn flat round dense icon="add" aria-label="เพิ่มจำนวน" @click="cart.changeQty(props.row.index, 1)" />
          </q-td>
        </template>
        <template #body-cell-actions="props">
          <q-td :props="props">
            <q-btn flat round dense color="negative" icon="delete_outline" aria-label="ลบรายการ" @click="cart.remove(props.row.index)" />
          </q-td>
        </template>
      </q-table>

      <div class="row items-center justify-between q-mt-md">
        <div class="text-h6">รวม ฿{{ cart.total.toLocaleString('th-TH') }}</div>
        <q-btn unelevated color="primary" no-caps label="สั่งซื้อ" :loading="loading" @click="onCheckout" />
      </div>
    </template>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useCartStore } from '../stores/cartStore'
import { errMsg } from '../api'

const router = useRouter()
const $q = useQuasar()
const cart = useCartStore()
const loading = ref(false)

const columns = [
  { name: 'name', label: 'สินค้า', field: 'name', align: 'left' },
  { name: 'size', label: 'ไซส์', field: 'size', align: 'center' },
  { name: 'price', label: 'ราคา', field: (r) => `฿${r.price.toLocaleString('th-TH')}`, align: 'right' },
  { name: 'qty', label: 'จำนวน', field: 'qty', align: 'center' },
  { name: 'sub', label: 'รวม', field: (r) => `฿${(r.price * r.qty).toLocaleString('th-TH')}`, align: 'right' },
  { name: 'actions', label: '', field: 'actions', align: 'center' },
]
const rows = computed(() =>
  cart.items.map((it, index) => ({ ...it, index, key: `${it.productId}-${it.size}` })),
)

const onCheckout = async () => {
  loading.value = true
  try {
    const order = await cart.checkout()
    $q.notify({ type: 'positive', message: `สั่งซื้อสำเร็จ หมายเลขออเดอร์ #${order.id}` })
    router.push('/')
  } catch (e) {
    $q.notify({ type: 'negative', message: errMsg(e) })
  } finally {
    loading.value = false
  }
}
</script>
