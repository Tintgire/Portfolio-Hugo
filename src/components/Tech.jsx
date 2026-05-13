import React from 'react'
import { BallCanvas } from './canvas'
import { SectionWrapper } from '../hoc'
import { technologies } from '../constans'

const Tech = () => {
  // Gestionnaire d'événement de double clic sur la balle
  const handleBallDoubleClick = (link) => {
    // Ouvre le lien donné dans un nouvel onglet
    window.open(link, '_blank')
  }

  return (
    <div className="flex flex-row flex-wrap justify-center gap-10">
      {technologies.map((technology) => (
        <div
          className="w-28 h-28 cursor-pointer"
          key={technology.name}
          // Passe le lien associé à la balle comme argument lors du double clic
          onDoubleClick={() => handleBallDoubleClick(technology.link)}
        >
          <BallCanvas icon={technology.icon} />
        </div>
      ))}
    </div>
  )
}

export default SectionWrapper(Tech, '')
