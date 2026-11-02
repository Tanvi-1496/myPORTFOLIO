import { About } from './components/About'
import { Contact } from './components/Contact'
import { CustomCursor } from './components/CustomCursor'
import { Footer } from './components/Footer'
import { Hero } from './components/Hero'
import { Navbar } from './components/Navbar'
import { Pipeline } from './components/Pipeline'
import { Projects } from './components/Projects'
import { Skills } from './components/Skills'
import { SparkleBackground } from './components/SparkleBackground'
import { Terminal } from './components/Terminal'
import { Timeline } from './components/Timeline'
import { GithubStats } from './components/GithubStats'
import { CommandMenu } from './components/CommandMenu'
import { ChatWidget } from './components/ChatWidget'
import { SparkleBurst } from './components/SparkleBurst'

export default function App() {
  return (
    <div className="min-h-screen overflow-hidden bg-[var(--page)] text-[var(--text)] selection:bg-[var(--accent)]/30">
      <SparkleBackground />
      <SparkleBurst />
      <CustomCursor />
      <Navbar />
      <CommandMenu />
      <main>
        <Hero />
        <About />
        <Timeline />
        <Terminal />
        <Skills />
        <Pipeline />
        <Projects />
        <GithubStats />
        <Contact />
      </main>
      <Footer />
      <ChatWidget />
    </div>
  )
}
