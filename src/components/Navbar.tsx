import { motion, useScroll, useSpring } from 'motion/react'
import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'

const links = ['about', 'journey', 'skills', 'projects', 'github']
const observed = [...links, 'terminal', 'pipeline', 'contact']

export function Navbar() {
  const [active, setActive] = useState('about')
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 25 })

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && setActive(entry.target.id)),
      { rootMargin: '-35% 0px -55%' },
    )
    observed.forEach((id) => {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    })
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <motion.div className="fixed inset-x-0 top-0 z-[70] h-[2px] origin-left bg-gradient-to-r from-[var(--accent)] to-[var(--accent-soft)]" style={{ scaleX }} />
      <nav aria-label="Primary navigation" className="fixed left-1/2 top-5 z-50 flex w-[calc(100%-24px)] max-w-3xl -translate-x-1/2 items-center justify-between rounded-full border border-[var(--border)] bg-[var(--section)]/80 px-2 py-2 shadow-2xl shadow-black/30 backdrop-blur-xl">
        <a href="#home" className="ml-3 font-display text-xl italic text-[var(--gold)]" aria-label="Tanvi, home">T.</a>
        <div className="hidden items-center sm:flex">
          {links.map((link) => (
            <a
              key={link}
              href={`#${link}`}
              className={`nav-link rounded-full px-3 py-2 text-[11px] font-medium capitalize transition lg:px-4 lg:text-xs ${
                active === link ? 'active text-white' : 'text-[var(--muted)] hover:text-white'
              }`}
            >
              {link}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-1.5">
          <button className="command-hint hidden sm:flex" onClick={() => window.dispatchEvent(new Event('open-command-menu'))}><Search size={13} /> <span>Ctrl K</span></button>
          <button className="command-hint flex sm:hidden" aria-label="Open command menu" onClick={() => window.dispatchEvent(new Event('open-command-menu'))}><Search size={15} /></button>
          <a href="#contact" className="nav-hire">Hire Me</a>
        </div>
      </nav>
    </>
  )
}
