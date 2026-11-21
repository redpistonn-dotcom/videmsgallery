import { Link } from 'react-router-dom'
import FurnitureArt from '../components/FurnitureArt'

export default function NotFound() {
  return (
    <main className="wrap notfound">
      <div className="nf-art" aria-hidden="true"><FurnitureArt kind="sofa" tone="#7B1E2E" /></div>
      <p className="eyebrow"><i /> Error 404</p>
      <h1>This page has <em>moved house.</em></h1>
      <p>We couldn't find what you were looking for. Let's get you back to something comfortable.</p>
      <div className="t-actions">
        <Link to="/" className="btn btn-primary">Back to home</Link>
        <Link to="/shop" className="btn btn-ghost">Browse furniture</Link>
      </div>
    </main>
  )
}
