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

export function playTick() {
  tone({ frequency: 1320, duration: 0.025, type: 'sine', volume: 0.045, attack: 0.001, release: 0.04 })
}

// ─── Outer Wilds-flavored scroll-layered soundtrack ─────────────────────────
// Six General MIDI-sampled instruments (royalty-free FluidR3 soundfont) play
// an original C minor arrangement. Each layer is gated by total scroll
// progress and fades in/out symmetrically when its threshold is crossed.
//
//   0%   piano        sustained Cm → Abmaj7-ish chord (base)
//   17%  banjo        descending arpeggio at 60 BPM
//   33%  harmonica    sustained pad an octave up
//   50%  flute        slow melody
//   67%  whistle      sparse high response
//   83%  drums        gentle pulse on beats 1 and 3

import Soundfont from 'soundfont-player'

const BEAT = 1.2 // 50 BPM — slow, contemplative
const LOOKAHEAD = 0.1
const TICK_MS = 50
const FADE_OUT = 2

const INSTRUMENT_GM = {
  piano: 'acoustic_grand_piano',
  banjo: 'banjo',
  harmonica: 'harmonica',
  flute: 'flute',
  whistle: 'whistle',
  drums: 'synth_drum',
}

const THRESHOLDS = {
  piano: 0,
  banjo: 0.17,
  harmonica: 0.33,
  flute: 0.5,
  whistle: 0.67,
  drums: 0.83,
}

const MASTER_LEVEL = {
  piano: 0.45,
  banjo: 0.35,
  harmonica: 0.3,
  flute: 0.4,
  whistle: 0.4,
  drums: 0.25,
}

const FADE_IN = {
  piano: 3,
  banjo: 2,
  harmonica: 2.5,
  flute: 2,
  whistle: 2,
  drums: 2,
}

// 32-beat loop (~38s at 50 BPM). Chord progression i-VI-III-VII in C minor:
// Cm (beats 0-7) → Ab (8-15) → Eb (16-23) → Bb (24-31) → back to Cm.
const SCORES = {
  piano: {
    loopBeats: 32,
    events: [
      // Cm triad
      { beat: 0, note: 'C3', duration: 7.5 },
      { beat: 0, note: 'Eb3', duration: 7.5 },
      { beat: 0, note: 'G3', duration: 7.5 },
      // Ab triad
      { beat: 8, note: 'Ab2', duration: 7.5 },
      { beat: 8, note: 'C3', duration: 7.5 },
      { beat: 8, note: 'Eb3', duration: 7.5 },
      // Eb triad
      { beat: 16, note: 'Eb3', duration: 7.5 },
      { beat: 16, note: 'G3', duration: 7.5 },
      { beat: 16, note: 'Bb3', duration: 7.5 },
      // Bb triad
      { beat: 24, note: 'Bb2', duration: 7.5 },
      { beat: 24, note: 'D3', duration: 7.5 },
      { beat: 24, note: 'F3', duration: 7.5 },
    ],
  },
  banjo: {
    // Slow root-fifth-third-fifth pattern per chord (every 2 beats)
    loopBeats: 32,
    events: [
      { beat: 0, note: 'C3', duration: 0.6 },
      { beat: 2, note: 'G3', duration: 0.6 },
      { beat: 4, note: 'Eb3', duration: 0.6 },
      { beat: 6, note: 'G3', duration: 0.6 },
      { beat: 8, note: 'Ab2', duration: 0.6 },
      { beat: 10, note: 'Eb3', duration: 0.6 },
      { beat: 12, note: 'C3', duration: 0.6 },
      { beat: 14, note: 'Eb3', duration: 0.6 },
      { beat: 16, note: 'Eb3', duration: 0.6 },
      { beat: 18, note: 'Bb3', duration: 0.6 },
      { beat: 20, note: 'G3', duration: 0.6 },
      { beat: 22, note: 'Bb3', duration: 0.6 },
      { beat: 24, note: 'Bb2', duration: 0.6 },
      { beat: 26, note: 'F3', duration: 0.6 },
      { beat: 28, note: 'D3', duration: 0.6 },
      { beat: 30, note: 'F3', duration: 0.6 },
    ],
  },
  harmonica: {
    // One long sustained note per chord, hitting the 5th or 3rd
    loopBeats: 32,
    events: [
      { beat: 0, note: 'G4', duration: 7.5 },   // 5th of Cm
      { beat: 8, note: 'C5', duration: 7.5 },   // 3rd of Ab
      { beat: 16, note: 'Bb4', duration: 7.5 }, // 5th of Eb
      { beat: 24, note: 'D5', duration: 7.5 },  // 3rd of Bb
    ],
  },
  flute: {
    // Simple stepwise melody, one phrase per chord
    loopBeats: 32,
    events: [
      { beat: 0, note: 'G5', duration: 2 },
      { beat: 3, note: 'Eb5', duration: 1.5 },
      { beat: 5, note: 'F5', duration: 2.5 },
      { beat: 8, note: 'Eb5', duration: 3 },
      { beat: 12, note: 'C5', duration: 3.5 },
      { beat: 16, note: 'Bb5', duration: 2 },
      { beat: 19, note: 'G5', duration: 2 },
      { beat: 22, note: 'F5', duration: 1.5 },
      { beat: 24, note: 'F5', duration: 2 },
      { beat: 27, note: 'D5', duration: 1.5 },
      { beat: 29, note: 'Eb5', duration: 2.5 }, // resolves back to Cm
    ],
  },
  whistle: {
    // Counter-melody above the flute, very sparse
    loopBeats: 32,
    events: [
      { beat: 11, note: 'C6', duration: 1.5 },
      { beat: 26, note: 'Bb5', duration: 2 },
    ],
  },
  drums: {
    // Atmospheric pulse — once per chord change, very soft
    loopBeats: 32,
    events: [
      { beat: 0, note: 'C3', duration: 0.3 },
      { beat: 8, note: 'C3', duration: 0.3 },
      { beat: 16, note: 'C3', duration: 0.3 },
      { beat: 24, note: 'C3', duration: 0.3 },
    ],
  },
}

