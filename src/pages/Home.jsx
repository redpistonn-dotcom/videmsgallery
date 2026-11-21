import { useState } from 'react'
import { Link } from 'react-router-dom'
import HeroOffers from '../components/HeroOffers'
import ComboScene, { hotspots } from '../components/ComboScene'
import FurnitureArt from '../components/FurnitureArt'
import ProductCard from '../components/ProductCard'
import Slider from '../components/Slider'
import { Countdown, CopyCode, Arrow } from '../components/Bits'
import { useCart } from '../context/CartContext'
import { categories, products, combos, byId, coupons, comboCartItem, inr, off } from '../data/catalog'

export default function Home() {
  return (
    <main>
      <HeroOffers />
      <Categories />
      <Budget />
      <RoomExplorer />
      <OffersDeals />
      <Trending />
      <Craft />
      <Reviews />
      <Services />
      <Newsletter />
    </main>
  )
}

function Head({ eyebrow, title, em, right }) {
  return (
    <header className="sec-head">
      <div>
        <p className="eyebrow"><i /> {eyebrow}</p>
        <h2>{title} <em>{em}</em></h2>
      </div>
      {right}
    </header>
  )
}

/* ───── Shop by category ───── */
function Categories() {
  return (
    <section className="section">
      <div className="wrap">
        <Head eyebrow="Shop by type" title="Find your" em="piece" right={<Link to="/shop" className="link-arrow">View all →</Link>} />
        <Slider per={4} label="categories" className="cat-slider">
          {categories.map((c) => (
            <li key={c.slug}>
              <Link to={`/shop?cat=${c.slug}`} className="cat-tile">
                <div className="cat-art"><FurnitureArt kind={c.kind} tone={c.tone} /></div>
                <span>{c.name}</span>
                <em className="cat-go">Explore <b aria-hidden="true">→</b></em>
              </Link>
            </li>
          ))}
        </Slider>
      </div>
    </section>
  )
}

/* ───── Shop the room: styled room with numbered hotspots ───── */
function RoomExplorer() {
  const { add } = useCart()
  const [ri, setRi] = useState(0)
  const [hi, setHi] = useState(0)
  const c = combos[ri]
  const spots = hotspots(c)
  const sel = spots[Math.min(hi, spots.length - 1)].product
  const pick = (i) => { setRi(i); setHi(0) }

  return (
    <section className="section tint">
      <div className="wrap">
        <header className="sec-head">
          <div>
            <p className="eyebrow"><i /> Shop the room</p>
            <h2>Tap a piece, <em>see the price</em></h2>
          </div>
          <div className="d4-tabs" role="tablist" aria-label="Choose room">
            {combos.map((r, i) => (
              <button key={r.id} role="tab" aria-selected={i === ri} className={i === ri ? 'on' : ''} onClick={() => pick(i)}>
                {r.room}<small>{r.slots.length} pieces</small>
              </button>
            ))}
          </div>
        </header>

        <div className="d4-stage">
          <div className="d4-room">
            <ComboScene combo={c} index={ri} />
            {spots.map((s, k) => (
              <button
                key={s.product.id}
                className={`hot ${k === hi ? 'on' : ''}`}
                style={{ left: `${s.left}%`, top: `${s.top}%` }}
                onClick={() => setHi(k)}
                aria-label={`${s.product.name}, ${inr(s.product.price)}`}
                aria-pressed={k === hi}
              >{k + 1}</button>
            ))}
            <div className="d4-pop" key={sel.id}>
              <FurnitureArt kind={sel.kind} tone={sel.tone} />
              <div>
                <h3>{sel.name}</h3>
                <p><strong>{inr(sel.price)}</strong> <s>{inr(sel.mrp)}</s> <span className="off">{off(sel.price, sel.mrp)}% off</span></p>
              </div>
              <button className="btn btn-primary" onClick={() => add({ key: sel.id, name: sel.name, price: sel.price, kind: sel.kind, tone: sel.tone, meta: sel.material })}>Add</button>
            </div>
          </div>

          <aside className="d4-panel">
            <p className="mono-label">Combo offer · save {inr(c.mrp - c.basePrice)}</p>
            <h3 className="panel-title">{c.name}</h3>
            <p className="d4-blurb">{c.blurb}</p>
            <ol className="d4-list">
              {c.slots.map((s, k) => {
                const p = spots[k].product
                return (
                  <li key={s.label}>
                    <button className={k === hi ? 'on' : ''} onClick={() => setHi(k)}>
                      <span className="n">{k + 1}</span>
                      <span className="nm">{s.qty ? `${s.qty}× ` : ''}{p.name}</span>
                      <span className="pr">{inr(p.price * (s.qty || 1))}</span>
                    </button>
                  </li>
                )
              })}
            </ol>
            <div className="d4-total">
              <div><small className="mono-label">Combo price</small><p><strong>{inr(c.basePrice)}</strong> <s>{inr(c.mrp)}</s></p></div>
              <span className="off">Save {inr(c.mrp - c.basePrice)}</span>
            </div>
            <button className="btn btn-primary btn-cta block" onClick={() => add(comboCartItem(c))}>Add whole room <Arrow /></button>
            <Link to={`/combo/${c.slug}`} className="btn btn-ghost block">Swap pieces & customise</Link>
          </aside>
        </div>
      </div>
    </section>
  )
}

