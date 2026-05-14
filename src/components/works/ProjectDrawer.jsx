import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import DrawerGallery from './DrawerGallery'
import { useLenis } from '../../lib/LenisProvider'
import { playDrawerOpen, playDrawerClose } from '../../lib/audio/uiSounds'

export default function ProjectDrawer({ project, onClose }) {
  const closeBtnRef = useRef(null)
  const lenis = useLenis()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!project) return

    playDrawerOpen()

    const previouslyFocused = document.activeElement
    closeBtnRef.current?.focus()

    const onKey = (e) => {
      if (e.key === 'Escape') {
        playDrawerClose()
        onClose()
      }
    }
    document.addEventListener('keydown', onKey)

    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    lenis?.stop()

    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
      lenis?.start()
      if (previouslyFocused instanceof HTMLElement) {
        previouslyFocused.focus()
      }
    }
  }, [project, onClose, lenis])

  const handleClose = () => {
    playDrawerClose()
    onClose()
  }

  if (!mounted) return null

  return createPortal(
    <AnimatePresence>
      {project && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={handleClose}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            aria-hidden="true"
          />

          <motion.aside
            key="panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="drawer-title"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-0 right-0 z-50 h-full w-full sm:max-w-[640px] bg-gradient-to-br from-[#0a0418] via-[#160a30] to-[#050211] border-l border-white/10 shadow-2xl overflow-y-auto"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-[#0a0418]/80 backdrop-blur-md border-b border-white/5">
              <div className="text-[10px] tracking-[0.3em] uppercase opacity-55">
                {project.type} · {project.year}
              </div>
              <button
                ref={closeBtnRef}
                type="button"
                onClick={handleClose}
                aria-label="Fermer le détail du projet"
                className="w-9 h-9 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
              >
                <span aria-hidden className="text-xl leading-none">×</span>
              </button>
            </div>

            <div className="px-6 sm:px-8 py-6 space-y-6">
              <header>
                <h2 id="drawer-title" className="text-3xl sm:text-4xl font-black tracking-tight leading-tight bg-gradient-to-br from-white via-pink-300 to-purple-400 bg-clip-text text-transparent">
                  {project.name}
                </h2>
                <p className="mt-2 text-white/75 text-sm leading-relaxed">
                  {project.description}
                </p>
              </header>

              <DrawerGallery
                images={project.images}
                imagePositions={project.imagePositions}
                alt={project.name}
              />

              {project.longDescription && (
                <section>
                  <h3 className="text-[10px] tracking-[0.3em] uppercase opacity-55 mb-2">À propos</h3>
                  <div className="text-white/80 text-sm leading-relaxed whitespace-pre-line">
                    {project.longDescription}
                  </div>
                </section>
              )}

              {project.tech?.length > 0 && (
                <section>
                  <h3 className="text-[10px] tracking-[0.3em] uppercase opacity-55 mb-2">Stack technique</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {project.tech.map((t) => (
                      <span
                        key={t}
                        className="text-[10px] px-2 py-1 rounded bg-purple-300/10 border border-purple-300/25 text-purple-200"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {(project.links?.live || project.links?.github) && (
                <section>
                  <h3 className="text-[10px] tracking-[0.3em] uppercase opacity-55 mb-2">Liens</h3>
                  <div className="flex flex-wrap gap-3">
                    {project.links.live && (
                      <a
                        href={project.links.live.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-br from-pink-500 to-purple-600 text-white text-xs font-bold tracking-wider shadow-lg shadow-pink-500/40 hover:scale-[1.03] transition-transform"
                      >
                        {project.links.live.label} ↗
                      </a>
                    )}
                    {project.links.github?.url && (
                      <a
                        href={project.links.github.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-white/20 bg-white/5 text-white text-xs font-bold tracking-wider hover:bg-white/10 transition-colors"
                      >
                        Code source ↗
                      </a>
                    )}
                    {project.links.github?.private && (
                      <span className="inline-flex items-center text-[10px] opacity-55 italic">
                        ⚿ Code source privé — {project.links.github.reason}
                      </span>
                    )}
                  </div>
                </section>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>,
    document.body,
  )
}
