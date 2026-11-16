<template>
  <q-layout view="hHh lpR fFf">
    <q-header bordered class="bg-white text-dark">
      <q-toolbar>
        <q-toolbar-title class="text-weight-bolder cursor-pointer" @click="router.push('/')">
          CLOVER
        </q-toolbar-title>

        <q-btn flat no-caps label="ร้านค้า" to="/" class="gt-xs" />
        <q-btn v-if="auth.isAdmin" flat no-caps label="จัดการร้าน" to="/admin" />

        <q-btn flat round icon="shopping_bag" to="/cart" aria-label="ตะกร้าสินค้า">
          <q-badge v-if="cart.count" color="primary" floating>{{ cart.count }}</q-badge>
        </q-btn>

        <q-btn v-if="!auth.isLoggedIn" unelevated color="primary" no-caps label="เข้าสู่ระบบ" to="/login" />
        <q-btn-dropdown v-else flat no-caps :label="auth.user.name">
          <q-list>
            <q-item-label header>{{ auth.user.role === 'admin' ? 'ผู้ดูแลระบบ' : 'ลูกค้า' }}</q-item-label>
            <q-item v-close-popup clickable @click="onLogout">
              <q-item-section>ออกจากระบบ</q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />

      <div class="column items-center q-pa-xl q-mt-xl brand-footer" style="border-top: 1px solid #ddd">
        <div class="text-h2 text-weight-bolder">CLOVER</div>
      </div>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAuthStore } from '../stores/authStore'
import { useCartStore } from '../stores/cartStore'

const router = useRouter()
const $q = useQuasar()
const auth = useAuthStore()
const cart = useCartStore()

const onLogout = () => {
  auth.logout()
  router.push('/')
  try {
    $q.notify({ message: 'ออกจากระบบแล้ว' })
  } catch (e) {
    console.error('Notify error:', e)
  }
}
</script>
