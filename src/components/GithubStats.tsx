import { motion, useInView, useReducedMotion } from 'motion/react'
import { ArrowUpRight, GitBranch, GitFork, Star } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { getStats } from '../lib/api'
import { GlassCard, SectionHeading } from './ui'

type Repo = { name: string; html_url: string; description: string | null; language: string | null; stargazers_count: number; updated_at: string; fork?: boolean }
type GitData = { repos: number; followers: number; stars: number; recent: Repo[]; languages: Array<[string, number]> }
type LeetCodeData = { total: number; easy: number; medium: number; hard: number }
type Contribution = { date: string; count: number; level: number }

const fallbackRepos: Repo[] = [
  { name: 'support-copilot-ai-agent-rag', html_url: 'https://github.com/Tanvi-1496', description: 'RAG and agentic AI support copilot.', language: 'Python', stargazers_count: 0, updated_at: '', fork: false },
  { name: 'SkillSwap-Learn.-Mentor.-Grow.', html_url: 'https://github.com/Tanvi-1496', description: 'AI-powered student and mentor matching.', language: 'TypeScript', stargazers_count: 0, updated_at: '', fork: false },
  { name: 'DMart-Retail-Analytics', html_url: 'https://github.com/Tanvi-1496', description: 'Retail OLAP and predictive analytics.', language: 'Python', stargazers_count: 0, updated_at: '', fork: false },
]
const fallbackGit: GitData = { repos: 12, followers: 5, stars: 0, recent: fallbackRepos, languages: [['Python', 4], ['TypeScript', 3], ['JavaScript', 2], ['Other', 1]] }
const fallbackLeet: LeetCodeData = { total: 100, easy: 55, medium: 40, hard: 5 }

