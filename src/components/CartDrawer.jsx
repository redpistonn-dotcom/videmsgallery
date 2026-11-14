import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import FurnitureArt from './FurnitureArt'
import { useCart } from '../context/CartContext'
import { inr, delivery, coupons } from '../data/catalog'

export default function CartDrawer() {
  const { open, setOpen, items, qty, remove, subtotal, shipping, discount, code, couponMsg, total, applyCoupon, removeCoupon } = useCart()
  const [input, setInput] = useState('')
  const [msg, setMsg] = useState(null)
  const closeRef = useRef(null)
  const lastFocus = useRef(null)

  // Esc closes; focus moves into the drawer on open and returns to the trigger on close.
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [setOpen])

  useEffect(() => {
    if (open) {
      lastFocus.current = document.activeElement
      setTimeout(() => closeRef.current?.focus(), 60)
    } else if (lastFocus.current instanceof HTMLElement) {
      lastFocus.current.focus()
      lastFocus.current = null
    }
  }, [open])

  const toFree = Math.max(0, delivery.freeAbove - subtotal)
  const apply = (e) => {
    e.preventDefault()
    const r = applyCoupon(input)
    setMsg(r)
    if (r.ok) setInput('')
  }

  return (
    <>
      <div className={`scrim ${open ? 'show' : ''}`} onClick={() => setOpen(false)} />
      <aside className={`drawer ${open ? 'open' : ''}`} inert={!open} role="dialog" aria-modal="true" aria-label="Shopping cart">
        <div className="drawer-head">
          <h2>Your cart</h2>
          <button className="icon-btn" ref={closeRef} onClick={() => setOpen(false)} aria-label="Close cart">✕</button>
        </div>

        {items.length === 0 ? (
          <div className="drawer-empty">
            <p className="serif">Your cart is empty</p>
            <p>Browse our collections and add pieces you love.</p>
            <button className="btn btn-primary" onClick={() => setOpen(false)}>Continue shopping</button>
          </div>
        ) : (
          <>
            {toFree > 0 ? (
              <p className="free-note">Add <strong>{inr(toFree)}</strong> more for free delivery</p>
            ) : (
              <p className="free-note ok">You've unlocked free delivery</p>
            )}
            <ul className="cart-list">
              {items.map((i) => (
                <li key={i.key}>
                  <div className="cart-thumb"><FurnitureArt kind={i.kind} tone={i.tone} /></div>
                  <div className="cart-info">
                    <h3>{i.name}</h3>
                    {i.meta && <p className="mono-label">{i.meta}</p>}
                    {i.lines && (
                      <ul className="cart-lines">
                        {i.lines.map((l) => <li key={l}>{l}</li>)}
                      </ul>
                    )}
                    <div className="qty-row">
                      <div className="qty" role="group" aria-label={`Quantity of ${i.name}`}>
                        <button onClick={() => qty(i.key, -1)} aria-label="Decrease">−</button>
                        <span>{i.qty}</span>
                        <button onClick={() => qty(i.key, 1)} aria-label="Increase">+</button>
                      </div>
                      <strong>{inr(i.price * i.qty)}</strong>
                    </div>
                    <button className="link-btn" onClick={() => remove(i.key)}>Remove</button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="drawer-foot">
              {code ? (
                <div className="applied">
                  <span><b>{code}</b> applied · you save {inr(discount)}</span>
                  <button className="link-btn" onClick={() => { removeCoupon(); setMsg(null) }}>Remove</button>
                </div>
              ) : (
                <form className="coupon-form" onSubmit={apply}>
                  <input value={input} onChange={(e) => { setInput(e.target.value); setMsg(null) }} placeholder="Coupon code" aria-label="Coupon code" list="coupon-hints" autoCapitalize="characters" />
                  <datalist id="coupon-hints">{coupons.map((c) => <option key={c.code} value={c.code}>{c.text}</option>)}</datalist>
                  <button className="btn btn-ghost" type="submit">Apply</button>
                </form>
              )}
              {(msg && !msg.ok) && <p className="cp-msg bad" role="alert">{msg.msg}</p>}
              {couponMsg && <p className="cp-msg bad" role="status">{couponMsg}</p>}

              <div className="sum"><span>Subtotal</span><span>{inr(subtotal)}</span></div>
              {discount > 0 && <div className="sum disc"><span>Coupon discount</span><span>−{inr(discount)}</span></div>}
              <div className="sum"><span>Delivery</span><span>{shipping === 0 ? 'Free' : inr(shipping)}</span></div>
              <div className="sum total"><span>Total</span><span>{inr(total)}</span></div>
              <Link to="/checkout" className="btn btn-primary btn-cta block" onClick={() => setOpen(false)}>Proceed to checkout <span className="arr" aria-hidden="true">→</span></Link>
              <Link to="/cart" className="link-arrow center" onClick={() => setOpen(false)}>View full cart</Link>
              <p className="fine">Exact delivery charges are confirmed at checkout.</p>
            </div>
          </>
        )}
      </aside>
    </>
  )
}
