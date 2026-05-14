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

// ─── Outer Wilds-flavored layered soundtrack ────────────────────────────────
// Four layers in C minor, gated by scroll progress:
//   0%   drone   sustained C2/G2/Eb3/C4 chord with LFO breathing
//   25%  plucks  triangle arpeggio (banjo-ish), 60 BPM
//   50%  breath  detuned-triangle chord pad an octave up (harmonica-ish)
//   75%  bells   sparse sine + 2x harmonic melody (flute/glock-ish)
// setMusicProgress(0..1) toggles layers in/out symmetrically.

const layers = { drone: null, plucks: null, breath: null, bells: null }
const FADE_IN = { drone: 3.5, plucks: 2.5, breath: 3, bells: 2 }
const FADE_OUT = 2
const MASTER_LEVEL = { drone: 0.022, plucks: 0.025, breath: 0.014, bells: 0.025 }

function startLayer(name) {
  if (!isSoundEnabled() || layers[name]) return
  const c = getContext()
  if (!c) return
  if (c.state === 'suspended') c.resume().catch(() => {})

  const master = c.createGain()
  const now = c.currentTime
  master.gain.setValueAtTime(0, now)
  master.gain.linearRampToValueAtTime(MASTER_LEVEL[name], now + FADE_IN[name])
  master.connect(c.destination)

  if (name === 'drone') layers.drone = buildDrone(c, master, now)
  else if (name === 'plucks') layers.plucks = buildScheduled(c, master, pluckScore)
  else if (name === 'breath') layers.breath = buildBreath(c, master, now)
  else if (name === 'bells') layers.bells = buildScheduled(c, master, bellScore)
}

function stopLayer(name) {
  const layer = layers[name]
  if (!layer) return
  const c = getContext()
  if (!c) return
  const now = c.currentTime
  layer.master.gain.cancelScheduledValues(now)
  layer.master.gain.setValueAtTime(layer.master.gain.value, now)
  layer.master.gain.linearRampToValueAtTime(0, now + FADE_OUT)
  layers[name] = null
  if (layer.scheduler) clearInterval(layer.scheduler)
  setTimeout(() => {
    try {
      layer.nodes?.forEach(({ osc, lfo }) => { osc.stop(); lfo?.stop() })
      layer.master.disconnect()
    } catch {
      // already stopped
    }
  }, FADE_OUT * 1000 + 200)
}

function buildDrone(c, master, now) {
  const voices = [
    { freq: 65.41, detune: 0, lfoRate: 0.07 },   // C2
    { freq: 98.00, detune: -4, lfoRate: 0.11 },  // G2
    { freq: 155.56, detune: 3, lfoRate: 0.13 },  // Eb3
    { freq: 261.63, detune: -2, lfoRate: 0.09 }, // C4
  ]
  const nodes = voices.map(({ freq, detune, lfoRate }) => {
    const osc = c.createOscillator()
    const gain = c.createGain()
    osc.type = 'sine'
    osc.frequency.value = freq
    osc.detune.value = detune
    gain.gain.value = 0.5
    const lfo = c.createOscillator()
    const lfoDepth = c.createGain()
    lfo.frequency.value = lfoRate
    lfoDepth.gain.value = 0.3
    lfo.connect(lfoDepth).connect(gain.gain)
    lfo.start(now)
    osc.connect(gain).connect(master)
    osc.start(now)
    return { osc, lfo }
  })
  return { master, nodes }
}

function buildBreath(c, master, now) {
  // Detuned triangle stack a fifth above the drone — sustained pad with tremolo
  const voices = [
    { freq: 392.00, detune: 0 },   // G4
    { freq: 392.00, detune: 8 },
    { freq: 466.16, detune: -3 },  // Bb4
    { freq: 622.25, detune: 5 },   // Eb5
  ]
  // Slow breath LFO — chord swells in and out every ~10 s for a chill, spaced feel
  const tremolo = c.createOscillator()
  const tremoloDepth = c.createGain()
  tremolo.frequency.value = 0.1
  tremoloDepth.gain.value = 0.35
  tremolo.start(now)

  const nodes = voices.map(({ freq, detune }) => {
    const osc = c.createOscillator()
    const gain = c.createGain()
    osc.type = 'triangle'
    osc.frequency.value = freq
    osc.detune.value = detune
    gain.gain.value = 0.4
    tremolo.connect(tremoloDepth).connect(gain.gain)
    osc.connect(gain).connect(master)
    osc.start(now)
    return { osc, lfo: tremolo }
  })
  // Make sure tremolo is stopped only once
  return { master, nodes: [{ osc: tremolo }, ...nodes] }
}

// ─── Note scheduling ────────────────────────────────────────────────────────
// Each scored layer has a list of (offsetBeats, freq) events on a 16-beat loop
// at 60 BPM (1 beat = 1 second). The scheduler looks 100ms ahead.

const LOOP_BEATS = 16
const BEAT = 1.0
const LOOKAHEAD = 0.1
const TICK_MS = 50

