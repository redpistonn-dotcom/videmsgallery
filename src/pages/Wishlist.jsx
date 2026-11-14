import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { useWishlist } from '../context/WishlistContext'
import { useCart } from '../context/CartContext'
import { byId } from '../data/catalog'

export default function Wishlist() {
  const { ids, clear } = useWishlist()
  const { add } = useCart()
  const list = ids.map((id) => byId[id]).filter(Boolean)
  const buyable = list.filter((p) => p.stock !== 'out')

  const addAll = () => buyable.forEach((p) => add({ key: p.id, name: p.name, price: p.price, kind: p.kind, tone: p.tone, meta: p.material }))

  return (
    <main className="wrap shop">
      <nav className="crumbs" aria-label="Breadcrumb"><Link to="/">Home</Link><span>/</span><span>Wishlist</span></nav>
      <header className="shop-head">
        <h1>Your wishlist</h1>
        <p>{list.length} {list.length === 1 ? 'item' : 'items'}</p>
      </header>

      {list.length ? (
        <>
          <div className="wish-bar">
            <button className="btn btn-primary" onClick={addAll} disabled={!buyable.length}>Add all to cart</button>
            <button className="btn btn-ghost" onClick={clear}>Clear wishlist</button>
          </div>
          <div className="p-grid">{list.map((p) => <ProductCard key={p.id} p={p} />)}</div>
        </>
      ) : (
        <div className="empty">
          <p className="serif">Your wishlist is empty</p>
          <p>Tap the heart on any product to save it here. Saved on this device.</p>
          <Link to="/shop" className="btn btn-primary">Browse furniture</Link>
        </div>
      )}
    </main>
  )
}
