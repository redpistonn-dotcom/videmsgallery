import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const KEY = 'videm-wishlist'
const Ctx = createContext(null)

const read = () => {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) || '[]')
    return Array.isArray(v) ? v : []
  } catch {
    return []
  }
}

// Wishlist of product ids, saved in the browser (localStorage). Becomes per-account once login exists.
export function WishlistProvider({ children }) {
  const [ids, setIds] = useState(read)

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(ids)) } catch { /* storage blocked */ }
  }, [ids])

  // keep tabs in sync
  useEffect(() => {
    const on = (e) => e.key === KEY && setIds(read())
    window.addEventListener('storage', on)
    return () => window.removeEventListener('storage', on)
  }, [])

  const toggle = useCallback((id) => setIds((l) => (l.includes(id) ? l.filter((x) => x !== id) : [...l, id])), [])
  const remove = useCallback((id) => setIds((l) => l.filter((x) => x !== id)), [])
  const clear = useCallback(() => setIds([]), [])

  const value = useMemo(() => ({ ids, count: ids.length, has: (id) => ids.includes(id), toggle, remove, clear }), [ids, toggle, remove, clear])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export const useWishlist = () => useContext(Ctx)
