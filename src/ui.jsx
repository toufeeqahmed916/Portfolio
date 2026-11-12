import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useInView, animate, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion'
import { Link } from './router'
import { previews } from './data'
import { sfx } from './sound'

export const Chev = ({ open }) => (
  <motion.svg animate={{ rotate: open ? 180 : 0 }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6" /></motion.svg>
)

export function Reveal({ children, delay = 0, as: T = 'div', className }) {
  const M = motion[T]
  return <M className={className} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: .7, delay, ease: [.2, .7, .2, 1] }}>{children}</M>
}

export function Words({ text, className, as: T = 'h2' }) {
  const M = motion[T]
  return (
    <M className={className} initial="h" whileInView="s" viewport={{ once: true, margin: '-60px' }} transition={{ staggerChildren: .06 }}>
      {text.split(' ').map((w, i) => <span className="wmask" key={i}><motion.span style={{ display: 'inline-block' }} variants={{ h: { y: '110%' }, s: { y: 0 } }} transition={{ duration: .6, ease: [.2, .7, .2, 1] }}>{w}&nbsp;</motion.span></span>)}
    </M>
  )
}

export function Accordion({ items, numbered, preview }) {
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

export function Counter({ n, l }) {
  const ref = useRef(null), inView = useInView(ref, { once: true })
  const [v, setV] = useState(0)
  useEffect(() => { if (inView) animate(0, n, { duration: 1.6, ease: 'easeOut', onUpdate: x => setV(Math.round(x)) }) }, [inView, n])
  return <div ref={ref}><b className="num">{v}+</b><span>{l}</span></div>
}


export function HandIcon() {
  return (
    <motion.svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ originX: .5, originY: .9 }} animate={{ rotate: [0, 16, -8, 16, -4, 0] }} transition={{ repeat: Infinity, duration: 2.2, repeatDelay: 1 }}>
      <path d="M18 11V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2" /><path d="M14 10V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v2" /><path d="M10 10.5V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2v8" /><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
    </motion.svg>
  )
}

const techIcons = [
  { k: 'HTML', src: '/icons/html.png', x: 6, y: 3, d: 4.2 },
  { k: 'React', src: '/icons/react.png', x: 40, y: 0, d: 5 },
  { k: 'JavaScript', src: '/icons/javascript.png', x: 72, y: 8, d: 3.8 },
  { k: 'CSS', src: '/icons/css.png', x: 24, y: 17, d: 4.6 },
  { k: 'TypeScript', src: '/icons/typescript.png', x: 56, y: 22, d: 5.4 },
  { k: 'Tailwind CSS', src: '/icons/tailwind.png', x: 4, y: 30, d: 4.4 },
  { k: 'Bootstrap', src: '/icons/bootstrap.png', x: 38, y: 38, d: 5.2 },
  { k: 'Node.js', src: '/icons/nodejs.png', x: 70, y: 40, d: 4 },
  { k: 'Express.js', src: '/icons/express.png', x: 18, y: 50, d: 4.8 },
  { k: 'Python', src: '/icons/python.png', x: 52, y: 54, d: 5.6 },
  { k: 'Git', src: '/icons/git.png', x: 2, y: 66, d: 4.1 },
  { k: 'GitHub', src: '/icons/github.png', x: 34, y: 68, d: 4.9 },
  { k: 'PostgreSQL', src: '/icons/postgresql.png', x: 68, y: 64, d: 5.3 },
  { k: 'Supabase', src: '/icons/supabase.png', x: 14, y: 82, d: 4.5 },
  { k: 'C++', src: '/icons/cpp.png', x: 46, y: 82, d: 5.1 },
  { k: 'Arduino', src: '/icons/arduino.png', x: 74, y: 82, d: 3.9 },
]

