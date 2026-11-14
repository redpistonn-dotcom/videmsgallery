import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <main className="wrap notfound">
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
