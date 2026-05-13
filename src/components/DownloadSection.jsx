// Import des bibliothèques et composants nécessaires
import React from 'react'
import { Tilt } from 'react-tilt'
import { motion } from 'framer-motion'

// Import des styles, des constantes et des fonctions d'animation définies ailleurs
import { styles } from '../styles'

import { SectionWrapper } from '../hoc'
import { Downloads } from '../constans'
import { fadeIn, textVariant } from '../utils/motion' // Assurez-vous que ces fonctions sont correctement définies dans le fichier utils/motion, ou importez-les depuis l'emplacement approprié.

// Composant DownloadSection
const DownloadSection = () => {
  // Fonction de téléchargement
  const handleDownload = (pdfUrl) => {
    // Extrait le nom du fichier du chemin d'accès à partir de l'URL
    const fileName = pdfUrl.split('/').pop()
    // Crée un élément d'ancrage (lien) pour le téléchargement
    const anchor = document.createElement('a')
    anchor.href = pdfUrl
    anchor.download = fileName // Utilise le nom du fichier extrait pour le téléchargement
    anchor.click() // Simule le clic sur le lien pour déclencher le téléchargement
  }

  // Fonction d'ouverture dans un nouvel onglet
  const handleOpen = (pdfUrl) => {
    // Crée un élément d'ancrage (lien) pour l'ouverture du PDF dans un nouvel onglet
    const anchor = document.createElement('a')
    anchor.href = pdfUrl
    anchor.target = '_blank' // Ouvre le PDF dans un nouvel onglet/tab
    anchor.rel = 'noopener noreferrer' // Ajoute les attributs de sécurité recommandés
    anchor.click() // Simule le clic sur le lien pour déclencher l'ouverture du PDF dans le nouvel onglet
  }

  return (
    <>
      {/* JSX pour le titre */}
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>Document</p>
        <h2 className={styles.sectionHeadText}>À Télécharger.</h2>
      </motion.div>

      {/* JSX pour les éléments de téléchargement */}
      <div className="mt-20 flex flex-wrap gap-7">
        {Downloads.map((Download, index) => (
          <motion.div
            key={`download-${index}`}
            variants={fadeIn('up', 'spring', index * 0.5, 0.75)}
            className="cursor-pointer"
          >
            {/* Div contenant l'élément de téléchargement */}
            <div onClick={() => handleOpen(Download.pdfUrlOpen)}>
              {/* Composant Tilt pour l'effet de bascule */}
              <Tilt
                options={{
                  max: 45,
                  scale: 1,
                  speed: 450,
                }}
                className="bg-tertiary p-5 rounded-2xl sm:w-[360px] w-full"
              >
                {/* Image */}
                <div className="relative w-full h-[230px]">
                  <img
                    src={Download.image}
                    alt="download"
                    className="w-full h-full object-cover rounded-2xl"
                  />
                </div>

                {/* Nom et description */}
                <div className="mt-5">
                  <h3 className="text-white font-bold text-[24px]">
                    {Download.name}
                  </h3>
                  <p className="mt-2 text-secondary text-[14px]">
                    {Download.description}
                  </p>
                </div>

                {/* Bouton de téléchargement */}
                <button
                  onClick={(e) => {
                    e.stopPropagation() // Empêche la propagation de l'événement au div parent
                    handleDownload(Download.pdfUrlDownload)
                  }}
                  className="bg-purple-600 hover:bg-purple-700 mt-4 flex flex-wrap gap-2 font-bold py-2 px-4 rounded"
                >
                  {Download.button}
                </button>
              </Tilt>
            </div>
          </motion.div>
        ))}
      </div>
    </>
  )
}

// Export du composant enveloppé avec SectionWrapper
export default SectionWrapper(DownloadSection, '')
