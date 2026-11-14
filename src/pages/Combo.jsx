import { useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import FurnitureArt from '../components/FurnitureArt'
import ComboScene from '../components/ComboScene'
import { useCart } from '../context/CartContext'
import { combos, byId, inr } from '../data/catalog'

export default function Combo() {
  const { slug } = useParams()
  return <ComboView key={slug} slug={slug} />
}

function ComboView({ slug }) {
  const combo = combos.find((c) => c.slug === slug)
  const { add } = useCart()
  const [pick, setPick] = useState(() => Object.fromEntries((combo?.slots || []).map((s, i) => [i, s.default])))

  const calc = useMemo(() => {
    if (!combo) return null
    const rows = combo.slots.map((s, i) => {
      const chosen = byId[pick[i]]
      const orig = byId[s.default]
      const q = s.qty || 1
      return { slot: s, chosen, orig, q, delta: (chosen.price - orig.price) * q, changed: chosen.id !== orig.id }
    })
    const delta = rows.reduce((t, r) => t + r.delta, 0)
    return { rows, delta, final: combo.basePrice + delta }
  }, [combo, pick])

  if (!combo) return <Navigate to="/" replace />

  const addCombo = () =>
    add({
      key: `${combo.id}:${Object.values(pick).join('-')}`,
      name: combo.name,
      kind: calc.rows[0].chosen.kind,
      tone: calc.rows[0].chosen.tone,
      price: calc.final,
      meta: 'Room combo',
      lines: calc.rows.map((r) => `${r.q > 1 ? r.q + '× ' : ''}${r.chosen.name}${r.changed ? ' (swapped)' : ''}`),
    })

  return (
    <main className="wrap combo-page">
      <nav className="crumbs" aria-label="Breadcrumb"><Link to="/">Home</Link><span>/</span><span>Room combos</span><span>/</span><span>{combo.name}</span></nav>

      <div className="combo-tabs">
        {combos.map((c) => <Link key={c.id} to={`/combo/${c.slug}`} className={c.id === combo.id ? 'on' : ''}>{c.room}</Link>)}
      </div>

      <div className="combo-layout">
        <div className="combo-visual">
          <ComboScene combo={combo} index={combos.indexOf(combo)} items={calc.rows.map((r) => r.chosen)} />
          <span className="img-tag">Updates as you swap pieces</span>
        </div>

        <div className="combo-panel">
          <p className="eyebrow"><i /> {combo.room} combo</p>
          <h1>{combo.name}</h1>
          <p className="combo-blurb">{combo.blurb}</p>

          <ol className="slot-list">
            {calc.rows.map((r, i) => (
              <li key={i} className="slot">
                <div className="slot-head">
                  <span className="mono-label">{i + 1}. {r.slot.label}</span>
                  {r.changed && <button className="link-btn" onClick={() => setPick({ ...pick, [i]: r.slot.default })}>Reset</button>}
                </div>
                <div className="slot-current">
                  <div className="slot-thumb"><FurnitureArt kind={r.chosen.kind} tone={r.chosen.tone} /></div>
                  <div>
                    <h3>{r.q > 1 ? `${r.q}× ` : ''}{r.chosen.name}</h3>
                    <p className="mono-label">{r.chosen.material}</p>
                  </div>
                  <span className={`delta ${r.delta > 0 ? 'up' : r.delta < 0 ? 'down' : ''}`}>
                    {r.delta === 0 ? 'Included' : `${r.delta > 0 ? '+' : '−'}${inr(Math.abs(r.delta))}`}
                  </span>
                </div>
                {r.slot.options.length > 1 && (
                  <div className="swap" role="radiogroup" aria-label={`Replace ${r.slot.label}`}>
                    {r.slot.options.map((id) => {
                      const o = byId[id]
                      const d = (o.price - r.orig.price) * r.q
                      const on = pick[i] === id
                      return (
                        <button key={id} role="radio" aria-checked={on} className={on ? 'on' : ''} onClick={() => setPick({ ...pick, [i]: id })} disabled={o.stock === 'out'}>
                          <FurnitureArt kind={o.kind} tone={o.tone} />
                          <span className="sw-name">{o.name}</span>
                          <span className="sw-delta">{id === r.slot.default ? 'Original' : o.stock === 'out' ? 'Out of stock' : d === 0 ? 'Same price' : `${d > 0 ? '+' : '−'}${inr(Math.abs(d))}`}</span>
                        </button>
                      )
                    })}
                  </div>
                )}
              </li>
            ))}
          </ol>

          <div className="price-box" aria-live="polite">
            <div className="sum"><span>Original combo price</span><span>{inr(combo.basePrice)}</span></div>
            {calc.rows.filter((r) => r.changed).map((r, i) => (
              <div key={i} className="sum swapline">
                <span>{r.orig.name} → <strong>{r.chosen.name}</strong></span>
                <span className={r.delta > 0 ? 'up' : 'down'}>{r.delta > 0 ? '+' : '−'}{inr(Math.abs(r.delta))}</span>
              </div>
            ))}
            <div className="sum total"><span>Your combo price</span><span>{inr(calc.final)}</span></div>
            <p className="saving">You save {inr(combo.mrp + calc.delta - calc.final)} vs. buying separately · MRP <s>{inr(combo.mrp + calc.delta)}</s></p>
            <button className="btn btn-primary block" onClick={addCombo}>Add combo to cart</button>
          </div>
        </div>
      </div>
    </main>
  )
}
