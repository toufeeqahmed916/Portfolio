import { motion } from 'framer-motion'
import { Words, Reveal, Accordion, Counter, TechFloat } from '../ui'
import { Link } from '../router'
import { links, stats, stack, journey, hackathons, process, faqs } from '../data'

export default function About() {
  return (
    <>
      <section className="sec page-head about-head">
        <div>
          <Words as="h1" className="page-title" text="About me" />
          <Reveal><p className="lead">I'm Toufeeq Shaikh, a Full Stack Developer and AI Engineer from Pakistan. I turn ideas into working products: fast web apps, smart automations and tools people enjoy using.</p></Reveal>
          <Reveal delay={.1}><p className="lead">I add AI where it truly helps, do a little design to keep things sharp, and love building under pressure at hackathons.</p></Reveal>
          <div className="stats">{stats.map(s => <Counter key={s.l} {...s} />)}</div>
          <p className="contact-line">Call today: <a href={`tel:${links.phone}`}>{links.phone}</a> &nbsp;·&nbsp; Email: <a href={`mailto:${links.email}`}>{links.email}</a></p>
          <div className="row">
            <a className="pill black" href={links.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
            <a className="pill black" href={links.github} target="_blank" rel="noreferrer">GitHub</a>
            <Link className="pill white" to="/book">Book a call</Link>
          </div>
        </div>
        <motion.div className="hcard about-photo" initial={{ y: 80, opacity: 0, rotate: 6 }} animate={{ y: 0, opacity: 1, rotate: 3 }} transition={{ duration: .8, ease: [.2, .7, .2, 1] }} whileHover={{ rotate: -2, scale: 1.03 }}>
          <img src="/avatar.png" alt="Toufeeq Shaikh" />
        </motion.div>
      </section>

      <section className="sec">
        <h3 className="sub first">Discover my journey</h3>
        <div className="narrow">{journey.map(([r, c, d]) => <div className="jr" key={r}><b>{r}</b><span><em>{c}</em>{d}</span></div>)}</div>
      </section>

      <section className="sec">
        <div className="tech">
          <div>
            <h3 className="sub first">My tech stack</h3>
            <div>{stack.map(([t, d]) => <div className="tk" key={t}><b>{t}</b><span>{d}</span></div>)}</div>
          </div>
          <TechFloat />
        </div>
      </section>

      <section className="sec">
        <Words text="Hackathon wins" />
        <Reveal><p className="lead">I love building under pressure. Three hackathons, three milestones, back to back.</p></Reveal>
        <div className="hk">
          {hackathons.map((h, i) => (
            <motion.div key={h.title} className={'hk-card c' + i} initial={{ opacity: 0, y: 60, rotate: i % 2 ? 3 : -3 }} whileInView={{ opacity: 1, y: 0, rotate: 0 }} viewport={{ once: true }} whileHover={{ y: -8, rotate: i % 2 ? 1.5 : -1.5 }} transition={{ duration: .6, delay: i * .1 }}>
              <span className="tag">{h.place}</span><h3>{h.title}</h3><em>{h.org}</em><p>{h.note}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="sec">
        <Words text="Design & develop with strategy and creativity" />
        <Reveal><p className="lead">My process mixes smart planning with clean code. I understand the problem first, then design, build and improve it step by step, and I stay with you after launch.</p></Reveal>
        <div className="proc">
          {process.map((p, i) => p.img
            ? <motion.div key={i} className="pc img" initial={{ opacity: 0, scale: .9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * .06 }} whileHover={{ rotate: -2, scale: 1.03 }}><img src={p.img} alt="" loading="lazy" /></motion.div>
            : <motion.div key={i} className={'pc ' + p.k + (p.wide ? ' wide' : '')} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * .06 }} whileHover={{ y: -6 }}><b>{p.n}.</b><span>{p.t}</span></motion.div>)}
        </div>
      </section>

      <section className="sec faq">
        <div><h2>Frequently asked questions</h2><p className="lead">Quick answers to common questions. Anything else, just message me.</p></div>
        <div><Accordion numbered items={faqs} /></div>
      </section>

      <section className="sec">
        <Reveal className="cta-card g wide-cta">
          <h3>Like what you see?</h3>
          <p>Let's talk about your idea. Pick a time and I'll be there.</p>
          <div className="row"><Link className="pill black" to="/book">Book a call</Link><Link className="pill white" to="/projects">See my projects</Link></div>
        </Reveal>
      </section>
    </>
  )
}
