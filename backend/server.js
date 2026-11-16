
import express from 'express'
import cors from 'cors'
import jwt from 'jsonwebtoken'

const app = express()
const PORT = process.env.PORT || 3000
const SECRET = process.env.JWT_SECRET || 'dev-secret-change-me'
const CATEGORIES = ['Tees', 'Oversize', 'Hoodie', 'Cap']

app.use(cors())
app.use(express.json())

const users = [
  { id: 1, username: 'admin', password: '123456', name: 'Admin', role: 'admin' },
{ id: 2, username: 'user', password: '123456', name: 'User', role: 'customer' },]
let products = [
  { id: 1, name: 'เสื้อยืดคอกลม ขาว', category: 'Tees', price: 249, color: '#f4f4ef', image: '/images/tee-white.jpg' },
  { id: 2, name: 'เสื้อยืดคอกลม ดำ', category: 'Tees', price: 249, color: '#15171c', image: '/images/tee-black.jpg' },
  { id: 3, name: 'เสื้อยืดลายวงกลม ฟ้า', category: 'Tees', price: 299, color: '#7da7d9', image: '/images/tee-blue.jpg' },
  { id: 4, name: 'เสื้อโอเวอร์ไซส์ เทา', category: 'Oversize', price: 389, color: '#a9afb8', image: '/images/oversize-grey.jpg' },
  { id: 5, name: 'เสื้อโอเวอร์ไซส์ ส้ม', category: 'Oversize', price: 389, color: '#e8793a', image: '/images/oversize-orange.jpg' },
  { id: 6, name: 'ฮู้ดดี้ น้ำเงิน', category: 'Hoodie', price: 790, color: '#2b4bff', image: '/images/hoodie-blue.jpg' },
  { id: 7, name: 'ฮู้ดดี้ ดำ', category: 'Hoodie', price: 790, color: '#15171c', image: '/images/hoodie-black.jpg' },
  { id: 8, name: 'หมวกแก๊ป เขียว', category: 'Cap', price: 329, color: '#2f7d5b', image: '/images/cap-green.jpg' },
]
const orders = []
let nextProductId = 9
let nextUserId = 3
let nextOrderId = 1

const publicUser = (u) => ({ id: u.id, username: u.username, name: u.name, role: u.role })
const sign = (u) => jwt.sign({ id: u.id, role: u.role }, SECRET, { expiresIn: '2h' })

const auth = (req, res, next) => {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null
  if (!token) return res.status(401).json({ message: 'กรุณาเข้าสู่ระบบ' })
  try {
    req.user = jwt.verify(token, SECRET)
    next()
  } catch {
    res.status(401).json({ message: 'Token ไม่ถูกต้องหรือหมดอายุ' })
  }
}
const adminOnly = (req, res, next) =>
  req.user.role === 'admin' ? next() : res.status(403).json({ message: 'ไม่มีสิทธิ์ใช้งานส่วนนี้' })

const validProduct = (b) =>
  b && typeof b.name === 'string' && b.name.trim() && Number(b.price) > 0 && CATEGORIES.includes(b.category)

const cleanImage = (v) => {
  const t = typeof v === 'string' ? v.trim() : ''
  return /^(\/(?!\/)[\w\-./]*|https?:\/\/\S+)$/.test(t) ? t.slice(0, 500) : ''
}
const normalize = (b) => ({
  name: b.name.trim(),
  category: b.category,
  price: Number(b.price),
  image: cleanImage(b.image),
  color: typeof b.color === 'string' && /^#[0-9a-fA-F]{6}$/.test(b.color) ? b.color : '#cccccc',
})

app.get('/api/health', (req, res) => res.json({ status: 'ok' }))

app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body || {}
  const user = users.find((u) => u.username === username && u.password === password)
  if (!user) return res.status(401).json({ message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' })
  res.json({ token: sign(user), user: publicUser(user) })
})

app.post('/api/auth/register', (req, res) => {
  const { username, password, name } = req.body || {}
  if (!username || username.length < 3 || !password || password.length < 6 || !name) {
    return res.status(400).json({ message: 'ข้อมูลไม่ครบ (ชื่อผู้ใช้ ≥ 3 ตัว, รหัสผ่าน ≥ 6 ตัว)' })
  }
  if (users.some((u) => u.username === username)) {
    return res.status(409).json({ message: 'ชื่อผู้ใช้นี้ถูกใช้แล้ว' })
  }
  const user = { id: nextUserId++, username, password, name, role: 'customer' }
  users.push(user)
  res.status(201).json(publicUser(user))
})

app.get('/api/auth/me', auth, (req, res) => {
  const user = users.find((u) => u.id === req.user.id)
  if (!user) return res.status(401).json({ message: 'ไม่พบผู้ใช้' })
  res.json(publicUser(user))
})

app.get('/api/products', (req, res) => res.json(products))

app.get('/api/products/:id', (req, res) => {
  const p = products.find((x) => x.id === Number(req.params.id))
  if (!p) return res.status(404).json({ message: 'ไม่พบสินค้า' })
  res.json(p)
})

app.post('/api/products', auth, adminOnly, (req, res) => {
  if (!validProduct(req.body)) return res.status(400).json({ message: 'ข้อมูลสินค้าไม่ถูกต้อง' })
  const p = { id: nextProductId++, ...normalize(req.body) }
  products.push(p)
  res.status(201).json(p)
})

app.put('/api/products/:id', auth, adminOnly, (req, res) => {
  const i = products.findIndex((x) => x.id === Number(req.params.id))
  if (i === -1) return res.status(404).json({ message: 'ไม่พบสินค้า' })
  if (!validProduct(req.body)) return res.status(400).json({ message: 'ข้อมูลสินค้าไม่ถูกต้อง' })
  products[i] = { id: products[i].id, ...normalize(req.body) }
  res.json(products[i])
})

app.delete('/api/products/:id', auth, adminOnly, (req, res) => {
  const id = Number(req.params.id)
  if (!products.some((x) => x.id === id)) return res.status(404).json({ message: 'ไม่พบสินค้า' })
  products = products.filter((x) => x.id !== id)
  res.json({ message: 'ลบสินค้าแล้ว' })
})

app.post('/api/orders', auth, (req, res) => {
  const { items } = req.body || {}
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'ตะกร้าว่าง' })
  }
  const lines = []
  for (const it of items) {
    const p = products.find((x) => x.id === Number(it.productId))
    const qty = Number(it.qty)
    if (!p || !Number.isInteger(qty) || qty < 1) {
      return res.status(400).json({ message: 'รายการสินค้าไม่ถูกต้อง' })
    }
    lines.push({ productId: p.id, name: p.name, size: it.size, qty, price: p.price })
  }
  const user = users.find((u) => u.id === req.user.id)
  const order = {
    id: nextOrderId++,
    userId: user.id,
    username: user.username,
    items: lines,
    total: lines.reduce((s, l) => s + l.price * l.qty, 0),
    createdAt: new Date().toISOString(),
  }
  orders.push(order)
  res.status(201).json(order)
})

app.get('/api/orders', auth, (req, res) => {
  const list = req.user.role === 'admin' ? orders : orders.filter((o) => o.userId === req.user.id)
  res.json(list)
})

app.listen(PORT, () => console.log(`Clover Shop API running on port ${PORT}`))
