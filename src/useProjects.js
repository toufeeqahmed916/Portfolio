import { useState, useEffect } from 'react'
import { projects as fallback } from './data'

// DB row -> the shape ProjectCard expects. Dark backgrounds get white text.
const DARK = ['#3b7bff', '#111111']
const toCard = r => ({ tag: r.tag, title: r.title, color: r.color, ink: DARK.includes(r.color.toLowerCase()) ? '#fff' : '#111', img: r.img || null, problem: r.problem || '', what: r.what, live: r.live_url || '', code: r.code_url || '' })

// Speed: show the last known list (localStorage) or data.js INSTANTLY, then refresh from Supabase in the background.
// Supabase itself is loaded lazily, so it no longer blocks the first paint.
const LS = 'projects:v1'
let cache = null, fetched = false
const subs = new Set()
const readLS = () => { try { const j = localStorage.getItem(LS); return j ? JSON.parse(j) : null } catch { return null } }

export const clearProjects = () => { cache = null; fetched = false; try { localStorage.removeItem(LS) } catch {} }

function refresh() {
  if (fetched) return
  fetched = true
  import('./supabase').then(({ supabase }) => {
    if (!supabase) return
    return supabase.from('projects').select('*').order('sort_order').order('id').then(({ data, error }) => {
      if (error || !data) { fetched = false; return }
      cache = data.map(toCard)
      try { localStorage.setItem(LS, JSON.stringify(cache)) } catch {}
      subs.forEach(f => f(cache))
    })
  }).catch(() => { fetched = false })
}

export function useProjects() {
  const [list, setList] = useState(() => cache || readLS() || fallback)
  useEffect(() => {
    subs.add(setList)
    refresh()
    return () => { subs.delete(setList) }
  }, [])
  return list
}
