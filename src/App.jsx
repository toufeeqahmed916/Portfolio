import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, animate } from 'framer-motion'
import { Link, usePath, clean } from './router'
import { links } from './data'
import Home from './pages/Home'
import About from './pages/About'
import ProjectsPage from './pages/ProjectsPage'
import Book from './pages/Book'
import Play from './pages/Play'
import Admin from './pages/Admin'

const routes = {
  '/': { C: Home, title: 'Toufeeq Shaikh | Full Stack Developer & AI Engineer' },
  '/about': { C: About, title: 'About | Toufeeq Shaikh' },
  '/projects': { C: ProjectsPage, title: 'Projects | Toufeeq Shaikh' },
  '/book': { C: Book, title: 'Book a call | Toufeeq Shaikh' },
  '/play': { C: Play, title: 'Play | Toufeeq Shaikh' },
  '/admin': { C: Admin, title: 'Admin | Toufeeq Shaikh' },
}

function NotFound() {
  return (
    <section className="sec page-head">
      <h1 className="page-title">404</h1>
      <p className="lead">This page does not exist. Maybe it ran away.</p>
      <div className="row"><Link className="pill black" to="/">Go home</Link></div>
    </section>
  )
}

function Nav({ page }) {
  const [compact, setCompact] = useState(false)
  useEffect(() => {
    let last = window.scrollY
    const f = () => { const y = window.scrollY; setCompact(y > 120 && y > last); last = y }
    window.addEventListener('scroll', f, { passive: true }); return () => window.removeEventListener('scroll', f)
  }, [])
  useEffect(() => setCompact(false), [page])
  const item = (to, label, cls = '') => <Link key={to} to={to} className={cls + (page === to ? ' on' : '')}>{label}</Link>
  return (
    <div className="nav-wrap"><motion.nav className="nav" layout transition={{ type: 'spring', stiffness: 260, damping: 28 }}>
      <Link to="/" aria-label="Home"><motion.img layout src="/head.png" alt="Toufeeq" className="nav-av" /></Link>
      <AnimatePresence initial={false} mode="popLayout">
        {compact
          ? <motion.span key="a" className="nav-av-txt" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}><i />Available for work</motion.span>
          : <motion.span key="l" className="nav-links" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {item('/', 'Home', 'hide-sm')}
              {item('/about', 'About')}
              {item('/projects', 'Projects')}
              {item('/play', 'Play')}
              <Link to="/book" className="pill white">Book<span className="hide-xs">&nbsp;a call</span></Link>
            </motion.span>}
      </AnimatePresence>
    </motion.nav></div>
  )
}

function Curtain({ phase, onCovered, onDone }) {
  const y = phase === 'in' ? '0%' : phase === 'out' ? '-135%' : '115%'
  return (
    <motion.div className="curtain" style={{ visibility: phase === 'idle' ? 'hidden' : 'visible' }} initial={false} animate={{ y }} transition={phase === 'idle' ? { duration: 0 } : { duration: .6, ease: [.76, 0, .24, 1] }}
      onAnimationComplete={() => { if (phase === 'in') onCovered(); if (phase === 'out') onDone() }} aria-hidden="true" />
  )
}

function Layout() {
  const path = usePath()
  const [page, setPage] = useState(path)
  const [phase, setPhase] = useState('idle')
  const pathRef = useRef(path)
  pathRef.current = path

  useEffect(() => { if (path !== page && phase === 'idle') setPhase('in') }, [path, page, phase])
  const route = routes[page]
  useEffect(() => { document.title = route ? route.title : 'Not found | Toufeeq Shaikh' }, [route])

  const covered = () => { setPage(pathRef.current); window.scrollTo(0, 0); setTimeout(() => setPhase('out'), 60) }
  const Page = route ? route.C : NotFound

  return (
    <>
      <i className="bg-blob g" /><i className="bg-blob y" /><i className="bg-blob u" />
      <Nav page={page} />
      {page !== '/book' && <Link className="avail" to="/book"><i />Available for work</Link>}
      <main><Page key={page} /></main>
      <footer>
        <div><small>Email:</small><a href={`mailto:${links.email}`}>{links.email}</a></div>
        <div><small>Call today:</small><a href={`tel:${links.phone}`}>{links.phone}</a></div>
        <nav className="foot-nav"><Link to="/">Home</Link><Link to="/about">About</Link><Link to="/projects">Projects</Link><Link to="/play">Play</Link><Link to="/book">Book a call</Link></nav>
        <p>© 2026 All rights reserved. Created by <a href={links.linkedin} target="_blank" rel="noreferrer">Toufeeq Shaikh</a></p>
      </footer>
      <Curtain phase={phase} onCovered={covered} onDone={() => setPhase('idle')} />
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
    const typeEnd = 700 + WELCOME.length * 85 + 250
    const t1 = setTimeout(() => setTyping(false), typeEnd)
    const t2 = setTimeout(() => setUrdu(true), typeEnd + 250)
    const c = animate(0, 100, {
      duration: 5.4, ease: [.65, 0, .35, 1],
      onUpdate: v => setN(Math.round(v)),
      onComplete: () => setTimeout(() => { setLeave(true); onReveal() }, 650),
    })
    return () => { clearTimeout(t1); clearTimeout(t2); c.stop(); document.body.style.overflow = '' }
  }, [])
  return (
    <motion.div className="loader" initial={{ y: 0 }} animate={{ y: leave ? '-125%' : 0 }} transition={{ duration: 1, ease: [.76, 0, .24, 1] }}
      onAnimationComplete={() => { if (leave) { document.body.style.overflow = ''; onDone() } }}>
      <div className="ld-mid">
        <p className="ld-en" aria-label={WELCOME}>
          {WELCOME.split('').map((ch, i) => (
            <motion.span key={i} initial={{ opacity: 0, y: 10, filter: 'blur(6px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ delay: .7 + i * .085, duration: .35, ease: 'easeOut' }}>{ch === ' ' ? '\u00a0' : ch}</motion.span>
          ))}
          {typing && <i className="ld-caret" />}
        </p>
        <motion.p className="ld-ur" dir="rtl" lang="ur" initial={{ opacity: 0, y: 14, filter: 'blur(10px)' }} animate={urdu ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}} transition={{ duration: .8, ease: 'easeOut' }}>خوش آمدید</motion.p>
      </div>
      <div className="ld-num">{n}<span>%</span></div>
    </motion.div>
  )
}

export default function App() {
  const isAdmin = clean(window.location.pathname) === '/admin' // admin skips the welcome screen
  const [shown, setShown] = useState(isAdmin)
  const [loading, setLoading] = useState(!isAdmin)
  return (
    <>
      {shown && <Layout />}
      {loading && <Loader onReveal={() => setShown(true)} onDone={() => setLoading(false)} />}
    </>
  )
}
