import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useMagneticHover } from '../../lib/hooks/useMagneticHover'
import { playClick, setLayerActive } from '../../lib/audio/uiSounds'

export default function FeaturedProject({ project, onOpen }) {
  const { name, description, tech, images, links, year, mockup = 'phones' } = project
  const isBrowser = mockup === 'browser'

  const articleRef = useRef(null)
  const liveCtaRef = useRef(null)
  const detailsCtaRef = useRef(null)
  const liveMag = useMagneticHover(liveCtaRef, { strength: 0.35, max: 8 })
  const detailsMag = useMagneticHover(detailsCtaRef, { strength: 0.35, max: 8 })

  useEffect(() => {
    if (project.id !== 'rubi') return
    const node = articleRef.current
    if (!node) return
    // Extended top margin: once the article enters viewport, it stays
    // "intersecting" as the user scrolls past it — bells keep playing all the
    // way to the bottom of the page, fade out only when scrolling back above.
    const io = new IntersectionObserver(([entry]) => {
      setLayerActive('bells', entry.isIntersecting)
    }, { rootMargin: '99999px 0px 0px 0px', threshold: 0 })
    io.observe(node)
    return () => {
      io.disconnect()
      setLayerActive('bells', false)
    }
  }, [project.id])

  return (
    <motion.article
      ref={articleRef}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full rounded-3xl overflow-hidden border border-[#915EFF]/25 bg-gradient-to-br from-[#1a0a35] via-[#2a1156] to-[#050211] p-8 sm:p-12 my-8"
    >
      <div className={`grid ${isBrowser ? 'lg:grid-cols-[1fr_560px]' : 'lg:grid-cols-[1fr_320px]'} gap-10 items-center`}>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/15 border border-pink-500/40 text-pink-300 text-[10px] tracking-[0.2em] uppercase font-bold mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-pulse" />
            Live on {links?.live?.label ?? 'production'}
            <span className="opacity-60 ml-1">· {year}</span>
          </div>
          <h3 className="text-4xl sm:text-5xl font-black tracking-tight leading-none mb-3 bg-gradient-to-br from-white via-pink-300 to-purple-400 bg-clip-text text-transparent">
            {name}
          </h3>
          <p className="text-white/85 text-base leading-relaxed mb-5 max-w-2xl">
            {description}
          </p>
          <div className="flex flex-wrap gap-1.5 mb-6 max-w-2xl">
            {tech.map((t) => (
              <span
                key={t}
                className="text-[10px] px-2 py-1 rounded bg-purple-300/10 border border-purple-300/25 text-purple-200"
              >
                {t}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            {links?.live && (
              <motion.a
                ref={liveCtaRef}
                href={links.live.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => playClick()}
                style={{ x: liveMag.x, y: liveMag.y }}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-br from-pink-500 to-purple-600 text-white text-xs font-bold tracking-wider shadow-lg shadow-pink-500/40 transition-transform"
              >
                {links.live.ctaLabel ?? `Voir sur l'${links.live.label} ↗`}
              </motion.a>
            )}
            <motion.button
              ref={detailsCtaRef}
              type="button"
              onClick={() => {
                playClick()
                onOpen?.(project.id)
              }}
              style={{ x: detailsMag.x, y: detailsMag.y }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-purple-300/40 bg-white/5 text-purple-100 text-xs font-bold tracking-wider hover:bg-white/10 transition-colors"
            >
              Détails du projet
            </motion.button>
          </div>
          {links?.github?.private && (
            <p className="text-[10px] opacity-55 italic mt-3">
              ⚿ Code source privé — {links.github.reason}
            </p>
          )}
        </div>

        {isBrowser ? (
          <BrowserMockup src={images[0]} url={links?.live?.url ?? ''} />
        ) : (
          <PhoneHero src={images[0]} thumbs={images.slice(1, 5)} />
        )}
      </div>

      <div aria-hidden className="absolute -top-20 -right-20 w-72 h-72 bg-purple-500/30 rounded-full blur-3xl pointer-events-none" />
      <div aria-hidden className="absolute -bottom-20 -left-20 w-72 h-72 bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />
    </motion.article>
  )
}

function BrowserMockup({ src, url }) {
  let host = url
  try {
    host = new URL(url).host
  } catch {
    // ignore
  }
  return (
    <motion.div
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      className="relative w-full max-w-[560px] mx-auto lg:mx-0 rounded-xl overflow-hidden border border-white/15 bg-black shadow-2xl shadow-black/60"
    >
      <div className="flex items-center gap-2 px-3 py-2 bg-black/85 border-b border-white/10">
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
        </div>
        <div className="flex-1 mx-3 px-3 py-1 rounded-md bg-white/5 text-[10px] text-white/55 truncate text-center">
          {host || url}
        </div>
        <div className="w-[60px]" />
      </div>
      <div className="aspect-[16/10] overflow-hidden bg-black">
        <img src={src} alt="" className="w-full h-full object-cover object-top" />
      </div>
      <div aria-hidden className="absolute inset-0 pointer-events-none rounded-xl shadow-[inset_0_0_30px_rgba(145,94,255,0.25)]" />
    </motion.div>
  )
}

// Single hero phone — much bigger than the previous 4-stacked-phones layout.
// Width is fixed at 280px; height is driven by the screenshot's natural
// aspect ratio (no forced object-cover crop). The card grows to match.
// Up to 4 small thumbnails sit below for the secondary screens.
function PhoneHero({ src, thumbs = [] }) {
  return (
    <div className="w-full max-w-[320px] mx-auto lg:mx-0 flex flex-col items-center gap-4">
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        style={{ width: '280px' }}
        className="relative rounded-[34px] bg-black border-2 border-white/20 overflow-hidden shadow-2xl shadow-black/60"
      >
        {/* The screenshot dictates the phone height — no forced ratio,
         * no object-cover, so the full screen content stays visible. */}
        <img
          src={src}
          alt=""
          className="block w-full h-auto rounded-[28px]"
          style={{ display: 'block' }}
        />
        <div
          aria-hidden
          className="absolute inset-0 rounded-[34px] shadow-[inset_0_0_30px_rgba(145,94,255,0.3)] pointer-events-none"
        />
      </motion.div>

      {thumbs.length > 0 && (
        <div className="flex gap-2 justify-center flex-wrap">
          {thumbs.map((thumbSrc, i) => (
            <div
              key={i}
              className="w-12 rounded-md overflow-hidden border border-white/15 bg-black"
            >
              <img
                src={thumbSrc}
                alt=""
                className="block w-full h-auto rounded-[4px]"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
