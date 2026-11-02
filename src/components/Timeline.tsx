import { motion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { journey } from '../data/portfolio'
import { GlassCard, SectionHeading } from './ui'

export function Timeline() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 55%'] })
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <section id="journey" ref={ref} className="section-padding alternate-section">
      <div className="section-shell">
        <SectionHeading eyebrow="02 / Timeline" title="My" accent="Journey" description="The systems, experiences, and ambitions shaping the engineer I am becoming." />
        <div className="journey-timeline">
          <div className="journey-line"><motion.span style={{ scaleY }} /></div>
          {journey.map((item, index) => (
            <motion.div
              key={item.title}
              className={`journey-entry ${index % 2 ? 'journey-right' : 'journey-left'}`}
              initial={{ opacity: 0, x: index % 2 ? 24 : -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-15%' }}
              transition={{ duration: 0.55 }}
            >
              <span className="journey-node" />
              <GlassCard className="journey-card p-6">
                <span className="eyebrow">Step {String(index + 1).padStart(2, '0')}</span>
                <h3 className="mt-3 text-lg font-semibold">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{item.detail}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
