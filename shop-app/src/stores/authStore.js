import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '../api'

export const useAuthStore = defineStore(
  'auth',
  () => {

    const token = ref('')
    const user = ref(null)
    const checked = ref(false) // ตรวจ token กับ server แล้วหรือยัง (ไม่ persist)

    const isLoggedIn = computed(() => !!token.value && !!user.value)
    const isAdmin = computed(() => user.value?.role === 'admin')


    const login = async (username, password) => {
      const { data } = await api.post('/auth/login', { username, password })
      token.value = data.token
      user.value = data.user
      checked.value = true
    }
    const register = async (payload) => {
      await api.post('/auth/register', payload)
      await login(payload.username, payload.password)
    }
    const logout = () => {
      token.value = ''
      user.value = null
      checked.value = false
    }
    const checkAuth = async () => {
      checked.value = true
      if (!token.value) return
      try {
        const { data } = await api.get('/auth/me')
        user.value = data
      } catch {
        logout()
      }
    }

    return { token, user, checked, isLoggedIn, isAdmin, login, register, logout, checkAuth }
  },
  { persist: { pick: ['token', 'user'] } },
)
