import { useState } from 'react'
import { Link } from 'react-router-dom'
import FurnitureArt from '../components/FurnitureArt'
import Steps from '../components/Steps'
import { useCart } from '../context/CartContext'
import { inr, delivery, coupons } from '../data/catalog'

export default function Cart() {
  const { items, qty, remove, subtotal, shipping, discount, code, couponMsg, total, applyCoupon, removeCoupon } = useCart()
  const [input, setInput] = useState('')
  const [msg, setMsg] = useState(null)
  const toFree = Math.max(0, delivery.freeAbove - subtotal)

  const apply = (e) => {
    e.preventDefault()
    const r = applyCoupon(input)
    setMsg(r)
    if (r.ok) setInput('')
  }

  if (!items.length) {
    return (
      <main className="wrap shop">
        <div className="empty">
          <div className="empty-art" aria-hidden="true"><FurnitureArt kind="sofa" tone="#7B1E2E" /></div>
          <p className="serif">Your cart is empty</p>
          <p>Add pieces you love and they'll appear here.</p>
          <Link to="/shop" className="btn btn-primary">Browse furniture</Link>
        </div>
      </main>
    )
  }

  return (
    <main className="wrap cart-page">
      <nav className="crumbs" aria-label="Breadcrumb"><Link to="/">Home</Link><span>/</span><span>Cart</span></nav>
      <Steps current={1} />
      <header className="shop-head"><h1>Your cart</h1><p>{items.reduce((s, i) => s + i.qty, 0)} items</p></header>

      <div className="co-grid">
        <section aria-label="Cart items">
          <div className={`free-note flat ${toFree > 0 ? '' : 'ok'}`}>
            <p>{toFree > 0 ? <>Add <strong>{inr(toFree)}</strong> more for free delivery</> : "You've unlocked free delivery"}</p>
            <FreeBar subtotal={subtotal} />
          </div>
          <ul className="cp-list">
            {items.map((i) => (
              <li key={i.key}>
                <div className="cart-thumb"><FurnitureArt kind={i.kind} tone={i.tone} /></div>
                <div className="cp-main">
                  <h3>{i.name}</h3>
                  {i.meta && <p className="mono-label">{i.meta}</p>}
                  {i.lines && <ul className="cart-lines">{i.lines.map((l) => <li key={l}>{l}</li>)}</ul>}
                  <button className="link-btn" onClick={() => remove(i.key)}>Remove</button>
                </div>
                <div className="qty" role="group" aria-label={`Quantity of ${i.name}`}>
                  <button onClick={() => qty(i.key, -1)} aria-label="Decrease">−</button>
                  <span>{i.qty}</span>
                  <button onClick={() => qty(i.key, 1)} aria-label="Increase">+</button>
                </div>
                <strong className="cp-price">{inr(i.price * i.qty)}</strong>
              </li>
            ))}
          </ul>
          <Link to="/shop" className="link-arrow">← Continue shopping</Link>
        </section>

        <Summary
          subtotal={subtotal} discount={discount} shipping={shipping} total={total}
          code={code} couponMsg={couponMsg} msg={msg} input={input} setInput={setInput} setMsg={setMsg}
          apply={apply} removeCoupon={removeCoupon}
          cta={<Link to="/checkout" className="btn btn-primary btn-cta block">Proceed to checkout <span className="arr" aria-hidden="true">→</span></Link>}
        />
      </div>
    </main>
  )
}

export function FreeBar({ subtotal }) {
  const pct = Math.min(100, Math.round((subtotal / delivery.freeAbove) * 100))
  return <span className={`free-bar ${pct >= 100 ? 'full' : ''}`} role="progressbar" aria-label="Progress to free delivery" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct}><i style={{ width: `${pct}%` }} /></span>
}

export function Summary({ subtotal, discount, shipping, total, code, couponMsg, msg, input, setInput, setMsg, apply, removeCoupon, cta, shippingLabel, children }) {
  return (
    <aside className="co-summary" aria-label="Order summary">
      <h2>Order summary</h2>
      {children}
      {apply && (code ? (
        <div className="applied">
          <span><b>{code}</b> applied · you save {inr(discount)}</span>
          <button className="link-btn" onClick={() => { removeCoupon(); setMsg(null) }}>Remove</button>
        </div>
      ) : (
        <form className="coupon-form" onSubmit={apply}>
          <input value={input} onChange={(e) => { setInput(e.target.value); setMsg(null) }} placeholder="Coupon code" aria-label="Coupon code" list="coupon-hints2" autoCapitalize="characters" />
          <datalist id="coupon-hints2">{coupons.map((c) => <option key={c.code} value={c.code}>{c.text}</option>)}</datalist>
          <button className="btn btn-ghost" type="submit">Apply</button>
        </form>
      ))}
      {msg && !msg.ok && <p className="cp-msg bad" role="alert">{msg.msg}</p>}
      {couponMsg && <p className="cp-msg bad" role="status">{couponMsg}</p>}
      <div className="sum"><span>Subtotal</span><span>{inr(subtotal)}</span></div>
      {discount > 0 && <div className="sum disc"><span>Coupon discount</span><span>−{inr(discount)}</span></div>}
      <div className="sum"><span>Delivery</span><span>{shippingLabel || (shipping === 0 ? 'Free' : inr(shipping))}</span></div>
      <div className="sum total"><span>Total</span><span>{inr(total)}</span></div>
      {cta}
      <p className="fine">Inclusive of all taxes.</p>
    </aside>
  )
}
