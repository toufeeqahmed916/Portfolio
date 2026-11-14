import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useInView, animate, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion'
import { links, services, stats, projects, stack, journey, process, faqs, hackathons, previews } from './data'

const Chev = ({ open }) => (
  <motion.svg animate={{ rotate: open ? 180 : 0 }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6" /></motion.svg>
)

function Reveal({ children, delay = 0, as: T = 'div', className }) {
  const M = motion[T]
  return <M className={className} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: .7, delay, ease: [.2, .7, .2, 1] }}>{children}</M>
}

function Words({ text, className, as: T = 'h2' }) {
  const M = motion[T]
  return (
    <M className={className} initial="h" whileInView="s" viewport={{ once: true, margin: '-60px' }} transition={{ staggerChildren: .06 }}>
      {text.split(' ').map((w, i) => <span className="wmask" key={i}><motion.span style={{ display: 'inline-block' }} variants={{ h: { y: '110%' }, s: { y: 0 } }} transition={{ duration: .6, ease: [.2, .7, .2, 1] }}>{w}&nbsp;</motion.span></span>)}
    </M>
  )
}

function Accordion({ items, numbered, preview }) {
  const [o, setO] = useState(null)
  const [hv, setHv] = useState(-1)
  const x = useMotionValue(0), y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 220, damping: 22 }), sy = useSpring(y, { stiffness: 220, damping: 22 })
  const p = preview && hv >= 0 ? previews[hv % previews.length] : null
  return (<div onMouseMove={e => { x.set(e.clientX + 24); y.set(e.clientY - 40) }} onMouseLeave={() => setHv(-1)}>
    <AnimatePresence>{p && <motion.div className="follow" style={{ x: sx, y: sy, background: p[1] }} initial={{ scale: .6, opacity: 0, rotate: -10 }} animate={{ scale: 1, opacity: 1, rotate: -6 }} exit={{ scale: .6, opacity: 0 }}>{p[0]}</motion.div>}</AnimatePresence>
    {items.map(([t, body], i) => (
    <div className="acc" key={t} onMouseEnter={() => setHv(i)}>
      <button onClick={() => setO(o === i ? null : i)} aria-expanded={o === i}>
        <span>{numbered ? `${i + 1}. ` : ''}{t}</span><Chev open={o === i} />
      </button>
      <AnimatePresence initial={false}>
        {o === i && (
          <motion.div className="acc-body" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: .3 }}>
            {Array.isArray(body) ? <ul>{body.map(x => <li key={x}>{x}</li>)}</ul> : <p>{body}</p>}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  ))}
  </div>)
}

function Counter({ n, l }) {
  const ref = useRef(null), inView = useInView(ref, { once: true })
  const [v, setV] = useState(0)
  useEffect(() => { if (inView) animate(0, n, { duration: 1.6, ease: 'easeOut', onUpdate: x => setV(Math.round(x)) }) }, [inView, n])
  return <div ref={ref}><b className="num">{v}+</b><span>{l}</span></div>
}


function HandIcon() {
  return (
    <motion.svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ originX: .5, originY: .9 }} animate={{ rotate: [0, 16, -8, 16, -4, 0] }} transition={{ repeat: Infinity, duration: 2.2, repeatDelay: 1 }}>
      <path d="M18 11V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2" /><path d="M14 10V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v2" /><path d="M10 10.5V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2v8" /><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
    </motion.svg>
  )
}

