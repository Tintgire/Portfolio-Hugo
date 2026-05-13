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
    id: 'rubi',
    name: 'Rubi te paye',
    type: 'mobile',
    featured: true,
    year: '2025',
    description: `Application qui vous paie pour qui vous êtes. Contrôle total de vos données, compensation directe à chaque utilisation, sécurité garantie.`,
    longDescription: `Rubi inverse l'équation des données personnelles : au lieu que les utilisateurs cèdent gratuitement leurs informations aux plateformes, l'application leur reverse une rémunération directe à chaque utilisation. Au cœur du produit, un système de consentement granulaire — l'utilisateur autorise (ou refuse) l'accès, donnée par donnée — et un wallet intégré qui crédite les gains en temps réel.

Côté technique, le stack est résolument mobile-first : React Native pour l'app iOS/Android avec composants natifs (Java/Kotlin/Objective-C) pour les modules de sécurité, Next.js pour le dashboard web et l'API publique, Supabase + Firebase pour la persistance et l'auth, le tout orchestré via Docker. La sécurité a été pensée dès la conception : chiffrement bout en bout des consentements et audit trail immutable.

Projet d'entreprise — code source privé. Disponible sur l'App Store.`,
    tags: [
      { name: `React Native`, color: `text-cyan-400 text-gradient` },
      { name: `Next.js`, color: `text-white text-gradient` },
      { name: `Tailwind`, color: `text-sky-400 text-gradient` },
      { name: `Supabase`, color: `text-green-400 text-gradient` },
      { name: `Firebase`, color: `text-orange-400 text-gradient` },
      { name: `Docker`, color: `text-blue-400 text-gradient` },
    ],
    tech: [
      'React Native', 'Next.js', 'Tailwind', 'Supabase', 'Docker',
      'Firebase', 'Java', 'Ruby', 'Kotlin', 'Objective-C',
      'SCSS', 'JavaScript', 'HTML', 'Shell',
    ],
    image: '/projects/rubi/screen-2.png',
    images: [
      '/projects/rubi/screen-1.png',
      '/projects/rubi/screen-2.png',
      '/projects/rubi/screen-3.png',
      '/projects/rubi/screen-4.png',
    ],
    imagePositions: ['center', 'center', 'center', 'bottom'],
    site: 'https://apps.apple.com/us/app/rubi-pays-you/id6720740387',
    source_code_link: 'https://apps.apple.com/us/app/rubi-pays-you/id6720740387',
    links: {
      live: { url: 'https://apps.apple.com/us/app/rubi-pays-you/id6720740387', label: 'App Store' },
      github: { private: true, reason: `Projet d'entreprise` },
    },
  },
  {
    id: 'kasa',
    name: `Kaza`,
    type: 'web',
    featured: false,
    year: '2023',
    description: `En utilisant React et Figma, créez une application web de location immobilière en initiant une application avec Create React App, configurant la navigation entre les pages avec React Router, et développant des éléments d'interface de site web grâce à des composants React.`,
    longDescription: `Kaza est une plateforme de location immobilière saisonnière construite en React. Le projet pédagogique de l'OpenClassrooms parcours Dev Web met l'accent sur la navigation client-side (React Router), la décomposition en composants réutilisables (Cards, Collapsible, Carousel), et l'intégration de données JSON statiques.

J'ai porté une attention particulière au responsive (SCSS modulaire avec breakpoints mobile/tablet/desktop) et aux animations de transition entre pages. Le carrousel de photos est entièrement fait-main, sans bibliothèque externe.`,
    tags: [
      { name: `Html`, color: `text-blue-500 text-gradient` },
      { name: `Css`, color: `text-green-500 text-gradient` },
      { name: `Scss`, color: `text-pink-500 text-gradient` },
      { name: `Javascript`, color: `text-orange-500 text-gradient` },
      { name: `React`, color: `text-indigo-600 text-gradient` },
      { name: `Figma`, color: `text-fuchsia-600 text-gradient` },
    ],
    tech: ['HTML', 'CSS', 'SCSS', 'JavaScript', 'React', 'Figma'],
    image: kasa,
    images: [kasa],
    site: `https://github.com/Tintgire/projet-7-OC`,
    source_code_link: `https://github.com/Tintgire/projet-7-OC`,
    links: {
      live: null,
      github: { url: `https://github.com/Tintgire/projet-7-OC` },
    },
  },
  {
    id: 'hottakes',
    name: `Hot Takes`,
    type: 'web',
    featured: false,
    year: '2023',
    description: `Construisez une API sécurisée pour une application d'avis gastronomiques, implémenter un modèle logique de données conformément à la réglementation, stocker des données de manière sécurisée et garantir la confidentialité des utilisateurs en mettant en place des mesures robustes de protection des données.`,
    longDescription: `Hot Takes est une API REST sécurisée pour une application d'avis culinaires, construite avec Node.js + Express. Le projet couvre l'authentification JWT, la gestion de l'upload d'images (Multer), la validation côté serveur, et la mise en place de mesures OWASP (rate limiting, headers sécurisés via Helmet, sanitization).

La modélisation de données utilise Mongoose pour structurer les schémas (utilisateurs, sauces, likes/dislikes) avec contraintes et indexes appropriés. Les routes sont versionnées et documentées, conformes à la pédagogie REST.`,
    tags: [
      { name: `TypeScript`, color: `blue-text-gradient` },
      { name: `Javascript`, color: `text-orange-500 text-gradient` },
      { name: `Express.js`, color: `text-lime-500 text-gradient` },
      { name: `Api Rest`, color: `text-yellow-500 text-gradient` },
      { name: `MongoDB`, color: `text-red-500 text-gradient` },
      { name: `Node.js`, color: `text-purple-500 text-gradient` },
    ],
    tech: ['TypeScript', 'JavaScript', 'Express.js', 'REST API', 'MongoDB', 'Node.js'],
    image: hottakes,
    images: [hottakes],
    site: `https://github.com/Tintgire/Projet-6-OC`,
    source_code_link: `https://github.com/Tintgire/Projet-6-OC`,
    links: {
      live: null,
      github: { url: `https://github.com/Tintgire/Projet-6-OC` },
    },
  },
  {
    id: 'kanap',
    name: `Kanap`,
    type: 'web',
    featured: false,
    year: '2022',
    description: `En construisant un site e-commerce en JavaScript, vous serez en mesure de créer un plan de test pour l'application, de valider les données provenant de sources externes, d'interagir avec un web service à l'aide de JavaScript, et de gérer les événements JavaScript.`,
    longDescription: `Kanap est un site e-commerce de canapés codé en JavaScript vanilla — pas de framework, juste les fondamentaux. Le projet entraîne sur la gestion du DOM, la consommation d'une API REST, la persistance d'un panier en localStorage, et la validation de formulaires côté client avec regex.

Pour le plan de test, j'ai documenté les cas d'usage critiques (ajout au panier, modification de quantité, validation de commande) et identifié les bugs côté API en testant chaque endpoint via Postman. Un exercice solide de fondations avant de monter en abstraction sur les frameworks.`,
    tags: [
      { name: `Html`, color: `text-blue-500 text-gradient` },
      { name: `Css`, color: `text-green-500 text-gradient` },
      { name: `Scss`, color: `text-pink-500 text-gradient` },
      { name: `Javascript`, color: `text-orange-500 text-gradient` },
    ],
    tech: ['HTML', 'CSS', 'SCSS', 'JavaScript'],
    image: kanap,
    images: [kanap],
    site: `https://github.com/Tintgire/Projet-5-OC`,
    source_code_link: `https://github.com/Tintgire/Projet-5-OC`,
    links: {
      live: null,
      github: { url: `https://github.com/Tintgire/Projet-5-OC` },
    },
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
