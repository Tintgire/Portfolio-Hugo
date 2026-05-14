import React, { useEffect, useRef } from 'react'
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from 'react-vertical-timeline-component'
import { motion } from 'framer-motion'

import { experiences } from '../constans'
import { SectionWrapper } from '../hoc'
import { textVariant } from '../utils/motion'
import { playTick } from '../lib/audio/uiSounds'

import 'react-vertical-timeline-component/style.min.css'
import { styles } from '../styles'

const Section = ({ label, children }) => (
  <div className="mt-4">
    <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/55 mb-1.5">
      {label}
    </h4>
    {children}
  </div>
)

const ExperienceCard = ({ experience }) => {
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
    <VerticalTimelineElement
      contentStyle={{
        background: 'linear-gradient(135deg, #1a0a35 0%, #2a1156 100%)',
        color: '#fff',
        boxShadow: '0 10px 40px -10px rgba(145, 94, 255, 0.35)',
        border: '1px solid rgba(145, 94, 255, 0.25)',
        borderRadius: '20px',
        padding: '28px 30px',
      }}
      contentArrowStyle={{ borderRight: '7px solid #2a1156' }}
      date={experience.date}
      iconStyle={{
        background: experience.iconBg ?? '#915EFF',
        boxShadow: '0 0 0 4px #1d1836, inset 0 2px 4px rgba(0, 0, 0, 0.3)',
      }}
      icon={
        hasIcon ? (
          <div className="flex justify-center items-center w-full h-full">
            <img
              src={experience.icon}
              alt={experience.company_name}
              className="w-[60%] h-[60%] object-contain"
            />
          </div>
        ) : (
          <div className="flex justify-center items-center w-full h-full text-white font-black text-base tracking-wide">
            {experience.initials}
          </div>
        )
      }
    >
      <div ref={ref}>
        {experience.type && (
          <div className="inline-flex items-center text-[10px] font-bold uppercase tracking-[0.2em] px-2 py-1 rounded bg-pink-500/15 border border-pink-500/40 text-pink-300 mb-3">
            {experience.type}
          </div>
        )}

        <h3 className="text-white text-[22px] sm:text-[24px] font-bold leading-tight">
          {experience.title}
        </h3>

        <p
          className="mt-1 text-purple-200 text-[15px] font-semibold tracking-wide"
          style={{ margin: 0 }}
        >
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
      </div>
    </VerticalTimelineElement>
  )
}

const Experience = () => {
  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>
          Ce que j'ai fait jusqu'à présent
        </p>
        <h2 className={styles.sectionHeadText}>Expérience professionnelle</h2>
      </motion.div>

      <div className="mt-20 flex flex-col">
        <VerticalTimeline>
          {experiences.map((experience, index) => (
            <ExperienceCard key={index} experience={experience} />
          ))}
        </VerticalTimeline>
      </div>
    </>
  )
}

export default SectionWrapper(Experience, 'work')
