import { useEffect, useRef } from 'react'

type Particle = { x: number; y: number; vx: number; vy: number; size: number; phase: number }

export function SparkleBackground() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    let frame = 0
    let width = 0
    let height = 0
    const mouse = { x: -9999, y: -9999 }
    let particles: Particle[] = []
    const resize = () => {
      width = canvas.width = window.innerWidth * Math.min(devicePixelRatio, 2)
      height = canvas.height = window.innerHeight * Math.min(devicePixelRatio, 2)
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      particles = Array.from({ length: Math.min(112, Math.floor(window.innerWidth / 13)) }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.12,
        vy: (Math.random() - 0.5) * 0.1 - 0.04,
        size: Math.random() * 2.15 + 0.35,
        phase: Math.random() * Math.PI * 2,
      }))
    }
    const move = (e: PointerEvent) => {
      const dpr = Math.min(devicePixelRatio, 2)
      mouse.x = e.clientX * dpr
      mouse.y = e.clientY * dpr
    }
    const draw = (time: number) => {
      ctx.clearRect(0, 0, width, height)
      for (const p of particles) {
        const dx = p.x - mouse.x
        const dy = p.y - mouse.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 130 && dist > 0) {
          p.vx += (dx / dist) * 0.015
          p.vy += (dy / dist) * 0.015
        }
        p.vx *= 0.99
        p.vy *= 0.99
        p.x += p.vx
        p.y += p.vy
        if (p.y < -10) p.y = height + 10
        if (p.y > height + 10) p.y = -10
        if (p.x < -10) p.x = width + 10
        if (p.x > width + 10) p.x = -10
        const alpha = 0.15 + (Math.sin(time * 0.0015 + p.phase) + 1) * 0.25
        ctx.beginPath()
        ctx.fillStyle = `rgba(245, 215, 122, ${alpha})`
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
      }
      frame = requestAnimationFrame(draw)
    }
    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', move)
    frame = requestAnimationFrame(draw)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', move)
    }
  }, [])

  return <canvas ref={ref} aria-hidden className="pointer-events-none fixed inset-0 z-0 opacity-70" />
}
