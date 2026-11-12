import { useState, useEffect } from 'react'
import { supabase } from './supabase'
import { projects as fallback } from './data'

// DB row -> the shape ProjectCard expects. Dark backgrounds get white text.
const DARK = ['#3b7bff', '#111111']
const toCard = r => ({ tag: r.tag, title: r.title, color: r.color, ink: DARK.includes(r.color.toLowerCase()) ? '#fff' : '#111', img: r.img || null, problem: r.problem || '', what: r.what, live: r.live_url || '', code: r.code_url || '' })

let cache = null
export const clearProjects = () => { cache = null }

// Returns null while loading. Falls back to data.js only if Supabase is missing or errors.
export function useProjects() {
  const [list, setList] = useState(() => cache || (supabase ? null : fallback))
  useEffect(() => {
    if (cache || !supabase) return
    let on = true
    supabase.from('projects').select('*').order('sort_order').order('id').then(({ data, error }) => {
      if (!on) return
      if (error) { setList(fallback); return }
      cache = data.map(toCard); setList(cache)
    })
    return () => { on = false }
  }, [])
  return list
}
