import { createRouter, createWebHistory } from 'vue-router'
import { Notify } from 'quasar'
import routes from './routes'
import { useAuthStore } from '../stores/authStore'

export default function () {

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createWebHistory(import.meta.env.BASE_URL),
  })

  Router.beforeEach(async (to) => {
    const auth = useAuthStore()


    if (auth.token && !auth.checked) await auth.checkAuth()

    if (to.meta.requiresAuth && !auth.isLoggedIn) {
      Notify.create({ type: 'warning', message: 'กรุณาเข้าสู่ระบบก่อน' })
      return { path: '/login', query: { redirect: to.fullPath } }
    }
    if (to.meta.roles && !to.meta.roles.includes(auth.user?.role)) {
      Notify.create({ type: 'negative', message: 'คุณไม่มีสิทธิ์เข้าหน้านี้' })
      return '/'
    }
    if (to.path === '/login' && auth.isLoggedIn) return '/'
  })

  return Router
}
