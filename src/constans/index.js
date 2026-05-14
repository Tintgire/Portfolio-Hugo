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
  freshstock,
  valofenua,
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
    title: 'Product Engineer',
    icon: 'product',
  },
  {
    title: '3D & Creative Developer',
    icon: 'threed',
  },
  {
    title: 'AI Integration',
    icon: 'ai',
  },
  {
    title: 'DevOps / Cloud',
    icon: 'devops',
  },
  {
    title: 'Co-fondateur / Tech Lead',
    icon: 'lead',
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
    type: 'Co-fondateur · Startup',
    title: 'Co-fondateur & Développeur — FreshStock',
    company_name: 'FreshStock',
    context: 'B2B inventaire restauration vocale + IA · iOS / Android / web',
    icon: freshstock,
    iconBg: '#064E3B',
    date: '2026 — Présent',
    challenge: `Réinventer l'inventaire en restauration : remplacer les 2 h de comptage Excel manuel par une app qui comprend la voix, lit le visuel, et calcule le stock en temps réel.`,
    actionsLabel: 'Architecture & stack',
    points: [
      `Backend FastAPI + PostgreSQL + Redis · auth JWT, billing Stripe, mails Resend.`,
      `App mobile React Native + Expo SDK 54 — mode vocal (Whisper API fr-FR), mode visuel (estimation volumétrique sur bacs Gastronorm EN 631), mode manuel.`,
      `Site marketing Next.js 15 + React 19 + Tailwind 4 + shadcn.`,
      `Déploiement Railway · Catalogue seed de 46 produits et 24 contenants normalisés.`,
    ],
    results: `MVP en cours — objectif passage de 2 h à 20 min par inventaire.`,
    stack: ['FastAPI', 'PostgreSQL', 'React Native', 'Expo SDK 54', 'Next.js 15', 'OpenAI Whisper', 'Stripe', 'Railway'],
  },
  {
    type: 'Co-fondateur · Startup',
    title: 'Co-fondateur & Lead Dev — Valofenua',
    company_name: 'Valofenua',
    context: `Plateforme d'estimation immobilière · marché polynésien`,
    icon: valofenua,
    iconBg: '#0C4A6E',
    date: '2024 — 2026',
    challenge: `Bâtir une plateforme d'estimation de prix immobilier pour la Polynésie française : collecte automatisée des annonces, agent IA pour l'estimation, génération de rapports PDF.`,
    actionsLabel: 'Réalisations',
    points: [
      `Architecture full-stack React 19 + Vite 7 + Supabase (auth & PostgreSQL).`,
      `Web scraper quotidien collectant 1 300+ annonces automatiquement.`,
      `Agent IA n8n exploitant la base pour calculer les estimations.`,
      `Génération PDF côté client (@react-pdf/renderer) avec branding agence.`,
      `Management de l'équipe dev en collaboration avec le CEO — traduction des choix techniques au business.`,
    ],
    stack: ['React 19', 'Vite 7', 'Supabase', 'PostgreSQL', 'n8n', '@react-pdf/renderer', 'Vercel'],
  },
  {
    type: 'Freelance · Web',
    title: 'Développeur Web Freelance',
    company_name: 'Indépendant',
    context: 'Sites sur-mesure pour artisans, créatifs, marques personnelles',
    initials: 'FL',
    iconBg: '#A855F7',
    date: '2025',
    challenge: `Livrer des sites web sur-mesure à des clients variés — du portfolio éditorial brutaliste au site vitrine artisanal classique.`,
    keyProjects: [
      { name: 'Lou Studio', description: `Portfolio brutaliste pour makeup artist parisienne · Next.js 16 + React 19 + Three.js + GSAP. Direction cinématique, scroll piloté, 3D custom, bilingue FR/EN.` },
      { name: 'Olivier Mallet — Menuiserie', description: `Site vitrine pour artisan menuisier · React + Chakra UI + Google Maps + Nodemailer pour le formulaire de contact.` },
    ],
    stack: ['Next.js 16', 'React 19', 'Three.js', 'GSAP', 'Tailwind v4', 'Chakra UI', 'Vercel'],
  },
  {
    type: 'CDI · Startup',
    title: 'Développeur Full-Stack & Gestion de projet',
    company_name: 'Deltyo',
    context: 'App mobile iOS / Android & site web — full télétravail',
    initials: 'D',
    iconBg: '#915EFF',
    date: '2024 — 2025',
    challenge: `Développer la nouvelle offre produit multi-plateformes : iOS, Android, web et back-office.`,
    actionsLabel: 'Actions',
    points: [
      `Implémentation des features cross-platform en collaboration directe avec le design UI/UX.`,
      `Architecture et choix techniques sur les quatre surfaces (mobile, web, back-office).`,
      `Méthodologie Agile, livraison continue, organisation 100% distante.`,
    ],
    results: `Livraison réussie de la nouvelle offre produit en environnement startup, full télétravail.`,
    stack: ['React Native', 'React.js', 'Node.js', 'Redux', 'Notion', 'Agile'],
  },
  {
    type: 'Certification',
    title: 'Google Fundamentals of Digital Marketing — SEO',
    company_name: 'Google',
    context: 'Auto-formation continue & montée en compétence',
    initials: 'G',
    iconBg: '#4285F4',
    date: '2023 — 2024',
    challenge: `Maîtriser les fondamentaux du référencement organique et de la stratégie digitale, complément aux compétences dev.`,
    actionsLabel: 'Apports',
    points: [
      `Architecture sémantique, mots-clés, intention de recherche.`,
      `Google Search Console et Google Analytics — lecture, stratégie, itération.`,
      `Application directe sur projets personnels et collaborations.`,
    ],
    stack: ['SEO', 'Google Analytics', 'Search Console'],
  },
  {
    type: 'Diplôme · Bac +2',
    title: 'Développeur Web — Formation intensive',
    company_name: 'OpenClassrooms',
    context: 'Diplôme niveau 5 (Bac +2) · Mentorat professionnel',
    icon: oc,
    iconBg: '#E6DEDD',
    date: '2022 — 2023',
    challenge: `Maîtriser le cycle complet du développement web : 7 applications de la maquette au déploiement.`,
    keyProjects: [
      { name: 'E-commerce', description: `JavaScript vanilla, LocalStorage, gestion panier.` },
      { name: 'Réseau social', description: `API REST sécurisée, Node.js / Express, MongoDB, full stack.` },
      { name: 'Réservation voyages', description: `Flux de données complexes, filtres avancés, UX intuitive.` },
      { name: 'Site vitrine', description: `Animations CSS / JS sur mesure.` },
      { name: 'Portfolio 3D', description: `Three.js, rendus interactifs — l'embryon de ce site.` },
    ],
    results: `Diplôme validé 7/7 projets. Cycle complet Front-end / Back-end / BDD / UX. Architectures SPA & API REST. Clean code, revue de code, autonomie.`,
    stack: ['HTML', 'CSS', 'Sass', 'JavaScript', 'Node.js', 'Express', 'MongoDB', 'React', 'Three.js', 'Figma'],
  },
  {
    type: 'CDI · Management',
    title: 'Adjoint Directeur & Responsable Opérationnel',
    company_name: 'Del Arte',
    context: 'Restaurant ≈ 2 M€ de CA annuel · équipe 20 personnes',
    icon: delarte,
    iconBg: '#D32027',
    date: '2014 — 2022',
    challenge: `Performance et croissance d'un restaurant à fort volume. Management d'équipe et standards qualité / hygiène en environnement haute pression.`,
    points: [
      `Progression interne sur 8 ans : Serveur/Cuisinier → Leader salle → Adjoint Directeur.`,
      `Gestion opérationnelle complète : services, stocks, approvisionnements.`,
      `Hygiène et sécurité — méthode HACCP.`,
      `Management : recrutement, formation, objectifs, plannings, briefings.`,
      `Formation interne groupe Le Duff, immersion dans 10+ restaurants Del Arte.`,
    ],
    results: `+7 % de CA par an. Leadership en haute pression, délégation, organisation rigoureuse, progression mesurable des collaborateurs.`,
  },
  {
    type: 'CDI · Restauration étoilée',
    title: 'Serveur / Cuisinier — Leader salle',
    company_name: 'Le Lièvre Gourmand',
    context: '1 étoile Michelin',
    initials: 'LG',
    iconBg: '#C9A227',
    date: '2018 — 2019',
    challenge: `Service à standards Michelin — précision, exigence, gestion d'une salle gastronomique haut de gamme.`,
    points: [
      `Polyvalence salle / cuisine en environnement étoilé.`,
      `Accompagnement client dans une expérience gastronomique sur-mesure.`,
      `Travail en brigade, communication serrée cuisine / salle.`,
    ],
  },
  {
    type: 'Bootcamp · 3 mois',
    title: 'The Hacking Project — Ruby on Rails',
    company_name: 'The Hacking Project',
    context: 'thehackingproject.org · format intensif, gratuit, à distance',
    initials: 'THP',
    iconBg: '#0F172A',
    date: 'Automne 2019',
    challenge: `Devenir développeur full-stack en 3 mois, en mode startup — projets en équipe, sprints, code review entre élèves.`,
    points: [
      `Ruby & Ruby on Rails — full-stack en équipe, du modèle au déploiement.`,
      `Méthodologie Agile : sprints courts, daily stand-ups, démos hebdo.`,
      `Pair programming intensif et code review entre élèves.`,
      `Confirmation du pivot vers le développement après le test 42.`,
    ],
    stack: ['Ruby', 'Ruby on Rails', 'Git', 'Agile'],
  },
  {
    type: 'Bootcamp · 1 mois',
    title: 'École 42 — La Piscine',
    company_name: '42',
    context: 'Format de sélection intensif, 7J/7',
    icon: ecole,
    iconBg: '#231851',
    date: 'Été 2019',
    challenge: `Tester l'aptitude au métier de développeur via le programme de sélection le plus exigeant — sans profs, sans cours, en peer learning total.`,
    points: [
      `Programmation en C : pointeurs, structures, algorithmes, gestion mémoire.`,
      `Résolution de problèmes en autonomie totale, recherche active.`,
      `Peer learning : on apprend par et avec les autres élèves, pas de mentorat descendant.`,
    ],
    stack: ['C', 'Algorithmes', 'Peer learning'],
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
    id: 'freshstock',
    name: 'FreshStock',
    type: 'mobile',
    featured: true,
    mockup: 'phones',
    year: '2026',
    description: `App B2B qui digitalise l'inventaire en restauration via voix + IA. Whisper, FastAPI, React Native — passer de 2 h de comptage Excel à 20 min en cuisine.`,
    longDescription: `FreshStock réinvente l'inventaire en restauration. Au lieu des 2 heures de comptage Excel manuel à chaque prise, l'app permet à l'équipe cuisine de dire "5 kilos de boeuf haché" dans la chambre froide — un service NLP (OpenAI Whisper, fr-FR) parse le speech, identifie le produit, et calcule le stock en temps réel. Trois modes coexistent : vocal (le plus rapide), visuel (estimation volumétrique sur bacs Gastronorm normalisés EN 631 via calcul densité × volume), et manuel (saisie classique).

Côté technique, le backend FastAPI 0.115 + Python 3.11 sert une API REST sur PostgreSQL 16 + SQLAlchemy 2 + Alembic, avec Redis 7 pour le rate limiting et le cache, JWT pour l'auth, Stripe pour la facturation, Resend pour les mails transactionnels. L'app mobile React Native + Expo SDK 54 + TanStack Query (avec persistance AsyncStorage) communique avec le backend principal et avec un Supabase secondaire. Le site marketing est en Next.js 15 + React 19 + Tailwind 4 + shadcn. Déploiement Railway via Dockerfile + nixpacks. Catalogue seed de 46 produits et 24 contenants normalisés.

Mon rôle : co-fondateur, architecte technique, dev lead sur les trois surfaces (mobile, web marketing, backend).`,
    tags: [
      { name: `React Native`, color: `text-cyan-400 text-gradient` },
      { name: `FastAPI`, color: `text-emerald-400 text-gradient` },
      { name: `OpenAI Whisper`, color: `text-green-300 text-gradient` },
      { name: `PostgreSQL`, color: `text-blue-400 text-gradient` },
      { name: `Stripe`, color: `text-violet-400 text-gradient` },
      { name: `Next.js 15`, color: `text-white text-gradient` },
    ],
    tech: [
      'FastAPI', 'Python 3.11', 'PostgreSQL 16', 'SQLAlchemy 2', 'Alembic',
      'Redis 7', 'React Native', 'Expo SDK 54', 'TanStack Query',
      'Next.js 15', 'React 19', 'Tailwind 4', 'shadcn',
      'OpenAI Whisper', 'Stripe', 'Resend',
      'Railway', 'Docker', 'Supabase',
    ],
    image: '/projects/freshstock/screen-1.jpeg',
    images: [
      '/projects/freshstock/screen-1.jpeg',
      '/projects/freshstock/screen-2.jpeg',
      '/projects/freshstock/screen-3.jpeg',
      '/projects/freshstock/screen-4.jpeg',
      '/projects/freshstock/screen-5.jpeg',
      '/projects/freshstock/screen-6.jpeg',
    ],
    imagePositions: ['top', 'top', 'top', 'top', 'top', 'top'],
    site: 'https://freshstock-web.vercel.app',
    source_code_link: 'https://freshstock-web.vercel.app',
    links: {
      live: { url: 'https://freshstock-web.vercel.app', label: 'Site live', ctaLabel: 'Voir sur le site ↗' },
      github: { private: true, reason: `Projet startup — code privé` },
    },
  },
  {
    id: 'valofenua',
    name: 'Valofenua',
    type: 'web',
    featured: true,
    mockup: 'browser',
    year: '2025',
    description: `Plateforme d'estimation immobilière pour le marché polynésien — scraper quotidien de 1 300+ annonces, agent IA n8n, génération PDF côté client.`,
    longDescription: `Valofenua est une plateforme web qui automatise l'estimation des prix immobiliers en Polynésie française. Au cœur du produit, un web scraper quotidien collecte 1 300+ annonces des sites locaux, alimente une base PostgreSQL hébergée sur Supabase, et un agent IA orchestré sur n8n calcule des estimations précises pour n'importe quel bien à partir de ses caractéristiques (surface, localisation, type, prestations).

Côté front, c'est un SPA React 19 + Vite 7 + Tailwind 4 + Supabase Auth. La pièce technique notable : la génération PDF entièrement côté client via @react-pdf/renderer — pas de service serveur de rendu, pas de coût d'infra additionnel, le rapport avec branding agence se télécharge instantanément.

Mon rôle : co-fondateur, lead dev front, et management de l'équipe technique en collaboration avec le CEO pour traduire les choix techniques au business.`,
    tags: [
      { name: `React 19`, color: `text-cyan-400 text-gradient` },
      { name: `Supabase`, color: `text-green-400 text-gradient` },
      { name: `n8n`, color: `text-pink-400 text-gradient` },
      { name: `PDF render`, color: `text-violet-400 text-gradient` },
      { name: `AI agent`, color: `text-yellow-400 text-gradient` },
    ],
    tech: [
      'React 19', 'Vite 7', 'Tailwind v4', 'React Router 7',
      'Supabase', 'PostgreSQL', '@supabase/supabase-js',
      'n8n', 'AI agent',
      '@react-pdf/renderer', 'lucide-react',
      'Vercel',
    ],
    image: '/projects/valofenua/screen-1.png',
    images: [
      '/projects/valofenua/screen-1.png',
    ],
    imagePositions: ['top'],
    site: 'https://rhl-hebergement.vercel.app/#/connexion',
    source_code_link: 'https://rhl-hebergement.vercel.app/#/connexion',
    links: {
      live: { url: 'https://rhl-hebergement.vercel.app/#/connexion', label: 'Site live', ctaLabel: 'Voir sur le site ↗' },
      github: { private: true, reason: `Repo public — lien à venir` },
    },
  },
  {
    id: 'rubi',
    name: 'Rubi te paye',
    type: 'mobile',
    featured: true,
    year: '2025',
    description: `Application qui vous paie pour qui vous êtes. Contrôle total de vos données, compensation directe à chaque utilisation, sécurité garantie.`,
    longDescription: `Rubi inverse l'équation des données personnelles : au lieu que les utilisateurs cèdent gratuitement leurs informations aux plateformes, l'application leur reverse une rémunération directe à chaque utilisation. Au cœur du produit, un système de consentement granulaire — l'utilisateur autorise (ou refuse) l'accès, donnée par donnée — et un wallet intégré qui crédite les gains en temps réel.

Côté technique, l'écosystème est une stack JavaScript de bout en bout (React Native + React + Node.js), centrée sur Firebase et Google Cloud côté infra. L'app mobile (React Native + UI Kitten + Redux Toolkit) cohabite avec le site principal Rubi (Next.js + Chakra UI + Framer Motion) et les sites marketing en React. Le backend Node/Express tourne sur GCP App Engine, avec Firestore pour le temps réel, Memgraph/Neo4j pour le graphe de relations, et Stripe pour le paiement. Outillage : Docker, Fastlane, Sentry, Algolia pour la recherche, i18next pour la localisation.

Projet d'entreprise — code source privé. Disponible sur l'App Store.`,
    tags: [
      { name: `React Native`, color: `text-cyan-400 text-gradient` },
      { name: `Next.js`, color: `text-white text-gradient` },
      { name: `Node.js`, color: `text-green-400 text-gradient` },
      { name: `Firebase`, color: `text-orange-400 text-gradient` },
      { name: `Stripe`, color: `text-violet-400 text-gradient` },
      { name: `Neo4j`, color: `text-cyan-300 text-gradient` },
    ],
    tech: [
      'React Native', 'UI Kitten', 'Redux Toolkit',
      'Next.js', 'Chakra UI', 'Framer Motion',
      'React', 'Sass', 'React Router',
      'Node.js', 'Express', 'Stripe', 'Memgraph/Neo4j',
      'Google Cloud', 'Firebase', 'Docker', 'Fastlane', 'Sentry',
      'Algolia', 'Google Maps', 'i18next',
    ],
    image: '/projects/rubi/screen-2.png',
    images: [
      '/projects/rubi/screen-1.png',
      '/projects/rubi/screen-2.png',
      '/projects/rubi/screen-3.png',
      '/projects/rubi/screen-4.png',
    ],
    imagePositions: ['center', 'left center', 'center 65%', 'bottom'],
    site: 'https://apps.apple.com/us/app/rubi-pays-you/id6720740387',
    source_code_link: 'https://apps.apple.com/us/app/rubi-pays-you/id6720740387',
    links: {
      live: { url: 'https://apps.apple.com/us/app/rubi-pays-you/id6720740387', label: 'App Store' },
      github: { private: true, reason: `Projet d'entreprise` },
    },
  },
  {
    id: 'lou',
    name: 'Lou Studio',
    type: 'web',
    featured: true,
    mockup: 'browser',
    year: '2026',
    description: `Portfolio éditorial brutaliste pour Lou Boidin, makeup artist & styliste parisienne. Direction cinématique, scroll piloté, 3D custom, bilingue FR/EN.`,
    longDescription: `Lou Boidin est makeup artist et styliste à Paris. Le brief : un portfolio éditorial qui traduit son univers — brutalisme, contraste fort, photo dominante, zéro UI parasite — sans tomber dans le portfolio "agence créative" générique.

L'expérience est cinématique. Le Hero est pinné en sticky avec un frame-sequence canvas player (WebP pré-décodés swappés au scroll, plus fluide qu'une video native), un manifesto MAKEUP → STYLISM en crossfade scroll-driven, une gallery éditoriale 600vh qui slide d'une photo à l'autre. Les pages projets ont leur grand chiffre fantôme en arrière-plan, un compteur qui s'anime à l'intersection, et un grain film en SVG inline.

La pièce maîtresse : l'iPhone 3D dans la section Contact. Modèle glTF Sketchfab réel, sur lequel un screenshot Instagram clipé en rounded-rectangle est projeté via DecalGeometry — la texture épouse la surface réelle de l'écran, pas un sticker plat. Cliquable, ouvre le profil IG.

Stack : Next.js 16 App Router + React 19 + TypeScript strict + Tailwind v4. Animations Framer Motion / Lenis / GSAP-ScrollTrigger bridgés. 3D React Three Fiber + Drei. i18n FR/EN via next-intl. Tests Vitest + Playwright. Déployé sur Vercel.`,
    tags: [
      { name: `Next.js 16`, color: `text-white text-gradient` },
      { name: `React 19`, color: `text-cyan-400 text-gradient` },
      { name: `TypeScript`, color: `text-blue-400 text-gradient` },
      { name: `Tailwind v4`, color: `text-sky-400 text-gradient` },
      { name: `Three.js`, color: `text-pink-400 text-gradient` },
      { name: `Framer Motion`, color: `text-purple-400 text-gradient` },
    ],
    tech: [
      'Next.js 16', 'React 19', 'TypeScript', 'Tailwind v4',
      'Framer Motion', 'Lenis', 'GSAP', 'ScrollTrigger',
      'Three.js', 'React Three Fiber', 'Drei', 'DecalGeometry',
      'next-intl', 'next-mdx-remote', 'MDX',
      'Vitest', 'Playwright', 'ESLint', 'Prettier', 'pnpm', 'Vercel',
    ],
    image: '/projects/lou/screen-1.png',
    images: [
      '/projects/lou/screen-1.png',
      '/projects/lou/screen-2.png',
      '/projects/lou/screen-3.png',
      '/projects/lou/screen-4.png',
      '/projects/lou/screen-5.png',
    ],
    imagePositions: ['top', 'top', 'top', 'top', 'top'],
    site: 'https://portfolio-lou-six.vercel.app/fr',
    source_code_link: 'https://github.com/Tintgire/Portfolio-Lou',
    links: {
      live: { url: 'https://portfolio-lou-six.vercel.app/fr', label: 'Site live', ctaLabel: 'Voir sur le site ↗' },
      github: { url: 'https://github.com/Tintgire/Portfolio-Lou' },
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