const techIcons = [
  { k: 'HTML', src: '/icons/html.webp', x: 6, y: 3, d: 4.2 },
  { k: 'React', src: '/icons/react.webp', x: 40, y: 0, d: 5 },
  { k: 'JavaScript', src: '/icons/javascript.webp', x: 72, y: 8, d: 3.8 },
  { k: 'CSS', src: '/icons/css.webp', x: 24, y: 17, d: 4.6 },
  { k: 'TypeScript', src: '/icons/typescript.webp', x: 56, y: 22, d: 5.4 },
  { k: 'Tailwind CSS', src: '/icons/tailwind.webp', x: 4, y: 30, d: 4.4 },
  { k: 'Bootstrap', src: '/icons/bootstrap.webp', x: 38, y: 38, d: 5.2 },
  { k: 'Node.js', src: '/icons/nodejs.webp', x: 70, y: 40, d: 4 },
  { k: 'Express.js', src: '/icons/express.webp', x: 18, y: 50, d: 4.8 },
  { k: 'Python', src: '/icons/python.webp', x: 52, y: 54, d: 5.6 },
  { k: 'Git', src: '/icons/git.webp', x: 2, y: 66, d: 4.1 },
  { k: 'GitHub', src: '/icons/github.webp', x: 34, y: 68, d: 4.9 },
  { k: 'PostgreSQL', src: '/icons/postgresql.webp', x: 68, y: 64, d: 5.3 },
  { k: 'Supabase', src: '/icons/supabase.webp', x: 14, y: 82, d: 4.5 },
  { k: 'C++', src: '/icons/cpp.webp', x: 46, y: 82, d: 5.1 },
  { k: 'Arduino', src: '/icons/arduino.webp', x: 74, y: 82, d: 3.9 },
]

function FloatIcon({ ic, mx, my, box, on }) {
  const ref = useRef(null)
  const push = (axis) => ([x, y]) => {
    const el = ref.current; if (!el) return 0
    const cx = el.offsetLeft + el.offsetWidth / 2, cy = el.offsetTop + el.offsetHeight / 2
    const dx = cx - x, dy = cy - y, d = Math.hypot(dx, dy) || 1
    return d < 180 ? (axis ? dy : dx) / d * (180 - d) * .8 : 0
  }
  const sx = useSpring(useTransform([mx, my], push(0)), { stiffness: 110, damping: 13 })
  const sy = useSpring(useTransform([mx, my], push(1)), { stiffness: 110, damping: 13 })
  return (
    <motion.div ref={ref} className="ficon" style={{ left: ic.x + '%', top: ic.y + '%', x: sx, y: sy }}>
      <motion.div animate={on ? { y: [0, -14, 0], rotate: [-4, 4, -4] } : { y: 0, rotate: 0 }} transition={on ? { repeat: Infinity, duration: ic.d, ease: 'easeInOut' } : { duration: .3 }}>
        <motion.div className="ficon-in" drag dragConstraints={box} dragElastic={.25} whileHover={{ scale: 1.18, rotate: 8 }} whileTap={{ scale: .92, cursor: 'grabbing' }} title={ic.k}>
          <img src={ic.src} alt={ic.k} width="104" height="104" loading="lazy" decoding="async" draggable={false} />
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

function TechFloat() {
  const box = useRef(null)
  const on = useInView(box, { margin: '100px' })
  const mx = useMotionValue(-9999), my = useMotionValue(-9999)
  const move = e => { const r = box.current.getBoundingClientRect(); mx.set(e.clientX - r.left); my.set(e.clientY - r.top) }
  return (
    <div className="tfloat" ref={box} onMouseMove={move} onMouseLeave={() => { mx.set(-9999); my.set(-9999) }}>
      {techIcons.map(ic => <FloatIcon key={ic.k} ic={ic} mx={mx} my={my} box={box} on={on} />)}
    </div>
  )
}

function Nav() {
  const [compact, setCompact] = useState(false)
  useEffect(() => {
    let last = window.scrollY
    const f = () => { const y = window.scrollY; setCompact(y > 120 && y > last); last = y }
    window.addEventListener('scroll', f, { passive: true }); return () => window.removeEventListener('scroll', f)
  }, [])
  const go = id => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  return (
    <div className="nav-wrap"><motion.nav className="nav" layout transition={{ type: 'spring', stiffness: 260, damping: 28 }}>
      <motion.img layout src="/head-sm.webp" alt="Toufeeq" className="nav-av" width="36" height="36" />
      <AnimatePresence initial={false} mode="popLayout">
        {compact
          ? <motion.span key="a" className="nav-av-txt" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}><i />Available for work</motion.span>
          : <motion.span key="l" className="nav-links" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {['home', 'about', 'projects'].map(id => <button key={id} onClick={() => go(id)}>{id[0].toUpperCase() + id.slice(1)}</button>)}
              <button className="pill white" onClick={() => go('contact')}>Contact</button>
            </motion.span>}
      </AnimatePresence>
    </motion.nav></div>
  )
}

function Hero({ ready }) {
  const mx = useMotionValue(0), my = useMotionValue(0)
  const rx = useSpring(useTransform(my, [-1, 1], [8, -8]), { stiffness: 120, damping: 14 })
  const ry = useSpring(useTransform(mx, [-1, 1], [-10, 10]), { stiffness: 120, damping: 14 })
  const { scrollY } = useScroll()
  const nameY = useTransform(scrollY, [0, 500], [0, -90])
  const move = e => { const r = e.currentTarget.getBoundingClientRect(); mx.set((e.clientX - r.left) / r.width * 2 - 1); my.set((e.clientY - r.top) / r.height * 2 - 1) }
  return (
    <section id="home" className="hero" onMouseMove={move}>
      <motion.h1 className="hname l" style={{ y: nameY }} initial={{ x: -140, opacity: 0 }} animate={ready ? { x: 0, opacity: 1 } : {}} transition={{ duration: .9, ease: [.2, .7, .2, 1] }}>Toufeeq</motion.h1>
      <motion.div className="hcard" style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }} initial={{ y: 120, opacity: 0, rotate: -6 }} animate={ready ? { y: 0, opacity: 1, rotate: 0 } : {}} transition={{ duration: .9, delay: .15, ease: [.2, .7, .2, 1] }}>
        <img src="/avatar.webp" alt="Toufeeq Shaikh" width="720" height="720" fetchpriority="high" decoding="async" />
        <motion.div className="hi" animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 2.4 }}>
          <HandIcon />
        </motion.div>
      </motion.div>
      <motion.h1 className="hname r" style={{ y: nameY }} initial={{ x: 140, opacity: 0 }} animate={ready ? { x: 0, opacity: 1 } : {}} transition={{ duration: .9, ease: [.2, .7, .2, 1] }}>Shaikh</motion.h1>
      <motion.p className="hsub" initial={{ opacity: 0, y: 20 }} animate={ready ? { opacity: 1, y: 0 } : {}} transition={{ delay: .7 }}>I'm a Pakistan-based Full Stack Developer and AI Engineer. I build web apps and smart automations that work while you sleep.</motion.p>
    </section>
  )
}

