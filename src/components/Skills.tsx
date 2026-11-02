import { motion } from 'motion/react'
import { BrainCircuit, CloudCog, Code2, Database, PanelsTopLeft } from 'lucide-react'
import { skillGroups } from '../data/portfolio'
import { GlassCard, SectionHeading, fadeUp } from './ui'

const groups = [
  { title: 'DevOps & Cloud', icon: CloudCog, wide: true },
  { title: 'Programming', icon: Code2 },
  { title: 'Web', icon: PanelsTopLeft },
  { title: 'AI / ML', icon: BrainCircuit, wide: true },
  { title: 'Data', icon: Database },
]

export function Skills() {
  return (
    <section id="skills" className="section-padding">
      <div className="section-shell">
        <SectionHeading eyebrow="02 / Skills" title="Tools I use to" accent="make things happen." />
        <motion.div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3" initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-70px' }} transition={{ staggerChildren: 0.07 }}>
          {groups.map(({ title, icon: Icon, wide }) => (
            <motion.div key={title} variants={fadeUp} className={wide ? 'lg:col-span-2' : ''}>
              <GlassCard className="h-full min-h-52 p-7">
                <div className="mb-7 flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent)]/15 text-[var(--gold)]"><Icon size={19} /></span><h3 className="font-semibold">{title}</h3></div>
                <div className="flex flex-wrap gap-2">{skillGroups[title as keyof typeof skillGroups].map((skill) => <motion.span whileHover={{ y: -3 }} className="skill-chip" key={skill}>{skill}</motion.span>)}</div>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
      <div className="marquee mt-16 border-y border-white/[0.06] py-5">
        <div className="marquee-track">
          {[...Array(2)].flatMap((_, i) => ['DOCKER', 'KUBERNETES', 'PROMETHEUS', 'REACT', 'FASTAPI', 'GENAI', 'POSTGRESQL'].map((item) => <span key={`${i}-${item}`}>{item} <b>✦</b></span>))}
        </div>
      </div>
    </section>
  )
}
