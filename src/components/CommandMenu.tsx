import { AnimatePresence, motion } from 'motion/react'
import { ArrowUpRight, Command, Search, X } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { commandItems } from '../data/portfolio'

export function CommandMenu() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const filtered = useMemo(() => {
    const needle = query.toLowerCase().replace(/\s/g, '')
    if (!needle) return commandItems
    return commandItems.filter((item) => `${item.label}${item.keywords}`.toLowerCase().replace(/\s/g, '').includes(needle))
  }, [query])

  const run = (item: (typeof commandItems)[number]) => {
    setOpen(false)
    setQuery('')
    if (item.external) window.open(item.href, '_blank', 'noopener,noreferrer')
    else window.location.href = item.href
  }

  useEffect(() => {
    const toggle = () => setOpen((value) => !value)
    const keyboard = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        toggle()
      }
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', keyboard)
    window.addEventListener('open-command-menu', toggle)
    return () => {
      window.removeEventListener('keydown', keyboard)
      window.removeEventListener('open-command-menu', toggle)
    }
  }, [])

  useEffect(() => {
    if (open) window.setTimeout(() => inputRef.current?.focus(), 50)
    setActive(0)
  }, [open, query])

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="command-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={() => setOpen(false)}>
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Command menu"
            className="command-menu"
            initial={{ opacity: 0, y: -20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="command-search">
              <Search size={18} />
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'ArrowDown') { event.preventDefault(); setActive((value) => Math.min(value + 1, filtered.length - 1)) }
                  if (event.key === 'ArrowUp') { event.preventDefault(); setActive((value) => Math.max(value - 1, 0)) }
                  if (event.key === 'Enter' && filtered[active]) run(filtered[active])
                }}
                placeholder="Where would you like to go?"
                aria-label="Search commands"
              />
              <button onClick={() => setOpen(false)} aria-label="Close command menu"><X size={17} /></button>
            </div>
            <div className="command-list">
              {filtered.length ? filtered.map((item, index) => (
                <button key={item.label} className={`command-item ${index === active ? 'active' : ''}`} onMouseEnter={() => setActive(index)} onClick={() => run(item)}>
                  <span><Command size={15} />{item.label}</span><ArrowUpRight size={14} />
                </button>
              )) : <p className="p-8 text-center text-sm text-[var(--muted)]">No matching command.</p>}
            </div>
            <div className="command-footer"><span>↑↓ navigate</span><span>↵ select</span><span>esc close</span></div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
