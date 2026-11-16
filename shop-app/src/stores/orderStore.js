import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api, errMsg } from '../api'

export const useOrderStore = defineStore('orders', () => {
  const items = ref([])
  const loading = ref(false)
  const error = ref('')

  const fetchOrders = async () => {
    loading.value = true
    error.value = ''
    try {
      const { data } = await api.get('/orders')
      items.value = data
    } catch (e) {
      error.value = errMsg(e)
    } finally {
      loading.value = false
    }
  }

  return { items, loading, error, fetchOrders }
})
