<template>
  <svg viewBox="0 0 100 100" :width="size" :height="size" aria-hidden="true">
    <template v-if="type === 'cap'">
      <path d="M20 62c0-24 14-36 32-36s30 12 30 36z" :fill="color" />
      <path d="M60 62h34c0 6-10 10-34 10z" :fill="color" stroke="rgba(0,0,0,.25)" />
    </template>
    <template v-else>
      <path
        d="M33 12l-25 14 8 18 12-5v43h44V39l12 5 8-18-25-14c-3 7-10 11-17 11s-14-4-17-11z"
        :fill="color"
        stroke="rgba(0,0,0,.25)"
        stroke-width="1.2"
      />
      <path
        v-if="type === 'hood'"
        d="M38 12c4 10 20 10 24 0"
        fill="none"
        stroke="rgba(0,0,0,.35)"
        stroke-width="3"
      />
      <circle cx="50" cy="46" r="8" fill="none" stroke="rgba(128,128,128,.7)" stroke-width="3" />
    </template>
  </svg>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  color: { type: String, default: '#cccccc' },
  category: { type: String, default: 'Tees' },
  size: { type: [Number, String], default: 120 },
})

const type = computed(() =>
  props.category === 'Hoodie' ? 'hood' : props.category === 'Cap' ? 'cap' : 'tee',
)
</script>
