import { useRef } from 'react'
import { motion } from 'framer-motion'
import { useSoundToggle } from '../lib/hooks/useSoundToggle'
import { useMagneticHover } from '../lib/hooks/useMagneticHover'

export default function SoundToggle() {
  const { enabled, toggle } = useSoundToggle()
  const ref = useRef(null)
  const { x, y } = useMagneticHover(ref, { strength: 0.3, max: 6 })

  return (
    <motion.button
      ref={ref}
      type="button"
      onClick={toggle}
      aria-label={enabled ? 'Désactiver le son' : 'Activer le son'}
      aria-pressed={enabled}
      style={{ x, y }}
      className="w-9 h-9 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors text-white/70 hover:text-white"
    >
      {enabled ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </svg>
      )}
    </motion.button>
  )
}
