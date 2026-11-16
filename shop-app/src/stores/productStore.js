import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api, errMsg } from '../api'

export const useProductStore = defineStore('products', () => {
  const items = ref([])
  const loading = ref(false)
  const saving = ref(false)
  const error = ref('')


  const fetchProducts = async () => {
    loading.value = true
    error.value = ''
    try {
      const { data } = await api.get('/products')
      items.value = data
    } catch (e) {
      error.value = errMsg(e)
    } finally {
      loading.value = false
    }
  }

  const addProduct = async (payload) => {
    saving.value = true
    try {
      const { data } = await api.post('/products', payload)
      items.value.push(data)
      return data
    } finally {
      saving.value = false
    }
  }

  const updateProduct = async (id, payload) => {
    saving.value = true
    try {
      const { data } = await api.put(`/products/${id}`, payload)
      const i = items.value.findIndex((p) => p.id === id)
      if (i !== -1) items.value[i] = data
      return data
    } finally {
      saving.value = false
    }
  }

  const deleteProduct = async (id) => {
    await api.delete(`/products/${id}`)
    items.value = items.value.filter((p) => p.id !== id)
  }

  return { items, loading, saving, error, fetchProducts, addProduct, updateProduct, deleteProduct }
})
