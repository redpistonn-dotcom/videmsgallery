import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Steps from '../components/Steps'
import FurnitureArt from '../components/FurnitureArt'
import { getOrder } from '../lib/orders'
import { inr } from '../data/catalog'

export default function Order() {
  const { id } = useParams()
  const o = getOrder(id)
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try { await navigator.clipboard.writeText(id) } catch { /* clipboard blocked */ }
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  if (!o) {
    return (
      <main className="wrap shop">
        <div className="empty">
          <p className="serif">Order not found</p>
          <p>We couldn't find order {id} on this device.</p>
          <Link to="/" className="btn btn-primary">Back to home</Link>
        </div>
      </main>
    )
  }

  const a = o.address
  const date = new Date(o.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })

  return (
    <main className="wrap cart-page order-page">
      <Steps current={4} />
      <div className="ok-head">
        <span className="ok-tick" aria-hidden="true"><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5 9-10" /></svg></span>
        <p className="eyebrow"><i /> Order received</p>
        <h1>Thank you, <em>{o.customer.name.split(' ')[0]}.</em></h1>
        <p className="oid">Order ID <strong>{o.id}</strong> · {date}</p>
        <div className="t-actions no-print">
          <button className="btn btn-ghost" onClick={copy} aria-live="polite">{copied ? 'Copied ✓' : 'Copy order ID'}</button>
          <button className="btn btn-ghost" onClick={() => window.print()}>Print / save PDF</button>
        </div>
        <p className="demo-note">Demo order — no payment was taken. In the live site this page appears after Juspay confirms payment, and a WhatsApp confirmation is sent to {o.customer.phone}.</p>
      </div>

      <div className="co-grid">
        <section>
          <h2 className="sub">Items</h2>
          <ul className="cp-list">
            {o.items.map((i) => (
              <li key={i.key}>
                <div className="cart-thumb"><FurnitureArt kind={i.kind} tone={i.tone} /></div>
                <div className="cp-main">
                  <h3>{i.name}</h3>
                  {i.meta && <p className="mono-label">{i.meta}</p>}
                  {i.lines && <ul className="cart-lines">{i.lines.map((l) => <li key={l}>{l}</li>)}</ul>}
                </div>
                <span className="cp-qty">Qty {i.qty}</span>
                <strong className="cp-price">{inr(i.price * i.qty)}</strong>
              </li>
            ))}
          </ul>

          <h2 className="sub">What happens next</h2>
          <ol className="steps">
            <li><b>1</b><span>We confirm your order on WhatsApp.</span></li>
            <li><b>2</b><span>{o.zone === 'outside' ? 'Our team calls you to arrange delivery to your location and confirm the charge.' : 'We schedule delivery and assembly with you.'}</span></li>
            <li><b>3</b><span>Your furniture is delivered and assembled by our team.</span></li>
          </ol>
        </section>

        <aside className="co-summary">
          <h2>Delivering to</h2>
          <address>
            <strong>{o.customer.name}</strong><br />
            {a.line1}{a.line2 && <>, {a.line2}</>}<br />
            {a.landmark && <>Near {a.landmark}<br /></>}
            {a.city}, {a.state} — {a.pincode}<br />
            +91 {o.customer.phone}
          </address>
          <div className="sum"><span>Subtotal</span><span>{inr(o.totals.subtotal)}</span></div>
          {o.totals.discount > 0 && <div className="sum disc"><span>{o.totals.coupon} discount</span><span>−{inr(o.totals.discount)}</span></div>}
          <div className="sum"><span>Delivery</span><span>{o.totals.shipping === null ? 'To be confirmed' : o.totals.shipping === 0 ? 'Free' : inr(o.totals.shipping)}</span></div>
          <div className="sum total"><span>Total</span><span>{inr(o.totals.total)}</span></div>
          <Link to="/shop" className="btn btn-primary block">Continue shopping</Link>
        </aside>
      </div>
    </main>
  )
}
