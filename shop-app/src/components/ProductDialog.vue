<template>
  <q-dialog :model-value="modelValue" @update:model-value="emit('update:modelValue', $event)">
    <q-card v-if="product" style="width: 420px; max-width: 92vw">
      <ProductImage :product="product" height="260px" :art-size="160" />
      <q-card-section>
        <div class="text-h6">{{ product.name }}</div>
        <div class="text-subtitle1 text-grey-8">฿{{ product.price.toLocaleString('th-TH') }}</div>
        <div class="text-caption q-mt-md q-mb-xs">เลือกไซส์</div>
        <q-btn-toggle
          v-model="size"
          no-caps
          unelevated
          toggle-color="dark"
          color="grey-3"
          text-color="dark"
          :options="sizes.map((s) => ({ label: s, value: s }))"
        />
      </q-card-section>
      <q-card-actions align="right" class="q-pa-md">
        <q-btn flat no-caps label="ปิด" v-close-popup />
        <q-btn unelevated color="primary" no-caps label="ใส่ตะกร้า" @click="onAdd" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import ProductImage from './ProductImage.vue'

const props = defineProps({
  modelValue: Boolean,
  product: { type: Object, default: null },
})
const emit = defineEmits(['update:modelValue', 'add'])

const isCap = computed(() => props.product?.category === 'Cap')
const sizes = computed(() => (isCap.value ? ['Free'] : ['S', 'M', 'L', 'XL']))
const size = ref('M')

watch(
  () => props.product,
  () => {
    size.value = isCap.value ? 'Free' : 'M'
  },
)

const onAdd = () => {
  emit('add', size.value)
  emit('update:modelValue', false)
}
</script>