function StickyPhoto({ children }) {
  const ref = useRef(null)
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const rot = useTransform(p, [0, .4, .7, 1], [-10, 5, -6, 4])
  const o1 = useTransform(p, [0, .3, .4], [1, 1, 0]), o2 = useTransform(p, [.3, .45, .6], [0, 1, 0]), o3 = useTransform(p, [.55, .7, 1], [0, 1, 1])
  return (
    <div className="stick" ref={ref}>
      <div className="stick-text">{children}</div>
      <div className="stick-card-wrap">
        <motion.div className="stick-card" style={{ rotate: rot }}>
          <motion.img src="/avatar.webp" alt="" width="720" height="720" loading="lazy" decoding="async" style={{ opacity: o1 }} />
          <motion.img src="/head.webp" alt="Toufeeq Shaikh" width="640" height="640" loading="lazy" decoding="async" style={{ opacity: o3 }} />
        </motion.div>
      </div>
    </div>
  )
}

function Projects() {
  return (
    <section id="projects" className="sec">
      <Words text="Featured Projects" />
      <Reveal><p className="lead">Real products I built. Each one solves a real problem.</p></Reveal>
      <div className="plist">
        {projects.map(p => (
          <motion.article key={p.title} className="pcard" style={{ background: p.color, color: p.ink }} initial={{ opacity: 0, y: 80, scale: .95 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true, margin: '-80px' }} whileHover={{ scale: 1.015 }} transition={{ type: 'spring', stiffness: 120, damping: 20 }}>
            <i className="blob b1" /><i className="blob b2" />
            <div className="pin">
              <span className="tag">{p.tag}</span>
              <h3>{p.title}</h3>
              {p.problem && <p className="prob"><b>The problem: </b>{p.problem}</p>}
              <p className="what">{p.what}</p>
              <div className="row">
                {p.live ? <a className="pill white" href={p.live} target="_blank" rel="noreferrer">Live Site</a> : <span className="pill white soon">Coming soon</span>}
                <a className="pill ghost" href={p.code} target="_blank" rel="noreferrer">GitHub</a>
              </div>
            </div>
            {p.img
              ? <motion.a className="pshot" href={p.live} target="_blank" rel="noreferrer" whileHover={{ rotate: -2, scale: 1.03 }}><img src={p.img} alt={p.title + ' website screenshot'} width="960" height="546" loading="lazy" decoding="async" /></motion.a>
              : <div className="pshot soonbox"><span>Deploying soon</span></div>}
            </motion.article>
        ))}
      </div>
    </section>
  )
}

