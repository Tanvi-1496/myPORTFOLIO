import { motion, useInView, useReducedMotion } from 'motion/react'
import { Check, Container, GitCommitHorizontal, Rocket, SearchCheck, TestTubeDiagonal } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { SectionHeading } from './ui'

const stages = [
  { title: 'Commit', caption: 'Git push', icon: GitCommitHorizontal },
  { title: 'Build', caption: 'Docker build', icon: Container },
  { title: 'Test', caption: 'Automated tests', icon: TestTubeDiagonal },
  { title: 'Security Scan', caption: 'Trivy scan', icon: SearchCheck },
  { title: 'Deploy', caption: 'Kubernetes rollout', icon: Rocket },
]

export function Pipeline() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { margin: '-20%' })
  const reduceMotion = useReducedMotion()
  const [active, setActive] = useState(-1)
  useEffect(() => {
    if (!inView) return
    if (reduceMotion) {
      setActive(stages.length - 1)
      return
    }
    let step = -1
    const tick = () => {
      step = step >= stages.length ? -1 : step + 1
      setActive(step)
    }
    tick()
    const timer = window.setInterval(tick, 850)
    return () => window.clearInterval(timer)
  }, [inView, reduceMotion])
  return (
    <section id="pipeline" ref={ref} className="section-padding alternate-section">
      <div className="section-shell">
        <SectionHeading eyebrow="04 / Workflow" title="How I" accent="ship." description="A secure, automated path from first commit to a healthy rollout." />
        <div className="pipeline">
          <div className="pipeline-track"><motion.span animate={{ scaleX: Math.max(0, active) / (stages.length - 1) }} /></div>
          {stages.map(({ title, caption, icon: Icon }, index) => {
            const complete = index <= active
            return (
              <motion.div key={title} className={`pipeline-node ${complete ? 'complete' : ''}`} animate={{ scale: index === active ? 1.04 : 1 }}>
                <div className="pipeline-icon">{complete ? <Check size={21} /> : <Icon size={21} />}</div>
                <strong>{title}</strong><small>{caption}</small>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
