import React, { useState, useCallback } from 'react'
import { Tilt } from 'react-tilt'
import { motion } from 'framer-motion'

import { styles } from '../styles'
import { github } from '../assets'

import { SectionWrapper } from '../hoc'
import { projects } from '../constans'
import { fadeIn, textVariant } from '../utils/motion'
import FeaturedProject from './works/FeaturedProject'
import ProjectDrawer from './works/ProjectDrawer'

const ProjectCard = ({
  index,
  project,
  onOpen,
}) => {
  const { id, name, description, tags, image, source_code_link } = project

  return (
    <motion.div variants={fadeIn('up', 'spring', index * 0.5, 0.75)}>
      <Tilt
        options={{
          max: 45,
          scale: 1,
          speed: 450,
        }}
        className="bg-tertiary p-5 rounded-2xl sm:w-[360px] w-full cursor-pointer"
      >
        <div
          role="button"
          tabIndex={0}
          onClick={() => onOpen?.(id)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              onOpen?.(id)
            }
          }}
        >
          <div className="relative w-full h-[230px]">
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover rounded-2xl"
            />

            <div className="absolute inset-0 flex justify-end m-3">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  window.open(source_code_link, '_blank')
                }}
                aria-label={`Ouvrir le code source de ${name}`}
                className="black-gradient w-10 h-10 rounded-full flex justify-center items-center cursor-pointer"
              >
                <img
                  src={github}
                  alt=""
                  className="w-1/2 h-1/2 object-contain"
                />
              </button>
            </div>
          </div>

          <div className="mt-5">
            <h3 className="text-white font-bold text-[24px]">{name}</h3>
            <p className="mt-2 text-secondary text-[14px]">{description}</p>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <p key={tag.name} className={`text-[14px] ${tag.color}`}>
                #{tag.name}
              </p>
            ))}
          </div>
        </div>
      </Tilt>
    </motion.div>
  )
}

const Works = () => {
  const featured = projects.filter((p) => p.featured)
  const others = projects.filter((p) => !p.featured)

  const [openId, setOpenId] = useState(null)
  const openProject = useCallback((id) => setOpenId(id), [])
  const closeProject = useCallback(() => setOpenId(null), [])

  const activeProject = openId ? projects.find((p) => p.id === openId) : null

  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>Mon Travail</p>
        <h2 className={styles.sectionHeadText}>Projets.</h2>
      </motion.div>

      <div className="w-full flex">
        <motion.p
          variants={fadeIn('', '', 0.1, 1)}
          className="mt-3 text-secondary text-[17px] max-w-3xl leading-[30px]"
        >
          Voici mes projets finis, soigneusement réalisés avec passion et
          dévouement au fil du temps. Chacun d'entre eux représente un
          aboutissement personnel, et j'espère sincèrement qu'ils vous
          procureront satisfaction et plaisir. N'hésitez pas à les explorer en
          détail et, si l'un d'entre eux retient particulièrement votre
          attention, je serais ravi de recevoir vos commentaires et vos
          impressions. Votre retour est précieux pour moi, car il alimente ma
          motivation et m'encourage à continuer à créer des œuvres qui suscitent
          l'enthousiasme. Alors, parcourez-les à votre guise et laissez libre
          cours à votre appréciation. Merci d'avance pour votre intérêt et votre
          soutien, et j'attends avec impatience vos messages enthousiastes! :D
        </motion.p>
      </div>

      {featured.length > 0 && (
        <div className="mt-16">
          {featured.map((project) => (
            <FeaturedProject
              key={project.id}
              project={project}
              onOpen={openProject}
            />
          ))}
        </div>
      )}

      <div className="mt-12 flex flex-wrap gap-7">
        {others.map((project, index) => (
          <ProjectCard
            key={project.id ?? `project-${index}`}
            project={project}
            index={index}
            onOpen={openProject}
          />
        ))}
      </div>

      <ProjectDrawer project={activeProject} onClose={closeProject} />
    </>
  )
}

export default SectionWrapper(Works, '')
