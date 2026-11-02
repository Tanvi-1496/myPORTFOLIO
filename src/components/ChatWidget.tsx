import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ArrowUp, RotateCcw, Sparkles, X } from 'lucide-react'
import { FormEvent, useEffect, useRef, useState } from 'react'
import { EMAIL, quickQuestions } from '../data/portfolio'
import { postChat } from '../lib/api'

type Message = { from: 'bot' | 'user'; text: string; link?: boolean }

export async function getAnswer(question: string, history: Message[] = []): Promise<Message> {
  // 1. First try backend AI assistant if available
  try {
    const formattedHistory = history.slice(-6).map((item) => ({
      role: item.from === 'bot' ? 'assistant' : 'user',
      content: item.text,
    }))
    const response = await postChat(question, formattedHistory)
    if (response) {
      return {
        from: 'bot',
        text: response.answer,
        link: response.showContactLink,
      }
    }
  } catch {
    // Silently fall through to client-side heuristics
  }

  // 2. Safe fallback: client-side keyword matching
  const text = question.toLowerCase()
  await new Promise((resolve) => window.setTimeout(resolve, 550))
  if (/skill|technology|stack|devops/.test(text)) return { from: 'bot', text: 'Tanvi’s strongest areas are DevOps, cloud, observability, React/FastAPI, Python, AI/ML, RAG and agentic systems.' }
  if (/project|built|work/.test(text)) return { from: 'bot', text: 'Her featured work includes Blinkit Support Copilot, ObserveX, Vaani Kavach, SkillSwap, AgriFlow AI and DMart Retail Analytics.' }
  if (/intern|open|hire/.test(text)) return { from: 'bot', text: 'Yes — Tanvi is open to DevOps, Cloud, AIOps and software engineering internships.' }
  if (/contact|email|reach|linkedin/.test(text)) return { from: 'bot', text: `Email Tanvi at ${EMAIL}, or connect through GitHub and LinkedIn in the Contact section.`, link: true }
  if (/education|college|cgpa/.test(text)) return { from: 'bot', text: 'Tanvi is a B.Tech IT lateral-entry student at Vidyalankar Institute of Technology, Mumbai, with a 9.83 CGPA.' }
  if (/experience|elevate|observability/.test(text)) return { from: 'bot', text: 'At Elevate Labs (MSME), she completed a 2-week DevOps internship and built an observability stack with Prometheus, Grafana, Loki, Jaeger and Docker Compose.' }
  return { from: 'bot', text: 'I may not know that yet, but Tanvi would be happy to answer it herself. Head to the Contact section and say hello.', link: true }
}

export function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([{ from: 'bot', text: 'Hi, I’m Tanvi’s portfolio assistant. What would you like to know?' }])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()

  useEffect(() => endRef.current?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' }), [messages, typing, reduceMotion])

  const ask = async (question: string) => {
    if (!question.trim() || typing) return
    const userText = question.trim()
    const historySnapshot = [...messages]
    setMessages((current) => [...current, { from: 'user', text: userText }])
    setInput('')
    setTyping(true)
    const answer = await getAnswer(userText, historySnapshot)
    setMessages((current) => [...current, answer])
    setTyping(false)
  }

  const submit = (event: FormEvent) => { event.preventDefault(); void ask(input) }
  const clear = () => setMessages([{ from: 'bot', text: 'Chat cleared. What would you like to know?' }])

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.aside className="chat-panel" aria-label="Ask Tanvi AI chat" initial={{ opacity: 0, y: 24, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.97 }}>
            <header className="chat-header">
              <div><span className="online-dot" /><strong>Ask Tanvi AI</strong><small>Portfolio assistant</small></div>
              <div><button onClick={clear} aria-label="Clear chat"><RotateCcw size={16} /></button><button onClick={() => setOpen(false)} aria-label="Close chat"><X size={17} /></button></div>
            </header>
            <div className="chat-history">
              <div className="quick-questions">{quickQuestions.map((question) => <button key={question} onClick={() => void ask(question)}>{question}</button>)}</div>
              {messages.map((message, index) => (
                <div key={index} className={`chat-message ${message.from}`}>
                  {message.text}
                  {message.link && <a href="#contact" onClick={() => setOpen(false)}>Contact Tanvi →</a>}
                </div>
              ))}
              {typing && <div className="chat-message bot typing-dots"><i /><i /><i /></div>}
              <div ref={endRef} />
            </div>
            <form className="chat-input" onSubmit={submit}>
              <input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask about Tanvi..." aria-label="Chat message" />
              <button disabled={!input.trim() || typing} aria-label="Send message"><ArrowUp size={17} /></button>
            </form>
          </motion.aside>
        )}
      </AnimatePresence>
      <button className="chat-launcher" onClick={() => setOpen((value) => !value)} aria-label={open ? 'Close Ask Tanvi AI' : 'Open Ask Tanvi AI'}>
        {open ? <X size={22} /> : <Sparkles size={23} />}
      </button>
    </>
  )
}