function Contact() {
  const [f, setF] = useState({ name: '', email: '', service: '', message: '' })
  const [s, setS] = useState('idle')
  const on = k => e => setF({ ...f, [k]: e.target.value })
  async function send(e) {
    e.preventDefault(); setS('sending')
    const { getSupabase } = await import('./supabase')
    const supabase = getSupabase()
    if (!supabase) { setS('noconfig'); return }
    const { error } = await supabase.from('messages').insert(f)
    setS(error ? 'error' : 'done')
    if (!error) setF({ name: '', email: '', service: '', message: '' })
  }
  return (
    <section id="contact" className="sec contact">
      <div className="cav"><img src="/avatar.webp" alt="" width="720" height="720" loading="lazy" decoding="async" /><motion.div className="hi" animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 2.4 }}><HandIcon /></motion.div></div>
      <form onSubmit={send}>
        <h2>Let's work together</h2>
        <p className="lead">Have an idea, an app or something to automate? Tell me about it and let's build it.</p>
        <div className="two">
          <label>Name<input required value={f.name} onChange={on('name')} placeholder="John Smith" /></label>
          <label>Email<input required type="email" value={f.email} onChange={on('email')} placeholder="johnsmith@gmail.com" /></label>
        </div>
        <label>Service needed?
          <select required value={f.service} onChange={on('service')}>
            <option value="">Select…</option>
            {['Full Stack Web Development', 'AI & Automation', 'Embedded / Arduino', 'Graphic Design'].map(x => <option key={x}>{x}</option>)}
          </select>
        </label>
        <label>What can I help you with?<textarea required rows="4" value={f.message} onChange={on('message')} placeholder="Hello, I'd like to talk about…" /></label>
        <button className="pill black" disabled={s === 'sending'}>{s === 'sending' ? 'Sending…' : 'Send message'}</button>
        <p className="status" role="status">
          {s === 'done' && 'Thanks! Your message is sent. I will reply soon.'}
          {s === 'error' && 'Could not send. Please email me directly.'}
          {s === 'noconfig' && 'Form is not connected yet. Please email me directly.'}
        </p>
      </form>
    </section>
  )
}

