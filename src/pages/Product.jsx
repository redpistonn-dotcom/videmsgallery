import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import FurnitureArt from '../components/FurnitureArt'
import ProductCard from '../components/ProductCard'
import Slider from '../components/Slider'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { products, combos, categories, byId, delivery, inr, off } from '../data/catalog'

// Sample spec data by furniture type — replace with real values from the product table.
const DIMS = {
  sofa: ['210 × 90 × 85 cm (L × D × H)', '58 kg'],
  bed: ['215 × 195 × 110 cm (L × W × H)', '92 kg'],
  table: ['180 × 90 × 76 cm (L × W × H)', '64 kg'],
  chair: ['48 × 55 × 90 cm (W × D × H)', '7 kg'],
  wardrobe: ['180 × 55 × 210 cm (W × D × H)', '120 kg'],
  tvunit: ['180 × 40 × 50 cm (W × D × H)', '38 kg'],
  coffee: ['100 × 60 × 42 cm (L × W × H)', '22 kg'],
  lamp: ['Height 175 cm · base 30 cm', '6 kg'],
}
const FABRIC = ['sofa', 'chair', 'bed']
const finishes = (p) =>
  FABRIC.includes(p.kind)
    ? [{ name: 'Original', tone: p.tone }, { name: 'Charcoal', tone: '#3E4C59' }, { name: 'Ivory', tone: '#D4C5AA' }, { name: 'Forest', tone: '#2F4A3A' }]
    : [{ name: 'Original', tone: p.tone }, { name: 'Walnut', tone: '#6B4A33' }, { name: 'Natural', tone: '#C9A56B' }, { name: 'Espresso', tone: '#3B2A20' }]

function RoomShot({ kind, tone }) {
  return (
    <div className="pdp-room">
      <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <rect width="400" height="300" style={{ fill: 'var(--wall-0)' }} />
        <circle cx="310" cy="92" r="58" fill="#FBF8F3" stroke="var(--gold)" strokeWidth="5" />
        <rect y="236" width="400" height="64" style={{ fill: 'var(--floor)' }} />
        <rect y="234" width="400" height="3" style={{ fill: 'var(--floor-line)' }} opacity=".5" />
      </svg>
      <div className="pdp-room-art"><FurnitureArt kind={kind} tone={tone} /></div>
    </div>
  )
}

const VIEWS = [['front', 'Front'], ['angle', 'Angle'], ['detail', 'Detail'], ['room', 'In a room']]

