import { SkillStage } from './platform';

export type LearningContentType = 'course' | 'formation' | 'masterclass';

export type ContentDifficulty = 'Débutant' | 'Intermédiaire' | 'Avancé' | 'Tous niveaux';

export type AccessType = 'free' | 'paid';

export type LessonBlockType = 
  | 'text' 
  | 'image' 
  | 'video' 
  | 'document' 
  | 'link' 
  | 'resource' 
  | 'exercise' 
  | 'quiz' 
  | 'challenge' 
  | 'project';

export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
  explanation?: string;
}

export interface QuizBlockContent {
  title: string;
  description?: string;
  passingScorePercent: number;
  questions: QuizQuestion[];
}

export interface ExerciseBlockContent {
  title: string;
  instructions: string;
  starterCode?: string;
  expectedDeliverable: string;
  rubrics?: string[];
}

export interface ProjectBlockContent {
  title: string;
  context: string;
  objectives: string[];
  instructions: string;
  deliverableType: 'github' | 'live' | 'document' | 'any';
  evaluationCriteria: string[];
  targetSkillStage: SkillStage;
}

export interface VideoBlockContent {
  videoUrl: string;
  title?: string;
  caption?: string;
  durationSeconds?: number;
  provider?: 'direct' | 'youtube' | 'vimeo' | 'loom' | 'cloudinary';
}

export interface ImageBlockContent {
  imageUrl: string;
  caption?: string;
  altText?: string;
}

export interface DocumentBlockContent {
  title: string;
  description?: string;
  fileUrl: string;
  fileSize?: string;
  fileType?: string;
  isDownloadable?: boolean;
}

export interface LinkBlockContent {
  title: string;
  url: string;
  description?: string;
}

export interface TextBlockContent {
  markdown: string;
}

export interface LessonBlock {
  id: string;
  type: LessonBlockType;
  title?: string;
  order: number;
  content: 
    | TextBlockContent 
    | ImageBlockContent 
    | VideoBlockContent 
    | DocumentBlockContent 
    | LinkBlockContent 
    | ExerciseBlockContent 
    | QuizBlockContent 
    | ProjectBlockContent;
}

export interface Lesson {
  id: string;
  title: string;
  description?: string;
  durationMinutes: number;
  order: number;
  isFreePreview?: boolean;
  blocks: LessonBlock[];
}

export interface Module {
  id: string;
  title: string;
  description?: string;
  order: number;
  lessons: Lesson[];
}

export interface LearningItem {
  id: string;
  type: LearningContentType;
  title: string;
  slug: string;
  headline: string;
  description: string;
  coverImage: string;
  promoVideoUrl?: string;
  category: string;
  targetSkills: string[];
  level: ContentDifficulty;
  language: string;
  estimatedDuration: string;
  accessType: AccessType;
  price?: number;
  currency?: string;
  mentorId: string;
  mentorName: string;
  mentorRole: string;
  mentorCompany?: string;
  mentorAvatar: string;
  mentorBio?: string;
  modules: Module[];
  prerequisites?: string[];
  includedResources?: string[];
  // Specific to Masterclass
  masterclassDate?: string;
  masterclassTime?: string;
  liveAccessUrl?: string;
  replayVideoUrl?: string;
  maxSeats?: number;
  companionResources?: { title: string; url: string; size?: string }[];
  
  // Official SkillBridge Program & Certifications
  isOfficialSkillBridge?: boolean;
  authorType?: 'skillbridge' | 'mentor';
  isCertifying?: boolean;
  certificationCriteria?: {
    minPassingScorePercent: number;
    requireAllLessons: boolean;
    requireCapstoneProject?: boolean;
  };
  
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserCertificate {
  id: string; // Format: SB-CERT-XXXXXXXX
  userId: string;
  userName: string;
  userAvatar?: string;
  contentId: string;
  contentTitle: string;
  contentType: LearningContentType;
  issuer: string; // e.g. "SkillBridge Academy & Certification Authority"
  issueDate: string;
  verificationUrl: string;
  skillsValidated: string[];
  scorePercent: number;
  status: 'valid' | 'revoked';
  signatureAuthority: string;
  credentialFingerprint: string;
}

export interface UserSubmission {
  id: string;
  blockId: string;
  blockTitle: string;
  lessonId: string;
  contentId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  deliverableUrl: string;
  notes?: string;
  submittedAt: string;
  status: 'submitted' | 'reviewed' | 'approved' | 'rejected';
  feedback?: string;
  grade?: number;
}

export interface UserEnrollment {
  id: string;
  userId: string;
  contentId: string;
  contentType: LearningContentType;
  progressPercent: number;
  completedLessonIds: string[];
  currentLessonId?: string;
  quizScores: Record<string, { score: number; passed: boolean; completedAt: string }>;
  submissions: UserSubmission[];
  enrolledAt: string;
  completedAt?: string;
  lastAccessedAt: string;
  // Certification & Payment
  certificateId?: string;
  certifiedAt?: string;
  paymentStatus?: 'free' | 'paid' | 'pending';
  paymentTransactionId?: string;
}

export type MentorApplicationStatus = 
  | 'pending' 
  | 'more_info_needed' 
  | 'approved' 
  | 'rejected' 
  | 'suspended';

export interface MentorApplication {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  currentRole: string;
  organization: string;
  expertiseDomains: string[];
  yearsExperience: number;
  portfolioUrl?: string;
  linkedinUrl?: string;
  motivation: string;
  proposedTopic: string;
  status: MentorApplicationStatus;
  submittedAt: string;
  reviewedAt?: string;
  adminNotes?: string;
}
