import { useState } from 'react'
import { Link } from 'react-router-dom'
import FurnitureArt from './FurnitureArt'
import QuickView from './QuickView'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { inr, off } from '../data/catalog'

export default function ProductCard({ p }) {
  const { add } = useCart()
  const { has, toggle } = useWishlist()
  const fav = has(p.id)
  const [qv, setQv] = useState(false)
  const out = p.stock === 'out'
  return (
    <article className="pcard">
      <div className="pcard-media">
        {p.tag && <span className="chip">{p.tag}</span>}
        {out && <span className="chip chip-out">Out of stock</span>}
        <button className={`fav ${fav ? 'on' : ''}`} onClick={() => toggle(p.id)} aria-pressed={fav} aria-label={fav ? 'Remove from wishlist' : 'Add to wishlist'}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill={fav ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" /></svg>
        </button>
        <Link to={`/product/${p.slug}`} aria-label={p.name} className="pcard-art">
          <FurnitureArt kind={p.kind} tone={p.tone} />
        </Link>
        <div className="pcard-actions">
          <button className="qa-ghost" onClick={() => setQv(true)}>Quick view</button>
          <button
            className="qa-main"
            disabled={out}
            onClick={() => add({ key: p.id, name: p.name, price: p.price, kind: p.kind, tone: p.tone, meta: p.material })}
          >
            {out ? 'Notify me' : 'Add to cart'}
          </button>
        </div>
      </div>
      <div className="pcard-body">
        <p className="mono-label">{p.material}</p>
        <h3><Link to={`/product/${p.slug}`}>{p.name}</Link></h3>
        <div className="price-row">
          <strong>{inr(p.price)}</strong>
          <s>{inr(p.mrp)}</s>
          <span className="off">{off(p.price, p.mrp)}% off</span>
        </div>
        <p className="rating"><span aria-hidden="true">★</span> {p.rating} <em>({p.reviews})</em>
          {p.stock === 'low' && <span className="low">Only few left</span>}
        </p>
      </div>
      {qv && <QuickView p={p} onClose={() => setQv(false)} />}
    </article>
  )
}
