import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Words, Reveal, HandIcon } from '../ui'
import { supabase } from '../supabase'
import { bookingCfg as cfg } from '../data'

const TOPICS = ['Full Stack Web Development', 'AI & Automation', 'Embedded / Arduino', 'Graphic Design', 'Just a quick chat']
const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'your time'

// Build every open slot (as UTC milliseconds) for the next few days.
function buildSlots() {
  const out = [], now = Date.now()
  for (let i = 0; i <= cfg.ahead; i++) {
    const p = new Date(now + i * 864e5 + cfg.utcOffset * 36e5) // date in Pakistan
    if (!cfg.days.includes(p.getUTCDay())) continue
    const midnight = Date.UTC(p.getUTCFullYear(), p.getUTCMonth(), p.getUTCDate()) - cfg.utcOffset * 36e5
    for (let m = cfg.from * 60; m + cfg.slotMins <= cfg.to * 60; m += cfg.slotMins) {
      const t = midnight + m * 6e4
      if (t > now + cfg.minNoticeHrs * 36e5) out.push(t)
    }
  }
  return out
}

const dayKey = t => new Date(t).toLocaleDateString('en-CA')
const dayLabel = t => new Date(t).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' })
const timeLabel = t => new Date(t).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })
const pktLabel = t => new Date(t).toLocaleString('en-GB', { timeZone: 'Asia/Karachi', weekday: 'short', day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })

function downloadIcs(slot) {
  const f = d => new Date(d).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
  const text = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Toufeeq Shaikh//Booking//EN', 'BEGIN:VEVENT', `UID:${slot}@toufeeq-portfolio`, `DTSTAMP:${f(Date.now())}`, `DTSTART:${f(slot)}`, `DTEND:${f(slot + cfg.slotMins * 6e4)}`, 'SUMMARY:Call with Toufeeq Shaikh', 'END:VEVENT', 'END:VCALENDAR'].join('\r\n')
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([text], { type: 'text/calendar' }))
  a.download = 'call-with-toufeeq.ics'
  a.click()
  setTimeout(() => URL.revokeObjectURL(a.href), 1000)
}

