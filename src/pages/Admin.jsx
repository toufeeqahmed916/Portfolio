import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '../supabase'
import { clearProjects } from '../useProjects'

const EMPTY = { title: '', tag: '', problem: '', what: '', live_url: '', code_url: '', img: '', color: '#6bf01f', sort_order: 0 }
const COLORS = [['Green', '#6bf01f'], ['Yellow', '#ffd23f'], ['Blue', '#3b7bff'], ['Black', '#111111'], ['White', '#ffffff']]
const isUrl = v => !v || /^https?:\/\/\S+$/i.test(v)
// Same rules as the CHECK constraints in schema.sql (the database enforces them again)
function check(f) {
  if (f.title.trim().length < 2 || f.title.length > 80) return 'Title must be 2 to 80 characters.'
  if (f.tag.length > 40) return 'Tag can be at most 40 characters.'
  if (f.what.trim().length < 10 || f.what.length > 600) return 'Description must be 10 to 600 characters.'
  if (f.problem.length > 400) return 'Problem can be at most 400 characters.'
  if (!isUrl(f.live_url.trim()) || !isUrl(f.code_url.trim())) return 'Links must start with http:// or https://'
  if (f.img.trim() && !/^(\/|https?:\/\/)\S+$/i.test(f.img.trim())) return 'Image must start with / (a file in public) or https://'
  return ''
}

const fmt = iso => new Date(iso).toLocaleString('en-GB', { timeZone: 'Asia/Karachi', weekday: 'short', day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })

const VIEWS = [['projects', 'Projects'], ['bookings', 'Bookings'], ['messages', 'Messages']]

