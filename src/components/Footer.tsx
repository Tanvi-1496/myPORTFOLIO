import { ArrowUp, GitBranch, Link2 } from 'lucide-react'
import { EMAIL } from '../data/portfolio'

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/[0.06] px-5 py-7">
      <div className="section-shell flex flex-col items-center justify-between gap-5 text-xs text-white/40 sm:flex-row">
        <p>© 2026 Tanvi. Crafted with AI and code. · <a className="hover:text-[var(--text)]" href={`mailto:${EMAIL}`}>{EMAIL}</a></p>
        <div className="flex items-center gap-3">
          <a className="footer-link" href="https://github.com/Tanvi-1496" target="_blank" rel="noreferrer" aria-label="GitHub"><GitBranch size={15} /></a>
          <a className="footer-link" href="https://linkedin.com/in/tanvijaware" target="_blank" rel="noreferrer" aria-label="LinkedIn"><Link2 size={15} /></a>
          <a href="#home" className="ml-4 inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-4 py-2 text-[var(--accent-soft)] transition hover:bg-[var(--accent)]/10">Back to top <ArrowUp size={13} /></a>
        </div>
      </div>
    </footer>
  )
}