function Count({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const reduceMotion = useReducedMotion()
  const [shown, setShown] = useState(0)
  useEffect(() => {
    if (!inView) return
    if (reduceMotion) { setShown(value); return }
    const start = performance.now()
    let frame = 0
    const tick = (now: number) => {
      const progress = Math.min((now - start) / 900, 1)
      setShown(Math.round(value * (1 - Math.pow(1 - progress, 3))))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [inView, reduceMotion, value])
  return <span ref={ref}>{shown}</span>
}

export function GithubStats() {
  const [git, setGit] = useState<GitData | null>(null)
  const [leetcode, setLeetcode] = useState<LeetCodeData | null>(null)
  const [contributions, setContributions] = useState<Contribution[]>([])
  const [fallback, setFallback] = useState(false)

  useEffect(() => {
    const load = async () => {
      // 1. Try backend aggregated /api/stats first
      try {
        const stats = await getStats()
        if (stats && stats.github && stats.leetcode) {
          setGit(stats.github as GitData)
          setLeetcode(stats.leetcode)
          setContributions(stats.contributions || [])
          if (stats.stale) setFallback(true)
          return
        }
      } catch {
        // Fall back to direct browser APIs below
      }

      // 2. Direct browser API calls fallback
      const github = Promise.all([
        fetch('https://api.github.com/users/Tanvi-1496').then((response) => { if (!response.ok) throw new Error('GitHub user'); return response.json() }),
        fetch('https://api.github.com/users/Tanvi-1496/repos?per_page=100&sort=updated').then((response) => { if (!response.ok) throw new Error('GitHub repos'); return response.json() }),
      ]).then(([user, repos]: [{ public_repos: number; followers: number }, Repo[]]) => {
        const original = repos.filter((repo) => !repo.fork)
        const languageMap = original.reduce<Record<string, number>>((acc, repo) => {
          const language = repo.language || 'Other'
          acc[language] = (acc[language] || 0) + 1
          return acc
        }, {})
        setGit({
          repos: user.public_repos,
          followers: user.followers,
          stars: original.reduce((sum, repo) => sum + repo.stargazers_count, 0),
          recent: [...original].sort((a, b) => Date.parse(b.updated_at) - Date.parse(a.updated_at)).slice(0, 3),
          languages: Object.entries(languageMap).sort((a, b) => b[1] - a[1]).slice(0, 5),
        })
      }).catch(() => { setGit(fallbackGit); setFallback(true) })

      const contributionRequest = fetch('https://github-contributions-api.jogruber.de/v4/Tanvi-1496?y=last')
        .then((response) => { if (!response.ok) throw new Error('Contributions'); return response.json() })
        .then((data: { contributions: Contribution[] }) => setContributions(data.contributions || []))
        .catch(() => { setContributions([]); setFallback(true) })

      const leetcodeRequest = fetch('https://leetcode-stats-api.herokuapp.com/Tanvi_1496')
        .then((response) => { if (!response.ok) throw new Error('LeetCode'); return response.json() })
        .then((data: { totalSolved: number; easySolved: number; mediumSolved: number; hardSolved: number }) => setLeetcode({ total: data.totalSolved, easy: data.easySolved, medium: data.mediumSolved, hard: data.hardSolved }))
        .catch(() => { setLeetcode(fallbackLeet); setFallback(true) })
      await Promise.allSettled([github, contributionRequest, leetcodeRequest])
    }
    void load()
  }, [])

  const weeks = useMemo(() => {
    const cells = contributions.slice(-364)
    return Array.from({ length: Math.ceil(cells.length / 7) }, (_, index) => cells.slice(index * 7, index * 7 + 7))
  }, [contributions])
  const totalLanguages = git?.languages.reduce((sum, [, count]) => sum + count, 0) || 1

  return (
    <section id="github" className="section-padding alternate-section">
      <div className="section-shell">
        <SectionHeading eyebrow="06 / Live signal" title="Live from" accent="GitHub" description="A live snapshot of recent code, consistency and problem-solving practice." />
        {!git || !leetcode ? <div className="stats-skeleton"><i /><i /><i /></div> : (
          <>
            <div className="grid gap-4 lg:grid-cols-[1.35fr_.65fr]">
              <GlassCard className="p-6 sm:p-8">
                <div className="flex items-center justify-between"><div className="flex items-center gap-3"><GitBranch className="text-[var(--gold)]" /><strong>Tanvi-1496</strong></div><a className="project-link text-xs" href="https://github.com/Tanvi-1496" target="_blank" rel="noreferrer">View on GitHub <ArrowUpRight size={14} /></a></div>
                <div className="github-number-grid">
                  <div><span className="stat-value"><Count value={git.repos} /></span><small>Public repos</small></div>
                  <div><span className="stat-value"><Count value={git.followers} /></span><small>Followers</small></div>
                  <div><span className="stat-value"><Count value={git.stars} /></span><small>Total stars</small></div>
                </div>
                <div className="language-bar">{git.languages.map(([language, count], index) => <i key={language} title={`${language}: ${count}`} className={`language-${index + 1}`} style={{ width: `${(count / totalLanguages) * 100}%` }} />)}</div>
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">{git.languages.map(([language]) => <span key={language} className="language-label">{language}</span>)}</div>
              </GlassCard>
              <GlassCard className="p-6 sm:p-8">
                <p className="eyebrow">LeetCode · Tanvi_1496</p>
                <p className="mt-5 stat-value"><Count value={leetcode.total} /></p>
                <p className="mt-2 text-sm text-[var(--muted)]">Problems solved</p>
                <div className="leetcode-grid"><span><b>{leetcode.easy}</b> Easy</span><span><b>{leetcode.medium}</b> Medium</span><span><b>{leetcode.hard}</b> Hard</span></div>
              </GlassCard>
            </div>
            <GlassCard className="mt-4 p-6 sm:p-8">
              <div className="mb-5 flex items-center justify-between"><div><p className="eyebrow">Last year</p><h3 className="mt-2 text-lg font-semibold">Contribution rhythm</h3></div>{fallback && <span className="fallback-note">Sample data shown where live APIs were unavailable</span>}</div>
              {weeks.length ? <div className="heatmap" aria-label="GitHub contribution heatmap">{weeks.map((week, weekIndex) => <div key={weekIndex}>{week.map((day) => <i key={day.date} className={`level-${day.level}`} title={`${day.date}: ${day.count} contributions`} />)}</div>)}</div> : <div className="heatmap-placeholder">Contribution data is temporarily unavailable. <a href="https://github.com/Tanvi-1496" target="_blank" rel="noreferrer">View on GitHub →</a></div>}
            </GlassCard>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {git.recent.map((repo) => <motion.a whileHover={{ y: -5 }} key={repo.name} href={repo.html_url} target="_blank" rel="noreferrer" className="repo-card"><div><GitFork size={16} /><ArrowUpRight size={15} /></div><strong>{repo.name}</strong><p>{repo.description || 'Explore this repository on GitHub.'}</p><span>{repo.language || 'Code'} · <Star size={12} /> {repo.stargazers_count}</span></motion.a>)}
            </div>
          </>
        )}
      </div>
    </section>
  )
}
