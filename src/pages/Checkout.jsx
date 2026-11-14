import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import FurnitureArt from '../components/FurnitureArt'
import { Summary } from './Cart'
import Steps from '../components/Steps'
import { useCart } from '../context/CartContext'
import { delivery, inr } from '../data/catalog'
import { STATES, cleanPhone, newOrderId, saveOrder, validate } from '../lib/orders'

const DRAFT = 'videm-checkout'
const blank = { name: '', phone: '', email: '', line1: '', line2: '', landmark: '', city: '', state: '', pincode: '', zone: 'in', notes: '' }
const loadDraft = () => {
  try { return { ...blank, ...JSON.parse(localStorage.getItem(DRAFT) || '{}') } } catch { return blank }
}

function Field({ id, label, error, hint, required, ok, children }) {
  return (
    <div className={`fld ${error ? 'err' : ok ? 'ok' : ''}`}>
      <label htmlFor={id}>{label}{required && <span aria-hidden="true"> *</span>}</label>
      {children}
      {hint && !error && <small id={`${id}-h`}>{hint}</small>}
      {error && <small id={`${id}-e`} className="fld-err" role="alert">{error}</small>}
    </div>
  )
}

export default function Checkout() {
  const { items, subtotal, shipping, discount, total, code, clear, removeCoupon } = useCart()
  const nav = useNavigate()
  const [f, setF] = useState(loadDraft)
  const [touched, setTouched] = useState({})
  const [tried, setTried] = useState(false)
  const [busy, setBusy] = useState(false)
  const summaryRef = useRef(null)

  useEffect(() => {
    try { localStorage.setItem(DRAFT, JSON.stringify(f)) } catch { /* storage blocked */ }
  }, [f])

  const errors = validate(f)
  const show = (k) => (tried || touched[k]) && errors[k]
  const fmt = (k, v) => {
    if (k === 'pincode') return v.replace(/\D/g, '').slice(0, 6)
    if (k === 'phone' && /^[\d\s]*$/.test(v)) {
      const d = v.replace(/\s/g, '').slice(0, 10)
      return d.length > 5 ? `${d.slice(0, 5)} ${d.slice(5)}` : d
    }
    return v
  }
  const set = (k) => (e) => setF({ ...f, [k]: fmt(k, e.target.value) })
  const okf = (k) => !!f[k] && !errors[k] && (tried || touched[k])
  const blur = (k) => () => setTouched({ ...touched, [k]: true })
  const aria = (k) => ({ id: k, 'aria-invalid': !!show(k), 'aria-describedby': show(k) ? `${k}-e` : undefined, onBlur: blur(k) })

  const outside = f.zone === 'out'
  const ship = outside ? 0 : shipping
  const grand = subtotal - discount + ship

  if (!items.length) {
    return (
      <main className="wrap shop">
        <div className="empty">
          <p className="serif">Nothing to check out</p>
          <p>Your cart is empty.</p>
          <Link to="/shop" className="btn btn-primary">Browse furniture</Link>
        </div>
      </main>
    )
  }

  const place = (e) => {
    e.preventDefault()
    setTried(true)
    const keys = Object.keys(errors)
    if (keys.length) {
      document.getElementById(keys[0])?.focus()
      return
    }
    setBusy(true)
    const order = {
      id: newOrderId(),
      createdAt: new Date().toISOString(),
      status: 'Pending payment (demo)',
      customer: { name: f.name.trim(), phone: cleanPhone(f.phone), email: f.email.trim() },
      address: { line1: f.line1.trim(), line2: f.line2.trim(), landmark: f.landmark.trim(), city: f.city.trim(), state: f.state, pincode: f.pincode },
      zone: outside ? 'outside' : 'within',
      notes: f.notes.trim(),
      items: items.map(({ key, name, price, qty, meta, lines, kind, tone }) => ({ key, name, price, qty, meta, lines, kind, tone })),
      totals: { subtotal, discount, coupon: code || null, shipping: outside ? null : ship, total: grand },
    }
    setTimeout(() => {
      saveOrder(order)
      clear()
      removeCoupon()
      try { localStorage.removeItem(DRAFT) } catch { /* ignore */ }
      nav(`/order/${order.id}`, { replace: true })
    }, 500)
  }

  const errList = Object.entries(errors)

  return (
    <main className="wrap cart-page">
      <nav className="crumbs" aria-label="Breadcrumb"><Link to="/">Home</Link><span>/</span><Link to="/cart">Cart</Link><span>/</span><span>Checkout</span></nav>
      <Steps current={2} />
      <header className="shop-head"><h1>Checkout</h1><p>Delivery details</p></header>

      <form className="co-grid" onSubmit={place} noValidate>
        <div className="co-form">
          {tried && errList.length > 0 && (
            <div className="err-sum" role="alert">
              <strong>Please fix {errList.length} {errList.length === 1 ? 'field' : 'fields'}:</strong>
              <ul>{errList.map(([k, m]) => <li key={k}><a href={`#${k}`} onClick={(e) => { e.preventDefault(); document.getElementById(k)?.focus() }}>{m}</a></li>)}</ul>
            </div>
          )}

          <fieldset>
            <legend>1 · Contact</legend>
            <div className="fld-row">
              <Field id="name" label="Full name" required error={show('name')} ok={okf('name')}>
                <input {...aria('name')} value={f.name} onChange={set('name')} autoComplete="name" />
              </Field>
              <Field id="phone" label="Mobile number" required error={show('phone')} ok={okf('phone')} hint="We'll send order updates on WhatsApp">
                <input {...aria('phone')} value={f.phone} onChange={set('phone')} type="tel" inputMode="tel" autoComplete="tel" placeholder="98765 43210" />
              </Field>
            </div>
            <Field id="email" label="Email (optional)" error={show('email')} ok={okf('email')} hint="For your invoice">
              <input {...aria('email')} value={f.email} onChange={set('email')} type="email" autoComplete="email" />
            </Field>
          </fieldset>

          <fieldset>
            <legend>2 · Delivery address</legend>
            <Field id="line1" label="House / flat no. and street" required error={show('line1')} ok={okf('line1')}>
              <input {...aria('line1')} value={f.line1} onChange={set('line1')} autoComplete="address-line1" />
            </Field>
            <div className="fld-row">
              <Field id="line2" label="Area / locality"><input id="line2" value={f.line2} onChange={set('line2')} autoComplete="address-line2" /></Field>
              <Field id="landmark" label="Landmark"><input id="landmark" value={f.landmark} onChange={set('landmark')} /></Field>
            </div>
            <div className="fld-row three">
              <Field id="city" label="City" required error={show('city')} ok={okf('city')}>
                <input {...aria('city')} value={f.city} onChange={set('city')} autoComplete="address-level2" />
              </Field>
              <Field id="state" label="State" required error={show('state')} ok={okf('state')}>
                <select {...aria('state')} value={f.state} onChange={set('state')} autoComplete="address-level1">
                  <option value="">Select</option>
                  {STATES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </Field>
              <Field id="pincode" label="Pincode" required error={show('pincode')} ok={okf('pincode')}>
                <input {...aria('pincode')} value={f.pincode} onChange={set('pincode')} inputMode="numeric" autoComplete="postal-code" maxLength={6} />
              </Field>
            </div>

            <div className="zone" role="radiogroup" aria-label="Delivery area">
              <label className={f.zone === 'in' ? 'on' : ''}>
                <input type="radio" name="zone" checked={f.zone === 'in'} onChange={() => setF({ ...f, zone: 'in' })} />
                <span><strong>Within {delivery.radiusKm} km of our showroom</strong><small>Delivered and assembled by our team. Free above {inr(delivery.freeAbove)}, otherwise {inr(delivery.flat)}.</small></span>
              </label>
              <label className={f.zone === 'out' ? 'on' : ''}>
                <input type="radio" name="zone" checked={f.zone === 'out'} onChange={() => setF({ ...f, zone: 'out' })} />
                <span><strong>Outside {delivery.radiusKm} km</strong><small>We'll call you to arrange delivery and confirm the charge. It is not added to your total now.</small></span>
              </label>
            </div>

            <Field id="notes" label="Delivery notes (optional)"><textarea id="notes" rows={2} value={f.notes} onChange={set('notes')} placeholder="Floor, lift access, preferred time…" /></Field>
          </fieldset>

          <fieldset>
            <legend>3 · Payment</legend>
            <div className="pay">
              <label className="on">
                <input type="radio" name="pay" checked readOnly />
                <span><strong>Pay online · UPI, cards, netbanking</strong><small>Secure payment by Juspay.</small></span>
              </label>
              <p className="demo-note">Demo build: the Juspay gateway is not connected yet, so placing an order does <strong>not</strong> charge you.</p>
            </div>
          </fieldset>
        </div>

        <div ref={summaryRef} className="co-side">
          <Summary
            subtotal={subtotal} discount={discount} shipping={ship} total={grand} code={code}
            shippingLabel={outside ? 'To be confirmed' : undefined}
            cta={<div className="cta-desktop"><button className="btn btn-primary btn-cta block" type="submit" disabled={busy}>{busy ? <><i className="spin" /> Placing order…</> : <>Place order <span className="arr" aria-hidden="true">→</span></>}</button><ul className="secure"><li>Secure checkout</li><li>Free assembly</li><li>3-year warranty</li></ul></div>}
          >
            <ul className="mini-items">
              {items.map((i) => (
                <li key={i.key}>
                  <span className="mini-thumb"><FurnitureArt kind={i.kind} tone={i.tone} /></span>
                  <span className="mini-name">{i.name}<small>Qty {i.qty}</small></span>
                  <strong>{inr(i.price * i.qty)}</strong>
                </li>
              ))}
            </ul>
          </Summary>
          <p className="fine back"><Link to="/cart">← Edit cart</Link></p>
        </div>

        <div className="place-bar">
          <div><small>Total</small><strong>{inr(grand)}</strong></div>
          <button className="btn btn-primary btn-cta" type="submit" disabled={busy}>{busy ? <><i className="spin" /> Placing…</> : 'Place order'}</button>
        </div>
      </form>
    </main>
  )
}
