import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export type Language = 'fr' | 'en';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LANGUAGE_STORAGE_KEY = 'sb_language_preference';

const translations: Record<Language, Record<string, string>> = {
  fr: {
    // Navigation
    'nav.home': 'Accueil',
    'nav.talents': 'Talents',
    'nav.mentors': 'Mentorat',
    'nav.companies': 'Organisations',
    'nav.learn': 'Apprendre',
    'nav.challenges': 'Défis',
    'nav.resources': 'Ressources',
    'nav.passport': 'Skill Passport',
    'nav.login': 'Connexion',
    'nav.join': 'Rejoindre',
    'nav.logout': 'Déconnexion',
    'nav.dashboard': 'Mon Espace',
    'nav.explorer': 'Explorer',
    'nav.messages': 'Messages',

    // Hero
    'hero.badge': 'INFRASTRUCTURE SOUVERAINE DU TALENT AFRICAIN',
    'hero.title1': 'Le pont entre les compétences',
    'hero.title2': 'et les opportunités.',
    'hero.subtitle': 'Valorisez vos compétences techniques réelles, obtenez des preuves vérifiées par vos pairs et connectez-vous aux projets et recruteurs mondiaux.',
    'hero.cta.join': 'Rejoindre SkillBridge',
    'hero.cta.vision': 'Découvrir notre vision',

    // The Gap
    'gap.badge': 'THE GAP · LA RÉALITÉ DU TERRAIN',
    'gap.title1': 'Le talent est partout.',
    'gap.title2': 'Les opportunités ne le sont pas toujours.',
    'gap.subtitle': "L'écosystème regorge de potentiels remarquables, mais l'absence de passerelles vérifiables crée une distance silencieuse entre les capacités réelles et la reconnaissance méritée.",
    'gap.resolution.badge': 'LA RÉPONSE SKILLBRIDGE',
    'gap.resolution.title': 'SkillBridge est né pour réduire cette distance.',
    'gap.resolution.desc': "En connectant organiquement les compétences, le talent, l'expérience et les opportunités, nous bâtissons l'infrastructure où chacun avance par la preuve.",
    'gap.resolution.join': "Rejoindre l'écosystème",
    'gap.resolution.explore': 'Explorer les profils vérifiés',

    // Dashboard
    'dash.welcome': 'Bienvenue',
    'dash.subtitle': 'Votre espace personnel. Retrouvez ici vos statistiques, vos candidatures et vos projets.',
    'dash.my_projects': 'Mes Projets',
    'dash.my_projects_desc': "Vous n'avez pas encore publié de projets pour enrichir votre portefeuille.",
    'dash.publish_project': 'Publier un projet',
    'dash.my_opportunities': 'Mes Opportunités',
    'dash.my_opportunities_desc': "Vous n'avez aucune candidature en cours actuellement.",
    'dash.explore_jobs': 'Explorer les offres',
    'dash.my_passport': 'Mon Skill Passport',
    'dash.score': 'Score d’Aptitude',

    // Auth
    'auth.title': 'Accédez à votre espace',
    'auth.login_tab': 'Se connecter',
    'auth.register_tab': 'Créer un compte',
    'auth.email': 'Adresse e-mail',
    'auth.password': 'Mot de passe',
    'auth.confirm_password': 'Confirmation',
    'auth.first_name': 'Prénom',
    'auth.last_name': 'Nom',
    'auth.submit_login': 'Accéder à mon espace',
    'auth.submit_register': 'Créer mon profil',
    'auth.demo_talent': 'Démo Talent',
    'auth.demo_mentor': 'Démo Mentor',
    'auth.demo_company': 'Démo Entreprise',

    // Theme & Language
    'theme.light': 'Mode Clair',
    'theme.dark': 'Mode Sombre',
    'lang.fr': 'Français',
    'lang.en': 'English'
  },
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.talents': 'Talents',
    'nav.mentors': 'Mentorship',
    'nav.companies': 'Organizations',
    'nav.learn': 'Learn',
    'nav.challenges': 'Challenges',
    'nav.resources': 'Resources',
    'nav.passport': 'Skill Passport',
    'nav.login': 'Sign In',
    'nav.join': 'Join Now',
    'nav.logout': 'Sign Out',
    'nav.dashboard': 'Dashboard',
    'nav.explorer': 'Explore',
    'nav.messages': 'Messages',

    // Hero
    'hero.badge': 'SOVEREIGN INFRASTRUCTURE FOR AFRICAN TALENT',
    'hero.title1': 'The bridge between skills',
    'hero.title2': 'and opportunities.',
    'hero.subtitle': 'Showcase your real technical competencies, earn peer-verified proofs, and connect with global projects and hiring organizations.',
    'hero.cta.join': 'Join SkillBridge',
    'hero.cta.vision': 'Discover our vision',

    // The Gap
    'gap.badge': 'THE GAP · GROUND REALITY',
    'gap.title1': 'Talent is universal.',
    'gap.title2': 'Opportunities are not always.',
    'gap.subtitle': 'The ecosystem is full of remarkable potential, but the lack of verifiable gateways creates a silent distance between real abilities and deserved recognition.',
    'gap.resolution.badge': 'THE SKILLBRIDGE ANSWER',
    'gap.resolution.title': 'SkillBridge was built to bridge this gap.',
    'gap.resolution.desc': 'By organically connecting skills, talent, experience, and opportunities, we build the infrastructure where everyone progresses by proof.',
    'gap.resolution.join': 'Join the ecosystem',
    'gap.resolution.explore': 'Explore verified profiles',

    // Dashboard
    'dash.welcome': 'Welcome',
    'dash.subtitle': 'Your personal dashboard. Track your stats, applications, and verified skill proofs.',
    'dash.my_projects': 'My Projects',
    'dash.my_projects_desc': 'You have not published any projects to enrich your portfolio yet.',
    'dash.publish_project': 'Publish a project',
    'dash.my_opportunities': 'My Opportunities',
    'dash.my_opportunities_desc': 'You currently have no active applications.',
    'dash.explore_jobs': 'Explore job openings',
    'dash.my_passport': 'My Skill Passport',
    'dash.score': 'Passport Score',

    // Auth
    'auth.title': 'Access your workspace',
    'auth.login_tab': 'Sign In',
    'auth.register_tab': 'Create Account',
    'auth.email': 'Email Address',
    'auth.password': 'Password',
    'auth.confirm_password': 'Confirm Password',
    'auth.first_name': 'First Name',
    'auth.last_name': 'Last Name',
    'auth.submit_login': 'Access Workspace',
    'auth.submit_register': 'Create My Profile',
    'auth.demo_talent': 'Demo Talent',
    'auth.demo_mentor': 'Demo Mentor',
    'auth.demo_company': 'Demo Company',

    // Theme & Language
    'theme.light': 'Light Mode',
    'theme.dark': 'Dark Mode',
    'lang.fr': 'Français',
    'lang.en': 'English'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const savedLang = localStorage.getItem(LANGUAGE_STORAGE_KEY) as Language | null;
      if (savedLang === 'fr' || savedLang === 'en') {
        return savedLang;
      }
      return navigator.language.startsWith('en') ? 'en' : 'fr';
    } catch {
      return 'fr';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
      document.documentElement.lang = language;
    } catch (e) {
      console.warn('Failed to save language preference', e);
    }
  }, [language]);

  const toggleLanguage = () => {
    setLanguageState((prev) => (prev === 'fr' ? 'en' : 'fr'));
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    const langDict = translations[language];
    if (langDict && langDict[key]) {
      return langDict[key];
    }
    // Fallback to French if missing
    return translations.fr[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
