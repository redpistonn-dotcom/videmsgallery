import { useEffect, useMemo, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import FurnitureArt from './FurnitureArt'
import { categories, products, inr } from '../data/catalog'

const Icon = ({ d, label }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-label={label}>
    {d}
  </svg>
)
const searchIcon = <><circle cx="11" cy="11" r="7" /><line x1="20" y1="20" x2="16" y2="16" /></>

// Search box with live suggestions (top matches by name / material / category).
function SearchBox({ className = '', onDone }) {
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const nav = useNavigate()
  const term = q.trim().toLowerCase()
  const hits = useMemo(
    () => (term.length < 2 ? [] : products.filter((p) => `${p.name} ${p.material} ${p.category}`.toLowerCase().includes(term)).slice(0, 5)),
    [term],
  )
  const done = () => { setOpen(false); setQ(''); onDone?.() }
  const submit = (e) => {
    e.preventDefault()
    if (!term) return
    nav(`/shop?q=${encodeURIComponent(q.trim())}`)
    done()
  }

  return (
    <form className={`search ${className}`} onSubmit={submit} role="search" onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false) }}>
      <Icon d={searchIcon} />
      <input
        value={q}
        onChange={(e) => { setQ(e.target.value); setOpen(true) }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => e.key === 'Escape' && setOpen(false)}
        placeholder="Search furniture…"
        aria-label="Search products"
        aria-expanded={open && term.length >= 2}
        autoComplete="off"
      />
      {open && term.length >= 2 && (
        <div className="suggest" role="listbox">
          {hits.length ? (
            <>
              {hits.map((p) => (
                <Link key={p.id} to={`/product/${p.slug}`} className="sg" onClick={done} role="option">
                  <span className="sg-art"><FurnitureArt kind={p.kind} tone={p.tone} /></span>
                  <span className="sg-name">{p.name}<small>{p.material}</small></span>
                  <strong>{inr(p.price)}</strong>
                </Link>
              ))}
              <button type="submit" className="sg-all">See all results for “{q.trim()}” →</button>
            </>
          ) : (
            <p className="sg-none">No matches for “{q.trim()}”. Try “sofa”, “bed” or “dining”.</p>
          )}
        </div>
      )}
    </form>
  )
}

export default function Header() {
  const { count, setOpen, bump } = useCart()
  const wish = useWishlist()
  const [menu, setMenu] = useState(false)
  const close = () => setMenu(false)

  // Mobile menu: Esc closes it
  useEffect(() => {
    if (!menu) return
    const k = (e) => e.key === 'Escape' && setMenu(false)
    document.addEventListener('keydown', k)
    return () => document.removeEventListener('keydown', k)
  }, [menu])

  return (
    <>
    <div className={`menu-scrim ${menu ? 'show' : ''}`} onClick={close} aria-hidden="true" />
    <header className="site-header">
      <a className="skip" href="#content">Skip to content</a>
      <div className="announce">
        <span>Free delivery within 200 km on orders above ₹25,000</span>
        <span className="sep">·</span>
        <span>Easy EMI available</span>
      </div>

      <div className="wrap head-main">
        <button className="icon-btn burger" onClick={() => setMenu(!menu)} aria-label="Menu" aria-expanded={menu}>
          <Icon d={menu ? <><line x1="6" y1="6" x2="18" y2="18" /><line x1="18" y1="6" x2="6" y2="18" /></> : <><line x1="4" y1="7" x2="20" y2="7" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="17" x2="20" y2="17" /></>} />
        </button>

        <Link to="/" className="brand" aria-label="Videm's Gallery home" onClick={close}>
          <img src="/brand/logo-full.png" alt="Videm's Gallery — Furniture & Interior" />
        </Link>

        <nav className={`main-nav ${menu ? 'open' : ''}`} aria-label="Primary">
          <SearchBox className="nav-search" onDone={close} />
          {categories.slice(0, 5).map((c) => (
            <NavLink key={c.slug} to={`/shop?cat=${c.slug}`} onClick={close}>{c.name}</NavLink>
          ))}
          <NavLink to="/combo/the-living-room-suite" className="nav-combo" onClick={close}>Room Combos</NavLink>
          <NavLink to="/shop?sale=1" className="nav-sale" onClick={close}>Offers</NavLink>
        </nav>

        <div className="head-actions">
          <SearchBox />
          <Link to="/wishlist" className="icon-btn" aria-label={`Wishlist, ${wish.count} saved`} onClick={close}>
            <Icon d={<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />} />
            {wish.count > 0 && <span className="badge gold">{wish.count}</span>}
          </Link>
          <button className="icon-btn cart-btn" onClick={() => setOpen(true)} aria-label={`Cart, ${count} items`}>
            <Icon d={<><path d="M5 8h14l-1.2 11H6.2z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></>} />
            {count > 0 && <span className="badge" key={bump}>{count}</span>}
          </button>
        </div>
      </div>
    </header>
    </>
  )
}
