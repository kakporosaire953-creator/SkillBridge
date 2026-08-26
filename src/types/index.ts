import { UserSkillItem, UserProjectItem, UserCertificationItem, UserValidationItem, SkillStage, SkillProof } from './platform';

export type AccountType = 
  | 'talent'
  | 'learner'
  | 'professional'
  | 'mentor'
  | 'company'
  | 'institution';

export type ProfileVisibility = 'public' | 'private';

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
  website: string | null;
  linkedin_url: string | null;
  instagram_url: string | null;
  tiktok_url: string | null;
  github_url: string | null;
  availability: string | null;
  profile_visibility: ProfileVisibility;
  passport_id: string;
  passport_score: number;
  skills: UserSkillItem[];
  projects: UserProjectItem[];
  certifications: UserCertificationItem[];
  validations: UserValidationItem[];
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
  passport_score?: number;
}

export interface AuthState {
  user: {
    id: string;
    email?: string;
    user_metadata?: Record<string, unknown>;
  } | null;
  profile: Profile | null;
  isLoading: boolean;
  error: string | null;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export type { UserSkillItem, UserProjectItem, UserCertificationItem, UserValidationItem, SkillStage, SkillProof };
export * from './learning';
export * from './ecosystem';