export default function Product() {
  const { slug } = useParams()
  const p = products.find((x) => x.slug === slug)
  const { add } = useCart()
  const wish = useWishlist()
  const [fi, setFi] = useState(0)
  const [view, setView] = useState('front')
  const [qty, setQty] = useState(1)
  const [pin, setPin] = useState('')
  const [pinMsg, setPinMsg] = useState(null)
  const [tab, setTab] = useState('desc')
  const buyRef = useRef(null)
  const [buyInView, setBuyInView] = useState(false)

  useEffect(() => {
    setFi(0); setView('front'); setQty(1); setPin(''); setPinMsg(null); setTab('desc')
    if (p) document.title = `${p.name} — Videm's Gallery`
    return () => { document.title = "Videm's Gallery — Furniture & Interior" }
  }, [slug]) // eslint-disable-line react-hooks/exhaustive-deps

  // UI only: hide the mobile sticky bar while the inline buy row is on screen
  useEffect(() => {
    const el = buyRef.current
    if (!el || !('IntersectionObserver' in window)) return
    const io = new IntersectionObserver(([e]) => setBuyInView(e.isIntersecting), { threshold: 0.6 })
    io.observe(el)
    return () => io.disconnect()
  }, [slug, p])

  const fin = useMemo(() => (p ? finishes(p) : []), [p])
  const related = useMemo(() => (p ? [...products.filter((x) => x.category === p.category && x.id !== p.id), ...products.filter((x) => x.category !== p.category && x.id !== p.id)].slice(0, 8) : []), [p])
  const inCombos = useMemo(() => (p ? combos.filter((c) => c.slots.some((s) => s.options.includes(p.id))) : []), [p])

  if (!p) return <Navigate to="/shop" replace />

  const cat = categories.find((c) => c.slug === p.category)
  const f = fin[fi]
  const out = p.stock === 'out'
  const [dim, wt] = DIMS[p.kind]
  const saved = wish.has(p.id)
  const item = () => ({ key: `${p.id}:${f.name}`, name: p.name, price: p.price, kind: p.kind, tone: f.tone, meta: `${p.material} · ${f.name}` })

  const checkPin = (e) => {
    e.preventDefault()
    if (!/^[1-9]\d{5}$/.test(pin)) return setPinMsg({ ok: false, t: 'Enter a valid 6-digit pincode.' })
    setPinMsg({ ok: true, t: `Delivery within ${delivery.radiusKm} km of our showroom is handled by our own team. We confirm your zone, date and any charge at checkout.` })
  }

  const specs = [
    ['Category', cat?.name], ['Material', p.material], ['Finish', f.name], ['Dimensions', dim], ['Weight', wt],
    ['Assembly', 'Free, by our carpenters'], ['Warranty', '3 years on structure'],
  ]

  return (
    <main className="wrap pdp">
      <nav className="crumbs" aria-label="Breadcrumb">
        <Link to="/">Home</Link><span>/</span><Link to={`/shop?cat=${p.category}`}>{cat?.name}</Link><span>/</span><span>{p.name}</span>
      </nav>

      <div className="pdp-grid">
        {/* Gallery */}
        <div className="pdp-gallery">
          <div className="pdp-stage">
            {p.tag && <span className="chip">{p.tag}</span>}
            {view === 'room' ? (
              <RoomShot kind={p.kind} tone={f.tone} />
            ) : (
              <div className={`pdp-art ${view}`}><FurnitureArt kind={p.kind} tone={f.tone} /></div>
            )}
          </div>
          <ul className="pdp-thumbs" role="tablist" aria-label="Product views">
            {VIEWS.map(([k, l]) => (
              <li key={k}>
                <button role="tab" aria-selected={view === k} className={view === k ? 'on' : ''} onClick={() => setView(k)}>
                  <span className={`pdp-thumb ${k}`}>{k === 'room' ? <RoomShot kind={p.kind} tone={f.tone} /> : <FurnitureArt kind={p.kind} tone={f.tone} />}</span>
                  <small>{l}</small>
                </button>
              </li>
            ))}
          </ul>
          <p className="pdp-note">Illustrations shown — real product photos will replace these.</p>
        </div>

        {/* Buy box */}
        <div className="pdp-info">
          <p className="mono-label">{p.material}</p>
          <h1>{p.name}</h1>
          <p className="rating pdp-rating"><span aria-hidden="true">★</span> {p.rating} <em>({p.reviews} reviews)</em></p>

          <div className="pdp-price">
            <strong>{inr(p.price)}</strong><s>{inr(p.mrp)}</s><span className="off">{off(p.price, p.mrp)}% off</span>
          </div>
          <p className="pdp-tax">Inclusive of all taxes · Delivery {p.price >= delivery.freeAbove ? 'free' : `from ${inr(delivery.flat)}`} within {delivery.radiusKm} km</p>

          <p className={`stock ${p.stock}`} role="status">
            <i /> {out ? 'Out of stock' : p.stock === 'low' ? 'Only a few left' : 'In stock · ready to ship'}
          </p>

          <fieldset className="pdp-field">
            <legend>Finish: <strong>{f.name}</strong></legend>
            <div className="swatches" role="radiogroup" aria-label="Finish">
              {fin.map((x, i) => (
                <button key={x.name} role="radio" aria-checked={fi === i} aria-label={x.name} title={x.name} className={fi === i ? 'on' : ''} onClick={() => setFi(i)}>
                  <span style={{ background: x.tone }} />
                </button>
              ))}
            </div>
          </fieldset>

          <div className="pdp-buy" ref={buyRef}>
            <div className="qty lg" role="group" aria-label="Quantity">
              <button onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Decrease quantity" disabled={out}>−</button>
              <span aria-live="polite">{qty}</span>
              <button onClick={() => setQty(Math.min(9, qty + 1))} aria-label="Increase quantity" disabled={out}>+</button>
            </div>
            <button className="btn btn-primary btn-cta" disabled={out} onClick={() => add(item(), qty)}>
              {out ? 'Out of stock' : 'Add to cart'} <span className="arr" aria-hidden="true">→</span>
            </button>
            <button className={`fav-lg ${saved ? 'on' : ''}`} onClick={() => wish.toggle(p.id)} aria-pressed={saved} aria-label={saved ? 'Remove from wishlist' : 'Add to wishlist'}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" /></svg>
            </button>
          </div>

          <form className="pin" onSubmit={checkPin}>
            <label htmlFor="pin">Check delivery</label>
            <div>
              <input id="pin" inputMode="numeric" maxLength={6} placeholder="Enter 6-digit pincode" value={pin} onChange={(e) => { setPin(e.target.value.replace(/\D/g, '')); setPinMsg(null) }} aria-describedby="pin-msg" />
              <button className="btn btn-ghost" type="submit">Check</button>
            </div>
            <p id="pin-msg" className={`pin-msg ${pinMsg?.ok ? 'ok' : 'bad'}`} role="status">{pinMsg?.t}</p>
          </form>

          <ul className="pdp-perks">
            <li>Free assembly by our carpenters</li>
            <li>3 years warranty on structure</li>
            <li>Easy EMI on larger orders</li>
          </ul>

          {inCombos.length > 0 && (
            <div className="pdp-combos">
              <p className="mono-label">Also available in a combo</p>
              {inCombos.map((c) => (
                <Link key={c.id} to={`/combo/${c.slug}`}>
                  <span><strong>{c.name}</strong> · {c.slots.length} pieces</span>
                  <em>{inr(c.basePrice)} <b aria-hidden="true">→</b></em>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Details */}
      <section className="pdp-details">
        <div className="tabs" role="tablist" aria-label="Product details">
          {[['desc', 'Description'], ['spec', 'Specifications'], ['ship', 'Delivery']].map(([k, l]) => (
            <button key={k} role="tab" aria-selected={tab === k} className={tab === k ? 'on' : ''} onClick={() => setTab(k)}>{l}</button>
          ))}
        </div>
        <div className="pdp-panel" role="tabpanel">
          {tab === 'desc' && (
            <div className="prose">
              <p>The {p.name} is crafted in {p.material.toLowerCase()} with a clean, timeless profile that sits easily in modern and classic homes alike. Joinery is reinforced for everyday use, and every piece is finished by hand.</p>
              <ul>
                <li>Built from seasoned, kiln-dried materials for lasting strength</li>
                <li>Finish options to match your room</li>
                <li>Delivered and assembled by our own team within {delivery.radiusKm} km</li>
              </ul>
            </div>
          )}
          {tab === 'spec' && (
            <table className="spec-table"><tbody>{specs.map(([k, v]) => <tr key={k}><th scope="row">{k}</th><td>{v}</td></tr>)}</tbody></table>
          )}
          {tab === 'ship' && (
            <div className="prose">
              <p><strong>Delivery.</strong> Orders within about {delivery.radiusKm} km of our showroom are delivered and assembled by our own team. Delivery is free on orders above {inr(delivery.freeAbove)}; otherwise a flat {inr(delivery.flat)} applies. Orders outside this zone are arranged separately — we will contact you after you order.</p>
              <p><strong>Returns & warranty.</strong> Structural warranty up to 3 years. Please inspect the product at delivery and report any damage within 48 hours.</p>
            </div>
          )}
        </div>
      </section>

      {/* Related */}
      <section className="pdp-related">
        <header className="sec-head"><div><p className="eyebrow"><i /> You may also like</p><h2>Pairs <em>well with</em></h2></div></header>
        <Slider per={4} label="related products" key={slug}>
          {related.map((r) => <li key={r.id}><ProductCard p={r} /></li>)}
        </Slider>
      </section>

      {/* Mobile sticky bar */}
      <div className={`pdp-sticky ${buyInView ? 'hide' : ''}`}>
        <div><strong>{inr(p.price)}</strong><s>{inr(p.mrp)}</s></div>
        <button className="btn btn-primary" disabled={out} onClick={() => add(item(), qty)}>{out ? 'Out of stock' : 'Add to cart'}</button>
      </div>
    </main>
  )
}
