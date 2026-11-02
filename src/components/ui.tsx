import { motion, useMotionValue, useSpring } from 'motion/react'
import type { MouseEvent, ReactNode } from 'react'

export const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
}

export function SectionHeading({
  eyebrow,
  title,
  accent,
  description,
}: {
  eyebrow: string
  title: string
  accent: string
  description?: string
}) {
  return (
    <motion.div
      className="section-heading mb-12 max-w-2xl"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      variants={fadeUp}
      transition={{ duration: 0.65 }}
      onViewportEnter={(entry) => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
        const rect = entry?.target.getBoundingClientRect()
        if (rect) window.dispatchEvent(new CustomEvent('gold-sparkle', { detail: { x: rect.left + Math.min(rect.width, 240), y: rect.top + 65 } }))
      }}
    >
      <p className="eyebrow mb-3">{eyebrow}</p>
      <h2 className="text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
        {title} <span className="font-display italic gold-text">{accent}</span>
      </h2>
      {description && <p className="mt-5 leading-7 text-[var(--muted)]">{description}</p>}
    </motion.div>
  )
}

export function GlassCard({
  children,
  className = '',
  spotlight = true,
  onClick,
}: {
  children: ReactNode
  className?: string
  spotlight?: boolean
  onClick?: () => void
}) {
  const onMove = (event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    event.currentTarget.style.setProperty('--x', `${event.clientX - rect.left}px`)
    event.currentTarget.style.setProperty('--y', `${event.clientY - rect.top}px`)
  }
  return (
    <motion.div
      onMouseMove={onMove}
      onClick={onClick}
      whileHover={{ y: -5, rotateX: 0.6, rotateY: -0.6 }}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      className={`glass-card ${spotlight ? 'spotlight-card' : ''} ${className}`}
    >
      <span className="card-sparkles" aria-hidden>✦ ✧ ✦</span>
      {children}
    </motion.div>
  )
}

export function MagneticButton({
  children,
  href,
  variant = 'gold',
  className = '',
  external = false,
}: {
  children: ReactNode
  href: string
  variant?: 'gold' | 'outline'
  className?: string
  external?: boolean
}) {
  const x = useSpring(useMotionValue(0), { stiffness: 180, damping: 14 })
  const y = useSpring(useMotionValue(0), { stiffness: 180, damping: 14 })
  const move = (event: MouseEvent<HTMLAnchorElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    x.set((event.clientX - rect.left - rect.width / 2) * 0.16)
    y.set((event.clientY - rect.top - rect.height / 2) * 0.16)
  }
  return (
    <motion.a
      href={href}
      onMouseMove={move}
      onMouseLeave={() => {
        x.set(0)
        y.set(0)
      }}
      style={{ x, y }}
      className={`magnetic-button ${variant === 'gold' ? 'button-gold' : 'button-outline'} ${className}`}
      target={external ? '_blank' : undefined}
      rel={external ? 'noreferrer' : undefined}
    >
      {children}
    </motion.a>
  )
}
