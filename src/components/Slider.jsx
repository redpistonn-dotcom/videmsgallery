import { useCallback, useEffect, useRef, useState } from 'react'

const Chevron = ({ dir }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={dir === 'l' ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7'} />
  </svg>
)

// Snap-scroll slider with prev/next. Cards are <li> children; width set via CSS var --per.
export default function Slider({ children, per = 4, label, className = '' }) {
  const ref = useRef(null)
  const [edge, setEdge] = useState({ start: true, end: false })

  const update = useCallback(() => {
    const el = ref.current
    if (!el) return
    setEdge({ start: el.scrollLeft < 4, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4 })
  }, [])

  useEffect(() => {
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [update])

  const move = (d) => {
    const el = ref.current
    el.scrollBy({ left: d * el.clientWidth * 0.85, behavior: 'smooth' })
  }

  return (
    <div className={`slider ${className}`} style={{ '--per': per }}>
      <button className="sl-btn sl-prev" onClick={() => move(-1)} disabled={edge.start} aria-label={`Previous ${label}`}><Chevron dir="l" /></button>
      <ul className="sl-track" ref={ref} onScroll={update} aria-label={label}>{children}</ul>
      <button className="sl-btn sl-next" onClick={() => move(1)} disabled={edge.end} aria-label={`Next ${label}`}><Chevron dir="r" /></button>
    </div>
  )
}
