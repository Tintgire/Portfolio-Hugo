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
    const node = articleRef.current
    if (!node) return
    const io = new IntersectionObserver(([entry]) => {
      setLayerActive('bells', entry.isIntersecting)
    }, { threshold: 0.25 })
    io.observe(node)
    return () => {
      io.disconnect()
      setLayerActive('bells', false)
    }
  }, [])

  return (
    <motion.article
      ref={articleRef}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full rounded-3xl overflow-hidden border border-[#915EFF]/25 bg-gradient-to-br from-[#1a0a35] via-[#2a1156] to-[#050211] p-8 sm:p-12 my-8"
    >
      <div className={`grid ${isBrowser ? 'lg:grid-cols-[1fr_560px]' : 'lg:grid-cols-[1fr_420px]'} gap-10 items-center`}>
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
                Voir sur l'{links.live.label} ↗
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
          <div className="relative h-[420px] w-full max-w-[420px] mx-auto lg:mx-0" style={{ perspective: '1000px' }}>
            <PhoneMockup src={images[3]} pos={{ left: '10%', top: '60px' }} transform={{ rotateY: -20, rotateZ: 8, scale: 0.85 }} opacity={0.85} z={10} />
            <PhoneMockup src={images[2]} pos={{ left: '28%', top: '10px' }} transform={{ rotateY: -15, rotateZ: 4 }} z={20} />
            <PhoneMockup src={images[1]} pos={{ left: '50%', top: '0' }} transform={{ rotateY: 0, rotateZ: 0 }} z={30} featured />
            <PhoneMockup src={images[0]} pos={{ left: '72%', top: '20px' }} transform={{ rotateY: 15, rotateZ: -6 }} z={20} />
          </div>
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

function PhoneMockup({ src, pos, transform, opacity = 1, z = 1, featured = false }) {
  const transformStr = `rotateY(${transform.rotateY}deg) rotateZ(${transform.rotateZ}deg) scale(${transform.scale ?? 1})`
  return (
    <motion.div
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      style={{
        position: 'absolute',
        left: pos.left,
        top: pos.top,
        transform: transformStr,
        transformStyle: 'preserve-3d',
        opacity,
        zIndex: z,
        width: '130px',
        height: '270px',
      }}
      className={`rounded-[22px] bg-black border-2 ${featured ? 'border-white/30' : 'border-white/15'} overflow-hidden shadow-2xl shadow-black/60`}
    >
      <div className="absolute inset-1 rounded-[18px] overflow-hidden">
        <img src={src} alt="" className="w-full h-full object-cover" />
      </div>
      <div aria-hidden className="absolute inset-0 rounded-[22px] shadow-[inset_0_0_30px_rgba(145,94,255,0.3)] pointer-events-none" />
    </motion.div>
  )
}
