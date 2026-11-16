import { Notify } from 'quasar'
import { api } from '../api'
import { useAuthStore } from '../stores/authStore'

export default ({ router }) => {

  api.interceptors.request.use((config) => {
    const auth = useAuthStore()
    if (auth.token) config.headers.Authorization = `Bearer ${auth.token}`
    return config
  })


  api.interceptors.response.use(
    (res) => res,
    (error) => {
      const auth = useAuthStore()
      if (error.response?.status === 401 && auth.token) {
        auth.logout()
        Notify.create({ type: 'warning', message: 'เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่' })
        router.push('/login')
      }
      return Promise.reject(error)
    },
  )
}
