import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { playTick } from '../../lib/audio/uiSounds'

export default function DrawerGallery({ images, alt, imagePositions, orientation = 'landscape' }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const thumbStripRef = useRef(null)

  const total = images?.length ?? 0
  const single = total === 1

  const goTo = useCallback((i) => {
    if (i === activeIndex) return
    playTick()
    setActiveIndex(i)
  }, [activeIndex])

  const prev = useCallback(() => {
    if (single || total === 0) return
    playTick()
    setActiveIndex((i) => (i - 1 + total) % total)
  }, [single, total])

  const next = useCallback(() => {
    if (single || total === 0) return
    playTick()
    setActiveIndex((i) => (i + 1) % total)
  }, [single, total])

  // Keyboard ← → navigation while the drawer is open.
  useEffect(() => {
    if (single || total === 0) return
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); prev() }
      else if (e.key === 'ArrowRight') { e.preventDefault(); next() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [single, total, prev, next])

  // Keep the active thumbnail in view as the user navigates. Without this, on
  // narrow screens (mobile) the strip overflows horizontally and the violet
  // border on the active thumbnail ends up off-screen — the user can't tell
  // which image they're on.
  useEffect(() => {
    const strip = thumbStripRef.current
    if (!strip) return
    const activeBtn = strip.children[activeIndex]
    if (!activeBtn) return
    activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
  }, [activeIndex])

  if (!images || total === 0) return null

  const activePosition = imagePositions?.[activeIndex] ?? 'center'
  const isPortrait = orientation === 'portrait'

  return (
    <div className="w-full">
      {isPortrait ? (
        // Portrait (mobile screenshots): width capped at ~280px, height
        // dictated by the image's natural ratio — no forced aspect, no
        // crop. The drawer scrolls vertically if the image is tall.
        <div className="relative w-full max-w-[280px] mx-auto rounded-xl overflow-hidden border border-white/10 bg-black/40">
          <AnimatePresence mode="wait">
            <motion.img
              key={activeIndex}
              src={images[activeIndex]}
              alt={alt}
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="block w-full h-auto rounded-xl"
            />
          </AnimatePresence>
          {!single && <ArrowButtons onPrev={prev} onNext={next} />}
        </div>
      ) : (
        // Landscape (web screenshots): fixed 16:10 aspect with
        // object-cover + objectPosition for fine framing control.
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-white/10 bg-black/40">
          <AnimatePresence mode="wait">
            <motion.img
              key={activeIndex}
              src={images[activeIndex]}
              alt={alt}
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              style={{ objectPosition: activePosition }}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </AnimatePresence>
          {!single && <ArrowButtons onPrev={prev} onNext={next} />}
        </div>
      )}

      {!single && (
        <div className="mt-3 flex items-center justify-center">
          <span className="text-[10px] tracking-[0.3em] uppercase opacity-55 tabular-nums">
            {String(activeIndex + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </span>
        </div>
      )}

      {!single && (
        <div ref={thumbStripRef} className={`mt-3 flex gap-2 overflow-x-auto pb-1 ${isPortrait ? 'justify-center' : ''}`}>
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Voir l'image ${i + 1}`}
              aria-current={i === activeIndex}
              className={`relative shrink-0 ${isPortrait ? 'w-10 h-20' : 'w-20 h-14'} rounded-md overflow-hidden border-2 transition-all ${
                i === activeIndex
                  ? 'border-[#915EFF] opacity-100'
                  : 'border-white/10 opacity-60 hover:opacity-90'
              }`}
            >
              <img
                src={src}
                alt=""
                style={{ objectPosition: imagePositions?.[i] ?? 'center' }}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// Round chevron buttons matching the drawer's close button:
// border-white/15, bg-black/40 with backdrop-blur, hover lifts to white/15.
// Positioned absolute, centered vertically, just inside the image edges.
function ArrowButtons({ onPrev, onNext }) {
  return (
    <>
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onPrev() }}
        aria-label="Image précédente"
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full border border-white/15 bg-black/40 backdrop-blur-sm text-white hover:bg-white/15 hover:border-white/30 transition-colors flex items-center justify-center"
      >
        <Chevron direction="left" />
      </button>
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onNext() }}
        aria-label="Image suivante"
        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full border border-white/15 bg-black/40 backdrop-blur-sm text-white hover:bg-white/15 hover:border-white/30 transition-colors flex items-center justify-center"
      >
        <Chevron direction="right" />
      </button>
    </>
  )
}

function Chevron({ direction }) {
  const d = direction === 'left' ? 'M15 18l-6-6 6-6' : 'M9 18l6-6-6-6'
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d={d} />
    </svg>
  )
}