const pluckScore = {
  loopBeats: LOOP_BEATS,
  events: [
    // C minor descending arpeggio with returning low C
    { beat: 0, freq: 130.81 },   // C3
    { beat: 1, freq: 196.00 },   // G3
    { beat: 2, freq: 233.08 },   // Bb3
    { beat: 3, freq: 196.00 },   // G3
    { beat: 4, freq: 311.13 },   // Eb4
    { beat: 5, freq: 196.00 },   // G3
    { beat: 6, freq: 233.08 },   // Bb3
    { beat: 7, freq: 196.00 },   // G3
    { beat: 8, freq: 130.81 },   // C3
    { beat: 9, freq: 196.00 },   // G3
    { beat: 10, freq: 311.13 },  // Eb4
    { beat: 11, freq: 196.00 },  // G3
    { beat: 12, freq: 233.08 },  // Bb3
    { beat: 13, freq: 311.13 },  // Eb4
    { beat: 14, freq: 392.00 },  // G4
    { beat: 15, freq: 311.13 },  // Eb4
  ],
  play(c, master, time, freq) {
    const osc = c.createOscillator()
    const gain = c.createGain()
    osc.type = 'triangle'
    osc.frequency.value = freq
    gain.gain.setValueAtTime(0, time)
    gain.gain.linearRampToValueAtTime(0.7, time + 0.005)
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.45)
    osc.connect(gain).connect(master)
    osc.start(time)
    osc.stop(time + 0.5)
  },
}

const bellScore = {
  loopBeats: LOOP_BEATS,
  events: [
    // Sparse, melancholic high melody
    { beat: 0, freq: 523.25 },    // C5
    { beat: 4, freq: 783.99 },    // G5
    { beat: 6, freq: 622.25 },    // Eb5
    { beat: 10, freq: 932.33 },   // Bb5
    { beat: 12, freq: 783.99 },   // G5
    { beat: 14, freq: 622.25 },   // Eb5
  ],
  play(c, master, time, freq) {
    // Bell: sine + 2x harmonic, fast attack, long decay
    const gain = c.createGain()
    gain.gain.setValueAtTime(0, time)
    gain.gain.linearRampToValueAtTime(0.6, time + 0.008)
    gain.gain.exponentialRampToValueAtTime(0.001, time + 1.6)
    gain.connect(master)

    const fund = c.createOscillator()
    fund.type = 'sine'
    fund.frequency.value = freq
    fund.connect(gain)
    fund.start(time)
    fund.stop(time + 1.7)

    const harm = c.createOscillator()
    harm.type = 'sine'
    harm.frequency.value = freq * 2
    const harmGain = c.createGain()
    harmGain.gain.setValueAtTime(0, time)
    harmGain.gain.linearRampToValueAtTime(0.25, time + 0.008)
    harmGain.gain.exponentialRampToValueAtTime(0.001, time + 1.0)
    harm.connect(harmGain).connect(master)
    harm.start(time)
    harm.stop(time + 1.1)
  },
}

function buildScheduled(c, master, score) {
  const startTime = c.currentTime
  let nextBeatIndex = 0

  const tick = () => {
    const horizon = c.currentTime + LOOKAHEAD
    while (true) {
      const loop = Math.floor(nextBeatIndex / score.events.length)
      const ev = score.events[nextBeatIndex % score.events.length]
      const beatPos = loop * score.loopBeats + ev.beat
      const t = startTime + beatPos * BEAT
      if (t > horizon) break
      if (t >= c.currentTime - 0.05) score.play(c, master, t, ev.freq)
      nextBeatIndex++
    }
  }

  // Prime once immediately so notes near startTime get scheduled
  tick()
  const scheduler = setInterval(tick, TICK_MS)
  return { master, scheduler, nodes: [] }
}

// ─── Public API ─────────────────────────────────────────────────────────────

let lastProgress = 0
let musicActive = false
const anchorLayers = { bells: false }
let interactionListenerArmed = false

// AudioContext starts in 'suspended' state on page load (autoplay policy) and
// only resumes after a user gesture. Arm a one-shot listener that resumes the
// context on the first click/keypress/scroll so the drone can actually be heard
// when sound is already enabled at load time.
function armResumeOnInteraction() {
  if (interactionListenerArmed || typeof window === 'undefined') return
  interactionListenerArmed = true
  const events = ['click', 'keydown', 'touchstart', 'pointerdown', 'scroll']
  const handler = () => {
    const c = getContext()
    if (c && c.state === 'suspended') c.resume().catch(() => {})
    events.forEach((e) => window.removeEventListener(e, handler))
  }
  events.forEach((e) => window.addEventListener(e, handler, { passive: true }))
}

export function setMusicProgress(progress) {
  lastProgress = Math.min(1, Math.max(0, progress))
  if (!musicActive || !isSoundEnabled()) return
  apply()
}

export function setMusicActive(active) {
  musicActive = active
  if (!active) {
    Object.keys(layers).forEach((name) => stopLayer(name))
    return
  }
  armResumeOnInteraction()
  apply()
}

export function setLayerActive(name, active) {
  if (!(name in anchorLayers)) return
  anchorLayers[name] = active
  if (!musicActive || !isSoundEnabled()) return
  applyAnchorLayer(name)
}

function applyAnchorLayer(name) {
  if (anchorLayers[name]) {
    if (!layers[name]) startLayer(name)
  } else if (layers[name]) {
    stopLayer(name)
  }
}

function apply() {
  if (!isSoundEnabled()) {
    Object.keys(layers).forEach((name) => stopLayer(name))
    return
  }
  // Drone whenever music is active
  if (!layers.drone) startLayer('drone')
  // Plucks at 25%
  if (lastProgress >= 0.25) { if (!layers.plucks) startLayer('plucks') }
  else if (layers.plucks) stopLayer('plucks')
  // Breath at 50%
  if (lastProgress >= 0.5) { if (!layers.breath) startLayer('breath') }
  else if (layers.breath) stopLayer('breath')
  // Bells: anchor-controlled (FeaturedProject viewport), not scroll-based
  applyAnchorLayer('bells')
}
