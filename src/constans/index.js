import {
  mobile,
  backend,
  creator,
  web,
  javascript,
  typescript,
  html,
  css,
  reactjs,
  sass,
  tailwind,
  nodejs,
  mongodb,
  git,
  figma,
  php,
  ecole,
  oc,
  delarte,
  kitsune,
  kasa,
  hottakes,
  kanap,
  threejs,
  cv,
  diplome,
} from '../assets'

export const navLinks = [
  {
    id: 'about',
    title: 'About',
  },
  {
    id: 'work',
    title: 'Work',
  },
  {
    id: 'contact',
    title: 'Contact',
  },
]

const services = [
  {
    title: 'Web Developer',
    icon: web,
  },
  {
    title: 'React Native Developer',
    icon: mobile,
  },
  {
    title: 'Backend Developer',
    icon: backend,
  },
  {
    title: 'Full Stack Developer',
    icon: creator,
  },
]

const technologies = [
  {
    name: 'HTML 5',
    icon: html,
    link: `https://fr.wikipedia.org/wiki/HTML5`,
  },
  {
    name: 'CSS 3',
    icon: css,
    link: `https://fr.wikipedia.org/wiki/Feuilles_de_style_en_cascade#`,
  },
  {
    name: 'JavaScript',
    icon: javascript,
    link: `https://fr.wikipedia.org/wiki/JavaScript`,
  },
  {
    name: 'TypeScript',
    icon: typescript,
    link: `https://fr.wikipedia.org/wiki/TypeScript`,
  },
  {
    name: 'React JS',
    icon: reactjs,
    link: `https://fr.wikipedia.org/wiki/React`,
  },
  {
    name: 'Sass',
    icon: sass,
    link: `https://sass-lang.com/`,
  },
  {
    name: 'Tailwind CSS',
    icon: tailwind,
    link: `https://fr.wikipedia.org/wiki/Tailwind_CSS`,
  },
  {
    name: 'Node JS',
    icon: nodejs,
    link: `https://fr.wikipedia.org/wiki/Node.js`,
  },
  {
    name: 'MongoDB',
    icon: mongodb,
    link: `https://google.com`,
  },
  {
    name: 'Three JS',
    icon: threejs,
    link: `https://fr.wikipedia.org/wiki/Three.js`,
  },
  {
    name: 'git',
    icon: git,
    link: `https://fr.wikipedia.org/wiki/Git`,
  },
  {
    name: 'figma',
    icon: figma,
    link: `https://fr.wikipedia.org/wiki/Figma`,
  },
  {
    name: 'php',
    icon: php,
    link: `https://fr.wikipedia.org/wiki/PHP`,
  },
]

const experiences = [
  {
    title: 'Site Web',
    company_name: 'A Domicile',
    icon: kitsune,
    iconBg: '#231851',
    date: 'Mars 2023 - Juin 2023',
    points: [
      `Développer et maintenir le site web à l'aide de React.js et d'autres technologies connexes.`,
      `Mettre en œuvre une conception réactive et assurer la compatibilité entre les navigateurs.`,
      `Créer et gérer aisément des scènes 3D dans un navigateur via Three.js.`,
      `Utilisation de Tailwind CSS, un framework CSS , afin de garantir sa compatibilité avec différents appareils et d'assurer le responsive`,
    ],
  },
  {
    title: 'Développeur Web',
    company_name: 'OPENCLASSROOM',
    icon: oc,
    iconBg: '#E6DEDD',
    date: 'Mars 2022 - Mars 2023',
    points: [
      `Obtention Bac +2 en Informatique.`,
      `Formation au métier de Développeur web Full Stack qui consiste à réaliser 7 projets tirés de cas concrets d'entreprises avec le soutien d'un mentor professionnel.`,
      `Technos: HTML / CSS / SASS / JS / SEO / NodeJS / Express / Mongoose / React / MongoDB / Figma`,
      `Création d'un serveur Discord dédié aux étudiants afin de les soutenir dans leurs projets OC, favorisant ainsi le développement de leurs compétences tout en enrichissant mes connaissances pédagogiques.`,
      `Capacité à apprendre seul via des veilles informatique tout en échangeant avec des étudiants (Peer to Peer).`,
    ],
  },
  {
    title: 'Responsable Adjoint',
    company_name: 'Del Arte',
    icon: delarte,
    iconBg: '#231851',
    date: 'Aout 2014 - Mars 2022',
    points: [
      `Polyvalent en salle et cuisine.`,
      `Gérer une équipe pendant les services en leur donnant des objectifs journalier / annuel pour progresser.`,
      `Gestion du restaurant, inventaire, progression d'équipe et responsable de l'hygiène.`,
      `Formation interne via le groupe LE DUFF, apprentissage dans plus de 10 restaurants Del Arte pour avoir de nouveaux outils.`,
    ],
  },
  {
    title: 'Piscine 42',
    company_name: '42',
    icon: ecole,
    iconBg: '#E6DEDD',
    date: 'Juillet 2014 - Aout 2014',
    points: [
      `Programmation en C : Fort accent sur l'apprentissage du langage de programmation C. Exposés aux concepts fondamentaux de la programmation, tels que les variables, les boucles, les conditions, les pointeurs, les structures de données, etc., en utilisant le langage C.`,
      `Résolution de problèmes : Accent sur l'apprentissage de la résolution de problèmes à travers des exercices pratiques et des projets. Encouragés à penser de manière logique et créative pour trouver des solutions efficaces.`,
      `Collaboration et travail d'équipe : Amenés à travailler sur des projets en équipe, ce qui favorise l'apprentissage de la communication, de la coordination et du travail en groupe.`,
      `Autonomie et auto-apprentissage : Apprentissage basé sur le principe d'auto-apprentissage. Encouragés à rechercher des ressources, à explorer et à approfondir les connaissances de manière autonome`,
    ],
  },
]

