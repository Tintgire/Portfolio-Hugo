import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function DrawerGallery({ images, alt }) {
  const [activeIndex, setActiveIndex] = useState(0)

  if (!images || images.length === 0) return null

  const single = images.length === 1

  return (
    <div className="w-full">
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
            className="absolute inset-0 w-full h-full object-cover"
          />
        </AnimatePresence>
      </div>

      {!single && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActiveIndex(i)}
              aria-label={`Voir l'image ${i + 1}`}
              aria-current={i === activeIndex}
              className={`relative shrink-0 w-20 h-14 rounded-md overflow-hidden border-2 transition-all ${
                i === activeIndex
                  ? 'border-[#915EFF] opacity-100'
                  : 'border-white/10 opacity-60 hover:opacity-90'
              }`}
            >
              <img src={src} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