/* ───── Offers: deal of the day + coupons ───── */
function OffersDeals() {
  const { add } = useCart()
  const deal = byId.p1
  return (
    <section className="section">
      <div className="wrap">
        <Head eyebrow="Offers" title="Today's" em="best deals" right={<span className="sec-note">Deal ends in <Countdown className="inline" /></span>} />
        <div className="offers-grid">
          <article className="deal-card">
            <div>
              <span className="mono-label">Deal of the day</span>
              <h3>{deal.name}</h3>
              <p className="t-price"><strong>{inr(deal.price)}</strong> <s>{inr(deal.mrp)}</s> <span className="off">{off(deal.price, deal.mrp)}% off</span></p>
              <p className="d4-blurb">{deal.material}</p>
              <div className="t-actions" style={{ marginTop: 14 }}>
                <button className="btn btn-primary btn-cta" onClick={() => add({ key: deal.id, name: deal.name, price: deal.price, kind: deal.kind, tone: deal.tone, meta: deal.material })}>Add to cart <Arrow /></button>
              </div>
            </div>
            <div className="deal-art"><FurnitureArt kind={deal.kind} tone={deal.tone} /></div>
          </article>
          <div className="coupon-list">
            {coupons.map((c) => (
              <article key={c.code} className="coupon">
                <div><h3>{c.text}</h3><p>{c.note}</p></div>
                <CopyCode code={c.code} />
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ───── Trending ───── */
function Trending() {
  const [tab, setTab] = useState('new')
  const sets = {
    new: products.filter((p) => p.tag === 'New' || ['p4', 'p6', 'p11', 'p15'].includes(p.id)),
    best: products.filter((p) => ['Bestseller', 'Popular'].includes(p.tag)),
    sale: [...products].sort((a, b) => off(b.price, b.mrp) - off(a.price, a.mrp)).slice(0, 8),
  }
  const list = sets[tab].concat(products.filter((x) => !sets[tab].includes(x))).slice(0, 8)
  return (
    <section className="section tint">
      <div className="wrap">
        <header className="sec-head">
          <div>
            <p className="eyebrow"><i /> Handpicked for you</p>
            <h2>Trending <em>now</em></h2>
          </div>
          <div className="tabs" role="tablist">
            {[['new', 'New arrivals'], ['best', 'Bestsellers'], ['sale', 'Best offers']].map(([k, l]) => (
              <button key={k} role="tab" aria-selected={tab === k} className={tab === k ? 'on' : ''} onClick={() => setTab(k)}>{l}</button>
            ))}
          </div>
        </header>
        <Slider per={4} label="products" key={tab}>
          {list.map((p) => <li key={p.id}><ProductCard p={p} /></li>)}
        </Slider>
      </div>
    </section>
  )
}

function Craft() {
  return (
    <section className="section">
      <div className="wrap">
        <Head eyebrow="Why Videm's Gallery" title="Built to" em="last" />
        <div className="craft-grid">
          {[
            ['01', 'Seasoned solid wood', 'Kiln-dried sheesham, teak and mango for strength that holds shape for decades.'],
            ['02', 'Designed in-house', 'Proportions tested for real homes — comfortable, compact and elegant.'],
            ['03', 'Delivered by our team', 'Careful delivery and assembly within 200 km. Beyond this, we arrange it separately.'],
            ['04', 'Transparent pricing', 'Clear prices and no hidden charges. Delivery is shown before you pay.'],
          ].map(([n, t, d]) => (
            <article key={n} className="craft-card"><span className="mono-label gold">{n}</span><h3>{t}</h3><p>{d}</p></article>
          ))}
        </div>
      </div>
    </section>
  )
}

function Reviews() {
  return (
    <section className="section tint">
      <div className="wrap">
        <Head eyebrow="Loved by homeowners" title="What customers" em="say" />
        <div className="review-grid">
          {[
            ['The sofa looks even better in person. Delivery and assembly were smooth and on time.', 'Anitha R.', 'Aria 3 Seater Sofa'],
            ['Swapping the coffee table in the combo was so easy — the price change was clear right away.', 'Rahul K.', 'Living Room Suite'],
            ['Solid build quality and a premium finish. Worth every rupee.', 'Meghana S.', 'Kyoto King Bed'],
          ].map(([q, n, p]) => (
            <figure key={n} className="review">
              <p className="stars" aria-label="5 out of 5">★★★★★</p>
              <blockquote>{q}</blockquote>
              <figcaption><strong>{n}</strong><span>{p}</span></figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}

function Newsletter() {
  return (
    <section className="section tight">
      <div className="wrap"><div className="news">
        <div>
          <h2>Get <em>10% off</em> your first order</h2>
          <p>Join for new arrivals, offers and design ideas. No spam.</p>
        </div>
        <form onSubmit={(e) => e.preventDefault()} className="news-form">
          <input type="email" placeholder="Email address" aria-label="Email address" />
          <button className="btn btn-primary">Subscribe</button>
        </form>
      </div></div>
    </section>
  )
}

/* ───── Shop by budget ───── */
function Budget() {
  const rows = [['Under ₹10,000', 10000], ['Under ₹25,000', 25000], ['Under ₹50,000', 50000], ['Under ₹75,000', 75000]]
  return (
    <section className="budget-band">
      <div className="wrap budget-row">
        <span className="mono-label">Shop by budget</span>
        {rows.map(([l, v]) => <Link key={v} to={`/shop?max=${v}`} className="budget">{l}</Link>)}
      </div>
    </section>
  )
}

/* ───── Services ───── */
const svc = [
  ['Free delivery', 'Within 200 km on orders above ₹25,000', <><rect x="2" y="7" width="12" height="9" rx="1" /><path d="M14 10h4l3 3v3h-7z" /><circle cx="7" cy="18" r="2" /><circle cx="17" cy="18" r="2" /></>],
  ['Free assembly', 'Installed by our trained carpenters', <><path d="M14 6l4 4-8 8H6v-4z" /><path d="M13 7l4 4" /></>],
  ['Up to 3 years warranty', 'On structure and workmanship', <><path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" /><path d="M9 12l2 2 4-4" /></>],
  ['Easy EMI', 'Pay over time on larger orders', <><rect x="3" y="6" width="18" height="12" rx="2" /><path d="M3 10h18" /><path d="M7 15h3" /></>],
]
function Services() {
  return (
    <section className="services">
      <ul className="wrap svc-row">
        {svc.map(([t, d, ico]) => (
          <li key={t}>
            <span className="svc-ico"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{ico}</svg></span>
            <div><strong>{t}</strong><small>{d}</small></div>
          </li>
        ))}
      </ul>
    </section>
  )
}
