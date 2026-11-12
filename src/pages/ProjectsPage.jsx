import { Words, Reveal, ProjectCard } from '../ui'
import { Link } from '../router'
import { useProjects } from '../useProjects'

export default function ProjectsPage() {
  const projects = useProjects()
  return (
    <>
      <section className="sec page-head">
        <Words as="h1" className="page-title" text="Projects" />
        <Reveal><p className="lead">Real products I built. Each one solves a real problem, from disaster relief maps to citizen safety and event websites.</p></Reveal>
        <div className="plist">{!projects ? <p>Loading projects…</p> : projects.length === 0 ? <p>No projects yet.</p> : projects.map(p => <ProjectCard key={p.title} p={p} />)}</div>
      </section>
      <section className="sec">
        <Reveal className="cta-card y wide-cta">
          <h3>Want something like this?</h3>
          <p>Tell me your idea and I'll tell you how I'd build it.</p>
          <div className="row"><Link className="pill black" to="/book">Book a call</Link></div>
        </Reveal>
      </section>
    </>
  )
}
