import { Hero, StickyPhoto, Words, Reveal, Accordion, Counter, ProjectCard } from '../ui'
import { Link } from '../router'
import { services, stats } from '../data'
import { useProjects } from '../useProjects'

export default function Home() {
  const projects = useProjects()
  return (
    <>
      <Hero />
      <section className="sec">
        <StickyPhoto>
          <Words text="What I can do for you" />
          <Reveal><p className="lead">I build web apps and AI tools that help your business grow, save time and stand out.</p></Reveal>
          <div className="narrow"><Accordion numbered preview items={services.map(s => [s.t, s.p])} /></div>
          <div className="about-intro">
            <Words text="About me" />
            <Reveal><p className="lead">I'm a full stack developer who loves turning ideas into working products. I add AI where it truly helps, and I win and build at hackathons, which keeps me fast and curious.</p></Reveal>
            <div className="stats">{stats.map(s => <Counter key={s.l} {...s} />)}</div>
            <div className="row"><Link className="pill black" to="/about">See more about me →</Link></div>
          </div>
        </StickyPhoto>
      </section>
      <section className="sec">
        <Words text="Featured projects" />
        <Reveal><p className="lead">Real products I built. Each one solves a real problem.</p></Reveal>
        <div className="plist">{projects ? projects.slice(0, 3).map(p => <ProjectCard key={p.title} p={p} />) : <p>Loading projects…</p>}</div>
        <div className="row center"><Link className="pill black" to="/projects">See all projects →</Link></div>
      </section>
      <section className="sec">
        <div className="cta2">
          <Reveal className="cta-card g">
            <h3>Got an idea? Let's talk.</h3>
            <p>Pick a time that works for you. No emails back and forth.</p>
            <div className="row"><Link className="pill black" to="/book">Book a call</Link></div>
          </Reveal>
          <Reveal className="cta-card y" delay={.1}>
            <h3>Bored? Beat me at hand cricket.</h3>
            <p>The game we all played as kids, now against an AI.</p>
            <div className="row"><Link className="pill black" to="/play">Play now</Link></div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