function FloatIcon({ ic, mx, my, box }) {
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
      <motion.div animate={{ y: [0, -14, 0], rotate: [-4, 4, -4] }} transition={{ repeat: Infinity, duration: ic.d, ease: 'easeInOut' }}>
        <motion.div className="ficon-in" drag dragConstraints={box} dragElastic={.25} whileHover={{ scale: 1.18, rotate: 8 }} whileTap={{ scale: .92, cursor: 'grabbing' }} onTapStart={() => sfx('pop')} title={ic.k}>
          <img src={ic.src} alt={ic.k} draggable={false} />
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export function TechFloat() {
  const box = useRef(null)
  const mx = useMotionValue(-9999), my = useMotionValue(-9999)
  const move = e => { const r = box.current.getBoundingClientRect(); mx.set(e.clientX - r.left); my.set(e.clientY - r.top) }
  return (
    <div className="tfloat" ref={box} onMouseMove={move} onMouseLeave={() => { mx.set(-9999); my.set(-9999) }}>
      {techIcons.map(ic => <FloatIcon key={ic.k} ic={ic} mx={mx} my={my} box={box} />)}
    </div>
  )
}

export function Hero() {
  const mx = useMotionValue(0), my = useMotionValue(0)
  const rx = useSpring(useTransform(my, [-1, 1], [8, -8]), { stiffness: 120, damping: 14 })
  const ry = useSpring(useTransform(mx, [-1, 1], [-10, 10]), { stiffness: 120, damping: 14 })
  const { scrollY } = useScroll()
  const nameY = useTransform(scrollY, [0, 500], [0, -90])
  const move = e => { const r = e.currentTarget.getBoundingClientRect(); mx.set((e.clientX - r.left) / r.width * 2 - 1); my.set((e.clientY - r.top) / r.height * 2 - 1) }
  return (
    <section id="home" className="hero" onMouseMove={move}>
      <motion.h1 className="hname l" style={{ y: nameY }} initial={{ x: -140, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: .9, ease: [.2, .7, .2, 1] }}>Toufeeq</motion.h1>
      <motion.div className="hcard" style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }} initial={{ y: 120, opacity: 0, rotate: -6 }} animate={{ y: 0, opacity: 1, rotate: 0 }} transition={{ duration: .9, delay: .15, ease: [.2, .7, .2, 1] }}>
        <img src="/avatar.png" alt="Toufeeq Shaikh" />
        <motion.div className="hi" animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 2.4 }}>
          <HandIcon />
        </motion.div>
      </motion.div>
      <motion.h1 className="hname r" style={{ y: nameY }} initial={{ x: 140, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: .9, ease: [.2, .7, .2, 1] }}>Shaikh</motion.h1>
      <motion.p className="hsub" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .7 }}>I'm a Pakistan-based Full Stack Developer and AI Engineer. I build web apps and smart automations that work while you sleep.</motion.p>
      <motion.div className="hero-cta row" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .9 }}>
        <Link className="pill black" to="/projects">See my work</Link>
        <Link className="pill white" to="/book">Book a call</Link>
      </motion.div>
    </section>
  )
}

export function StickyPhoto({ children }) {
  const ref = useRef(null)
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const rot = useTransform(p, [0, .4, .7, 1], [-10, 5, -6, 4])
  const o1 = useTransform(p, [0, .3, .4], [1, 1, 0]), o2 = useTransform(p, [.3, .45, .6], [0, 1, 0]), o3 = useTransform(p, [.55, .7, 1], [0, 1, 1])
  return (
    <div className="stick" ref={ref}>
      <div className="stick-text">{children}</div>
      <div className="stick-card-wrap">
        <motion.div className="stick-card" style={{ rotate: rot }}>
          <motion.img src="/avatar.png" alt="" style={{ opacity: o1 }} />
          <motion.img src="/head.png" alt="Toufeeq Shaikh" style={{ opacity: o3 }} />
        </motion.div>
      </div>
    </div>
  )
}


export function ProjectCard({ p }) {
  return (
    <motion.article className="pcard" style={{ background: p.color, color: p.ink }} initial={{ opacity: 0, y: 80, scale: .95 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true, margin: '-80px' }} whileHover={{ scale: 1.015 }} transition={{ type: 'spring', stiffness: 120, damping: 20 }}>
      <i className="blob b1" /><i className="blob b2" />
      <div className="pin">
        <span className="tag">{p.tag}</span>
        <h3>{p.title}</h3>
        {p.problem && <p className="prob"><b>The problem: </b>{p.problem}</p>}
        <p className="what">{p.what}</p>
        <div className="row">
          {p.live ? <a className="pill white" href={p.live} target="_blank" rel="noreferrer">Live Site</a> : <span className="pill white soon">Coming soon</span>}
          {p.code && <a className="pill ghost" href={p.code} target="_blank" rel="noreferrer">GitHub</a>}
        </div>
      </div>
      {p.img
        ? <motion.a className="pshot" href={p.live} target="_blank" rel="noreferrer" whileHover={{ rotate: -2, scale: 1.03 }}><img src={p.img} alt={p.title + ' website screenshot'} loading="lazy" /></motion.a>
        : <div className="pshot soonbox"><span>Deploying soon</span></div>}
    </motion.article>
  )
}
