import { UserSkillItem, UserProjectItem, UserCertificationItem, UserValidationItem } from './platform';

// ============================================================================
// ENUMS
// ============================================================================

export type AccountType =
  | 'talent'
  | 'learner'
  | 'professional'
  | 'mentor'
  | 'company'
  | 'institution';

export type ProfileVisibility = 'public' | 'private';

export type SkillStage = 'declared' | 'learning' | 'practicing' | 'demonstrated' | 'verified';

export type SkillLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';

export type PassportStatus = 'active' | 'pending' | 'expired' | 'revoked';

export type CertificateStatus = 'valid' | 'revoked' | 'expired';

export type ExchangeStatus = 'pending' | 'accepted' | 'declined' | 'cancelled' | 'completed';

export type OpportunityType = 'emploi' | 'stage' | 'freelance' | 'collaboration' | 'projet' | 'challenge';

export type OpportunityStatus = 'draft' | 'published' | 'closed' | 'archived';

export type ApplicationStatus = 'submitted' | 'viewed' | 'shortlisted' | 'accepted' | 'rejected' | 'withdrawn';

export type CourseStatus = 'draft' | 'published' | 'archived';

export type CourseLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export type LessonType = 'video' | 'text' | 'quiz' | 'exercise';

export type PaymentStatus = 'pending' | 'processing' | 'success' | 'failed' | 'refunded' | 'cancelled';

export type PaymentProvider = 'stripe' | 'wave' | 'orange_money' | 'mtn' | 'free' | 'pending';

export type ChallengeStatus = 'draft' | 'active' | 'closed' | 'archived';

export type SubmissionStatus = 'submitted' | 'under_review' | 'accepted' | 'rejected' | 'winner';

export type UserRole = 'learner' | 'mentor' | 'company' | 'admin';

export type EntityType = 'project' | 'opportunity' | 'course' | 'talent' | 'masterclass';

export type WorkplaceType = 'remote' | 'hybrid' | 'onsite';

export type CompanySize = '1-10' | '11-50' | '51-200' | '201-1000' | '1000+';

export type ProofType = 'github' | 'live' | 'peer_review' | 'certification';

export type ProjectStatus = 'draft' | 'published' | 'archived';

export type MediaType = 'image' | 'video';

// ============================================================================
// PROFIL
// ============================================================================

export interface Profile {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  username: string;
  headline: string | null;
  avatar_url: string | null;
  bio: string | null;
  location: string | null;
  country: string | null;
  account_type: AccountType;
  title: string | null;
  domain: string | null;
  languages: string[];
  website: string | null;
  linkedin_url: string | null;
  instagram_url: string | null;
  tiktok_url: string | null;
  github_url: string | null;
  availability: string | null;
  profile_visibility: ProfileVisibility;
  passport_id: string | null;
  passport_score: number;
  skills?: UserSkillItem[];
  projects?: UserProjectItem[];
  certifications?: UserCertificationItem[];
  validations?: UserValidationItem[];
  created_at: string;
  updated_at: string;
}

export interface ProfileUpdateInput {
  first_name?: string;
  last_name?: string;
  username?: string;
  headline?: string | null;
  bio?: string | null;
  location?: string | null;
  country?: string | null;
  account_type?: AccountType;
  title?: string | null;
  domain?: string | null;
  languages?: string[];
  website?: string | null;
  linkedin_url?: string | null;
  instagram_url?: string | null;
  tiktok_url?: string | null;
  github_url?: string | null;
  availability?: string | null;
  profile_visibility?: ProfileVisibility;
  avatar_url?: string | null;
  skills?: UserSkillItem[];
  projects?: UserProjectItem[];
  certifications?: UserCertificationItem[];
  validations?: UserValidationItem[];
}

// ============================================================================
// RÔLES
// ============================================================================

export interface UserRoleRecord {
  id: string;
  user_id: string;
  role: UserRole;
  granted_by: string | null;
  created_at: string;
}

// ============================================================================
// COMPÉTENCES
// ============================================================================

export interface SkillCatalogItem {
  id: string;
  name: string;
  category: string;
  subcategory: string | null;
  icon: string | null;
  is_verified: boolean;
  is_active: boolean;
  created_at: string;
}

export interface UserSkill {
  id: string;
  profile_id: string;
  user_id: string;
  skill_catalog_id: string | null;
  name: string;
  category: string;
  stage: SkillStage;
  level: number;
  can_teach: boolean;
  want_to_learn: boolean;
  created_at: string;
  updated_at: string;
  // Relations
  proofs?: SkillProof[];
}

