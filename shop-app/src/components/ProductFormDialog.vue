<template>
  <q-dialog :model-value="modelValue" persistent @update:model-value="emit('update:modelValue', $event)">
    <q-card style="width: 420px; max-width: 92vw">
      <q-form @submit="onSubmit">
        <q-card-section>
          <div class="text-h6">{{ product ? 'แก้ไขสินค้า' : 'เพิ่มสินค้า' }}</div>
        </q-card-section>
        <q-card-section class="q-gutter-md">
          <q-input
            v-model="form.name"
            outlined
            label="ชื่อสินค้า"
            :rules="[(v) => !!v?.trim() || 'กรุณากรอกชื่อสินค้า']"
          />
          <q-select
            v-model="form.category"
            outlined
            label="หมวดหมู่"
            :options="categories"
            :rules="[(v) => !!v || 'กรุณาเลือกหมวดหมู่']"
          />
          <q-input
            v-model.number="form.price"
            outlined
            type="number"
            label="ราคา (บาท)"
            :rules="[(v) => v > 0 || 'ราคาต้องมากกว่า 0']"
          />
          <q-input v-model="form.color" outlined type="color" label="สีสินค้า" />
                    <q-input
            v-model="form.image"
            outlined
            clearable
            label="รูปสินค้า (ไม่บังคับ)"
            hint="เช่น /images/tee-white.jpg หรือลิงก์ https://..."
            :rules="[(v) => !v || v.startsWith('/') || /^https?:\/\//.test(v) || 'ต้องขึ้นต้นด้วย / หรือ https://']"
          />
        </q-card-section>
        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat no-caps label="ยกเลิก" :disable="store.saving" v-close-popup />
          <q-btn unelevated color="primary" no-caps type="submit" label="บันทึก" :loading="store.saving" />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { reactive, watch } from 'vue'
import { useQuasar } from 'quasar'
import { useProductStore } from '../stores/productStore'
import { errMsg } from '../api'

const props = defineProps({
  modelValue: Boolean,
  product: { type: Object, default: null }, // null = เพิ่มใหม่
})
const emit = defineEmits(['update:modelValue'])

const $q = useQuasar()
const store = useProductStore()
const categories = ['Tees', 'Oversize', 'Hoodie', 'Cap']
const form = reactive({ name: '', category: 'Tees', price: 299, color: '#2b4bff', image: '' })



watch(
  () => props.modelValue,
  (open) => {
    if (!open) return
        if (props.product) Object.assign(form, { image: '' }, props.product)
    else Object.assign(form, { name: '', category: 'Tees', price: 299, color: '#2b4bff', image: '' })
  },
)

const onSubmit = async () => {
  const payload = { name: form.name, category: form.category, price: form.price, color: form.color, image: form.image || '' }
    try {
    if (props.product) await store.updateProduct(props.product.id, payload)
    else await store.addProduct(payload)
    $q.notify({ type: 'positive', message: props.product ? 'แก้ไขสินค้าแล้ว' : 'เพิ่มสินค้าแล้ว' })
    emit('update:modelValue', false)
  } catch (e) {
    $q.notify({ type: 'negative', message: errMsg(e) })
  }
}
</script>
