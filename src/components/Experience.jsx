import React, { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

import { experiences } from '../constans'
import { SectionWrapper } from '../hoc'
import { playTick } from '../lib/audio/uiSounds'

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

function TimelineNode({ experience }) {
  const hasIcon = !!experience.icon
  return (
    <div className="flex flex-col items-center pt-8">
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center text-white font-black text-base shadow-[0_0_0_4px_#1d1836]"
        style={{ background: experience.iconBg ?? '#915EFF' }}
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
      </div>
      <p className="mt-3 text-[11px] uppercase tracking-[0.2em] text-white/55 whitespace-nowrap font-bold text-center">
        {experience.date}
      </p>
    </div>
  )
}

function TimelineRow({ experience, index }) {
  const isLeft = index % 2 === 0
  const showParticles = index === 0 // Deltyo only for now

  return (
    <div className="relative grid grid-cols-1 lg:grid-cols-[1fr_140px_1fr] gap-6 lg:gap-10 items-stretch">
      {showParticles && (
        // Full-bleed canvas behind everything: spans the full viewport width,
        // matches the row height (= card height via items-stretch). z-0 so the
        // card (z-10) covers the middle, particles only show in the empty
        // halves on either side.
        <div
          aria-hidden="true"
          className="hidden lg:block absolute top-0 bottom-0 z-0 pointer-events-none"
          style={{ left: 'calc(50% - 50vw)', width: '100vw' }}
        >
          <ParticleShapeField2D />
        </div>
      )}
      <div className={`relative z-10 ${isLeft ? 'lg:col-start-1' : 'lg:col-start-3'}`}>
        <ExperienceCard experience={experience} />
      </div>
      <div className="hidden lg:block lg:col-start-2 lg:row-start-1 relative z-10">
        <TimelineNode experience={experience} />
      </div>
    </div>
  )
}

const Experience = () => {
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

      <div className="relative mt-16">
        {/* Center vertical rail — desktop only */}
        <div
          aria-hidden="true"
          className="hidden lg:block absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-px bg-gradient-to-b from-transparent via-purple-500/40 to-transparent pointer-events-none z-[1]"
        />

        <div className="relative z-10 space-y-10 lg:space-y-16">
          {experiences.map((exp, i) => (
            <TimelineRow key={i} experience={exp} index={i} />
          ))}
        </div>
      </div>
    </>
  )
}

export default SectionWrapper(Experience, 'work')