export interface SkillProof {
  id: string;
  user_skill_id?: string;
  user_id?: string;
  title: string;
  url?: string;
  type: ProofType;
  proof_date?: string;
  date: string;
  verified: boolean;
  verified_by?: string;
  verified_at?: string;
  created_at?: string;
}

export interface CreateSkillInput {
  name: string;
  category: string;
  skill_catalog_id?: string;
  stage?: SkillStage;
  level?: number;
  can_teach?: boolean;
  want_to_learn?: boolean;
}

export interface CreateProofInput {
  user_skill_id: string;
  title: string;
  url?: string;
  type: ProofType;
  proof_date?: string;
}

// ============================================================================
// ÉCHANGES DE COMPÉTENCES
// ============================================================================

export interface SkillExchange {
  id: string;
  requester_id: string;
  responder_id: string;
  requester_user_id: string;
  responder_user_id: string;
  offer_skill_name: string;
  offer_skill_category: string | null;
  request_skill_name: string;
  request_skill_category: string | null;
  status: ExchangeStatus;
  message: string | null;
  response_message: string | null;
  created_at: string;
  updated_at: string;
  // Relations
  requester?: Profile;
  responder?: Profile;
}

export interface CreateExchangeInput {
  responder_id: string;
  offer_skill_name: string;
  request_skill_name: string;
  message?: string;
}

// ============================================================================
// PROJETS
// ============================================================================

export interface Project {
  id: string;
  author_id: string;
  user_id: string;
  title: string;
  description: string;
  category: string | null;
  technologies: string[];
  skills_used: string[];
  role: string | null;
  github_url: string | null;
  live_url: string | null;
  video_url: string | null;
  status: ProjectStatus;
  verified: boolean;
  project_date: string | null;
  likes_count: number;
  comments_count: number;
  created_at: string;
  updated_at: string;
  // Relations
  media?: ProjectMedia[];
  author?: Profile;
  liked_by_me?: boolean;
}

export interface ProjectMedia {
  id: string;
  project_id: string;
  user_id: string;
  url: string;
  type: MediaType;
  display_order: number;
  created_at: string;
}

export interface ProjectLike {
  id: string;
  project_id: string;
  user_id: string;
  created_at: string;
}

export interface ProjectComment {
  id: string;
  project_id: string;
  author_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  author?: Profile;
}

export interface CreateProjectInput {
  title: string;
  description: string;
  category?: string;
  technologies?: string[];
  skills_used?: string[];
  role?: string;
  github_url?: string;
  live_url?: string;
  video_url?: string;
  status?: ProjectStatus;
  project_date?: string;
}

// ============================================================================
// SKILL PASSPORT
// ============================================================================

export interface SkillPassport {
  id: string;
  profile_id: string;
  user_id: string;
  sbid: string;
  status: PassportStatus;
  score: number;
  public_visibility: boolean;
  issued_at: string;
  expires_at: string | null;
  revoked_at: string | null;
  revocation_reason: string | null;
  created_at: string;
  updated_at: string;
}

export interface PassportFull extends SkillPassport {
  first_name: string;
  last_name: string;
  username: string;
  headline: string | null;
  avatar_url: string | null;
  location: string | null;
  country: string | null;
  title: string | null;
  domain: string | null;
  bio: string | null;
  account_type: AccountType;
  linkedin_url: string | null;
  github_url: string | null;
  website: string | null;
  skills_count: number;
  verified_skills_count: number;
  projects_count: number;
  challenges_won: number;
  certificates_count: number;
  // Relations
  skills?: UserSkill[];
}

// ============================================================================
// CERTIFICATS
// ============================================================================

export interface Certificate {
  id: string;
  cert_id: string;
  user_id: string;
  profile_id: string;
  course_id: string | null;
  title: string;
  issuer: string;
  issued_at: string;
  expires_at: string | null;
  status: CertificateStatus;
  skills: string[];
  revoked_at: string | null;
  revocation_reason: string | null;
  created_at: string;
  // Relations
  profile?: Profile;
}

// ============================================================================
// FORMATIONS (COURSES)
// ============================================================================

export interface Course {
  id: string;
  creator_id: string;
  user_id: string;
  title: string;
  description: string;
  cover_url: string | null;
  category: string | null;
  level: CourseLevel;
  skills: string[];
  price: number;
  is_free: boolean;
  status: CourseStatus;
  total_lessons: number;
  total_duration_minutes: number;
  enrollments_count: number;
  created_at: string;
  updated_at: string;
  // Relations
  creator?: Profile;
  modules?: CourseModule[];
  my_enrollment?: CourseEnrollment;
}

