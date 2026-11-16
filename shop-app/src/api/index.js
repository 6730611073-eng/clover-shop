import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.QCLI_API_URL || 'http://localhost:3000/api',
  timeout: 15000,
})


export const errMsg = (e) => {
  if (e.response?.data?.message) return e.response.data.message
  if (e.code === 'ECONNABORTED') return 'เซิร์ฟเวอร์ตอบช้าเกินไป กรุณาลองใหม่'
  if (e.message === 'Network Error') return 'เชื่อมต่อเซิร์ฟเวอร์ไม่ได้'
  return 'เกิดข้อผิดพลาด กรุณาลองใหม่'
}
