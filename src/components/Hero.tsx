import { AnimatePresence, motion } from 'motion/react'
import { ArrowDown, Download, GitBranch, Link2, Terminal } from 'lucide-react'
import { useEffect, useState } from 'react'
import { MagneticButton } from './ui'

const roles = ['DevOps Engineer', 'Cloud Enthusiast', 'AIOps Builder']

function Social({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" aria-label={label} className="social-link">
      {children}
    </a>
  )
}

export function Hero() {
  const [role, setRole] = useState(0)
  const [imageFailed, setImageFailed] = useState(false)

  useEffect(() => {
    const timer = window.setInterval(() => setRole((current) => (current + 1) % roles.length), 2600)
    return () => window.clearInterval(timer)
  }, [])

  return (
    <section id="home" className="relative flex min-h-screen items-center px-5 pb-20 pt-32 sm:px-8 lg:px-12">
      <div className="section-shell grid items-center gap-16 lg:grid-cols-[1.08fr_.92fr]">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card)]/70 px-4 py-2 text-xs uppercase tracking-[0.22em] text-[var(--text)]">
            <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" /><span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" /></span>
            <span className="gold-text">Open to Internships</span>
          </div>
          <div className="hero-title-wrap"><span className="hero-sparkles" aria-hidden>✦ · ✧ · ✦</span><h1 className="text-[clamp(4.7rem,12vw,9rem)] font-bold leading-[0.75] tracking-[-0.07em]">Tanvi</h1></div>
          <div className="mt-8 flex min-h-14 items-center text-2xl font-semibold tracking-tight sm:text-4xl">
            <span className="mr-3 text-white/45">Aspiring</span>
            <AnimatePresence mode="wait">
              <motion.span
                key={roles[role]}
                initial={{ opacity: 0, y: 14, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -12, filter: 'blur(8px)' }}
                className="font-display italic gold-text"
              >
                {roles[role]}
              </motion.span>
            </AnimatePresence>
          </div>
          <p className="mt-6 max-w-xl text-base leading-8 text-[var(--muted)] sm:text-lg">
            B.Tech IT student who loves <span className="gold-text">building, automating and scaling</span> systems. Working towards <span className="gold-text">AIOps</span> — combining DevOps, ML and GenAI.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <MagneticButton href="#projects">View Projects <span>↗</span></MagneticButton>
            <MagneticButton href="#contact" variant="outline">Contact Me</MagneticButton>
            <MagneticButton href="/Tanvi_Resume.pdf" variant="outline" external>Download Resume <Download size={15} /></MagneticButton>
          </div>
          <div className="mt-8 flex items-center gap-3">
            <Social href="https://github.com/Tanvi-1496" label="GitHub"><GitBranch size={17} /></Social>
            <Social href="https://linkedin.com/in/tanvijaware" label="LinkedIn"><Link2 size={17} /></Social>
            <Social href="https://leetcode.com/u/Tanvi_1496" label="LeetCode"><Terminal size={17} /></Social>
            <span className="ml-2 text-xs uppercase tracking-[0.18em] text-white/35">Find me online</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25, duration: 0.9 }}
          className="relative mx-auto w-full max-w-[430px]"
        >
          <div className="profile-aura" />
          <span className="profile-sparkles" aria-hidden>✦ ✧ ✦ ✧</span>
          <div className="profile-border">
            <div className="relative h-full w-full overflow-hidden rounded-[9.5rem_9.5rem_2.6rem_2.6rem] bg-[var(--section)]">
              {!imageFailed ? (
                <img src="/profile.jpg" alt="Portrait of Tanvi" className="h-full w-full object-cover" onError={() => setImageFailed(true)} />
              ) : (
                <div className="flex h-full flex-col items-center justify-center bg-[var(--section)] text-center">
                  <div className="mb-5 flex h-28 w-28 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--accent)]/10 font-display text-5xl italic text-[var(--accent-soft)]">T</div>
                  <p className="text-sm font-medium text-white/65">Profile photo</p>
                  <p className="mt-2 font-mono text-[11px] text-white/30">/public/profile.jpg</p>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-white/5" />
            </div>
          </div>
          {['DevOps', 'Cloud', 'AI / ML'].map((badge, index) => (
            <motion.div
              key={badge}
              className={`floating-badge badge-${index + 1}`}
              animate={{ y: [0, -9, 0] }}
              transition={{ duration: 3.5 + index * 0.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#F5D77A] shadow-[0_0_10px_#D4AF37]" />{badge}
            </motion.div>
          ))}
        </motion.div>
      </div>
      <motion.a href="#about" aria-label="Scroll to about" className="absolute bottom-7 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-white/30 md:flex" animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
        Scroll <ArrowDown size={14} className="text-[var(--gold)]" />
      </motion.a>
    </section>
  )
}
