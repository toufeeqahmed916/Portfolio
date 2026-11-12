import { useState, useEffect } from 'react'

// Tiny router: no extra package needed. Uses the browser History API.
export const clean = p => (p.length > 1 ? p.replace(/\/+$/, '') : p) || '/'

export function navigate(to) {
  if (clean(to) === clean(window.location.pathname)) { window.scrollTo({ top: 0, behavior: 'smooth' }); return }
  window.history.pushState({}, '', to)
  window.dispatchEvent(new Event('app:nav'))
}

export function usePath() {
  const [p, setP] = useState(clean(window.location.pathname))
  useEffect(() => {
    const f = () => setP(clean(window.location.pathname))
    window.addEventListener('popstate', f)
    window.addEventListener('app:nav', f)
    return () => { window.removeEventListener('popstate', f); window.removeEventListener('app:nav', f) }
  }, [])
  return p
}

export function Link({ to, children, onClick, ...rest }) {
  const click = e => {
    if (onClick) onClick(e)
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    e.preventDefault()
    navigate(to)
  }
  return <a href={to} onClick={click} {...rest}>{children}</a>
}
