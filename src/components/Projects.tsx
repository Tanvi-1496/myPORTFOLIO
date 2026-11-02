import { AnimatePresence, motion } from 'motion/react'
import { Activity, AudioLines, Bot, ChartNoAxesCombined, GitBranch, Sprout } from 'lucide-react'
import { useCallback, useState } from 'react'
import { projects } from '../data/portfolio'
import { CaseStudyModal } from './CaseStudyModal'
import { GlassCard, MagneticButton, SectionHeading, fadeUp } from './ui'

const icons = { bot: Bot, activity: Activity, audio: AudioLines, git: GitBranch, sprout: Sprout, chart: ChartNoAxesCombined }

export function Projects() {
  const [selected, setSelected] = useState<number | null>(null)
  const [filter, setFilter] = useState<'All' | 'DevOps' | 'AI/ML' | 'Full-stack'>('All')
  const close = useCallback(() => setSelected(null), [])
  const previous = useCallback(() => setSelected((current) => current === null ? null : (current - 1 + projects.length) % projects.length), [])
  const next = useCallback(() => setSelected((current) => current === null ? null : (current + 1) % projects.length), [])
  const visible = projects.filter((project) => filter === 'All' || project.categories.includes(filter))

  return (
    <section id="projects" className="section-padding">
      <div className="section-shell">
        <SectionHeading eyebrow="05 / Projects" title="Selected work," accent="built to matter." description="A mix of intelligent products, infrastructure systems, and data-driven applications. Select a card for the full case study." />
        <div className="project-filters" role="tablist" aria-label="Filter projects">
          {(['All', 'DevOps', 'AI/ML', 'Full-stack'] as const).map((item) => <button role="tab" aria-selected={filter === item} key={item} onClick={() => setFilter(item)} className={filter === item ? 'active' : ''}>{item}{filter === item && <motion.i layoutId="filter-underline" />}</button>)}
        </div>
        <motion.div layout className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
          {visible.map((project) => {
            const index = projects.indexOf(project)
            const Icon = icons[project.icon]
            return (
              <motion.article layout variants={fadeUp} initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: .95 }} key={project.title} className={project.featured ? 'md:col-span-2' : ''}>
                <GlassCard className="group flex h-full min-h-[440px] cursor-pointer flex-col overflow-hidden" onClick={() => setSelected(index)}>
                  <div className={`project-visual visual-${(index % 3) + 1}`}>
                    <div className="project-orbit" />
                    <Icon size={project.featured ? 56 : 43} strokeWidth={1.1} className="relative z-10 text-[var(--gold)] drop-shadow-[0_0_18px_rgba(245,215,122,.2)]" />
                    <span className="absolute right-5 top-5 font-mono text-[10px] text-white/25">0{index + 1} — CASE</span>
                  </div>
                  <div className="flex flex-1 flex-col p-6 sm:p-7">
                    {project.badge && <span className="premium-badge mb-4 w-fit">{project.badge}</span>}
                    <h3 className="text-xl font-semibold">{project.title}</h3>
                    <p className="mt-3 leading-6 text-[var(--muted)]">{project.description}</p>
                    <div className="mt-5 flex flex-wrap gap-2">{project.tech.slice(0, 4).map((tech) => <span key={tech} className="project-chip">{tech}</span>)}</div>
                    <div className="mt-auto flex gap-4 pt-7 text-xs font-semibold">
                      {project.github && <a onClick={(event) => event.stopPropagation()} href={project.github} target="_blank" rel="noreferrer" className="project-link">GitHub <span>↗</span></a>}
                      {project.live && <a onClick={(event) => event.stopPropagation()} href={project.live} target="_blank" rel="noreferrer" className="project-link">Live <span>↗</span></a>}
                      {!project.github && !project.live && <span className="text-white/25">View case study →</span>}
                    </div>
                  </div>
                </GlassCard>
              </motion.article>
            )
          })}
          </AnimatePresence>
        </motion.div>
        <GlassCard className="mt-4 p-6 sm:p-8">
          <div className="flex flex-col justify-between gap-7 lg:flex-row lg:items-center">
            <div><p className="eyebrow mb-4">More projects</p><div className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-[var(--muted)]"><span>Athlete Recovery Assistant</span><span>Secure Stream</span><span>Kubernetes Self-Healing App</span><span>Crypto Price Tracker</span></div></div>
            <MagneticButton href="https://github.com/Tanvi-1496" variant="outline" external className="shrink-0">See all on GitHub ↗</MagneticButton>
          </div>
        </GlassCard>
        <motion.div className="terminal-card mt-16" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="terminal-bar"><i /><i /><i /><span>tanvi@smartops: ~/now</span></div>
          <div className="grid gap-6 p-6 sm:p-8 md:grid-cols-2">
            <p><span className="terminal-prompt">$ building</span><br /><strong>SmartOps</strong> — an AI-powered DevOps platform and capstone project.<span className="terminal-caret" /></p>
            <p><span className="terminal-prompt">$ learning</span><br /><strong>AIOps</strong> · Kubernetes · GenAI</p>
          </div>
        </motion.div>
      </div>
      <CaseStudyModal project={selected === null ? null : projects[selected]} onClose={close} onPrevious={previous} onNext={next} />
    </section>
  )
}
