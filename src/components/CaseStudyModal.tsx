import { AnimatePresence, motion } from 'motion/react'
import { ArrowLeft, ArrowRight, X } from 'lucide-react'
import { useEffect } from 'react'
import type { Project } from '../data/portfolio'

export function CaseStudyModal({ project, onClose, onPrevious, onNext }: { project: Project | null; onClose: () => void; onPrevious: () => void; onNext: () => void }) {
  useEffect(() => {
    if (!project) return
    const keyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowLeft') onPrevious()
      if (event.key === 'ArrowRight') onNext()
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', keyDown)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', keyDown)
    }
  }, [project, onClose, onPrevious, onNext])

  return (
    <AnimatePresence>
      {project && (
        <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={onClose}>
          <motion.div role="dialog" aria-modal="true" aria-labelledby="case-title" className="case-modal" initial={{ opacity: 0, scale: .94, y: 25 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: .96, y: 18 }} transition={{ type: 'spring', stiffness: 260, damping: 25 }} onMouseDown={(event) => event.stopPropagation()}>
            <button onClick={onClose} className="modal-close" aria-label="Close case study"><X size={19} /></button>
            <p className="eyebrow">Project case study</p>
            <h2 id="case-title">{project.title}</h2>
            <div className="mt-4 flex flex-wrap gap-2">{project.tech.map((tech) => <span className="project-chip" key={tech}>{tech}</span>)}</div>
            <div className="case-grid">
              <div><span>01</span><h3>Problem</h3><p>{project.problem}</p></div>
              <div><span>02</span><h3>Solution</h3><p>{project.solution}</p></div>
              <div><span>03</span><h3>Tech used</h3><p>{project.tech.join(' · ')}</p></div>
              <div><span>04</span><h3>Result</h3><p>{project.result}</p></div>
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
              <div className="flex gap-2">
                <button onClick={onPrevious} className="modal-nav" aria-label="Previous project"><ArrowLeft size={17} /></button>
                <button onClick={onNext} className="modal-nav" aria-label="Next project"><ArrowRight size={17} /></button>
              </div>
              <div className="flex gap-3">
                {project.github && <a className="button-outline magnetic-button" href={project.github} target="_blank" rel="noreferrer">GitHub ↗</a>}
                {project.live && <a className="button-gold magnetic-button" href={project.live} target="_blank" rel="noreferrer">Live Demo ↗</a>}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