function Site({ ready }) {
  return (
    <>
      <i className="bg-blob g" /><i className="bg-blob y" /><i className="bg-blob u" />
      <Nav />
      <a className="avail" href="#contact"><i />Available for work</a>
      <main>
        <Hero ready={ready} />
        <section className="sec">
          <StickyPhoto>
            <Words text="What I can do for you" />
            <Reveal><p className="lead">I build web apps and AI tools that help your business grow, save time and stand out.</p></Reveal>
            <div className="narrow"><Accordion numbered preview items={services.map(s => [s.t, s.p])} /></div>
            <div id="about" className="about-intro">
              <Words text="About me" />
              <Reveal><p className="lead">I'm a full stack developer who loves turning ideas into working products. I add AI where it truly helps, and I do a little design to keep things looking sharp. I also win and build at hackathons, which keeps me fast and curious.</p></Reveal>
              <div className="stats">{stats.map(s => <Counter key={s.l} {...s} />)}</div>
              <p className="contact-line">Call today: <a href={`tel:${links.phone}`}>{links.phone}</a> &nbsp;·&nbsp; Email: <a href={`mailto:${links.email}`}>{links.email}</a></p>
              <div className="row"><a className="pill black" href={links.linkedin} target="_blank" rel="noreferrer">LinkedIn</a><a className="pill black" href={links.github} target="_blank" rel="noreferrer">GitHub</a></div>
            </div>
          </StickyPhoto>
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
        <Projects />
        <section className="sec">
          <Words text="Design & develop with strategy and creativity" />
          <Reveal><p className="lead">My process mixes smart planning with clean code. I understand the problem first, then design, build and improve it step by step, and I stay with you after launch.</p></Reveal>
          <div className="proc">
            {process.map((p, i) => p.img
              ? <motion.div key={i} className="pc img" initial={{ opacity: 0, scale: .9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * .06 }} whileHover={{ rotate: -2, scale: 1.03 }}><img src={p.img} alt="" width="576" height="608" loading="lazy" decoding="async" /></motion.div>
              : <motion.div key={i} className={'pc ' + p.k + (p.wide ? ' wide' : '')} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * .06 }} whileHover={{ y: -6 }}><b>{p.n}.</b><span>{p.t}</span></motion.div>)}
          </div>
        </section>
        {/* Reviews hidden for now. Restore the section here when real reviews are ready. */}
        <section className="sec faq">
          <div><h2>Frequently asked questions</h2><p className="lead">Quick answers to common questions. Anything else, just message me.</p></div>
          <div><Accordion numbered items={faqs} /></div>
        </section>
        <Contact />
      </main>
      <footer>
        <div><small>Email:</small><a href={`mailto:${links.email}`}>{links.email}</a></div>
        <div><small>Call today:</small><a href={`tel:${links.phone}`}>{links.phone}</a></div>
        <p>© 2026 All rights reserved. Created by <a href={links.linkedin} target="_blank" rel="noreferrer">Toufeeq Shaikh</a></p>
      </footer>
    </>
  )
}

const WELCOME = 'Welcome to my portfolio'

function Loader({ onReveal, onDone }) {
  const [n, setN] = useState(0)
  const [typing, setTyping] = useState(true)
  const [urdu, setUrdu] = useState(false)
  const [leave, setLeave] = useState(false)
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const typeEnd = 250 + WELCOME.length * 35 + 150
    const t1 = setTimeout(() => setTyping(false), typeEnd)
    const t2 = setTimeout(() => setUrdu(true), typeEnd + 100)
    const c = animate(0, 100, {
      duration: 1.8, ease: [.65, 0, .35, 1],
      onUpdate: v => setN(Math.round(v)),
      onComplete: () => setTimeout(() => { setLeave(true); onReveal() }, 150),
    })
    return () => { clearTimeout(t1); clearTimeout(t2); c.stop(); document.body.style.overflow = '' }
  }, [])
  return (
    <motion.div className="loader" initial={{ y: 0 }} animate={{ y: leave ? '-125%' : 0 }} transition={{ duration: .8, ease: [.76, 0, .24, 1] }}
      onAnimationComplete={() => { if (leave) { document.body.style.overflow = ''; onDone() } }}>
      <div className="ld-mid">
        <p className="ld-en" aria-label={WELCOME}>
          {WELCOME.split('').map((ch, i) => (
            <motion.span key={i} initial={{ opacity: 0, y: 10, filter: 'blur(6px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ delay: .25 + i * .035, duration: .25, ease: 'easeOut' }}>{ch === ' ' ? '\u00a0' : ch}</motion.span>
          ))}
          {typing && <i className="ld-caret" />}
        </p>
        <motion.p className="ld-ur" dir="rtl" lang="ur" initial={{ opacity: 0, y: 14, filter: 'blur(10px)' }} animate={urdu ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}} transition={{ duration: .5, ease: 'easeOut' }}>خوش آمدید</motion.p>
      </div>
      <div className="ld-num">{n}<span>%</span></div>
    </motion.div>
  )
}

const seen = () => { try { return sessionStorage.getItem('seen') === '1' } catch { return false } }
const markSeen = () => { try { sessionStorage.setItem('seen', '1') } catch {} }

export default function App() {
  const skip = seen()
  const [ready, setReady] = useState(skip)
  const [loading, setLoading] = useState(!skip)
  return (
    <>
      <Site ready={ready} />
      {loading && <Loader onReveal={() => { setReady(true); markSeen() }} onDone={() => setLoading(false)} />}
    </>
  )
}