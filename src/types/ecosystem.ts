
// --- ROLES & PERMISSIONS ---
export type PlatformRole = 'learner' | 'mentor' | 'company' | 'admin';

// --- SKILL EXCHANGE ---
export interface SkillOffer {
  skillId: string;
  skillName: string;
  level: string; // e.g., 'Débutant', 'Intermédiaire', 'Avancé', 'Expert'
  experience: string;
  format: 'Mentorat' | 'Code Review' | 'Projet commun' | 'Discussion';
}

export interface SkillRequest {
  skillId: string;
  skillName: string;
  currentLevel: string;
  objective: string;
}

export type ExchangeStatus = 'pending' | 'accepted' | 'scheduled' | 'completed' | 'cancelled' | 'rejected';

export interface SkillExchangeRequest {
  id: string;
  requesterId: string;
  requesterName: string;
  requesterAvatar?: string;
  targetUserId: string;
  targetUserName: string;
  targetUserAvatar?: string;
  offeredSkill: string;
  requestedSkill: string;
  message: string;
  proposedFormat: string;
  availability: string;
  status: ExchangeStatus;
  createdAt: string;
  updatedAt: string;
}

export interface SkillExchangeSession {
  id: string;
  exchangeRequestId: string;
  participants: string[];
  date: string;
  time: string;
  durationMinutes: number;
  objective: string;
  format: string;
  meetingLink?: string;
  completed: boolean;
}

// --- MESSAGING ---
export interface Conversation {
  id: string;
  participants: { id: string; name: string; avatar?: string; role: PlatformRole }[];
  lastMessage?: Message;
  unreadCount: number;
  updatedAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  type: 'text' | 'image' | 'file' | 'link';
  fileUrl?: string;
  readBy: string[];
  createdAt: string;
}

// --- PROJECTS ---
export interface ProjectMember {
  userId: string;
  name: string;
  avatar?: string;
  role: string;
  contribution: string;
}

export interface PublishedProject {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  category: string;
  thumbnailUrl: string;
  demoVideoUrl?: string;
  skillsUsed: string[];
  objective: string;
  userRole: string;
  result: string;
  galleryUrls?: string[];
  liveUrl?: string;
  githubUrl?: string;
  figmaUrl?: string;
  documentUrl?: string;
  isCollaborative: boolean;
  members: ProjectMember[];
  status: 'draft' | 'published' | 'archived';
  likesCount: number;
  commentsCount: number;
  createdAt: string;
  updatedAt: string;
}

// --- OPPORTUNITIES ---
export interface Opportunity {
  id: string;
  companyId: string;
  companyName: string;
  companyLogo?: string;
  title: string;
  description: string;
  type: 'CDI' | 'CDD' | 'Freelance' | 'Stage' | 'Projet' | 'Collaboration';
  requiredSkills: string[];
  level: string;
  location: string;
  workplaceType: 'Présentiel' | 'Remote' | 'Hybride';
  compensation?: string;
  duration?: string;
  deadline?: string;
  additionalInfo?: string;
  status: 'open' | 'closed' | 'draft';
  createdAt: string;
  updatedAt: string;
}

export type ApplicationStatus = 'sent' | 'viewed' | 'in_progress' | 'accepted' | 'rejected';

export interface Application {
  id: string;
  opportunityId: string;
  applicantId: string;
  companyId: string;
  message: string;
  includePassport: boolean;
  resumeUrl?: string;
  relevantProjectIds: string[];
  links: string[];
  status: ApplicationStatus;
  createdAt: string;
  updatedAt: string;
}

// --- ADMIN ---
export interface AdminLog {
  id: string;
  adminId: string;
  adminName: string;
  action: string;
  targetResource: string;
  targetId: string;
  timestamp: string;
  details?: string;
}
