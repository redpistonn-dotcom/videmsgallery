import { useEffect, useState } from 'react'
import { secondsToMidnight } from '../data/catalog'

export function Countdown({ className = '' }) {
  const [s, setS] = useState(secondsToMidnight())
  useEffect(() => {
    const id = setInterval(() => setS(secondsToMidnight()), 1000)
    return () => clearInterval(id)
  }, [])
  const p = (n) => String(n).padStart(2, '0')
  return (
    <span className={`countdown ${className}`} role="timer" aria-label="Offer ends today">
      <b>{p(Math.floor(s / 3600))}</b>:<b>{p(Math.floor((s % 3600) / 60))}</b>:<b>{p(s % 60)}</b>
    </span>
  )
}

export function CopyCode({ code }) {
  const [done, setDone] = useState(false)
  const copy = async () => {
    try { await navigator.clipboard.writeText(code) } catch { /* clipboard may be blocked */ }
    setDone(true)
    setTimeout(() => setDone(false), 1800)
  }
  return (
    <button className={`copy-code ${done ? 'done' : ''}`} onClick={copy} aria-live="polite">
      <code>{code}</code><span>{done ? 'Copied ✓' : 'Copy'}</span>
    </button>
  )
}

export const Arrow = () => <span className="arr" aria-hidden="true">→</span>
