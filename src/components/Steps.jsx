import { Link } from 'react-router-dom'

const STEPS = [
  ['Cart', '/cart'],
  ['Delivery', '/checkout'],
  ['Payment', null],
  ['Done', null],
]

// current: 1 = cart, 2 = details + payment, 4 = confirmed
export default function Steps({ current }) {
  return (
    <ol className="steps-bar" aria-label="Checkout progress">
      {STEPS.map(([label, to], i) => {
        const n = i + 1
        const state = n < current ? 'done' : n === current ? 'now' : ''
        const inner = (
          <>
            <b aria-hidden="true">{n < current ? '✓' : n}</b>
            <span>{label}</span>
          </>
        )
        return (
          <li key={label} className={state} aria-current={n === current ? 'step' : undefined}>
            {to && n < current && current !== 4 ? <Link to={to}>{inner}</Link> : inner}
          </li>
        )
      })}
    </ol>
  )
}
