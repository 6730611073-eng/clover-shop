import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '../api'

export const useCartStore = defineStore(
  'cart',
  () => {
    const items = ref([]) // { productId, name, price, color, category, size, qty }

    const count = computed(() => items.value.reduce((s, i) => s + i.qty, 0))
    const total = computed(() => items.value.reduce((s, i) => s + i.price * i.qty, 0))

    const add = (product, size) => {
      const found = items.value.find((i) => i.productId === product.id && i.size === size)
      if (found) found.qty++
      else {
        items.value.push({
          productId: product.id,
          name: product.name,
          price: product.price,
          color: product.color,
          category: product.category,
          size,
          qty: 1,
        })
      }
    }
    const changeQty = (index, delta) => {
      const it = items.value[index]
      it.qty += delta
      if (it.qty < 1) items.value.splice(index, 1)
    }
    const remove = (index) => items.value.splice(index, 1)
    const clear = () => {
      items.value = []
    }

    const checkout = async () => {
      const payload = items.value.map((i) => ({ productId: i.productId, size: i.size, qty: i.qty }))
      const { data } = await api.post('/orders', { items: payload })
      clear()
      return data
    }

    return { items, count, total, add, changeQty, remove, clear, checkout }
  },
  { persist: true },
)