function ViewMenu({ view, setView, counts }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    if (!open) return
    const out = e => { if (!ref.current?.contains(e.target)) setOpen(false) }
    const esc = e => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('pointerdown', out); document.addEventListener('keydown', esc)
    return () => { document.removeEventListener('pointerdown', out); document.removeEventListener('keydown', esc) }
  }, [open])
  return (
    <div className="vmenu" ref={ref}>
      <button className="pill black" aria-haspopup="listbox" aria-expanded={open} onClick={() => setOpen(!open)}>{VIEWS.find(v => v[0] === view)[1]} ▾</button>
      {open && (
        <ul className="vmenu-list" role="listbox">
          {VIEWS.map(([k, l]) => (
            <li key={k}><button role="option" aria-selected={k === view} className={k === view ? 'on' : ''} onClick={() => { setView(k); setOpen(false) }}><span>{l}</span><b>{counts[k]}</b></button></li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default function Admin() {
  const [view, setView] = useState('projects')
  const [session, setSession] = useState(null)
  const [ready, setReady] = useState(false)
  const [bookings, setBookings] = useState([])
  const [messages, setMessages] = useState([])
  const [projects, setProjects] = useState([])
  const [pf, setPf] = useState(EMPTY)
  const [editId, setEditId] = useState(null)
  const [pmsg, setPmsg] = useState('')
  const [err, setErr] = useState('')
  const [login, setLogin] = useState({ email: '', password: '' })

  useEffect(() => {
    let meta = document.querySelector('meta[name="robots"]')
    if (!meta) { meta = document.createElement('meta'); meta.name = 'robots'; document.head.appendChild(meta) }
    meta.content = 'noindex'
    if (!supabase) { setReady(true); return }
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setReady(true) })
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => { sub.subscription.unsubscribe(); meta.content = 'index,follow' }
  }, [])

  const load = useCallback(async () => {
    if (!supabase || !session) return
    const b = await supabase.from('bookings').select('*').order('slot_start', { ascending: true })
    const m = await supabase.from('messages').select('*').order('created_at', { ascending: false }).limit(50)
    const p = await supabase.from('projects').select('*').order('sort_order').order('id')
    const bad = b.error || m.error || p.error
    if (bad) setErr(bad.message); else setErr('')
    setBookings(b.data || []); setMessages(m.data || []); setProjects(p.data || [])
  }, [session])
  useEffect(() => { load() }, [load])

  async function signIn(e) {
    e.preventDefault(); setErr('')
    const { error } = await supabase.auth.signInWithPassword(login)
    if (error) setErr(error.message)
  }
  async function saveProject(e) {
    e.preventDefault()
    const bad = check(pf)
    if (bad) { setPmsg(bad); return }
    const row = { title: pf.title.trim(), tag: pf.tag.trim(), problem: pf.problem.trim() || null, what: pf.what.trim(), live_url: pf.live_url.trim() || null, code_url: pf.code_url.trim() || null, img: pf.img.trim() || null, color: pf.color, sort_order: Number(pf.sort_order) || 0 }
    const { error } = editId ? await supabase.from('projects').update(row).eq('id', editId) : await supabase.from('projects').insert(row)
    if (error) { setPmsg(error.message); return }
    setPmsg(editId ? 'Project updated.' : 'Project added.'); setPf(EMPTY); setEditId(null); clearProjects(); load()
  }
  function editProject(p) {
    setEditId(p.id); setPmsg('')
    setPf({ title: p.title, tag: p.tag || '', problem: p.problem || '', what: p.what, live_url: p.live_url || '', code_url: p.code_url || '', img: p.img || '', color: p.color, sort_order: p.sort_order })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  async function delProject(p) {
    if (!window.confirm(`Delete "${p.title}"? This cannot be undone.`)) return
    const { error } = await supabase.from('projects').delete().eq('id', p.id)
    if (error) { setPmsg(error.message); return }
    setPmsg('Project deleted.'); if (editId === p.id) { setEditId(null); setPf(EMPTY) } clearProjects(); load()
  }
  async function setStatus(id, status) {
    const { error } = await supabase.from('bookings').update({ status }).eq('id', id)
    if (error) setErr(error.message); else load()
  }

  if (!ready) return <section className="sec page-head"><p>Loading…</p></section>
  if (!supabase) return <section className="login-page"><h1 className="page-title">Admin</h1><p className="lead">Supabase is not connected. Add the keys to your .env file.</p></section>
  if (!session) return (
    <section className="login-page">
      <h1 className="page-title">Admin</h1>
      <p className="hint">Sign in to manage projects, bookings and messages.</p>
      <form className="b-step b-form login-card" onSubmit={signIn}>
        <label>Email<input required type="email" value={login.email} onChange={e => setLogin({ ...login, email: e.target.value })} /></label>
        <label>Password<input required type="password" value={login.password} onChange={e => setLogin({ ...login, password: e.target.value })} /></label>
        <button className="pill black">Sign in</button>
        <p className="status warn">{err}</p>
      </form>
    </section>
  )
  return (
    <section className="sec page-head admin">
      <div className="admin-bar">
        <h1 className="page-title">Admin</h1>
        <div className="admin-tools">
          <ViewMenu view={view} setView={setView} counts={{ projects: projects.length, bookings: bookings.length, messages: messages.length }} />
          <button className="pill white" onClick={() => supabase.auth.signOut()}>Sign out</button>
        </div>
      </div>
      {err && <p className="status warn">{err}</p>}
      {view === 'projects' && <>
      <h3 className="sub first">Projects</h3>
      <form className="b-step b-form" onSubmit={saveProject} noValidate>
        <h3>{editId ? 'Edit project' : 'Add a project'}</h3>
        <div className="two">
          <label>Title *<input value={pf.title} maxLength={80} onChange={e => setPf({ ...pf, title: e.target.value })} /></label>
          <label>Tag<input value={pf.tag} maxLength={40} placeholder="AI + Maps" onChange={e => setPf({ ...pf, tag: e.target.value })} /></label>
        </div>
        <label>What it does *<textarea rows="3" value={pf.what} maxLength={600} onChange={e => setPf({ ...pf, what: e.target.value })} /></label>
        <label>The problem (optional)<textarea rows="2" value={pf.problem} maxLength={400} onChange={e => setPf({ ...pf, problem: e.target.value })} /></label>
        <div className="two">
          <label>Live link<input value={pf.live_url} placeholder="https://…" onChange={e => setPf({ ...pf, live_url: e.target.value })} /></label>
          <label>GitHub link<input value={pf.code_url} placeholder="https://github.com/…" onChange={e => setPf({ ...pf, code_url: e.target.value })} /></label>
        </div>
        <div className="two">
          <label>Image (file in /public like /karwan.jpg, or https link)<input value={pf.img} onChange={e => setPf({ ...pf, img: e.target.value })} /></label>
          <label>Card color<select value={pf.color} onChange={e => setPf({ ...pf, color: e.target.value })}>{COLORS.map(([n, v]) => <option key={v} value={v}>{n}</option>)}</select></label>
        </div>
        <label>Order (smaller shows first)<input type="number" value={pf.sort_order} onChange={e => setPf({ ...pf, sort_order: e.target.value })} /></label>
        <div className="row">
          <button className="pill black">{editId ? 'Save changes' : 'Add project'}</button>
          {editId && <button type="button" className="pill white" onClick={() => { setEditId(null); setPf(EMPTY); setPmsg('') }}>Cancel</button>}
        </div>
        <p className={'status' + (/added|updated|deleted/.test(pmsg) ? '' : ' warn')} role="status">{pmsg}</p>
      </form>
      {projects.length === 0 && <p>No projects yet.</p>}
      <div className="a-list">
        {projects.map(p => (
          <div className="a-item" key={p.id}>
            <div><b>{p.title}</b><span className="st">{p.tag || 'no tag'}</span></div>
            <p>{p.what}</p>
            <div className="row">
              <button className="pill black" onClick={() => editProject(p)}>Edit</button>
              <button className="pill white" onClick={() => delProject(p)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
      </>}
      {view === 'bookings' && <>
      <h3 className="sub first">Bookings <small>(Pakistan time)</small></h3>
      {bookings.length === 0 && <p>No bookings yet.</p>}
      <div className="a-list">
        {bookings.map(b => (
          <div className={'a-item ' + b.status} key={b.id}>
            <div><b>{fmt(b.slot_start)}</b><span className="st">{b.status}</span></div>
            <p>{b.name} · <a href={`mailto:${b.email}`}>{b.email}</a></p>
            <p><em>{b.topic}</em>{b.note ? ` — ${b.note}` : ''}</p>
            <small>Visitor timezone: {b.visitor_tz}</small>
            <div className="row">
              <button className="pill black" onClick={() => setStatus(b.id, 'confirmed')}>Confirm</button>
              <button className="pill white" onClick={() => setStatus(b.id, 'declined')}>Decline</button>
            </div>
          </div>
        ))}
      </div>
      </>}
      {view === 'messages' && <>
      <h3 className="sub first">Messages</h3>
      {messages.length === 0 && <p>No messages yet.</p>}
      <div className="a-list">
        {messages.map(m => (
          <div className="a-item" key={m.id}>
            <div><b>{m.name}</b> <a href={`mailto:${m.email}`}>{m.email}</a></div>
            <p><em>{m.service}</em></p><p>{m.message}</p>
            <small>{new Date(m.created_at).toLocaleString()}</small>
          </div>
        ))}
      </div>
      </>}
    </section>
  )
}
