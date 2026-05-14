const STORAGE_KEY = 'portfolio-sound-enabled'

let ctx = null
function getContext() {
  if (ctx) return ctx
  if (typeof window === 'undefined') return null
  const AC = window.AudioContext || window.webkitAudioContext
  if (!AC) return null
  ctx = new AC()
  return ctx
}

export function isSoundEnabled() {
  if (typeof window === 'undefined') return false
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
  try {
    return window.localStorage.getItem(STORAGE_KEY) === 'true'
  } catch {
    return false
  }
}

export function setSoundEnabled(enabled) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, enabled ? 'true' : 'false')
  } catch {
    // ignore
  }
}

function tone({ frequency, duration = 0.08, type = 'sine', volume = 0.08, attack = 0.005, release = 0.04 }) {
  if (!isSoundEnabled()) return
  const c = getContext()
  if (!c) return
  if (c.state === 'suspended') {
    c.resume().catch(() => {})
  }

  const now = c.currentTime
  const osc = c.createOscillator()
  const gain = c.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(frequency, now)
  gain.gain.setValueAtTime(0, now)
  gain.gain.linearRampToValueAtTime(volume, now + attack)
  gain.gain.linearRampToValueAtTime(0, now + attack + duration + release)
  osc.connect(gain).connect(c.destination)
  osc.start(now)
  osc.stop(now + attack + duration + release + 0.02)
}

function sweep({ from, to, duration = 0.2, type = 'sine', volume = 0.06, attack = 0.01, release = 0.05 }) {
  if (!isSoundEnabled()) return
  const c = getContext()
  if (!c) return
  if (c.state === 'suspended') {
    c.resume().catch(() => {})
  }

  const now = c.currentTime
  const osc = c.createOscillator()
  const gain = c.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(from, now)
  osc.frequency.exponentialRampToValueAtTime(to, now + duration)
  gain.gain.setValueAtTime(0, now)
  gain.gain.linearRampToValueAtTime(volume, now + attack)
  gain.gain.linearRampToValueAtTime(volume * 0.8, now + duration)
  gain.gain.linearRampToValueAtTime(0, now + duration + release)
  osc.connect(gain).connect(c.destination)
  osc.start(now)
  osc.stop(now + duration + release + 0.02)
}

export function playClick() {
  tone({ frequency: 880, duration: 0.04, type: 'sine', volume: 0.07, attack: 0.002, release: 0.06 })
  setTimeout(() => tone({ frequency: 1320, duration: 0.03, type: 'sine', volume: 0.04, attack: 0.001, release: 0.04 }), 12)
}

export function playHover() {
  tone({ frequency: 220, duration: 0.06, type: 'triangle', volume: 0.04, attack: 0.008, release: 0.08 })
}

export function playDrawerOpen() {
  sweep({ from: 320, to: 880, duration: 0.22, type: 'sine', volume: 0.05, attack: 0.01, release: 0.08 })
  setTimeout(() => sweep({ from: 480, to: 1100, duration: 0.18, type: 'triangle', volume: 0.025, attack: 0.005, release: 0.06 }), 20)
}

export function playDrawerClose() {
  sweep({ from: 880, to: 280, duration: 0.18, type: 'sine', volume: 0.05, attack: 0.005, release: 0.06 })
}

export function playToggle() {
  tone({ frequency: 660, duration: 0.04, type: 'sine', volume: 0.06, attack: 0.002, release: 0.05 })
  setTimeout(() => tone({ frequency: 990, duration: 0.05, type: 'sine', volume: 0.05, attack: 0.002, release: 0.06 }), 70)
}

export function playSubmit() {
  // C5 → E5 → G5 success arpeggio
  tone({ frequency: 523.25, duration: 0.06, type: 'sine', volume: 0.06, attack: 0.003, release: 0.08 })
  setTimeout(() => tone({ frequency: 659.25, duration: 0.06, type: 'sine', volume: 0.06, attack: 0.003, release: 0.08 }), 90)
  setTimeout(() => tone({ frequency: 783.99, duration: 0.12, type: 'sine', volume: 0.06, attack: 0.003, release: 0.14 }), 180)
}
