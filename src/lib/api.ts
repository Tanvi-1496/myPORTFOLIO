export const API_URL = import.meta.env.VITE_API_URL
  ? String(import.meta.env.VITE_API_URL).replace(/\/+$/, '')
  : ''

export interface ContactPayload {
  name: string
  email: string
  message: string
  website?: string
}

export interface ContactResponse {
  ok: boolean
}

export interface ChatHistoryTurn {
  role: string
  content: string
}

export interface ChatResponse {
  answer: string
  showContactLink: boolean
}

export interface RepoData {
  name: string
  html_url: string
  description: string | null
  language: string | null
  stargazers_count: number
  updated_at: string
}

export interface GitStatsData {
  repos: number
  followers: number
  stars: number
  recent: RepoData[]
  languages: Array<[string, number]>
}

export interface ContributionData {
  date: string
  count: number
  level: number
}

export interface LeetCodeStatsData {
  total: number
  easy: number
  medium: number
  hard: number
}

export interface StatsResponse {
  github: GitStatsData
  contributions: ContributionData[]
  leetcode: LeetCodeStatsData
  stale?: boolean
}

async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeoutMs = 8000
): Promise<Response> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    return await fetch(url, { ...options, signal: controller.signal })
  } finally {
    clearTimeout(timer)
  }
}

/**
 * Submit contact form to /api/contact.
 * Returns null if VITE_API_URL is unset, allowing default client handling.
 */
export async function postContact(payload: ContactPayload): Promise<ContactResponse | null> {
  if (!API_URL) return null

  try {
    const res = await fetchWithTimeout(`${API_URL}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      return { ok: false }
    }

    const data = (await res.json()) as ContactResponse
    return data
  } catch {
    return { ok: false }
  }
}

/**
 * Send chat message to /api/chat.
 * Returns null if VITE_API_URL is unset or request fails.
 */
export async function postChat(
  message: string,
  history: ChatHistoryTurn[] = []
): Promise<ChatResponse | null> {
  if (!API_URL) return null

  try {
    const res = await fetchWithTimeout(`${API_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history }),
    })

    if (!res.ok) return null
    return (await res.json()) as ChatResponse
  } catch {
    return null
  }
}

/**
 * Fetch aggregated GitHub and LeetCode stats from /api/stats.
 * Returns null if VITE_API_URL is unset or request fails.
 */
export async function getStats(): Promise<StatsResponse | null> {
  if (!API_URL) return null

  try {
    const res = await fetchWithTimeout(`${API_URL}/api/stats`)
    if (!res.ok) return null
    return (await res.json()) as StatsResponse
  } catch {
    return null
  }
}
