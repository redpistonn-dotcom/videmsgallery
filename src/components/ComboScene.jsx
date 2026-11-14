import FurnitureArt from './FurnitureArt'
import { byId } from '../data/catalog'

// Light styled "room" tile composed from a combo's default pieces.
// Placeholder until real room photos are uploaded.
const LAYOUT = {
  2: [[30, 52, 270], [225, 110, 170]],
  3: [[70, 48, 260], [4, 140, 140], [276, 92, 120]],
}

// Hotspot centres (percent of scene) for each piece — used by the Room Explorer.
export function hotspots(combo) {
  const kinds = combo.slots.map((s) => byId[s.default])
  const pos = LAYOUT[Math.min(3, kinds.length)] || LAYOUT[3]
  return kinds.map((p, k) => {
    const [x, y, w] = pos[k] || pos[0]
    const h = (w * 270) / 400
    return { product: p, left: ((x + w / 2) / 400) * 100, top: ((y + h * 0.45) / 300) * 100 }
  })
}

export default function ComboScene({ combo, index = 0, items }) {
  const kinds = items || combo.slots.map((s) => byId[s.default])
  const pos = LAYOUT[Math.min(3, kinds.length)] || LAYOUT[3]
  const id = `r${combo.id}`
  return (
    <svg className="scene" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" role="img" aria-label={combo.name}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" style={{ stopColor: 'var(--gold)' }} />
          <stop offset="1" style={{ stopColor: 'var(--bronze)' }} />
        </linearGradient>
      </defs>
      <rect width="400" height="300" style={{ fill: `var(--wall-${index % 5})` }} />
      <circle cx="300" cy="96" r="62" fill="#FBF8F3" stroke={`url(#${id})`} strokeWidth="5" />
      <rect y="232" width="400" height="68" style={{ fill: 'var(--floor)' }} />
      <rect y="230" width="400" height="3" style={{ fill: 'var(--floor-line)' }} opacity=".5" />
      {[...kinds].reverse().map((p, i) => {
        const k = kinds.length - 1 - i
        const [x, y, w] = pos[k] || pos[0]
        return (
          <svg key={p.id} x={x} y={y} width={w} height={(w * 270) / 400} viewBox="0 0 400 270" overflow="visible">
            <FurnitureInner kind={p.kind} tone={p.tone} />
          </svg>
        )
      })}
    </svg>
  )
}

// Render FurnitureArt body without its own <svg> wrapper by nesting it.
function FurnitureInner({ kind, tone }) {
  return <FurnitureArt kind={kind} tone={tone} />
}
