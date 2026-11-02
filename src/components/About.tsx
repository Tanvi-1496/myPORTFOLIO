import { motion, useInView } from 'motion/react'
import { ArrowUpRight, MapPin, Sparkles } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { GlassCard, SectionHeading, fadeUp } from './ui'

function CountUp({ end, suffix = '' }: { end: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!inView) return
    const start = performance.now()
    const tick = (now: number) => {
      const progress = Math.min((now - start) / 1200, 1)
      setValue(end * (1 - Math.pow(1 - progress, 3)))
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [end, inView])
  return <span ref={ref}>{end % 1 ? value.toFixed(2) : Math.round(value)}{suffix}</span>
}

export function About() {
  return (
    <section id="about" className="section-padding">
      <div className="section-shell">
        <SectionHeading eyebrow="01 / About" title="Curious mind." accent="Systems thinker." description="I enjoy the space where dependable infrastructure meets intelligent software." />
        <motion.div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4" initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} transition={{ staggerChildren: 0.08 }}>
          <motion.div variants={fadeUp} className="md:col-span-2 lg:row-span-2">
            <GlassCard className="flex h-full min-h-72 flex-col justify-between p-7 sm:p-8">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#D4AF37]/20 bg-[#D4AF37]/10 text-[#E5C458]"><Sparkles size={19} /></div>
              <div>
                <h3 className="mb-4 text-2xl font-semibold">Building with purpose.</h3>
                <p className="leading-7 text-[var(--muted)]">I&apos;m an <span className="gold-text">Information Technology student</span> at Vidyalankar Institute of Technology, Mumbai, pursuing B.Tech through lateral entry. I turn ideas into <span className="gold-text">thoughtful, resilient products</span> and keep learning from every deployment.</p>
                <p className="mt-5 flex items-center gap-2 text-sm text-white/55"><MapPin size={15} className="text-[#D4AF37]" /> Virar, Maharashtra, India</p>
              </div>
            </GlassCard>
          </motion.div>
          <motion.div variants={fadeUp}><GlassCard className="min-h-44 p-6"><p className="stat-value"><CountUp end={9.83} /></p><p className="mt-3 text-sm text-[var(--muted)]">CGPA</p></GlassCard></motion.div>
          <motion.div variants={fadeUp}><GlassCard className="min-h-44 p-6"><p className="stat-value"><CountUp end={8} suffix="+" /></p><p className="mt-3 text-sm text-[var(--muted)]">Projects built</p></GlassCard></motion.div>
          <motion.div variants={fadeUp} className="md:col-span-2"><GlassCard className="p-7"><p className="gold-text mb-5 text-xs uppercase tracking-[0.2em]">Currently focused on</p><div className="flex flex-wrap gap-2">{['Cloud', 'Kubernetes', 'CI/CD', 'Observability', 'AIOps'].map((item) => <span className="skill-chip gold-text" key={item}>{item}</span>)}</div></GlassCard></motion.div>
          <motion.div variants={fadeUp} className="md:col-span-2 lg:col-span-2"><GlassCard className="flex h-full min-h-40 items-center justify-between gap-6 p-7"><div><p className="text-xs uppercase tracking-[0.2em] text-white/35">Focus</p><p className="mt-3 text-xl font-semibold">DevOps <span className="gold-text">+</span> AI / ML</p></div><div className="text-right"><p className="mb-3 text-sm text-[var(--muted)]">Let&apos;s build something together.</p><a href="#contact" className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent-soft)]">Start a conversation <ArrowUpRight size={15} /></a></div></GlassCard></motion.div>
        </motion.div>
      </div>
    </section>
  )
}
