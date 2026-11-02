import { AnimatePresence, motion } from 'motion/react'
import { ArrowUpRight, Check, Copy, GitBranch, Link2, Mail, Send, Terminal } from 'lucide-react'
import { FormEvent, useState } from 'react'
import { EMAIL } from '../data/portfolio'
import { postContact } from '../lib/api'
import { GlassCard, SectionHeading } from './ui'

const details = [
  { icon: Link2, label: 'LinkedIn', value: '/in/tanvijaware', href: 'https://linkedin.com/in/tanvijaware' },
  { icon: GitBranch, label: 'GitHub', value: '/Tanvi-1496', href: 'https://github.com/Tanvi-1496' },
  { icon: Terminal, label: 'LeetCode', value: '/Tanvi_1496', href: 'https://leetcode.com/u/Tanvi_1496' },
]

export function Contact() {
  const [sent, setSent] = useState(false)
  const [errorToast, setErrorToast] = useState(false)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (loading) return

    const form = e.currentTarget
    const formData = new FormData(form)
    const name = String(formData.get('name') || '').trim()
    const email = String(formData.get('email') || '').trim()
    const message = String(formData.get('message') || '').trim()
    const website = String(formData.get('website') || '').trim()

    setLoading(true)
    setErrorToast(false)

    try {
      const res = await postContact({ name, email, message, website })
      // If API_URL is unset (res === null) or delivery succeeded (res.ok)
      if (res === null || res.ok) {
        form.reset()
        setSent(true)
        window.setTimeout(() => setSent(false), 3500)
      } else {
        setErrorToast(true)
        window.setTimeout(() => setErrorToast(false), 6000)
      }
    } catch {
      setErrorToast(true)
      window.setTimeout(() => setErrorToast(false), 6000)
    } finally {
      setLoading(false)
    }
  }

  const copyEmail = async () => {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(EMAIL)
    } else {
      const input = document.createElement('textarea')
      input.value = EMAIL
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      input.remove()
    }
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2500)
  }

  return (
    <section id="contact" className="section-padding pb-24">
      <div className="section-shell">
        <SectionHeading eyebrow="04 / Contact" title="Let’s work" accent="together." description="Open to internships and DevOps / Cloud opportunities. If you’re building something ambitious, I’d love to hear about it." />
        <div className="grid gap-4 lg:grid-cols-[.85fr_1.15fr]">
          <GlassCard className="p-7 sm:p-8">
            <p className="eyebrow mb-8">Find me here</p>
            <div className="space-y-3">
              <div className="contact-row group">
                <span className="contact-icon"><Mail size={17} /></span>
                <a href={`mailto:${EMAIL}`} className="min-w-0 flex-1"><small>Email</small><strong className="truncate">{EMAIL}</strong></a>
                <button onClick={copyEmail} aria-label="Copy email address" className="copy-button">{copied ? <Check size={16} /> : <Copy size={16} />}</button>
              </div>
              {details.map(({ icon: Icon, label, value, href }) => (
                <a key={label} href={href} target="_blank" rel="noreferrer" className="contact-row group">
                  <span className="contact-icon"><Icon size={17} /></span>
                  <span><small>{label}</small><strong>{value}</strong></span>
                  <ArrowUpRight size={16} className="ml-auto text-white/30 transition group-hover:text-[var(--accent-soft)]" />
                </a>
              ))}
            </div>
            <div className="mt-8 border-t border-white/[0.07] pt-6">
              <p className="text-xs text-white/35">Portfolio</p>
              <p className="mt-2 font-mono text-sm text-white/65">You&apos;re already here. /tanvi</p>
            </div>
          </GlassCard>
          <GlassCard className="p-7 sm:p-8">
            <form onSubmit={submit}>
              {/* Hidden honeypot field */}
              <div className="hidden" aria-hidden="true" style={{ display: 'none' }}>
                <label htmlFor="website">Website</label>
                <input id="website" name="website" tabIndex={-1} autoComplete="off" />
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="field-label">Your name<input name="name" required minLength={2} maxLength={80} placeholder="Jane Smith" /></label>
                <label className="field-label">Email address<input name="email" type="email" required placeholder="jane@company.com" /></label>
              </div>
              <label className="field-label mt-5">Message<textarea name="message" required minLength={10} maxLength={2000} rows={6} placeholder="Tell me about the opportunity or idea..." /></label>
              <button type="submit" disabled={loading} className="button-gold magnetic-button mt-6 w-full justify-center sm:w-auto">
                {loading ? 'Sending...' : 'Send message'} <Send size={15} />
              </button>
            </form>
          </GlassCard>
        </div>
      </div>
      <AnimatePresence>
        {sent && (
          <motion.div key="sent-toast" role="status" initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 15 }} className="toast">
            Message noted — thanks for reaching out.
          </motion.div>
        )}
        {errorToast && (
          <motion.div key="error-toast" role="alert" initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 15 }} className="toast">
            Could not send, please <a href={`mailto:${EMAIL}`} className="underline text-[var(--gold)] ml-1">email me directly</a>.
          </motion.div>
        )}
        {copied && <motion.div key="copied-toast" role="status" initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="toast">Copied!</motion.div>}
      </AnimatePresence>
    </section>
  )
}
