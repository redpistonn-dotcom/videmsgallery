// Front-end stand-in for the orders API. Orders are kept in localStorage for the demo;
// the real flow POSTs to the Node/PostgreSQL backend and receives the order id from the server.
const KEY = 'videm-orders'

const read = () => {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) || '[]')
    return Array.isArray(v) ? v : []
  } catch {
    return []
  }
}

export function newOrderId() {
  const d = new Date()
  const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`
  const rnd = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `VG-${ymd}-${rnd}`
}

export function saveOrder(order) {
  try { localStorage.setItem(KEY, JSON.stringify([order, ...read()].slice(0, 20))) } catch { /* storage blocked */ }
  return order
}

export const getOrder = (id) => read().find((o) => o.id === id) || null

// ---- validation (mirrors what the API must enforce again server-side) ----
export const STATES = ['Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi', 'Jammu & Kashmir', 'Chandigarh', 'Puducherry']

export const cleanPhone = (v) => v.replace(/[\s-]/g, '').replace(/^(\+91|91|0)(?=\d{10}$)/, '')

export function validate(f) {
  const e = {}
  if (f.name.trim().length < 2) e.name = 'Enter your full name'
  if (!/^[6-9]\d{9}$/.test(cleanPhone(f.phone))) e.phone = 'Enter a valid 10-digit mobile number'
  if (f.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.trim())) e.email = 'Enter a valid email address'
  if (f.line1.trim().length < 5) e.line1 = 'Enter your house / flat number and street'
  if (f.city.trim().length < 2) e.city = 'Enter your city'
  if (!f.state) e.state = 'Select your state'
  if (!/^[1-9]\d{5}$/.test(f.pincode)) e.pincode = 'Enter a valid 6-digit pincode'
  return e
}