const instrumentCache = {}
const masters = {}
const activeLayers = {}
const requestTokens = {}
let musicActive = false
let lastProgress = 0
let globalStartTime = null

function ensureMaster(name) {
  if (masters[name]) return masters[name]
  const c = getContext()
  if (!c) return null
  const g = c.createGain()
  g.gain.value = 0
  g.connect(c.destination)
  masters[name] = g
  return g
}

function loadInstrument(name) {
  if (instrumentCache[name]) return instrumentCache[name]
  const c = getContext()
  if (!c) return Promise.reject(new Error('no audio context'))
  const master = ensureMaster(name)
  instrumentCache[name] = Soundfont.instrument(c, INSTRUMENT_GM[name], {
    destination: master,
    format: 'ogg',
  })
  return instrumentCache[name]
}

function computeEventTime(score, index) {
  const loop = Math.floor(index / score.events.length)
  const ev = score.events[index % score.events.length]
  return (loop * score.loopBeats + ev.beat) * BEAT
}

async function startLayer(name) {
  if (!isSoundEnabled() || activeLayers[name]) return
  const c = getContext()
  if (!c) return
  if (c.state === 'suspended') c.resume().catch(() => {})

  const token = (requestTokens[name] = (requestTokens[name] ?? 0) + 1)
  activeLayers[name] = { loading: true, token }

  let player
  try {
    player = await loadInstrument(name)
  } catch {
    delete activeLayers[name]
    return
  }

  if (requestTokens[name] !== token) return
  if (!activeLayers[name]?.loading) return

  const master = masters[name]
  const now = c.currentTime
  master.gain.cancelScheduledValues(now)
  master.gain.setValueAtTime(master.gain.value, now)
  master.gain.linearRampToValueAtTime(MASTER_LEVEL[name], now + FADE_IN[name])

  if (globalStartTime === null) globalStartTime = c.currentTime
  const startTime = globalStartTime
  const score = SCORES[name]
  let nextEvIndex = 0

  // Skip past events so we start in-phase with the rest of the score
  for (let safety = 0; safety < 100000; safety++) {
    const t = startTime + computeEventTime(score, nextEvIndex)
    if (t >= c.currentTime - 0.05) break
    nextEvIndex++
  }

  const tick = () => {
    if (!activeLayers[name] || activeLayers[name].token !== token) return
    const horizon = c.currentTime + LOOKAHEAD
    while (true) {
      const t = startTime + computeEventTime(score, nextEvIndex)
      if (t > horizon) break
      if (t >= c.currentTime - 0.05) {
        const ev = score.events[nextEvIndex % score.events.length]
        try {
          player.play(ev.note, t, { duration: ev.duration ?? 1 })
        } catch {
          // ignore failed note
        }
      }
      nextEvIndex++
    }
  }

  tick()
  const scheduler = setInterval(tick, TICK_MS)
  activeLayers[name] = { scheduler, token, player }
}

function stopLayer(name) {
  const layer = activeLayers[name]
  if (!layer) return
  if (layer.scheduler) clearInterval(layer.scheduler)
  requestTokens[name] = (requestTokens[name] ?? 0) + 1
  const master = masters[name]
  const c = getContext()
  if (master && c) {
    const now = c.currentTime
    master.gain.cancelScheduledValues(now)
    master.gain.setValueAtTime(master.gain.value, now)
    master.gain.linearRampToValueAtTime(0, now + FADE_OUT)
  }
  delete activeLayers[name]
}

export function setMusicProgress(progress) {
  lastProgress = Math.min(1, Math.max(0, progress))
  if (!musicActive || !isSoundEnabled()) return
  apply()
}

export function setMusicActive(active) {
  musicActive = active
  if (!active) {
    Object.keys(INSTRUMENT_GM).forEach((name) => stopLayer(name))
    globalStartTime = null
    return
  }
  apply()
}

function apply() {
  if (!isSoundEnabled()) {
    Object.keys(INSTRUMENT_GM).forEach((name) => stopLayer(name))
    globalStartTime = null
    return
  }
  for (const [name, threshold] of Object.entries(THRESHOLDS)) {
    if (lastProgress >= threshold) {
      if (!activeLayers[name]) startLayer(name)
    } else if (activeLayers[name]) {
      stopLayer(name)
    }
  }
}
