import { Link } from 'react-router-dom'
import { categories } from '../data/catalog'

// Showroom details: fill in real values to show the "Visit the gallery" block (placeholders are not shipped).
const SHOWROOM = null // e.g. { address: 'Street, City, State — PIN', phone: '+91 …', hours: 'Mon–Sun · 10 am – 8 pm' }

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className={`wrap foot-grid ${SHOWROOM ? '' : 'three'}`}>
        <div className="foot-brand">
          <img src="/brand/logo-full.png" alt="Videm's Gallery — Furniture & Interior" />
          <p>Thoughtfully made furniture for homes that feel calm, warm and lived-in.</p>
        </div>
        <div>
          <h4 className="mono-label">Shop</h4>
          <ul>{categories.slice(0, 6).map((c) => <li key={c.slug}><Link to={`/shop?cat=${c.slug}`}>{c.name}</Link></li>)}</ul>
        </div>
        <div>
          <h4 className="mono-label">Help</h4>
          <ul>
            <li><a href="#">Delivery & installation</a></li>
            <li><a href="#">Returns & warranty</a></li>
            <li><a href="#">Track your order</a></li>
            <li><a href="#">Contact us</a></li>
          </ul>
        </div>
        {SHOWROOM && (
          <div>
            <h4 className="mono-label">Visit the gallery</h4>
            <p className="foot-addr">{SHOWROOM.address}<br />{SHOWROOM.phone}<br />{SHOWROOM.hours}</p>
          </div>
        )}
      </div>
      <div className="wrap foot-bar">
        <span>© {new Date().getFullYear()} Videm's Gallery. All rights reserved.</span>
        <span className="foot-legal">Privacy · Terms</span>
      </div>
    </footer>
  )
}
