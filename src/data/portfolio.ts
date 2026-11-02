export const EMAIL = 'vibhavari.14092006@gmail.com'

export type Project = {
  title: string
  description: string
  tech: string[]
  problem: string
  solution: string
  result: string
  github?: string
  live?: string
  badge?: string
  featured?: boolean
  icon: 'bot' | 'activity' | 'audio' | 'git' | 'sprout' | 'chart'
  categories: Array<'DevOps' | 'AI/ML' | 'Full-stack'>
}

export const projects: Project[] = [
  {
    title: 'Blinkit Support Copilot', icon: 'bot', categories: ['AI/ML', 'Full-stack'], description: 'Agentic AI customer-support copilot grounded in Blinkit support data.', tech: ['React', 'FastAPI', 'RAG', 'LLM'],
    problem: 'Support teams answer repetitive queries slowly.',
    solution: 'A RAG + agentic AI assistant over Blinkit support data with a chat frontend, deployed with a Vercel frontend and Render backend.',
    result: 'Working end-to-end live demo.',
    github: 'https://github.com/Tanvi-1496/support-copilot-ai-agent-rag', live: 'https://support-copilot-ai-agent-rag.vercel.app/', featured: true,
  },
  {
    title: 'ObserveX', icon: 'activity', categories: ['DevOps', 'Full-stack'], description: 'Unified observability dashboard across metrics, logs and traces.', tech: ['React', 'TypeScript', 'Docker', 'Prometheus', 'Grafana', 'Loki', 'Jaeger'],
    problem: 'Metrics, logs and traces are scattered across tools.',
    solution: 'One observability dashboard over Prometheus, Grafana, Loki and Jaeger run via Docker Compose.',
    result: 'Complete metrics + logs + traces visibility in one UI.',
    github: 'https://github.com/Tanvi-1496',
  },
  {
    title: 'Vaani Kavach', icon: 'audio', categories: ['AI/ML', 'Full-stack'], description: 'Real-time voice-clone and deepfake speech detection system.', tech: ['React', 'FastAPI', 'Transformers', 'AST/wav2vec2', 'Supabase'],
    problem: 'AI voice cloning is used for impersonation and fraud.',
    solution: 'Real-time synthetic speech detection with Transformers (AST/wav2vec2), FastAPI REST + WebSocket, and Supabase for auth and history.',
    result: 'Smart India Hackathon 2026 project, team QUASAR.',
    badge: 'Smart India Hackathon 2026',
  },
  {
    title: 'SkillSwap', icon: 'git', categories: ['AI/ML', 'Full-stack'], description: 'Student–mentor matching with semantic AI recommendations.', tech: ['React', 'Vite', 'Tailwind', 'SBERT', 'Supabase'],
    problem: 'Students struggle to find the right mentor.',
    solution: 'SBERT profile embeddings with cosine similarity recommend the top 3 mentors, supported by booking flows and dashboards.',
    result: 'Full student-mentor platform with AI recommendations.',
    github: 'https://github.com/Tanvi-1496/SkillSwap-Learn.-Mentor.-Grow.',
  },
  {
    title: 'AgriFlow AI', icon: 'sprout', categories: ['AI/ML', 'Full-stack'], description: 'Smart irrigation advice using ML and rule-based reasoning.', tech: ['React', 'FastAPI', 'Random Forest', 'scikit-learn'],
    problem: 'Small farmers over- or under-irrigate.',
    solution: 'A Random Forest model predicts irrigation need from crop, temperature, humidity and soil data, followed by a rule-based explanation layer.',
    result: 'About 99.58% accuracy on the held-out test split.',
  },
  {
    title: 'DMart Retail Analytics', icon: 'chart', categories: ['AI/ML', 'Full-stack'], description: 'OLAP and predictive analytics across nearly 1M retail rows.', tech: ['React', 'FastAPI', 'PostgreSQL', 'OLAP'],
    problem: 'Raw retail data of ~1M rows gives no insight.',
    solution: 'Warehouse design with OLAP, market basket analysis, customer segmentation and prediction screens.',
    result: 'Analytics dashboard where all numbers come from actual execution.',
    github: 'https://github.com/Tanvi-1496/DMart-Retail-Analytics',
  },
]

export const skillGroups = {
  'DevOps & Cloud': ['Docker', 'Kubernetes', 'CI/CD', 'Prometheus', 'Grafana', 'Loki', 'Jaeger', 'Linux', 'Git'],
  Programming: ['Python', 'JavaScript', 'TypeScript', 'SQL'],
  Web: ['React', 'Vite', 'Tailwind CSS', 'FastAPI'],
  'AI / ML': ['scikit-learn', 'Random Forest', 'RAG', 'LLMs', 'SBERT', 'Hugging Face'],
  Data: ['PostgreSQL', 'Supabase'],
}

export const journey = [
  { title: 'B.Tech IT (Lateral Entry)', detail: 'Vidyalankar Institute of Technology, Mumbai · CGPA 9.83.' },
  { title: 'DevOps & Cloud', detail: 'Started a hands-on learning path with a long-term goal of building for AIOps.' },
  { title: 'Elevate Labs (MSME)', detail: 'Completed a 2-week DevOps internship and built a complete observability system with Prometheus, Grafana, Loki, Jaeger and Docker Compose.' },
  { title: 'Smart India Hackathon 2026', detail: 'Built Vaani Kavach, a voice-clone detection system, with Team QUASAR.' },
  { title: 'Blinkit Support Copilot', detail: 'Built and deployed a RAG and agentic AI support project, live on Vercel.' },
  { title: 'Next: SmartOps', detail: 'An AI-powered DevOps platform and capstone project.' },
]

export const commandItems = [
  { label: 'Go to About', keywords: 'profile introduction', href: '#about' },
  { label: 'Go to Journey', keywords: 'timeline education internship', href: '#journey' },
  { label: 'Go to Terminal', keywords: 'commands interactive', href: '#terminal' },
  { label: 'Go to Skills', keywords: 'technology stack tools', href: '#skills' },
  { label: 'Go to Projects', keywords: 'work case studies', href: '#projects' },
  { label: 'Go to GitHub Stats', keywords: 'live code leetcode', href: '#github' },
  { label: 'Go to Contact', keywords: 'reach hire', href: '#contact' },
  { label: 'Open GitHub', keywords: 'social repositories', href: 'https://github.com/Tanvi-1496', external: true },
  { label: 'Open LinkedIn', keywords: 'social network', href: 'https://linkedin.com/in/tanvijaware', external: true },
  { label: 'Email me', keywords: 'contact mail', href: `mailto:${EMAIL}` },
  { label: 'Download Resume', keywords: 'cv pdf', href: '/Tanvi_Resume.pdf', external: true },
]

export const quickQuestions = [
  'What are her top skills?',
  'Tell me about her projects',
  'Is she open to internships?',
  'How can I contact her?',
]
