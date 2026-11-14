import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import ComboScene from './ComboScene'
import { combos, byId, inr } from '../data/catalog'

const DELAY = 5000

export default function HeroOffers() {
  const [i, setI] = useState(0)
  const [hold, setHold] = useState(false)
  const [playing, setPlaying] = useState(true)
  const touch = useRef(null)
  const n = combos.length
  const go = useCallback((k) => setI(((k % n) + n) % n), [n])

  // One slide at a time, auto-advance; paused on hover/focus/touch and for reduced motion.
  useEffect(() => {
    if (!playing || hold || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = setTimeout(() => go(i + 1), DELAY)
    return () => clearTimeout(id)
  }, [i, hold, playing, go])

  const onTouchEnd = (e) => {
    if (touch.current == null) return
    const dx = e.changedTouches[0].clientX - touch.current
    if (Math.abs(dx) > 40) go(i + (dx < 0 ? 1 : -1))
    touch.current = null
    setTimeout(() => setHold(false), 3000)
  }

  return (
    <section
      className="hero3"
      aria-roledescription="carousel"
      aria-label="Combo offers"
      onTouchStart={(e) => { touch.current = e.touches[0].clientX; setHold(true) }}
      onTouchEnd={onTouchEnd}
    >
      <div className="h3-track" style={{ transform: `translateX(-${i * 100}%)` }}>
        {combos.map((c, k) => {
          const pct = Math.round(((c.mrp - c.basePrice) / c.mrp) * 100)
          return (
            <article key={c.id} className="h3-slide" aria-hidden={k !== i} aria-label={`${k + 1} of ${n}`}>
              <div className="wrap h3-grid">
                <div className="h3-copy">
                  <p className="eyebrow"><i /> Combo offer · {c.room}</p>
                  <span className="h3-badge">{pct}% off</span>
                  <h1>{c.name}</h1>
                  <p className="h3-blurb">{c.blurb}</p>
                  <ul className="h3-items">
                    {c.slots.map((s) => (
                      <li key={s.label}>{s.qty ? `${s.qty}× ` : ''}{byId[s.default].name}</li>
                    ))}
                  </ul>
                  <div className="h3-buy">
                    <p className="h3-price"><strong>{inr(c.basePrice)}</strong> <s>{inr(c.mrp)}</s> <em>Save {inr(c.mrp - c.basePrice)}</em></p>
                    <Link to={`/combo/${c.slug}`} className="btn btn-primary btn-cta" tabIndex={k === i ? 0 : -1}>Customise combo <span className="arr" aria-hidden="true">→</span></Link>
                  </div>
                </div>
                <div className="h3-visual"><ComboScene combo={c} index={k} /></div>
              </div>
            </article>
          )
        })}
      </div>

      <div className="wrap h3-controls">
        <button className="h3-pp" aria-pressed={!playing} aria-label={playing ? 'Pause slideshow' : 'Play slideshow'} onClick={() => setPlaying(!playing)}>{playing ? '❚❚' : '▶'}</button>
        <div className="h3-dots" role="tablist" aria-label="Choose offer">
          {combos.map((c, k) => (
            <button key={c.id} role="tab" aria-selected={k === i} aria-label={c.name} className={k === i ? 'on' : ''} onClick={() => go(k)} />
          ))}
        </div>
        <div className="h3-arrows">
          <button onClick={() => go(i - 1)} aria-label="Previous offer"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 5l-7 7 7 7" /></svg></button>
          <button onClick={() => go(i + 1)} aria-label="Next offer"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5l7 7-7 7" /></svg></button>
        </div>
      </div>

      <ul className="wrap hero2-trust">
        <li>Solid wood craft</li><li>Delivery within 200 km</li><li>Free assembly</li><li>Up to 3 years warranty</li>
      </ul>
    </section>
  )
}