function Booking() {
  const slots = useMemo(buildSlots, [])
  const days = useMemo(() => {
    const m = new Map()
    slots.forEach(t => { const k = dayKey(t); if (!m.has(k)) m.set(k, []); m.get(k).push(t) })
    return [...m.entries()]
  }, [slots])
  const [taken, setTaken] = useState(new Set())
  const [nonce, setNonce] = useState(0)
  const [day, setDay] = useState(days[0]?.[0])
  const [slot, setSlot] = useState(null)
  const [f, setF] = useState({ name: '', email: '', topic: TOPICS[0], note: '' })
  const [s, setS] = useState('idle')
  const [done, setDone] = useState(null)
  const on = k => e => setF({ ...f, [k]: e.target.value })

  useEffect(() => {
    if (!supabase) return
    supabase.rpc('booked_slots').then(({ data, error }) => {
      if (!error && data) setTaken(new Set(data.map(r => new Date(r.slot_start).getTime())))
    })
  }, [nonce])

  async function submit(e) {
    e.preventDefault()
    if (!supabase) { setS('noconfig'); return }
    setS('sending')
    const { error } = await supabase.from('bookings').insert({ ...f, slot_start: new Date(slot).toISOString(), visitor_tz: tz })
    if (!error) { setDone(slot); setS('idle'); setNonce(n => n + 1); return }
    if (error.code === '23505') { setS('taken'); setSlot(null); setNonce(n => n + 1) } else setS('error')
  }

  if (done) return (
    <motion.div className="done-card" initial={{ scale: .9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
      <h3>You're booked in (almost)!</h3>
      <p className="when">{dayLabel(done)} · {timeLabel(done)} <small>({tz})</small></p>
      <p>That is {pktLabel(done)} in Pakistan. I'll check your request and confirm by email soon.</p>
      <div className="row">
        <button className="pill black" onClick={() => downloadIcs(done)}>Add to calendar</button>
        <button className="pill white" onClick={() => { setDone(null); setSlot(null); setF({ name: '', email: '', topic: TOPICS[0], note: '' }) }}>Book another</button>
      </div>
    </motion.div>
  )

  const list = (days.find(([k]) => k === day) || [, []])[1]
  return (
    <div className="booking">
      <div className="b-step">
        <h3>1. Pick a day</h3>
        <div className="dates">
          {days.map(([k, ts]) => (
            <button key={k} className={'chip' + (k === day ? ' on' : '')} onClick={() => { setDay(k); setSlot(null) }}>{dayLabel(ts[0])}</button>
          ))}
        </div>
        <h3>2. Pick a time <small>({tz})</small></h3>
        <div className="slots">
          {list.map(t => {
            const off = taken.has(t)
            return <button key={t} disabled={off} className={'slot' + (slot === t ? ' on' : '') + (off ? ' off' : '')} onClick={() => setSlot(t)}>{timeLabel(t)}</button>
          })}
        </div>
        <p className="hint">{cfg.slotMins}-minute call · open {cfg.days.length} days a week · crossed-out times are already booked</p>
      </div>

      <AnimatePresence>
        {slot && (
          <motion.form className="b-step b-form" onSubmit={submit} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <h3>3. Your details</h3>
            <p className="when">{dayLabel(slot)} · {timeLabel(slot)}</p>
            <div className="two">
              <label>Name<input required value={f.name} onChange={on('name')} placeholder="John Smith" /></label>
              <label>Email<input required type="email" value={f.email} onChange={on('email')} placeholder="johnsmith@gmail.com" /></label>
            </div>
            <label>What is it about?
              <select value={f.topic} onChange={on('topic')}>{TOPICS.map(x => <option key={x}>{x}</option>)}</select>
            </label>
            <label>Anything I should know? (optional)<textarea rows="3" value={f.note} onChange={on('note')} placeholder="A short note about your idea…" /></label>
            <button className="pill black" disabled={s === 'sending'}>{s === 'sending' ? 'Booking…' : 'Confirm booking'}</button>
            <p className="status" role="status">
              {s === 'error' && 'Could not book. Please email me directly.'}
              {s === 'noconfig' && 'Booking is not connected yet. Please email me directly.'}
            </p>
          </motion.form>
        )}
      </AnimatePresence>
      {s === 'taken' && !slot && <p className="status warn" role="status">Sorry, someone just took that time. Please pick another one.</p>}
    </div>
  )
}

function MessageForm() {
  const [f, setF] = useState({ name: '', email: '', service: '', message: '' })
  const [s, setS] = useState('idle')
  const on = k => e => setF({ ...f, [k]: e.target.value })
  async function send(e) {
    e.preventDefault(); setS('sending')
    if (!supabase) { setS('noconfig'); return }
    const { error } = await supabase.from('messages').insert(f)
    setS(error ? 'error' : 'done')
    if (!error) setF({ name: '', email: '', service: '', message: '' })
  }
  return (
    <form className="b-step b-form" onSubmit={send}>
      <div className="two">
        <label>Name<input required value={f.name} onChange={on('name')} placeholder="John Smith" /></label>
        <label>Email<input required type="email" value={f.email} onChange={on('email')} placeholder="johnsmith@gmail.com" /></label>
      </div>
      <label>Service needed?
        <select required value={f.service} onChange={on('service')}>
          <option value="">Select…</option>
          {TOPICS.slice(0, 4).map(x => <option key={x}>{x}</option>)}
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
  )
}

export default function Book() {
  const [tab, setTab] = useState('call')
  return (
    <section className="sec page-head book">
      <div className="book-top">
        <div>
          <Words as="h1" className="page-title" text="Let's talk" />
          <Reveal><p className="lead">Pick a time for a free call, or just send me a message. Either way, I read everything.</p></Reveal>
        </div>
        <div className="cav small"><img src="/avatar.webp" alt="" width="720" height="720" decoding="async" /><motion.div className="hi" animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 2.4 }}><HandIcon /></motion.div></div>
      </div>
      <div className="tabs" role="tablist">
        <button role="tab" aria-selected={tab === 'call'} className={'pill' + (tab === 'call' ? ' black' : ' white')} onClick={() => setTab('call')}>Book a call</button>
        <button role="tab" aria-selected={tab === 'msg'} className={'pill' + (tab === 'msg' ? ' black' : ' white')} onClick={() => setTab('msg')}>Send a message</button>
      </div>
      {tab === 'call' ? <Booking /> : <MessageForm />}
    </section>
  )
}
