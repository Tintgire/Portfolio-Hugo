import React from 'react'
import { motion } from 'framer-motion'

import { styles } from '../styles'
import { services } from '../constans'
import { fadeIn, textVariant } from '../utils/motion'
import { SectionWrapper } from '../hoc'

// Inline SVG icons — gradient violet → pink, line style at 1.8 stroke for
// crisp readability. Unique gradient id per icon to avoid SVG defs collisions.
const Icon = ({ id, size = 56, children }) => (
  <svg
    viewBox="0 0 64 64"
    width={size}
    height={size}
    fill="none"
    stroke={`url(#${id})`}
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id={id} x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#915EFF" />
        <stop offset="100%" stopColor="#ec4899" />
      </linearGradient>
    </defs>
    {children}
  </svg>
)

// Product Engineer — stacked layers + ship arrow (build & deliver)
export const IconProductEngineer = () => (
  <Icon id="svc-grad-product">
    <rect x="10" y="38" width="44" height="14" rx="2" />
    <rect x="14" y="26" width="36" height="10" rx="2" />
    <rect x="18" y="14" width="28" height="8" rx="2" />
    <path d="M32 6l4 4-4 4-4-4z" fill="url(#svc-grad-product)" stroke="none" />
  </Icon>
)

// 3D & Creative Developer — wireframe cube
export const Icon3D = () => (
  <Icon id="svc-grad-3d">
    <path d="M32 8l20 11v22L32 52 12 41V19z" />
    <path d="M32 8v22M12 19l20 11M52 19L32 30" />
  </Icon>
)

// AI Integration — neural network nodes + spark
export const IconAI = () => (
  <Icon id="svc-grad-ai">
    <circle cx="14" cy="22" r="4" />
    <circle cx="14" cy="42" r="4" />
    <circle cx="32" cy="32" r="5" />
    <circle cx="50" cy="22" r="4" />
    <circle cx="50" cy="42" r="4" />
    <path d="M18 22l9 8M18 42l9-8M37 30l9-8M37 34l9 8" />
    <path d="M44 6l1.5 3 3 1.5-3 1.5L44 15l-1.5-3-3-1.5 3-1.5z" fill="url(#svc-grad-ai)" stroke="none" />
  </Icon>
)

// DevOps / Cloud — cloud with deploy arrow
export const IconDevOps = () => (
  <Icon id="svc-grad-devops">
    {/* Cloud: bottom flat at y=44, three rounded bumps reaching y=16, sits cleanly inside viewBox */}
    <path d="M18 44Q8 44 8 36Q8 28 16 26Q18 16 28 16Q40 16 42 26Q56 26 56 36Q56 44 46 44Z" />
    {/* Download/deploy arrow centered in cloud */}
    <path d="M32 24v14M26 32l6 6 6-6" />
  </Icon>
)

// Co-fondateur / Tech Lead — pyramid/peak with crown star
export const IconLead = () => (
  <Icon id="svc-grad-lead">
    <path d="M8 50h48L40 22 32 32 24 22z" />
    <path d="M32 8l2.5 5.5 6 .5-4.5 4 1.5 6L32 21l-5.5 3 1.5-6-4.5-4 6-.5z" fill="url(#svc-grad-lead)" stroke="none" />
  </Icon>
)

const ICONS = {
  product: IconProductEngineer,
  threed: Icon3D,
  ai: IconAI,
  devops: IconDevOps,
  lead: IconLead,
}

// Cinematic service card — uniform grid (toutes les cards font la même
// taille), hover lifts the card by 8px and returns smoothly on mouse-leave.
//
// Architecture: `motion.div` outer = entrance animation (writes inline
// transform via framer-motion). `<article>` inner = pure CSS hover (writes
// its OWN transform on a different element). Transforms are per-element so
// no conflict, and the hover transition is independent from the entrance
// delay — un-hover returns immediately instead of waiting for the staggered
// entrance delay to replay.
const ServiceCard = ({ index, title, icon, tagline }) => {
  const IconComponent = typeof icon === 'string' ? ICONS[icon] : icon
  // Alternate background gradient between two purple shades for visual rhythm
  const bgClass = index % 2 === 0
    ? 'from-[#1a0a35] to-[#0a0418]'
    : 'from-[#160a30] to-[#050211]'

  return (
    <motion.div
      variants={fadeIn('up', 'spring', 0.15 * index, 0.75)}
      className="h-full"
    >
      <article
        className={`group relative h-full min-h-[260px] flex flex-col overflow-hidden rounded-2xl border border-white/10 hover:border-pink-500/50 bg-gradient-to-br ${bgClass} p-6 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-2`}
      >
        {/* Icon tilts when the parent card is hovered (group-hover) */}
        <div className="mb-4 inline-block transition-transform duration-[400ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:-rotate-[6deg] group-hover:scale-110">
          {IconComponent ? (
            <IconComponent />
          ) : (
            <img src={icon} alt="service" className="w-14 h-14 object-contain" />
          )}
        </div>
        <h3 className="text-white text-xl font-bold leading-tight mb-2">
          {title}
        </h3>
        {tagline && (
          <p className="text-secondary text-sm leading-relaxed mb-3">
            {tagline}
          </p>
        )}
        <span
          aria-hidden
          className="mt-auto self-start text-purple-300 text-sm opacity-60 group-hover:opacity-100 group-hover:translate-x-1 inline-block transition-all duration-300"
        >
          →
        </span>
      </article>
    </motion.div>
  )
}

const About = () => {
  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>Introduction</p>
        <h2 className={styles.heroHeadText}>Aperçu.</h2>
      </motion.div>

      <motion.p
        variants={fadeIn('', '', 0.1, 1)}
        className="mt-4 text-secondary text-[17px] max-w-3xl leading-[30px]"
      >
        Développeur full-stack — fondateur de{' '}
        <strong className="text-white/85">FreshStock</strong> (IA et inventaire vocal pour la restauration) et co-fondateur de{' '}
        <strong className="text-white/85">Valofenua</strong> (estimation immobilière en Polynésie française) — je ship des produits de bout en bout&nbsp;: architecture backend Python/FastAPI, front React 3D animé, agents IA, apps mobiles React Native. En parallèle, je livre régulièrement des sites sur-mesure en freelance pour artisans, créatifs et marques personnelles. Je crois aux outils qui font gagner du temps réel à de vrais utilisateurs — et aux interfaces qui se font remarquer.
      </motion.p>

      <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {services.map((service, index) => (
          <ServiceCard key={service.title} index={index} {...service} />
        ))}
      </div>
    </>
  )
}

export default SectionWrapper(About, 'about')
