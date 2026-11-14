import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { categories, products, off } from '../data/catalog'

export default function Shop() {
  const [sp, setSp] = useSearchParams()
  const [sort, setSort] = useState('pop')
  const [inStock, setInStock] = useState(false)
  const cat = sp.get('cat')
  const q = (sp.get('q') || '').toLowerCase()
  const sale = sp.get('sale')
  const max = Number(sp.get('max')) || 0

  const list = useMemo(() => {
    let l = products.filter(
      (p) => (!cat || p.category === cat) && (!q || `${p.name} ${p.material} ${p.category}`.toLowerCase().includes(q)) && (!inStock || p.stock !== 'out'),
    )
    if (sale) l = l.filter((p) => off(p.price, p.mrp) >= 20)
    if (max) l = l.filter((p) => p.price <= max)
    const s = { pop: (a, b) => b.reviews - a.reviews, low: (a, b) => a.price - b.price, high: (a, b) => b.price - a.price, off: (a, b) => off(b.price, b.mrp) - off(a.price, a.mrp) }
    return [...l].sort(s[sort])
  }, [cat, q, sale, max, sort, inStock])

  const chips = [
    cat && ['cat', categories.find((c) => c.slug === cat)?.name],
    q && ['q', `“${sp.get('q')}”`],
    max && ['max', `Under ₹${max.toLocaleString('en-IN')}`],
    sale && ['sale', 'Offers'],
    inStock && ['stock', 'In stock'],
  ].filter(Boolean)
  const dropChip = (k) => {
    if (k === 'stock') return setInStock(false)
    const n = new URLSearchParams(sp)
    n.delete(k)
    setSp(n)
  }

  const title = cat ? categories.find((c) => c.slug === cat)?.name : q ? `Results for “${sp.get('q')}”` : max ? `Under ₹${max.toLocaleString('en-IN')}` : sale ? 'Offers' : 'All furniture'

  return (
    <main className="wrap shop">
      <nav className="crumbs" aria-label="Breadcrumb"><Link to="/">Home</Link><span>/</span><span>{title}</span></nav>
      <header className="shop-head">
        <h1>{title}</h1>
        <p>{list.length} {list.length === 1 ? 'product' : 'products'}</p>
      </header>

      {chips.length > 1 && (
        <div className="chips" aria-label="Active filters">
          {chips.map(([k, l]) => <button key={k} onClick={() => dropChip(k)} aria-label={`Remove filter ${l}`}>{l} <span aria-hidden="true">✕</span></button>)}
          <button className="chips-clear" onClick={() => { setInStock(false); setSp({}) }}>Clear all</button>
        </div>
      )}

      <div className="shop-bar">
        <div className="pills">
          <button className={!cat ? 'on' : ''} onClick={() => setSp({})}>All</button>
          {categories.map((c) => (
            <button key={c.slug} className={cat === c.slug ? 'on' : ''} onClick={() => setSp({ cat: c.slug })}>{c.name}</button>
          ))}
        </div>
        <div className="shop-tools">
          <label className="check"><input type="checkbox" checked={inStock} onChange={(e) => setInStock(e.target.checked)} /> In stock</label>
          <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort by">
            <option value="pop">Popular</option>
            <option value="low">Price: low to high</option>
            <option value="high">Price: high to low</option>
            <option value="off">Biggest discount</option>
          </select>
        </div>
      </div>

      {list.length ? (
        <div className="p-grid">{list.map((p) => <ProductCard key={p.id} p={p} />)}</div>
      ) : (
        <div className="empty"><p className="serif">No products found</p><p>Try a different search or category.</p><button className="btn btn-primary" onClick={() => setSp({})}>Clear filters</button></div>
      )}
    </main>
  )
}
