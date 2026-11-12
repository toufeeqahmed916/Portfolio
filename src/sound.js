import { useSyncExternalStore } from 'react'

// Tiny synthesized sound effects (Web Audio). No audio files needed.
let ctx, master, noiseBuf
let muted = (() => { try { return localStorage.getItem('sfxMuted') === '1' } catch { return false } })()
const subs = new Set()

function ac() {
  if (!ctx) {
    const A = window.AudioContext || window.webkitAudioContext
    if (!A) return null
    ctx = new A(); master = ctx.createGain(); master.gain.value = .55; master.connect(ctx.destination)
    noiseBuf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate)
    const d = noiseBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1
  }
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

function tone(f, d = .12, { type = 'sine', v = .3, t = 0, to } = {}) {
  const c = ac(); if (!c) return
  const t0 = c.currentTime + t, o = c.createOscillator(), g = c.createGain()
  o.type = type; o.frequency.setValueAtTime(f, t0)
  if (to) o.frequency.exponentialRampToValueAtTime(to, t0 + d)
  g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(v, t0 + .01); g.gain.exponentialRampToValueAtTime(.0001, t0 + d)
  o.connect(g); g.connect(master); o.start(t0); o.stop(t0 + d + .02)
}

function noise(d = .2, { v = .3, t = 0, type = 'lowpass', f = 1200, to } = {}) {
  const c = ac(); if (!c) return
  const t0 = c.currentTime + t, s = c.createBufferSource(), fl = c.createBiquadFilter(), g = c.createGain()
  s.buffer = noiseBuf; fl.type = type; fl.frequency.setValueAtTime(f, t0)
  if (to) fl.frequency.exponentialRampToValueAtTime(to, t0 + d)
  g.gain.setValueAtTime(v, t0); g.gain.exponentialRampToValueAtTime(.0001, t0 + d)
  s.connect(fl); fl.connect(g); g.connect(master); s.start(t0); s.stop(t0 + d + .02)
}

const arp = (notes, step = .09, o = {}) => notes.forEach((n, i) => tone(n, .18, { t: i * step, ...o }))

const S = {
  tap: () => tone(540, .07, { type: 'triangle' }),
  pop: () => tone(300, .09, { type: 'sine', to: 700, v: .25 }),
  pick: n => tone(260 + (n || 1) * 60, .1, { type: 'triangle' }),
  toss: () => { tone(300, .8, { type: 'triangle', to: 1100, v: .18 }); [0, .16, .32, .48, .64].forEach(t => tone(1600, .04, { t, v: .1, type: 'square' })) },
  coin: () => { tone(1318, .25, { v: .25 }); tone(1760, .5, { t: .08, v: .22 }) },
  run: r => { tone(440 + r * 70, .12, { type: 'triangle' }); tone(660 + r * 70, .16, { type: 'triangle', t: .07 }) },
  six: () => { arp([523, 659, 784, 1046, 1318], .07, { type: 'square', v: .16 }); noise(.5, { type: 'highpass', f: 800, to: 4000, v: .15 }) },
  out: () => { tone(420, .45, { type: 'sawtooth', to: 70, v: .25 }); noise(.25, { v: .25, f: 900 }) },
  squash: () => { noise(.09, { type: 'highpass', f: 1500, v: .3 }); tone(330, .12, { type: 'square', to: 70, v: .22 }) },
  gold: () => arp([880, 1175, 1568, 2093], .05, { v: .22 }),
  bomb: () => { noise(.7, { v: .6, f: 1400, to: 90 }); tone(120, .6, { to: 28, v: .6 }); tone(60, .4, { type: 'square', to: 25, v: .25 }) },
  combo: n => arp([660, 880, 1100, 1320].slice(0, 2 + Math.min(2, n || 1)), .06, { type: 'triangle', v: .22 }),
  tick: () => tone(980, .05, { type: 'square', v: .1 }),
  miss: () => tone(200, .1, { to: 120, v: .12 }),
  start: () => arp([392, 523, 659, 784], .08, { type: 'square', v: .14 }),
  win: () => arp([523, 659, 784, 1046, 784, 1046, 1318], .1, { type: 'square', v: .16 }),
  lose: () => arp([392, 349, 311, 262], .16, { type: 'sawtooth', v: .15 }),
  end: () => arp([523, 440, 392], .13, { type: 'triangle', v: .2 }),
}

export const sfx = (name, arg) => { if (!muted && S[name]) { try { S[name](arg) } catch { /* audio not available */ } } }
export const buzz = ms => { if (!muted) try { navigator.vibrate?.(ms) } catch { /* ignore */ } }
export function toggleMute() {
  muted = !muted
  try { localStorage.setItem('sfxMuted', muted ? '1' : '0') } catch { /* ignore */ }
  subs.forEach(f => f())
  if (!muted) sfx('pop')
}
export const useMuted = () => useSyncExternalStore(f => { subs.add(f); return () => subs.delete(f) }, () => muted)
