<template>
  <q-page padding class="flex flex-center">
    <q-card flat bordered style="width: 400px; max-width: 100%">
      <q-form @submit="onSubmit">
        <q-card-section>
          <div class="text-h5 text-weight-bold">{{ isRegister ? 'สมัครสมาชิก' : 'เข้าสู่ระบบ' }}</div>
          <q-banner v-if="!isRegister" rounded dense class="bg-blue-1 text-blue-10 q-mt-md">
            บัญชีทดลอง: <b>admin</b> หรือ <b>user</b> รหัสผ่าน <b>123456</b>
          </q-banner>
        </q-card-section>

        <q-card-section class="q-gutter-md">
          <q-input v-if="isRegister" v-model="form.name" outlined label="ชื่อที่แสดง" :rules="[(v) => !!v?.trim() || 'กรุณากรอกชื่อ']" />
          <q-input
            v-model="form.username"
            outlined
            label="ชื่อผู้ใช้"
            autocomplete="username"
            :rules="[(v) => !!v || 'กรุณากรอกชื่อผู้ใช้', (v) => !isRegister || v.length >= 3 || 'อย่างน้อย 3 ตัวอักษร']"
          />
          <q-input
            v-model="form.password"
            outlined
            label="รหัสผ่าน"
            :type="showPw ? 'text' : 'password'"
            :autocomplete="isRegister ? 'new-password' : 'current-password'"
            :rules="[(v) => !!v || 'กรุณากรอกรหัสผ่าน', (v) => !isRegister || v.length >= 6 || 'อย่างน้อย 6 ตัวอักษร']"
          >
            <template #append>
              <q-icon :name="showPw ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="showPw = !showPw" />
            </template>
          </q-input>
          <q-input
            v-if="isRegister"
            v-model="form.confirm"
            outlined
            type="password"
            label="ยืนยันรหัสผ่าน"
            autocomplete="new-password"
            :rules="[(v) => v === form.password || 'รหัสผ่านไม่ตรงกัน']"
          />
        </q-card-section>

        <q-card-actions vertical class="q-px-md q-pb-md">
          <q-btn unelevated color="primary" no-caps type="submit" :label="isRegister ? 'สมัครสมาชิก' : 'เข้าสู่ระบบ'" :loading="loading" />
          <q-btn flat no-caps class="q-mt-sm" :label="isRegister ? 'มีบัญชีแล้ว? เข้าสู่ระบบ' : 'ยังไม่มีบัญชี? สมัครสมาชิก'" @click="isRegister = !isRegister" />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAuthStore } from '../stores/authStore'
import { errMsg } from '../api'

const route = useRoute()
const router = useRouter()
const $q = useQuasar()
const auth = useAuthStore()

const isRegister = ref(false)
const showPw = ref(false)
const loading = ref(false)
const form = reactive({ name: '', username: '', password: '', confirm: '' })

const onSubmit = async () => {
  loading.value = true
  try {
    if (isRegister.value) {
      await auth.register({ name: form.name.trim(), username: form.username, password: form.password })
      $q.notify({ type: 'positive', message: 'สมัครสมาชิกสำเร็จ' })
    } else {
      await auth.login(form.username, form.password)
      $q.notify({ type: 'positive', message: `ยินดีต้อนรับ ${auth.user.name}` })
    }
    // กลับไปหน้าที่ตั้งใจจะเข้า (ป้องกัน open redirect: ต้องขึ้นต้นด้วย / ตัวเดียว)
    const target = String(route.query.redirect || '/')
    router.push(target.startsWith('/') && !target.startsWith('//') ? target : '/')
  } catch (e) {
    $q.notify({ type: 'negative', message: errMsg(e) })
  } finally {
    loading.value = false
  }
}
</script>
