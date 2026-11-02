import { motion, useInView, useReducedMotion } from 'motion/react'
import { FormEvent, KeyboardEvent, useCallback, useEffect, useRef, useState } from 'react'
import { EMAIL, projects, skillGroups } from '../data/portfolio'
import { SectionHeading } from './ui'

type Line = { command: string; output: string }

const outputs: Record<string, string> = {
  help: 'Available commands: about · skills · projects · experience · education · contact · resume · clear',
  about: 'B.Tech IT (Lateral Entry) student at Vidyalankar Institute of Technology, Mumbai · CGPA 9.83 · focused on DevOps, cloud engineering and AIOps.',
  skills: Object.entries(skillGroups).map(([group, skills]) => `${group}: ${skills.join(', ')}`).join('\n'),
  projects: projects.map((project, index) => `${index + 1}. ${project.title} — ${project.description}`).join('\n'),
  experience: 'Building hands-on experience through 8+ production-minded projects spanning DevOps, cloud, observability, AI/ML and full-stack engineering.',
  education: 'B.Tech in Information Technology (Lateral Entry) · Vidyalankar Institute of Technology, Mumbai · CGPA: 9.83.',
  contact: `${EMAIL}\nGitHub: github.com/Tanvi-1496\nLinkedIn: linkedin.com/in/tanvijaware\nLeetCode: leetcode.com/u/Tanvi_1496`,
  resume: 'Opening Tanvi_Resume.pdf in a new tab...',
}

export function Terminal() {
  const sectionRef = useRef<HTMLElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const inView = useInView(sectionRef, { once: true, margin: '-25%' })
  const reduceMotion = useReducedMotion()
  const [lines, setLines] = useState<Line[]>([])
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [typing, setTyping] = useState(false)

  const runCommand = useCallback((rawCommand: string) => {
    const command = rawCommand.trim().toLowerCase()
    if (!command || typing) return
    if (command === 'clear') {
      setLines([])
      setHistory((current) => [...current, command])
      return
    }
    const fullOutput = outputs[command] ?? 'command not found, type help'
    if (reduceMotion) {
      setLines((current) => [...current, { command, output: fullOutput }])
      setHistory((current) => [...current, command])
      if (command === 'resume') window.open('/Tanvi_Resume.pdf', '_blank', 'noopener,noreferrer')
      return
    }
    setLines((current) => [...current, { command, output: '' }])
    setHistory((current) => [...current, command])
    setHistoryIndex(-1)
    setTyping(true)
    let index = 0
    const timer = window.setInterval(() => {
      index += 2
      setLines((current) => current.map((line, lineIndex) => lineIndex === current.length - 1 ? { ...line, output: fullOutput.slice(0, index) } : line))
      if (index >= fullOutput.length) {
        window.clearInterval(timer)
        setTyping(false)
        if (command === 'resume') window.open('/Tanvi_Resume.pdf', '_blank', 'noopener,noreferrer')
      }
    }, 8)
  }, [reduceMotion, typing])

  useEffect(() => {
    if (inView && lines.length === 0) runCommand('help')
  }, [inView, lines.length, runCommand])

  const submit = (event: FormEvent) => {
    event.preventDefault()
    runCommand(input)
    setInput('')
  }
  const keyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'ArrowUp' || !history.length) return
    event.preventDefault()
    const next = historyIndex < history.length - 1 ? historyIndex + 1 : historyIndex
    setHistoryIndex(next)
    setInput(history[history.length - 1 - next])
  }

  return (
    <section id="terminal" ref={sectionRef} className="section-padding">
      <div className="section-shell">
        <SectionHeading eyebrow="02 / Interactive" title="Talk to my" accent="terminal." description="A keyboard-first shortcut to the details that matter." />
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="interactive-terminal" onClick={() => inputRef.current?.focus()}>
          <div className="terminal-bar"><i /><i /><i /><span>tanvi — portfolio — zsh</span></div>
          <div className="terminal-output" aria-live="polite">
            {lines.map((line, index) => (
              <div key={`${line.command}-${index}`} className="terminal-line">
                <p><span className="gold-prompt">tanvi@portfolio:~$</span> {line.command}</p>
                <pre>{line.output}</pre>
              </div>
            ))}
            <form onSubmit={submit} className="terminal-input-row">
              <label htmlFor="terminal-command" className="gold-prompt">tanvi@portfolio:~$</label>
              <input ref={inputRef} id="terminal-command" value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={keyDown} disabled={typing} autoComplete="off" spellCheck={false} aria-label="Terminal command" />
              <span className="terminal-caret" />
            </form>
          </div>
        </motion.div>
        <div className="mt-4 flex flex-wrap gap-2">
          {['help', 'skills', 'projects', 'contact'].map((command) => <button key={command} onClick={() => runCommand(command)} className="suggestion-chip">{command}</button>)}
        </div>
      </div>
    </section>
  )
}