const testimonials = [
  {
    testimonial: `Le Site internet est véritablement excellent, non seulement il est magnifique, mais il se distingue également par sa productivité et sa rigueur. Merci pour les moments passer ensemble.`,
    name: `Valérie Malen`,
    designation: `Directeur`,
    company: `Del arte`,
    image: `https://randomuser.me/api/portraits/women/4.jpg`,
  },
  {
    testimonial: `Le Site internet est véritablement excellent, non seulement en raison de sa magnificence, mais également grâce à sa productivité et à sa rigueur, qui le distinguent.`,
    name: `Jean Laval`,
    designation: `Responsable`,
    company: `Chanel`,
    image: `https://randomuser.me/api/portraits/men/5.jpg`,
  },
  {
    testimonial: `Le Site internet se démarque véritablement en raison de sa magnificence, mais aussi par sa productivité et sa rigueur exceptionnelles, ce qui en fait une véritable référence.`,
    name: `Manon Corret`,
    designation: `CEO`,
    company: `Licorne`,
    image: `https://randomuser.me/api/portraits/women/6.jpg`,
  },
]

const projects = [
  {
    name: `Kaza`,
    description: `En utilisant React et Figma, créez une application web de location immobilière en initiant une application avec Create React App, configurant la navigation entre les pages avec React Router, et développant des éléments d'interface de site web grâce à des composants React.`,
    tags: [
      {
        name: `Html`,
        color: `text-blue-500 text-gradient`,
      },
      {
        name: `Css`,
        color: `text-green-500 text-gradient`,
      },
      {
        name: `Scss`,
        color: `text-pink-500 text-gradient`,
      },
      {
        name: `Javascript`,
        color: `text-orange-500 text-gradient`,
      },
      {
        name: `React`,
        color: `text-indigo-600 text-gradient`,
      },
      {
        name: `Figma`,
        color: `text-fuchsia-600 text-gradient`,
      },
    ],
    image: kasa,
    source_code_link: `https://github.com/Tintgire/projet-7-OC`,
    site: `https://github.com/Tintgire/projet-7-OC`,
  },
  {
    name: `Hot Takes`,
    description: `Construisez une API sécurisée pour une application d'avis gastronomiques, implémenter un modèle logique de données conformément à la réglementation, stocker des données de manière sécurisée et garantir la confidentialité des utilisateurs en mettant en place des mesures robustes de protection des données.`,
    tags: [
      {
        name: `TypeScript`,
        color: `blue-text-gradient`,
      },
      {
        name: `Javascript`,
        color: `text-orange-500 text-gradient`,
      },
      {
        name: `Express.js`,
        color: `text-lime-500 text-gradient`,
      },
      {
        name: `Api Rest`,
        color: `text-yellow-500 text-gradient`,
      },
      {
        name: `MongoDB`,
        color: `text-red-500 text-gradient`,
      },
      {
        name: `Node.js`,
        color: `text-purple-500 text-gradient`,
      },
    ],
    image: hottakes,
    source_code_link: `https://github.com/Tintgire/Projet-6-OC`,
    site: `https://github.com/Tintgire/Projet-6-OC`,
  },
  {
    name: `Kanap`,
    description: `En construisant un site e-commerce en JavaScript, vous serez en mesure de créer un plan de test pour l'application, de valider les données provenant de sources externes, d'interagir avec un web service à l'aide de JavaScript, et de gérer les événements JavaScript.`,
    tags: [
      {
        name: `Html`,
        color: `text-blue-500 text-gradient`,
      },
      {
        name: `Css`,
        color: `text-green-500 text-gradient`,
      },
      {
        name: `Scss`,
        color: `text-pink-500 text-gradient`,
      },
      {
        name: `Javascript`,
        color: `text-orange-500 text-gradient`,
      },
    ],
    image: kanap,
    source_code_link: `https://github.com/Tintgire/Projet-5-OC`,
    site: `https://github.com/Tintgire/Projet-5-OC`,
  },
]

const Downloads = [
  {
    name: `Curriculum vitae`,
    description: `En utilisant React et Figma, créez une application web de location immobilière en initiant une application avec Create React App, configurant la navigation entre les pages avec React Router, et développant des éléments d'interface de site web grâce à des composants React.`,
    button: `Télécharge mon CV 🧙🏽‍♂`,
    image: cv,
    pdfUrlOpen: `/pdf/CV_Hugo.pdf`,
    pdfUrlDownload: `/pdf/CV_Hugo.pdf`,
  },
  {
    name: `Diplome dev web`,
    description: `En utilisant React et Figma, créez une application web de location immobilière en initiant une application avec Create React App, configurant la navigation entre les pages avec React Router, et développant des éléments d'interface de site web grâce à des composants React.`,
    button: `Télécharge mon Diplome 🧙🏽‍♂`,
    image: diplome,
    pdfUrlOpen: `/pdf/Diplome_dev_web.pdf`,
    pdfUrlDownload: `/pdf/Diplome_dev_web.pdf`,
  },
]

export {
  services,
  technologies,
  experiences,
  testimonials,
  projects,
  Downloads,
}
