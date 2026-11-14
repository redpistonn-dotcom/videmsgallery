import { createContext, useContext, useEffect, useMemo, useReducer, useState } from 'react'
import { delivery, coupons, inr } from '../data/catalog'

const KEY = 'videm-cart'
const CKEY = 'videm-coupon'
const CartCtx = createContext(null)

function reducer(state, a) {
  switch (a.type) {
    case 'add': {
      const hit = state.find((i) => i.key === a.item.key)
      const q = a.qty || 1
      if (hit) return state.map((i) => (i.key === a.item.key ? { ...i, qty: i.qty + q } : i))
      return [...state, { ...a.item, qty: q }]
    }
    case 'qty':
      return state.map((i) => (i.key === a.key ? { ...i, qty: Math.max(1, i.qty + a.d) } : i))
    case 'remove':
      return state.filter((i) => i.key !== a.key)
    case 'clear':
      return []
    default:
      return state
  }
}

const load = () => {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) || '[]')
    return Array.isArray(v) ? v : []
  } catch {
    return []
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(reducer, undefined, load)
  const [open, setOpen] = useState(false)
  const [bump, setBump] = useState(0)
  const [code, setCode] = useState(() => { try { return localStorage.getItem(CKEY) || '' } catch { return '' } })

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(items)) } catch { /* storage blocked */ }
  }, [items])

  useEffect(() => {
    try { code ? localStorage.setItem(CKEY, code) : localStorage.removeItem(CKEY) } catch { /* storage blocked */ }
  }, [code])

  const value = useMemo(() => {
    const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0)
    const c = coupons.find((x) => x.code === code)
    const active = c && subtotal > 0 && subtotal >= c.min ? c : null
    const discount = active ? (active.type === 'pct' ? Math.round((subtotal * active.value) / 100) : Math.min(active.value, subtotal)) : 0
    const couponMsg = c && !active && subtotal > 0 ? `Add ${inr(c.min - subtotal)} more to use ${c.code}` : ''
    const shipping = subtotal === 0 ? 0 : subtotal >= delivery.freeAbove ? 0 : delivery.flat
    return {
      items,
      open,
      setOpen,
      bump,
      count: items.reduce((s, i) => s + i.qty, 0),
      subtotal,
      shipping,
      discount,
      code: active ? active.code : '',
      couponMsg,
      total: subtotal - discount + shipping,
      applyCoupon: (raw) => {
        const v = raw.trim().toUpperCase()
        const k = coupons.find((x) => x.code === v)
        if (!v) return { ok: false, msg: 'Enter a coupon code' }
        if (!k) return { ok: false, msg: 'This code is not valid' }
        if (subtotal < k.min) return { ok: false, msg: `Add ${inr(k.min - subtotal)} more to use ${k.code}` }
        setCode(k.code)
        return { ok: true, msg: `${k.code} applied` }
      },
      removeCoupon: () => setCode(''),
      add: (item, qty = 1) => {
        dispatch({ type: 'add', item, qty })
        setBump((b) => b + 1)
        setOpen(true)
      },
      qty: (key, d) => dispatch({ type: 'qty', key, d }),
      remove: (key) => dispatch({ type: 'remove', key }),
      clear: () => dispatch({ type: 'clear' }),
    }
  }, [items, open, bump, code])

  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>
}

export const useCart = () => useContext(CartCtx)
