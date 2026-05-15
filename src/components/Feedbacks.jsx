import React from 'react'
import { motion } from 'framer-motion'

import { SectionWrapper } from '../hoc'
import { fadeIn, textVariant } from '../utils/motion'

import { testimonials } from '../constans'
import { styles } from '../styles'

// Format the role line: "Designation chez Company" when both are present,
// just "Designation" when company is empty (e.g. freelance/indépendant).
const formatRole = ({ designation, company }) =>
  company ? `${designation} chez ${company}` : designation

// Decorative SVG quote glyph used in featured + sidebar cards.
const QuoteGlyph = ({ size = 36, gradientId }) => (
  <svg width={size} height={size * 0.78} viewBox="0 0 36 28" fill="none" aria-hidden>
    <path
      d="M0 28V18C0 11.5 1.5 6.5 4.5 3C7.5 0 11 -0.5 15 1.5L12 7.5C10 6.5 8.5 7 7.5 9C6.5 11 6 13.5 6 16.5H10V28H0ZM21 28V18C21 11.5 22.5 6.5 25.5 3C28.5 0 32 -0.5 36 1.5L33 7.5C31 6.5 29.5 7 28.5 9C27.5 11 27 13.5 27 16.5H31V28H21Z"
      fill={`url(#${gradientId})`}
    />
    <defs>
      <linearGradient id={gradientId} x1="0" y1="0" x2="36" y2="28">
        <stop stopColor="#c084fc" />
        <stop offset="1" stopColor="#ec4899" />
      </linearGradient>
    </defs>
  </svg>
)

// Featured testimonial — large card, bento "hero" slot. Big quote, prominent
// photo, gradient border + soft pink glow in the corner.
const FeaturedCard = ({ testimonial, name, designation, company, image }) => (
  <motion.article
    variants={fadeIn('right', 'spring', 0, 0.75)}
    className="relative h-full rounded-3xl p-8 sm:p-10 bg-gradient-to-br from-[#1a0a35] via-[#2a1156] to-[#0a0418] border border-[#915EFF]/30 overflow-hidden flex flex-col"
  >
    <div className="absolute top-6 right-6 sm:top-8 sm:right-8 opacity-25">
      <QuoteGlyph size={56} gradientId="featured-quote-grad" />
    </div>
    <p className="relative z-10 text-white text-[18px] sm:text-[20px] leading-[1.55] font-light mb-8 max-w-[500px]">
      « {testimonial} »
    </p>
    <div className="mt-auto flex items-center gap-4">
      <img
        src={image}
        alt={`Témoignage de ${name}`}
        className="shrink-0 w-14 h-14 rounded-full object-cover border-2 border-pink-400/40"
      />
      <div className="min-w-0">
        <p className="text-white font-semibold text-[16px] truncate">{name}</p>
        <p className="text-purple-300 text-[12px] truncate">
          {formatRole({ designation, company })}
        </p>
      </div>
    </div>
    <div aria-hidden className="absolute -bottom-24 -right-24 w-72 h-72 bg-pink-500/15 rounded-full blur-3xl pointer-events-none" />
  </motion.article>
)

// Sidebar testimonial — smaller compact card next to the featured one. Two of
// these stack vertically in the right column of the bento layout.
const SidebarCard = ({ testimonial, name, designation, company, image, index }) => (
  <motion.article
    variants={fadeIn('left', 'spring', 0.15 * index, 0.75)}
    className="flex-1 rounded-2xl p-6 bg-gradient-to-br from-[#160a30] to-[#050211] border border-white/10 flex flex-col"
  >
    <p className="text-white/85 text-[14px] leading-relaxed mb-4 flex-1">
      « {testimonial} »
    </p>
    <div className="flex items-center gap-3">
      <img
        src={image}
        alt={`Témoignage de ${name}`}
        className="shrink-0 w-10 h-10 rounded-full object-cover border border-white/15"
      />
      <div className="min-w-0">
        <p className="text-white font-semibold text-[13px] truncate">{name}</p>
        <p className="text-secondary text-[11px] truncate">
          {formatRole({ designation, company })}
        </p>
      </div>
    </div>
  </motion.article>
)

// Marquee item — compact horizontal card used inside the scrolling row at the
// bottom of the section. Fixed width so the strip lays out predictably; quote
// is line-clamped to 2 lines so all items stay the same height.
const MarqueeItem = ({ testimonial, name, designation, company, image }) => (
  <div className="shrink-0 w-[340px] bg-black-200 rounded-2xl p-5 flex items-start gap-4 border border-white/10">
    <img
      src={image}
      alt={`Témoignage de ${name}`}
      className="shrink-0 w-12 h-12 rounded-full object-cover border-2 border-white/15"
    />
    <div className="flex-1 min-w-0">
      <p className="text-white text-[13px] font-semibold truncate">{name}</p>
      <p className="text-secondary text-[10px] mb-2 truncate">
        {formatRole({ designation, company })}
      </p>
      <p className="text-white/75 text-[12px] leading-relaxed line-clamp-2">
        {testimonial}
      </p>
    </div>
  </div>
)

const Feedbacks = () => {
  // Bento allocation: first testimonial = featured (big), next two = sidebar.
  // To change which testimonial is featured, reorder the array in constans.
  const [featured, ...rest] = testimonials
  const stacked = rest.slice(0, 2)
  // Duplicate the list so the marquee can scroll -50% and loop seamlessly.
  const marqueeItems = [...testimonials, ...testimonials]

  return (
    <div className="mt-12 bg-black-100 rounded-[20px]">
      <div className={`${styles.padding} bg-tertiary rounded-2xl min-h-[300px]`}>
        <motion.div variants={textVariant()}>
          <p className={styles.sectionSubText}>Ce que disent les autres</p>
          <h2 className={styles.sectionHeadText}>Témoignages.</h2>
        </motion.div>
      </div>

      <div className={`${styles.paddingX} -mt-20 pb-14`}>
        {/* Bento top: featured (3 cols) + stacked sidebar (2 cols) on lg+,
            stacks vertically below lg. */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-7">
          {featured && (
            <div className="lg:col-span-3">
              <FeaturedCard {...featured} />
            </div>
          )}
          {stacked.length > 0 && (
            <div className="lg:col-span-2 flex flex-col gap-7">
              {stacked.map((t, i) => (
                <SidebarCard key={t.name} index={i + 1} {...t} />
              ))}
            </div>
          )}
        </div>

        {/* Infinite slow marquee below the bento. All testimonials are
            included (duplicated for seamless loop). Pauses on hover. */}
        {testimonials.length > 0 && (
          <div className="testimonial-marquee-wrap relative overflow-hidden mt-10">
            {/* Fade gradients so items don't visually clip at the edges */}
            <div aria-hidden className="absolute inset-y-0 left-0 w-16 z-10 pointer-events-none bg-gradient-to-r from-[#100d25] to-transparent" />
            <div aria-hidden className="absolute inset-y-0 right-0 w-16 z-10 pointer-events-none bg-gradient-to-l from-[#100d25] to-transparent" />
            <div className="testimonial-marquee flex gap-4 w-max" aria-label="Tous les témoignages — défilement automatique">
              {marqueeItems.map((t, i) => (
                <MarqueeItem key={`${t.name}-${i}`} {...t} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SectionWrapper(Feedbacks, '')
