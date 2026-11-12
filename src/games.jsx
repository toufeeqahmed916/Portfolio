import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { sfx, buzz, useMuted, toggleMute } from './sound'

const store = {
  get: (k, d) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d } catch { return d } },
  set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)) } catch { /* ignore */ } },
}
const roll = () => 1 + Math.floor(Math.random() * 6)

/* ---------------- shared fun stuff: sparks + sound toggle ---------------- */
const rnd = (a, b) => a + Math.random() * (b - a)
const CONF = ['#6bf01f', '#ffd23f', '#3b7bff', '#ff4d4d', '#111']
let sid = 0
function burst(x, y, colors, n = 10, spread = 70, fall = 0) {
  return Array.from({ length: n }, () => {
    const a = Math.random() * 6.283, d = rnd(spread * .35, spread)
    return { id: ++sid, x, y, dx: Math.cos(a) * d, dy: Math.sin(a) * d + fall, c: colors[Math.floor(Math.random() * colors.length)], r: rnd(-260, 260) }
  })
}
function useSparks() {
  const [list, set] = useState([])
  const add = arr => { set(l => [...l, ...arr]); setTimeout(() => set(l => l.filter(s => !arr.includes(s))), 1000) }
  return [list, add]
}
const Sparks = ({ list }) => <>{list.map(s => <i key={s.id} className="spark" style={{ left: s.x + '%', top: s.y + '%', background: s.c, '--dx': s.dx + 'px', '--dy': s.dy + 'px', '--r': s.r + 'deg' }} />)}</>
function SoundToggle() {
  const m = useMuted()
  return <button className="snd" onClick={toggleMute} aria-pressed={!m} aria-label={m ? 'Turn sound on' : 'Turn sound off'}>{m ? '🔇 Off' : '🔊 On'}</button>
}

/* ---------------- HAND CRICKET ---------------- */
// Both players show a number 1 to 6. Same number = OUT. Different = the batter scores his number.
function pickBowl(history) {
  // The AI sometimes "reads" your favourite number when it bowls.
  if (history.length > 3 && Math.random() < .35) {
    const c = {}
    history.forEach(n => { c[n] = (c[n] || 0) + 1 })
    return +Object.entries(c).sort((a, b) => b[1] - a[1])[0][0]
  }
  return roll()
}