export interface CourseModule {
  id: string;
  course_id: string;
  title: string;
  display_order: number;
  created_at: string;
  // Relations
  lessons?: Lesson[];
}

export interface Lesson {
  id: string;
  module_id: string;
  course_id: string;
  title: string;
  content: string | null;
  video_url: string | null;
  duration_minutes: number;
  display_order: number;
  type: LessonType;
  is_free_preview: boolean;
  created_at: string;
  updated_at: string;
  // Relations
  progress?: LessonProgress;
}

export interface CourseEnrollment {
  id: string;
  course_id: string;
  user_id: string;
  profile_id: string;
  status: 'active' | 'completed' | 'cancelled';
  progress_pct: number;
  enrolled_at: string;
  completed_at: string | null;
  created_at: string;
}

export interface LessonProgress {
  id: string;
  user_id: string;
  lesson_id: string;
  course_id: string;
  completed: boolean;
  completed_at: string | null;
  time_spent_seconds: number;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// MASTERCLASSES
// ============================================================================

export interface Masterclass {
  id: string;
  creator_id: string;
  user_id: string;
  title: string;
  description: string;
  cover_url: string | null;
  speaker_name: string | null;
  price: number;
  is_free: boolean;
  scheduled_at: string | null;
  duration_minutes: number | null;
  max_capacity: number | null;
  registrations_count: number;
  status: 'draft' | 'published' | 'cancelled' | 'completed';
  created_at: string;
  updated_at: string;
  creator?: Profile;
  my_registration?: MasterclassRegistration;
}

export interface MasterclassRegistration {
  id: string;
  masterclass_id: string;
  user_id: string;
  profile_id: string;
  status: 'registered' | 'confirmed' | 'cancelled';
  registered_at: string;
}

// ============================================================================
// MENTOR
// ============================================================================

export interface MentorProfile {
  id: string;
  profile_id: string;
  user_id: string;
  is_approved: boolean;
  approved_by: string | null;
  approved_at: string | null;
  bio: string | null;
  expertise: string[];
  domains: string[];
  experience_years: number | null;
  hourly_rate: number | null;
  availability: string | null;
  sessions_count: number;
  rating: number;
  created_at: string;
  updated_at: string;
  // Relations
  profile?: Profile;
}

// ============================================================================
// ENTREPRISES
// ============================================================================

export interface Company {
  id: string;
  owner_id: string;
  user_id: string;
  name: string;
  description: string | null;
  logo_url: string | null;
  website: string | null;
  location: string | null;
  country: string | null;
  industry: string | null;
  size: CompanySize | null;
  status: 'active' | 'suspended';
  created_at: string;
  updated_at: string;
}

export interface CreateCompanyInput {
  name: string;
  description?: string;
  logo_url?: string;
  website?: string;
  location?: string;
  country?: string;
  industry?: string;
  size?: CompanySize;
}

// ============================================================================
// OPPORTUNITÉS
// ============================================================================

export interface Opportunity {
  id: string;
  company_id: string | null;
  creator_id: string;
  user_id: string;
  title: string;
  description: string;
  type: OpportunityType;
  location: string | null;
  workplace_type: WorkplaceType;
  required_skills: string[];
  level: CourseLevel | null;
  salary_min: number | null;
  salary_max: number | null;
  currency: string;
  deadline: string | null;
  status: OpportunityStatus;
  applications_count: number;
  created_at: string;
  updated_at: string;
  // Relations
  company?: Company;
  creator?: Profile;
  my_application?: Application;
}

export interface CreateOpportunityInput {
  title: string;
  description: string;
  type: OpportunityType;
  location?: string;
  workplace_type?: WorkplaceType;
  required_skills?: string[];
  level?: CourseLevel;
  salary_min?: number;
  salary_max?: number;
  currency?: string;
  deadline?: string;
  company_id?: string;
}

// ============================================================================
// CANDIDATURES
// ============================================================================

export interface Application {
  id: string;
  opportunity_id: string;
  applicant_id: string;
  user_id: string;
  cover_message: string | null;
  passport_sbid: string | null;
  status: ApplicationStatus;
  submitted_at: string;
  updated_at: string;
  // Relations
  opportunity?: Opportunity;
  applicant?: Profile;
}

export interface CreateApplicationInput {
  opportunity_id: string;
  cover_message?: string;
  passport_sbid?: string;
}

// ============================================================================
// MESSAGERIE
// ============================================================================

export interface Conversation {
  id: string;
  created_by: string;
  last_message_at: string | null;
  created_at: string;
  // Relations
  participants?: ConversationParticipant[];
  last_message?: Message;
  other_participant?: Profile;
  unread_count?: number;
}

export interface ConversationParticipant {
  id: string;
  conversation_id: string;
  user_id: string;
  joined_at: string;
  last_read_at: string | null;
  profile?: Profile;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
  sender?: Profile;
}

export interface SendMessageInput {
  conversation_id: string;
  content: string;
}

// ============================================================================
// NOTIFICATIONS
// ============================================================================

export type NotificationType =
  | 'new_message'
  | 'exchange_request'
  | 'exchange_accepted'
  | 'exchange_declined'
  | 'new_opportunity'
  | 'application_updated'
  | 'mentor_validation'
  | 'course_completed'
  | 'certificate_earned'
  | 'project_liked'
  | 'project_commented'
  | 'masterclass_registered'
  | 'challenge_result'
  | 'passport_updated'
  | 'system';

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  body: string | null;
  data: Record<string, unknown>;
  action_url: string | null;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
}

