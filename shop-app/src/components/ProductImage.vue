<template>
  <div class="row flex-center product-image" :style="{ background: product.color + '33', height }">
    <img
      v-if="showImage"
      :src="product.image"
      :alt="product.name"
      class="product-img"
      loading="lazy"
      @error="failed = true"
    />

    <ShirtArt v-else :color="product.color" :category="product.category" :size="artSize" />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import ShirtArt from './ShirtArt.vue'

const props = defineProps({
  product: { type: Object, required: true },
  height: { type: String, default: '180px' },
  artSize: { type: Number, default: 120 },
})

const failed = ref(false)
watch(
  () => props.product.image,
  () => {
    failed.value = false
  },
)
const showImage = computed(() => !!props.product.image && !failed.value)
</script>

<style scoped>
.product-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
</style>
