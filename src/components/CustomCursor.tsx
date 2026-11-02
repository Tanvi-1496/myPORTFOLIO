import { motion, useMotionValue, useSpring } from 'motion/react'
import { useEffect, useState } from 'react'

export function CustomCursor() {
  const [hovering, setHovering] = useState(false)
  const [visible, setVisible] = useState(false)
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const ringX = useSpring(x, { stiffness: 200, damping: 24 })
  const ringY = useSpring(y, { stiffness: 200, damping: 24 })

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return
    const move = (e: PointerEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
      setVisible(true)
      setHovering(Boolean((e.target as HTMLElement).closest('a, button, .glass-card, input, textarea')))
    }
    const leave = () => setVisible(false)
    window.addEventListener('pointermove', move)
    document.documentElement.addEventListener('mouseleave', leave)
    return () => {
      window.removeEventListener('pointermove', move)
      document.documentElement.removeEventListener('mouseleave', leave)
    }
  }, [x, y])

  return (
    <div aria-hidden className={`custom-cursor hidden lg:block ${visible ? 'opacity-100' : 'opacity-0'}`}>
      <motion.div className="cursor-dot" style={{ x, y }} />
      <motion.div
        className="cursor-ring"
        style={{ x: ringX, y: ringY }}
        animate={{ width: hovering ? 54 : 34, height: hovering ? 54 : 34, opacity: hovering ? 0.8 : 0.45 }}
      />
    </div>
  )
}