function Hand({ label, n, hidden, out, tone }) {
  return (
    <div className={'hc-hand ' + tone}>
      <small>{label}</small>
      <AnimatePresence mode="wait">
        <motion.div key={hidden ? 'q' : n ?? 'x'} className={'hc-num' + (out ? ' out' : '')} initial={{ rotate: -20, scale: .4, opacity: 0 }} animate={out ? { rotate: [0, -8, 8, -6, 6, 0], scale: 1, opacity: 1 } : { rotate: 0, scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 16 }}>
          {hidden ? '?' : n ?? '–'}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export function HandCricket() {
  const [phase, setPhase] = useState('toss') // toss | choose | play | over
  const [coin, setCoin] = useState(null)
  const [flipping, setFlipping] = useState(false)
  const [batter, setBatter] = useState('you')
  const [inn, setInn] = useState(1)
  const [score, setScore] = useState(0)
  const [first, setFirst] = useState(0)
  const [balls, setBalls] = useState([])
  const [shown, setShown] = useState(null)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('Call the toss to start!')
  const [result, setResult] = useState(null)
  const [rec, setRec] = useState(() => store.get('hcRecord', { w: 0, l: 0, d: 0 }))
  const hist = useRef([])
  const [sp, addSp] = useSparks()

  function begin(who) {
    setBatter(who); setInn(1); setScore(0); setFirst(0); setBalls([]); setShown(null); setBusy(false); hist.current = []
    setMsg(who === 'you' ? 'You bat first. Pick a number!' : 'You bowl first. Match the AI number to get it out!')
    sfx('start'); setPhase('play')
  }
  function toss(call) {
    if (flipping) return
    setFlipping(true); setMsg('Flipping…'); sfx('toss')
    setTimeout(() => {
      const res = Math.random() < .5 ? 'heads' : 'tails'
      const win = res === call
      setCoin({ call, res, win }); setFlipping(false); sfx('coin')
      if (win) { setMsg(`It's ${res}. You won the toss!`); setPhase('choose') }
      else {
        const ai = Math.random() < .5 ? 'bat' : 'bowl'
        setMsg(`It's ${res}. AI won the toss and will ${ai} first.`)
        setTimeout(() => begin(ai === 'bat' ? 'ai' : 'you'), 1400)
      }
    }, 900)
  }
  function finish(kind) {
    // kind: 'chaser' | 'defender' | 'draw'
    const chaser = batter
    const winner = kind === 'draw' ? null : kind === 'chaser' ? chaser : chaser === 'you' ? 'ai' : 'you'
    const next = { ...rec, w: rec.w + (winner === 'you' ? 1 : 0), l: rec.l + (winner === 'ai' ? 1 : 0), d: rec.d + (winner === null ? 1 : 0) }
    setRec(next); store.set('hcRecord', next)
    setResult(winner)
    setTimeout(() => { setPhase('over'); setBusy(false); sfx(winner === 'you' ? 'win' : winner === 'ai' ? 'lose' : 'end'); if (winner === 'you') addSp(burst(50, 30, CONF, 46, 420, 170)) }, 1100)
  }
  function play(n) {
    if (busy) return
    setBusy(true); setShown({ you: n, ai: null }); sfx('pick', n); buzz(10)
    const ai = batter === 'ai' ? roll() : pickBowl(hist.current)
    hist.current.push(n)
    setTimeout(() => {
      const out = n === ai
      const runs = out ? 0 : batter === 'you' ? n : ai
      setShown({ you: n, ai, out })
      sfx(out ? 'out' : runs >= 6 ? 'six' : 'run', runs); if (out) buzz(70)
      setBalls(b => [...b.slice(-11), { you: n, ai, out, runs }])
      if (out) {
        if (inn === 1) {
          setFirst(score)
          setMsg(`OUT! ${batter === 'you' ? 'You' : 'The AI'} scored ${score}. Target: ${score + 1}`)
          setTimeout(() => { setInn(2); setBatter(batter === 'you' ? 'ai' : 'you'); setScore(0); setBalls([]); setShown(null); setBusy(false); setMsg(batter === 'you' ? `AI needs ${score + 1} to win. Bowl well!` : `You need ${score + 1} to win. Bat smart!`) }, 1700)
        } else {
          setMsg('OUT! Innings over.')
          finish(score > first ? 'chaser' : score === first ? 'draw' : 'defender')
        }
      } else {
        const ns = score + runs
        setScore(ns)
        if (inn === 2 && ns > first) { setMsg(`${batter === 'you' ? 'You' : 'The AI'} reached the target!`); finish('chaser') }
        else { setMsg(runs >= 6 ? 'SIX!' : `${runs} run${runs > 1 ? 's' : ''}`); setBusy(false) }
      }
    }, 750)
  }
  function reset() { sfx('tap'); setPhase('toss'); setCoin(null); setResult(null); setShown(null); setBalls([]); setScore(0); setFirst(0); setInn(1); setBusy(false); setMsg('Call the toss to start!') }

  const target = inn === 2 ? first + 1 : null
  const youScore = batter === 'you' ? score : inn === 2 ? first : 0
  const aiScore = batter === 'ai' ? score : inn === 2 ? first : 0

  return (
    <div className={'game hc' + (shown?.out ? ' shake' : '')}>
      <Sparks list={sp} />
      <div className="g-top">
        <h3>Hand Cricket <small>vs AI</small></h3>
        <div className="rec"><span>W {rec.w}</span><span>L {rec.l}</span><span>D {rec.d}</span><SoundToggle /></div>
      </div>

      {phase === 'toss' && (
        <div className="g-center">
          <motion.div className="coin" animate={flipping ? { rotateY: 1440 } : { rotateY: 0 }} transition={{ duration: .9, ease: 'easeInOut' }}>{coin ? (coin.res === 'heads' ? 'H' : 'T') : '?'}</motion.div>
          <p className="g-msg">{msg}</p>
          <div className="row center-row">
            <button className="pill black" disabled={flipping} onClick={() => toss('heads')}>Heads</button>
            <button className="pill white" disabled={flipping} onClick={() => toss('tails')}>Tails</button>
          </div>
        </div>
      )}

      {phase === 'choose' && (
        <div className="g-center">
          <p className="g-msg">{msg}</p>
          <p>What do you want to do first?</p>
          <div className="row center-row">
            <button className="pill black" onClick={() => begin('you')}>Bat first</button>
            <button className="pill white" onClick={() => begin('ai')}>Bowl first</button>
          </div>
        </div>
      )}

      {(phase === 'play' || phase === 'over') && (
        <>
          <div className="board">
            <div className="b-box"><small>You</small><b>{youScore}</b></div>
            <div className="b-mid"><small>Innings {inn}</small><span>{target ? `Target ${target}` : 'Setting target'}</span><span className="role">{batter === 'you' ? 'You are batting' : 'You are bowling'}</span></div>
            <div className="b-box ai"><small>AI</small><b>{aiScore}</b></div>
          </div>
          <div className="hands">
            <Hand label="You" n={shown?.you} tone="y" out={shown?.out} />
            <span className="vs">vs</span>
            <Hand label="AI" n={shown?.ai} hidden={shown && shown.ai == null} tone="a" out={shown?.out} />
          </div>
          <p className="g-msg" role="status">{shown?.out ? 'OUT!' : msg}</p>
          <div className="balls">{balls.map((b, i) => <span key={i} className={b.out ? 'w' : ''}>{b.out ? 'W' : b.runs}</span>)}</div>
          <div className="nums" aria-label="Pick a number">
            {[1, 2, 3, 4, 5, 6].map(n => <motion.button key={n} whileTap={{ scale: .88 }} whileHover={{ y: -4 }} disabled={busy || phase === 'over'} onClick={() => play(n)}>{n}</motion.button>)}
          </div>
          <AnimatePresence>
            {phase === 'over' && (
              <motion.div className="g-over" initial={{ opacity: 0, scale: .8 }} animate={{ opacity: 1, scale: 1 }}>
                <h3>{result === 'you' ? 'You win!' : result === 'ai' ? 'AI wins!' : "It's a draw!"}</h3>
                <p>{result === 'you' ? 'Childhood skills still work.' : result === 'ai' ? 'Not bad. One more try?' : 'Perfectly matched.'}</p>
                <button className="pill black" onClick={reset}>Play again</button>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  )
}

/* ---------------- BUG SQUASH ---------------- */
const Bug = ({ c }) => (
  <svg viewBox="0 0 64 64" width="100%" height="100%" aria-hidden="true">
    <g stroke="#111" strokeWidth="3" strokeLinecap="round"><path d="M14 26l-8-6M14 36H4M16 46l-8 8M50 26l8-6M50 36h10M48 46l8 8" /></g>
    <ellipse cx="32" cy="38" rx="17" ry="20" fill={c} stroke="#111" strokeWidth="3" />
    <circle cx="32" cy="16" r="9" fill="#111" /><path d="M32 22v34" stroke="#111" strokeWidth="3" />
    <circle cx="24" cy="36" r="3.5" fill="#111" /><circle cx="40" cy="36" r="3.5" fill="#111" /><circle cx="26" cy="48" r="3" fill="#111" /><circle cx="38" cy="48" r="3" fill="#111" />
  </svg>
)
const Bomb = () => (
  <svg viewBox="0 0 64 64" width="100%" height="100%" aria-hidden="true">
    <path d="M40 16c4-6 8-6 10-10" stroke="#111" strokeWidth="3.5" fill="none" strokeLinecap="round" />
    <path d="M52 2l2 6 6 2-6 2-2 6-2-6-6-2 6-2z" fill="#ffd23f" stroke="#111" strokeWidth="2" strokeLinejoin="round" />
    <rect x="28" y="12" width="14" height="9" rx="2" transform="rotate(30 35 16)" fill="#555" stroke="#111" strokeWidth="3" />
    <circle cx="30" cy="40" r="20" fill="#2b2b2b" stroke="#111" strokeWidth="3" />
    <ellipse cx="22" cy="32" rx="6" ry="4" transform="rotate(-35 22 32)" fill="#fff" opacity=".55" />
    <path d="M22 46l16 0M30 38v16" stroke="#ff4d4d" strokeWidth="3.5" strokeLinecap="round" transform="rotate(45 30 46)" />
  </svg>
)

const TIME = 30

export function BugSquash() {
  const [state, setState] = useState('idle') // idle | play | over
  const [score, setScore] = useState(0)
  const [time, setTime] = useState(TIME)
  const [items, setItems] = useState([])
  const [pops, setPops] = useState([])
  const [combo, setCombo] = useState(0)
  const [fx, setFx] = useState('')
  const [best, setBest] = useState(() => store.get('bugBest', 0))
  const [sp, addSp] = useSparks()
  const idRef = useRef(0), streak = useRef(0), fxT = useRef(0), lastSec = useRef(99)

  useEffect(() => {
    if (state !== 'play') return
    const t0 = Date.now()
    let spawnT
    const tick = setInterval(() => {
      const left = Math.max(0, TIME - (Date.now() - t0) / 1000)
      setTime(left)
      const sec = Math.ceil(left)
      if (sec <= 5 && sec > 0 && sec !== lastSec.current) sfx('tick')
      lastSec.current = sec
      setItems(it => it.filter(i => i.exp > Date.now()))
      if (left <= 0) { clearInterval(tick); clearTimeout(spawnT); setItems([]); setState('over') }
    }, 100)
    const spawn = () => {
      const el = (Date.now() - t0) / 1000
      const r = Math.random()
      const type = r < .1 ? 'gold' : r < .28 ? 'bomb' : 'bug'
      const life = Math.max(700, 1400 - el * 22)
      setItems(it => [...it.slice(-7), { id: ++idRef.current, x: 5 + Math.random() * 84, y: 6 + Math.random() * 72, type, exp: Date.now() + life }])
      spawnT = setTimeout(spawn, Math.max(300, 780 - el * 14))
    }
    spawn()
    return () => { clearInterval(tick); clearTimeout(spawnT) }
  }, [state])

  useEffect(() => {
    if (state !== 'over') return
    const nb = score > best
    if (nb) { setBest(score); store.set('bugBest', score); addSp(burst(50, 40, CONF, 46, 420, 170)) }
    sfx(nb ? 'win' : 'end')
  }, [state]) // eslint-disable-line

  function start() { sfx('start'); streak.current = 0; lastSec.current = 99; setCombo(0); setScore(0); setTime(TIME); setItems([]); setPops([]); setState('play') }
  function hit(it) {
    let d = it.type === 'bug' ? 1 : it.type === 'gold' ? 5 : -3
    setItems(a => a.filter(x => x.id !== it.id))
    if (it.type === 'bomb') {
      streak.current = 0; setCombo(0); sfx('bomb'); buzz(90)
      addSp(burst(it.x, it.y, ['#ff6b00', '#ffd23f', '#111', '#ff4d4d'], 20, 130))
      setFx('boom shake'); clearTimeout(fxT.current); fxT.current = setTimeout(() => setFx(''), 550)
    } else {
      streak.current++; setCombo(streak.current); buzz(15)
      sfx(it.type === 'gold' ? 'gold' : 'squash')
      addSp(burst(it.x, it.y, it.type === 'gold' ? ['#ffd23f', '#fff', '#ffb703'] : ['#ff4d4d', '#ffd23f', '#111'], it.type === 'gold' ? 16 : 9, it.type === 'gold' ? 100 : 60))
      if (streak.current % 5 === 0) { d += 2; setTimeout(() => sfx('combo', streak.current / 5), 110) }
    }
    setScore(s => Math.max(0, s + d))
    setPops(p => [...p, { id: it.id, x: it.x, y: it.y, t: d > 0 ? `+${d}` : `${d}`, bad: d < 0 }])
    setTimeout(() => setPops(p => p.filter(x => x.id !== it.id)), 700)
  }
  function miss(e) { if (state === 'play' && e.target === e.currentTarget) sfx('miss') }

  return (
    <div className="game bs">
      <div className="g-top">
        <h3>Bug Squash</h3>
        <div className="rec">{combo >= 3 && <span className="combo">Combo x{combo}</span>}<span>Score {score}</span><span>Best {best}</span><SoundToggle /></div>
      </div>
      <div className="timebar"><motion.i animate={{ width: (time / TIME * 100) + '%' }} transition={{ duration: .1, ease: 'linear' }} /></div>
      <div className={'arena ' + fx} onPointerDown={miss}>
        {state === 'idle' && (
          <div className="g-center over-arena">
            <p className="g-msg">Squash the red bugs. Gold bugs give +5. Don't touch the bombs, they cost you 3! Chain 5 in a row for a combo bonus.</p>
            <button className="pill black" onClick={start}>Start ({TIME}s)</button>
          </div>
        )}
        {state === 'over' && (
          <motion.div className="g-center over-arena" initial={{ opacity: 0, scale: .9 }} animate={{ opacity: 1, scale: 1 }}>
            <h3>{score >= best && score > 0 ? 'New best!' : 'Time up!'}</h3>
            <p className="g-msg">You squashed {score} points worth of bugs.</p>
            <button className="pill black" onClick={start}>Play again</button>
          </motion.div>
        )}
        <AnimatePresence>
          {items.map(it => (
            <motion.button key={it.id} className={'target ' + it.type} style={{ left: it.x + '%', top: it.y + '%' }} initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0, opacity: 0 }} whileHover={{ scale: 1.12 }} whileTap={{ scale: .8 }} onPointerDown={() => hit(it)} aria-label={it.type === 'bomb' ? 'Bomb, do not touch' : 'Bug, squash it'}>
              {it.type === 'bomb' ? <Bomb /> : <Bug c={it.type === 'gold' ? '#ffd23f' : '#ff4d4d'} />}
            </motion.button>
          ))}
        </AnimatePresence>
        <Sparks list={sp} />
        <AnimatePresence>
          {pops.map(p => <motion.span key={p.id} className={'pop' + (p.bad ? ' bad' : '')} style={{ left: p.x + '%', top: p.y + '%' }} initial={{ opacity: 1, y: 0 }} animate={{ opacity: 0, y: -40 }} exit={{ opacity: 0 }} transition={{ duration: .7 }}>{p.t}</motion.span>)}
        </AnimatePresence>
      </div>
    </div>
  )
}