// ============================================================================
// CHALLENGES
// ============================================================================

export interface Challenge {
  id: string;
  creator_id: string;
  user_id: string;
  title: string;
  description: string;
  skills: string[];
  rules: string | null;
  evaluation_criteria: string | null;
  starts_at: string | null;
  deadline: string | null;
  status: ChallengeStatus;
  submissions_count: number;
  created_at: string;
  updated_at: string;
  creator?: Profile;
  my_submission?: ChallengeSubmission;
}

export interface ChallengeSubmission {
  id: string;
  challenge_id: string;
  submitter_id: string;
  user_id: string;
  project_id: string | null;
  description: string | null;
  submission_url: string | null;
  status: SubmissionStatus;
  submitted_at: string;
  reviewed_at: string | null;
  review_notes: string | null;
}

// ============================================================================
// PAIEMENTS
// ============================================================================

export interface Payment {
  id: string;
  user_id: string;
  entity_type: 'course' | 'masterclass' | 'mentoring' | 'other';
  entity_id: string;
  gross_amount: number;
  platform_fee: number;
  creator_amount: number;
  payment_fee: number;
  net_amount: number;
  currency: string;
  status: PaymentStatus;
  provider: PaymentProvider;
  provider_transaction_id: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// CONFIGURATION PLATEFORME
// ============================================================================

export interface PlatformConfig {
  id: string;
  key: string;
  value: string;
  description: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// ÉLÉMENTS SAUVEGARDÉS
// ============================================================================

export interface SavedItem {
  id: string;
  user_id: string;
  entity_type: EntityType;
  entity_id: string;
  created_at: string;
}

// ============================================================================
// AUDIT LOGS
// ============================================================================

export interface AuditLog {
  id: string;
  actor_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  old_values: Record<string, unknown> | null;
  new_values: Record<string, unknown> | null;
  metadata: Record<string, unknown>;
  ip_address: string | null;
  created_at: string;
}

// ============================================================================
// ANALYTICS ADMIN
// ============================================================================

export interface AdminAnalytics {
  total_users: number;
  total_profiles: number;
  total_skills_declared: number;
  total_projects_published: number;
  total_courses_published: number;
  total_enrollments: number;
  total_opportunities_published: number;
  total_applications: number;
  approved_mentors: number;
  active_companies: number;
  valid_certificates: number;
  active_passports: number;
  total_revenue: number;
  successful_payments: number;
}

// ============================================================================
// VALIDATION
// ============================================================================

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

// ============================================================================
// SKILL STAGE LABELS (UI)
// ============================================================================

export const SKILL_STAGE_LABELS: Record<SkillStage, { label: string; step: number; color: string; bg: string }> = {
  declared: { label: 'Déclarée', step: 1, color: '#6B7280', bg: '#F3F4F6' },
  learning: { label: 'En apprentissage', step: 2, color: '#3B82F6', bg: '#EFF6FF' },
  practicing: { label: 'En pratique', step: 3, color: '#EAB308', bg: '#FEFCE8' },
  demonstrated: { label: 'Démontrée', step: 4, color: '#123B5D', bg: '#EBF3F8' },
  verified: { label: 'Vérifiée', step: 5, color: '#59B83E', bg: '#ECFDF5' },
};

// Re-exports for backward compatibility
export type { SkillStage as SkillStageType };
export * from './platform';
export * from './learning';
export * from './ecosystem';
