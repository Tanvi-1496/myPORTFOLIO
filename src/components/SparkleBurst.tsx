import { useEffect, useState } from 'react'

type Burst = { id: number; x: number; y: number }

export function SparkleBurst() {
  const [bursts, setBursts] = useState<Burst[]>([])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let id = 0
    const create = (x: number, y: number) => {
      const burst = { id: ++id, x, y }
      setBursts((current) => [...current.slice(-8), burst])
      window.setTimeout(() => setBursts((current) => current.filter((item) => item.id !== burst.id)), 850)
    }
    const click = (event: PointerEvent) => create(event.clientX, event.clientY)
    const hover = (event: PointerEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('button, a, .glass-card')) return
      create(event.clientX, event.clientY)
    }
    const custom = (event: Event) => {
      const detail = (event as CustomEvent<{ x: number; y: number }>).detail
      create(detail.x, detail.y)
    }
    window.addEventListener('pointerdown', click)
    window.addEventListener('pointerover', hover)
    window.addEventListener('gold-sparkle', custom)
    return () => {
      window.removeEventListener('pointerdown', click)
      window.removeEventListener('pointerover', hover)
      window.removeEventListener('gold-sparkle', custom)
    }
  }, [])

  return (
    <div className="sparkle-burst-layer" aria-hidden>
      {bursts.map((burst) => (
        <span key={burst.id} className="sparkle-burst" style={{ left: burst.x, top: burst.y }}>
          {Array.from({ length: 7 }, (_, index) => <i key={index} style={{ '--i': index } as React.CSSProperties}>✦</i>)}
        </span>
      ))}
    </div>
  )
}
