import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import FurnitureArt from './FurnitureArt'
import { useCart } from '../context/CartContext'
import { inr, off } from '../data/catalog'

export default function QuickView({ p, onClose }) {
  const { add } = useCart()
  useEffect(() => {
    const k = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', k)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', k); document.body.style.overflow = '' }
  }, [onClose])

  const out = p.stock === 'out'
  return createPortal(
    <div className="qv-scrim" onClick={onClose}>
      <div className="qv" role="dialog" aria-modal="true" aria-label={`${p.name} quick view`} onClick={(e) => e.stopPropagation()}>
        <button className="qv-close" onClick={onClose} aria-label="Close quick view">✕</button>
        <div className="qv-media"><FurnitureArt kind={p.kind} tone={p.tone} /></div>
        <div className="qv-info">
          <p className="mono-label">{p.material}</p>
          <h2>{p.name}</h2>
          <p className="rating"><span aria-hidden="true">★</span> {p.rating} <em>({p.reviews} reviews)</em></p>
          <div className="price-row big">
            <strong>{inr(p.price)}</strong><s>{inr(p.mrp)}</s><span className="off">{off(p.price, p.mrp)}% off</span>
          </div>
          <ul className="qv-points">
            <li>Delivery and assembly included within 200 km</li>
            <li>Up to 3 years warranty on structure</li>
            <li>{out ? 'Currently out of stock' : p.stock === 'low' ? 'Only a few left in stock' : 'In stock · ships soon'}</li>
          </ul>
          <button
            className="btn btn-primary btn-cta block"
            disabled={out}
            onClick={() => { add({ key: p.id, name: p.name, price: p.price, kind: p.kind, tone: p.tone, meta: p.material }); onClose() }}
          >
            {out ? 'Notify me' : 'Add to cart'} <span className="arr" aria-hidden="true">→</span>
          </button>
          <Link to={`/product/${p.slug}`} className="link-arrow" onClick={onClose}>View full details →</Link>
        </div>
      </div>
    </div>
  , document.body)
}
