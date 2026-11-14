// Flat brand-style furniture illustrations used as stand-ins until real product photos
// are uploaded. Swap for <img> in ProductCard when the API provides image URLs.
const shade = (hex, amt) => {
  const n = parseInt(hex.slice(1), 16)
  const c = (v) => Math.max(0, Math.min(255, v + amt))
  const r = c(n >> 16), g = c((n >> 8) & 255), b = c(n & 255)
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`
}

const WOOD = '#7A4B20'
const GOLD = '#B8862F'

export default function FurnitureArt({ kind = 'sofa', tone = '#C8281F', className = '' }) {
  const dark = shade(tone, -34)
  const light = shade(tone, 28)
  let body = null

  switch (kind) {
    case 'sofa':
      body = (
        <g>
          <rect x="105" y="92" width="190" height="78" rx="38" fill={tone} />
          <rect x="105" y="92" width="190" height="78" rx="38" fill="none" />
          <rect x="108" y="140" width="184" height="52" rx="14" fill={dark} />
          <rect x="122" y="128" width="156" height="42" rx="12" fill={light} />
          <rect x="72" y="120" width="52" height="76" rx="26" fill={tone} />
          <rect x="276" y="120" width="52" height="76" rx="26" fill={tone} />
          <rect x="132" y="192" width="14" height="16" rx="3" fill={WOOD} />
          <rect x="254" y="192" width="14" height="16" rx="3" fill={WOOD} />
        </g>
      )
      break
    case 'bed':
      body = (
        <g>
          <rect x="82" y="62" width="236" height="84" rx="14" fill={dark} />
          <rect x="94" y="72" width="212" height="64" rx="8" fill={shade(tone, -14)} />
          <rect x="70" y="140" width="260" height="46" rx="10" fill={tone} />
          <rect x="70" y="140" width="260" height="14" rx="7" fill={light} />
          <rect x="102" y="118" width="84" height="30" rx="12" fill="#F6F1EA" />
          <rect x="214" y="118" width="84" height="30" rx="12" fill="#F6F1EA" />
          <rect x="70" y="186" width="14" height="22" fill={WOOD} />
          <rect x="316" y="186" width="14" height="22" fill={WOOD} />
        </g>
      )
      break
    case 'table':
      body = (
        <g>
          <rect x="70" y="106" width="260" height="20" rx="8" fill={tone} />
          <rect x="70" y="118" width="260" height="8" rx="4" fill={dark} />
          <rect x="100" y="126" width="16" height="84" rx="3" fill={dark} />
          <rect x="284" y="126" width="16" height="84" rx="3" fill={dark} />
          <rect x="140" y="134" width="120" height="10" rx="3" fill={dark} opacity=".5" />
        </g>
      )
      break
    case 'chair':
      body = (
        <g>
          <rect x="140" y="64" width="120" height="86" rx="24" fill={tone} />
          <rect x="154" y="78" width="92" height="60" rx="16" fill={light} opacity=".5" />
          <rect x="128" y="146" width="144" height="30" rx="12" fill={dark} />
          <rect x="140" y="176" width="12" height="40" rx="3" fill={WOOD} />
          <rect x="248" y="176" width="12" height="40" rx="3" fill={WOOD} />
        </g>
      )
      break
    case 'wardrobe':
      body = (
        <g>
          <rect x="112" y="44" width="176" height="166" rx="8" fill={tone} />
          <rect x="120" y="52" width="76" height="150" rx="4" fill={light} opacity=".55" />
          <rect x="204" y="52" width="76" height="150" rx="4" fill={light} opacity=".35" />
          <rect x="186" y="116" width="5" height="26" rx="2" fill={GOLD} />
          <rect x="209" y="116" width="5" height="26" rx="2" fill={GOLD} />
          <rect x="124" y="210" width="12" height="10" fill={WOOD} />
          <rect x="264" y="210" width="12" height="10" fill={WOOD} />
        </g>
      )
      break
    case 'tvunit':
      body = (
        <g>
          <rect x="62" y="136" width="276" height="56" rx="8" fill={tone} />
          <rect x="72" y="146" width="80" height="36" rx="4" fill={dark} />
          <rect x="160" y="146" width="80" height="36" rx="4" fill={light} opacity=".5" />
          <rect x="248" y="146" width="80" height="36" rx="4" fill={dark} />
          <rect x="116" y="76" width="168" height="52" rx="4" fill="#25201E" />
          <rect x="120" y="80" width="160" height="44" rx="2" fill="#3A322E" />
          <rect x="80" y="192" width="10" height="14" fill={WOOD} />
          <rect x="310" y="192" width="10" height="14" fill={WOOD} />
        </g>
      )
      break
    case 'coffee':
      body = (
        <g>
          <ellipse cx="200" cy="130" rx="108" ry="26" fill={tone} />
          <ellipse cx="200" cy="124" rx="108" ry="24" fill={light} />
          <rect x="120" y="140" width="12" height="62" rx="3" fill={dark} />
          <rect x="268" y="140" width="12" height="62" rx="3" fill={dark} />
        </g>
      )
      break
    case 'lamp':
      body = (
        <g fill="none" stroke={tone} strokeWidth="5" strokeLinecap="round">
          <path d="M150 212 L150 100 C150 52 200 40 244 66" />
          <line x1="110" y1="212" x2="190" y2="212" strokeWidth="6" />
          <path d="M232 66 L274 70 C268 88 244 94 230 82 Z" fill={dark} stroke="none" />
          <ellipse cx="252" cy="86" rx="14" ry="4" fill="#F4DFA8" stroke="none" />
        </g>
      )
      break
    default:
      body = null
  }

  return (
    <svg className={`art ${className}`} viewBox="0 0 400 270" role="img" aria-hidden="true" preserveAspectRatio="xMidYMid meet">
      <ellipse cx="200" cy="218" rx="150" ry="11" fill="#2A2220" opacity=".10" />
      {body}
    </svg>
  )
}
