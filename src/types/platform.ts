export type ViewType = 
  | 'home'
  | 'about'
  | 'learn'
  | 'learn-detail'
  | 'lesson-player'
  | 'mentor-studio'
  | 'mentor-profile'
  | 'talents'
  | 'mentors'
  | 'companies'
  | 'resources'
  | 'challenges'
  | 'passport'
  | 'certificates'
  | 'verify'
  | 'auth'
  | 'onboarding'
  | 'dashboard-talent'
  | 'dashboard-mentor'
  | 'dashboard-company'
  | 'admin-programs'
  | 'skills-manager'
  | 'explorer'
  | 'messaging'
  | 'skill-exchange'
  | 'project-publish'
  | 'opportunities'
  | 'application'
  | 'admin-auth'
  | 'admin-dashboard'
  | 'public-profile'
  | 'favorites'
  | 'contact'
  | 'terms'
  | 'privacy'
  | 'public-passport';

export type UserRoleChoice = 'talent' | 'mentor' | 'company';

export type SkillStage = 'declared' | 'learning' | 'practicing' | 'demonstrated' | 'verified';

export const SKILL_STAGE_LABELS: Record<SkillStage, { label: string; step: number; color: string; bg: string }> = {
  declared: { label: 'Déclarée', step: 1, color: '#6B7280', bg: '#F3F4F6' },
  learning: { label: 'En apprentissage', step: 2, color: '#3B82F6', bg: '#EFF6FF' },
  practicing: { label: 'En pratique', step: 3, color: '#EAB308', bg: '#FEFCE8' },
  demonstrated: { label: 'Démontrée', step: 4, color: '#123B5D', bg: '#EBF3F8' },
  verified: { label: 'Vérifiée', step: 5, color: '#59B83E', bg: '#ECFDF5' },
};

export interface SkillProof {
  id: string;
  title: string;
  url?: string;
  type: 'github' | 'live' | 'peer_review' | 'certification';
  date: string;
  verified: boolean;
}

export interface UserSkillItem {
  id: string;
  name: string;
  category: string;
  stage: SkillStage;
  level: number; // 0-100
  proofs: SkillProof[];
}

export interface UserProjectItem {
  id: string;
  title: string;
  description: string;
  tech: string[];
  githubUrl?: string;
  liveUrl?: string;
  verified: boolean;
  createdAt: string;
}

export interface UserCertificationItem {
  id: string;
  title: string;
  issuer: string;
  date: string;
  credentialUrl?: string;
  verified: boolean;
}

export interface UserValidationItem {
  id: string;
  author: string;
  role: string;
  organization: string;
  skillName: string;
  comment: string;
  date: string;
}

export interface TalentProfileData {
  id: string;
  name: string;
  headline: string;
  location: string;
  country: string;
  avatarUrl?: string;
  skills: { name: string; level: number; proofCount: number; category: string; stage?: SkillStage }[];
  experience: { role: string; organization: string; period: string; description: string }[];
  projects: { title: string; description: string; tech: string[]; link?: string; verified: boolean }[];
  skillProofs: { title: string; type: 'github' | 'live' | 'peer_review' | 'certification'; date: string; url?: string }[];
  achievements: string[];
  recommendations: { author: string; role: string; company: string; text: string }[];
  passportScore: number;
}

export interface MentorProfileData {
  id: string;
  name: string;
  role: string;
  company: string;
  country: string;
  experienceYears: number;
  expertise: string[];
  bio: string;
  sessionsConducted: number;
  rating: number;
  availability: string;
}

export interface CompanyOpportunity {
  id: string;
  title: string;
  company: string;
  location: string;
  workplaceType: 'Télétravail' | 'Hybride' | 'Sur site';
  contractType: 'CDI' | 'CDD' | 'Mission' | 'Stage';
  requiredSkills: string[];
  domain: string;
  description: string;
}

export interface ResourceArticle {
  id: string;
  title: string;
  category: 'Guides' | 'Articles' | 'Conseils carrière' | 'Compétences' | 'Mentorat' | 'Opportunités' | 'Technologie' | 'Entrepreneuriat';
  readTime: string;
  date: string;
  excerpt: string;
  content: string;
}

export type SkillLevel = 'DÉBUTANT' | 'INTERMÉDIAIRE' | 'AVANCÉ' | 'EXPERT';
export type VerificationStatus = 'NON VÉRIFIÉ' | 'EN COURS DE VÉRIFICATION' | 'VÉRIFIÉ' | 'CERTIFIÉ';
export type PassportStatus = 'ACTIVE' | 'EXPIRED' | 'REVOKED';

export interface PassportSkill {
  name: string;
  level: SkillLevel;
  status: VerificationStatus;
  icon?: string;
}

export interface SkillPassportData {
  passportId: string;
  userId: string;
  status: PassportStatus;
  issuedAt: string;
  expiresAt?: string;
  publicVisibility: boolean;
  skills: PassportSkill[];
  metrics: {
    projects: number;
    challenges: number;
    evaluations: number;
    validations: number;
    certifications: number;
  };
}
