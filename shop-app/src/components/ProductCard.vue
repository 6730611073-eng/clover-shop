<template>
  <q-card flat bordered class="cursor-pointer product-card" @click="emit('select', product)">
    <ProductImage :product="product" height="220px" :art-size="120" />
    <q-card-section>
      <div class="text-caption text-grey-7">{{ product.category }}</div>
      <div class="text-subtitle1 text-weight-medium ellipsis">{{ product.name }}</div>
      <div class="text-h6">฿{{ product.price.toLocaleString('th-TH') }}</div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import ProductImage from './ProductImage.vue'

defineProps({ product: { type: Object, required: true } })
const emit = defineEmits(['select'])
</script>
