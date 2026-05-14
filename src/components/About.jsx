import React from 'react'
import { Tilt } from 'react-tilt'
import { motion } from 'framer-motion'

import { styles } from '../styles'
import { services } from '../constans'
import { fadeIn, textVariant } from '../utils/motion'
import { SectionWrapper } from '../hoc'

// Inline SVG icons — gradient violet → pink, line style at 1.6 stroke for
// crisp readability. Unique gradient id per icon to avoid SVG defs collisions.
const Icon = ({ id, children }) => (
  <svg
    viewBox="0 0 64 64"
    width="80"
    height="80"
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
    <path d="M16 38c-4 0-8-3-8-8 0-4 3-7 7-7 1-5 5-9 11-9 6 0 11 4 12 9h2c5 0 9 4 9 9s-4 9-9 9H16z" />
    <path d="M32 32v14M26 38l6 6 6-6" />
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

const ServiceCard = ({ index, title, icon }) => {
  const IconComponent = typeof icon === 'string' ? ICONS[icon] : icon
  return (
    <Tilt className="xs:w-[250px] w-full">
      <motion.div
        variants={fadeIn('right', 'spring', 0.5 * index, 0.75)}
        className="w-full green-pink-gradient p-[1px] rounded-[20px] shadow-card"
      >
        <div
          options={{
            max: 45,
            scale: 1,
            speed: 450,
          }}
          className="bg-tertiary rounded-[20px] py-5 px-6 min-h-[280px] flex justify-evenly items-center flex-col"
        >
          {IconComponent ? (
            <IconComponent />
          ) : (
            <img src={icon} alt="service" className="w-24 h-24 object-contain" />
          )}
          <h3 className="text-white text-[20px] font-bold text-center leading-tight">
            {title}
          </h3>
        </div>
      </motion.div>
    </Tilt>
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
        Développeur full-stack & co-fondateur de deux startups —{' '}
        <strong className="text-white/85">FreshStock</strong> (IA et inventaire vocal pour la restauration) et{' '}
        <strong className="text-white/85">Valofenua</strong> (estimation immobilière en Polynésie française) — je ship des produits de bout en bout&nbsp;: architecture backend Python/FastAPI, front React 3D animé, agents IA, apps mobiles React Native. En parallèle, je livre régulièrement des sites sur-mesure en freelance pour artisans, créatifs et marques personnelles. Je crois aux outils qui font gagner du temps réel à de vrais utilisateurs — et aux interfaces qui se font remarquer.
      </motion.p>

      <div className="mt-20 flex flex-wrap gap-10 justify-center lg:justify-start">
        {services.map((service, index) => (
          <ServiceCard key={service.title} index={index} {...service} />
        ))}
      </div>
    </>
  )
}

export default SectionWrapper(About, 'about')
