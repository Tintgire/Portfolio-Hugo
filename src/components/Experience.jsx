import React, { useEffect, useRef, useState } from 'react'
import { motion, useTransform } from 'framer-motion'

import { experiences } from '../constans'
import { SectionWrapper } from '../hoc'
import { playTick } from '../lib/audio/uiSounds'
import useScrollProgress from '../lib/useScrollProgress'

import { styles } from '../styles'
import ParticleShapeField2D from './experience/ParticleShapeField2D'

const Section = ({ label, children }) => (
  <div className="mt-4">
    <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/55 mb-1.5">
      {label}
    </h4>
    {children}
  </div>
)

function ExperienceCard({ experience }) {
  const ref = useRef(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        playTick()
        io.disconnect()
      }
    }, { threshold: 0.5 })
    io.observe(node)
    return () => io.disconnect()
  }, [])

  const hasIcon = !!experience.icon

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full rounded-[20px] border border-[#915EFF]/25 bg-gradient-to-br from-[#1a0a35] to-[#2a1156] p-6 sm:p-7 shadow-[0_10px_40px_-10px_rgba(145,94,255,0.35)]"
    >
      <div className="flex items-start gap-4 mb-3 lg:hidden">
        <span
          className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white font-black text-sm"
          style={{ background: experience.iconBg ?? '#915EFF', boxShadow: '0 0 0 3px #1d1836' }}
          aria-hidden="true"
        >
          {hasIcon ? (
            <img src={experience.icon} alt="" className="w-[60%] h-[60%] object-contain" />
          ) : (
            experience.initials
          )}
        </span>
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-white/55 font-bold">{experience.date}</p>
        </div>
      </div>

      {experience.type && (
        <div className="inline-flex items-center text-[10px] font-bold uppercase tracking-[0.2em] px-2 py-1 rounded bg-pink-500/15 border border-pink-500/40 text-pink-300 mb-3">
          {experience.type}
        </div>
      )}

      <h3 className="text-white text-[22px] sm:text-[24px] font-bold leading-tight">
        {experience.title}
      </h3>

      <p className="mt-1 text-purple-200 text-[15px] font-semibold tracking-wide">
        {experience.company_name}
      </p>

      {experience.context && (
        <p className="mt-1 text-white/55 text-[12px] italic leading-snug">
          {experience.context}
        </p>
      )}

      {experience.challenge && (
        <Section label="Défi">
          <p className="text-white/85 text-[14px] leading-relaxed">{experience.challenge}</p>
        </Section>
      )}

      {experience.keyProjects?.length > 0 && (
        <Section label="Projets clés">
          <ul className="space-y-1.5">
            {experience.keyProjects.map((p) => (
              <li key={p.name} className="text-white/80 text-[13px] leading-relaxed">
                <span className="text-pink-300 font-semibold">{p.name}</span>
                <span className="text-white/40"> — </span>
                {p.description}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {experience.points?.length > 0 && (
        <Section label={experience.actionsLabel ?? 'Actions'}>
          <ul className="list-disc ml-5 space-y-1.5">
            {experience.points.map((point, index) => (
              <li
                key={`exp-point-${index}`}
                className="text-white/80 text-[13px] leading-relaxed pl-1"
              >
                {point}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {experience.results && (
        <div className="mt-4 p-3 rounded-lg border border-pink-500/30 bg-gradient-to-br from-pink-500/10 to-purple-500/5">
          <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-pink-200 mb-1.5">
            Résultats
          </h4>
          <p className="text-white/85 text-[13px] leading-relaxed">{experience.results}</p>
        </div>
      )}

      {experience.stack?.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {experience.stack.map((t) => (
            <span
              key={t}
              className="text-[10px] px-2 py-1 rounded bg-purple-300/10 border border-purple-300/25 text-purple-200"
            >
              {t}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  )
}

// Vertical rail with a base track + gradient fill that grows with scroll
// progress through the timeline. A glowing head sits at the bottom of the
// fill — the "you are here" marker that drags down as the user scrolls.
function RailFill({ scrollYProgress }) {
  const height = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  return (
    <div
      aria-hidden="true"
      className="hidden lg:block absolute left-1/2 top-0 bottom-0 -translate-x-1/2 pointer-events-none z-[1]"
      style={{ width: '2px' }}
    >
      {/* Base track — very faint so it never competes with the particles */}
      <div
        className="absolute inset-0 rounded-full"
        style={{ background: 'rgba(255, 255, 255, 0.06)' }}
      />
      {/* Filled portion — gradient from violet to lavender to pink */}
      <motion.div
        className="absolute left-0 right-0 top-0 rounded-full"
        style={{
          height,
          background:
            'linear-gradient(to bottom, transparent 0%, rgba(145, 94, 255, 0.7) 15%, rgba(192, 132, 252, 0.9) 50%, rgba(236, 72, 153, 0.7) 85%, rgba(236, 72, 153, 0.95) 100%)',
          boxShadow:
            '0 0 6px rgba(145, 94, 255, 0.4), 0 0 14px rgba(236, 72, 153, 0.2)',
        }}
      />
    </div>
  )
}

function TimelineNode({ experience, scrollYProgress, timelineRef }) {
  const wrapperRef = useRef(null)
  const [isActive, setIsActive] = useState(false)
  const hasIcon = !!experience.icon

  useEffect(() => {
    if (!wrapperRef.current || !timelineRef?.current || !scrollYProgress) return

    let nodeRelY = 0
    const compute = () => {
      const containerRect = timelineRef.current.getBoundingClientRect()
      const nodeRect = wrapperRef.current.getBoundingClientRect()
      if (containerRect.height === 0) return
      const nodeCenter = nodeRect.top + nodeRect.height / 2 - containerRect.top
      nodeRelY = nodeCenter / containerRect.height
    }
    compute()

    // Light up the node as soon as the rail head crosses its vertical center.
    const unsubscribe = scrollYProgress.on('change', (p) => {
      setIsActive(p >= nodeRelY)
    })
    setIsActive(scrollYProgress.get() >= nodeRelY)

    const onResize = () => compute()
    window.addEventListener('resize', onResize)
    return () => {
      unsubscribe()
      window.removeEventListener('resize', onResize)
    }
  }, [scrollYProgress, timelineRef])

  return (
    <div className="flex flex-col items-center pt-8">
      <motion.div
        ref={wrapperRef}
        animate={{ scale: isActive ? 1.08 : 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-12 h-12 rounded-full flex items-center justify-center text-white font-black text-base transition-[box-shadow] duration-500"
        style={{
          background: experience.iconBg ?? '#915EFF',
          boxShadow: isActive
            ? '0 0 0 4px #1d1836, 0 0 0 6px rgba(236, 72, 153, 0.45), 0 0 24px rgba(236, 72, 153, 0.55)'
            : '0 0 0 4px #1d1836',
        }}
      >
        {hasIcon ? (
          <img
            src={experience.icon}
            alt={experience.company_name}
            className="w-[60%] h-[60%] object-contain"
          />
        ) : (
          experience.initials
        )}
      </motion.div>
      <p className="mt-3 text-[11px] uppercase tracking-[0.2em] text-white/55 whitespace-nowrap font-bold text-center">
        {experience.date}
      </p>
    </div>
  )
}

// Per-row particle config: text shape rendered behind the row in the empty
// half opposite the card.
const PARTICLE_SHAPES = {
  0: 'IA',   // FreshStock — voice + visual AI inventory
  1: 'M²',   // Valofenua — real-estate price platform
  2: 'FL',   // Freelance — multi-projets
  3: '{ }',  // Deltyo — Full-Stack
  4: 'SEO',  // Google — Certification SEO
  5: '</>',  // OpenClassrooms — Formation web
  6: '+7%',  // Del Arte — Adjoint Directeur (CA growth)
  7: '1★',   // Le Lièvre Gourmand — 1 étoile Michelin
  8: '$_',   // The Hacking Project — Bootcamp (shell prompt)
  9: '42',   // 42 — La Piscine
}

function TimelineRow({ experience, index, scrollYProgress, timelineRef }) {
  const isLeft = index % 2 === 0
  const shape = PARTICLE_SHAPES[index]
  // Card on left → particles on right · Card on right → particles on left
  const particlesSide = isLeft ? 'right' : 'left'

  return (
    <div className="relative grid grid-cols-1 lg:grid-cols-[1fr_140px_1fr] gap-6 lg:gap-10 items-stretch">
      {shape && (
        // Full-bleed canvas behind everything: spans the full viewport width,
        // matches the row height (= card height via items-stretch). z-0 so the
        // card (z-10) covers the middle, particles only show in the empty
        // halves on either side.
        <div
          aria-hidden="true"
          className="hidden lg:block absolute top-0 bottom-0 z-0 pointer-events-none"
          style={{ left: 'calc(50% - 50vw)', width: '100vw' }}
        >
          <ParticleShapeField2D shape={shape} side={particlesSide} />
        </div>
      )}
      <div className={`relative z-10 ${isLeft ? 'lg:col-start-1' : 'lg:col-start-3'}`}>
        <ExperienceCard experience={experience} />
      </div>
      <div className="hidden lg:block lg:col-start-2 lg:row-start-1 relative z-10">
        <TimelineNode
          experience={experience}
          scrollYProgress={scrollYProgress}
          timelineRef={timelineRef}
        />
      </div>
    </div>
  )
}

const Experience = () => {
  const timelineRef = useRef(null)
  // Lenis-aware scroll progress (framer-motion's useScroll relies on native
  // scroll events, which Lenis swallows). progress = 0 when timeline top
  // crosses viewport center, 1 when bottom crosses it. The rail head and
  // node-activation thresholds derive from this single MotionValue, so
  // everything stays perfectly in sync.
  const scrollYProgress = useScrollProgress(timelineRef)

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className={styles.sectionSubText}>Ce que j'ai fait jusqu'à présent</p>
        <h2 className={styles.sectionHeadText}>Expérience professionnelle</h2>
      </motion.div>

      <div ref={timelineRef} className="relative mt-16">
        <RailFill scrollYProgress={scrollYProgress} />

        <div className="relative z-10 space-y-10 lg:space-y-16">
          {experiences.map((exp, i) => (
            <TimelineRow
              key={i}
              experience={exp}
              index={i}
              scrollYProgress={scrollYProgress}
              timelineRef={timelineRef}
            />
          ))}
        </div>
      </div>
    </>
  )
}

export default SectionWrapper(Experience, 'work')
