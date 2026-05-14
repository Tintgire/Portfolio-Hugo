import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { setSoundEnabled, setMusicActive, playToggle } from '../lib/audio/uiSounds'

export default function SoundPrompt() {
  const [visible, setVisible] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Always show on every fresh page load — sound is OFF by default and the
    // user must choose. React state alone keeps the modal from re-appearing
    // within the current load after dismissal.
    const timer = setTimeout(() => setVisible(true), 1500)
    return () => clearTimeout(timer)
  }, [])

  const dismiss = () => {
    setVisible(false)
  }

  const activate = () => {
    setSoundEnabled(true)
    playToggle()
    setMusicActive(true)
    dismiss()
  }

  if (!mounted) return null

  return createPortal(
    <AnimatePresence>
      {visible && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={dismiss}
            className="fixed inset-0 z-[60] bg-black/55 backdrop-blur-md"
            aria-hidden="true"
          />
          <div
            key="prompt-wrapper"
            className="fixed inset-0 z-[61] flex items-center justify-center pointer-events-none px-4"
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="sound-prompt-title"
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.97 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="relative pointer-events-auto w-full max-w-[520px] rounded-3xl border border-[#915EFF]/35 bg-gradient-to-br from-[#1a0a35] via-[#2a1156] to-[#050211] p-8 sm:p-10 shadow-2xl shadow-purple-950/60"
            >
              <div aria-hidden className="absolute -top-12 -right-12 w-40 h-40 bg-pink-500/25 rounded-full blur-3xl pointer-events-none" />
              <div aria-hidden className="absolute -bottom-16 -left-16 w-48 h-48 bg-purple-500/30 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500/30 to-purple-600/30 border border-pink-300/40 flex items-center justify-center mb-5">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white" aria-hidden="true">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                  </svg>
                </div>

                <h2
                  id="sound-prompt-title"
                  className="text-3xl sm:text-4xl font-black tracking-tight leading-tight bg-gradient-to-br from-white via-pink-200 to-purple-300 bg-clip-text text-transparent"
                >
                  Active le son
                </h2>
                <p className="mt-3 text-white/80 text-sm sm:text-base leading-relaxed max-w-md">
                  Ce portfolio est pensé avec une bande-son cinématique qui se construit au fur et à mesure du scroll. Pour l'expérience complète, mets le son.
                </p>

                <div className="mt-7 flex flex-col sm:flex-row gap-3 w-full sm:w-auto items-center">
                  <button
                    type="button"
                    onClick={activate}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 text-white text-sm font-bold tracking-wider shadow-lg shadow-pink-500/40 hover:scale-[1.03] transition-transform w-full sm:w-auto"
                  >
                    Activer le son
                  </button>
                  <button
                    type="button"
                    onClick={dismiss}
                    className="text-white/55 hover:text-white/80 text-xs tracking-wider uppercase transition-colors"
                  >
                    Continuer en silence
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  )
}
