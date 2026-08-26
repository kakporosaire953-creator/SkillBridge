import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { Profile, ProfileUpdateInput, AccountType, UserSkillItem, UserProjectItem, UserCertificationItem, SkillStage, SkillProof } from '../types';
import { AuthService, SignUpParams, SignInParams } from '../services/authService';
import { ProfileService } from '../services/profileService';
import { StorageService } from '../services/storageService';
import { isSupabaseConfigured } from '../services/supabase';

const STORAGE_KEY_PROFILE = 'sb_active_profile_v2';
const STORAGE_KEY_USER = 'sb_active_user_v2';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  isLoading: boolean;
  isConfigured: boolean;
  error: string | null;
  signUp: (params: SignUpParams) => Promise<{ success: boolean; error?: string }>;
  signIn: (params: SignInParams) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateProfile: (input: ProfileUpdateInput) => Promise<{ success: boolean; error?: string }>;
  uploadAvatar: (fileOrDataUrl: File | string) => Promise<{ success: boolean; url?: string; error?: string }>;
  deleteAvatar: () => Promise<{ success: boolean; error?: string }>;
  addSkill: (skill: Omit<UserSkillItem, 'id'>) => Promise<void>;
  updateSkillStage: (skillId: string, stage: SkillStage) => Promise<void>;
  addSkillProof: (skillId: string, proof: Omit<SkillProof, 'id'>) => Promise<void>;
  removeSkill: (skillId: string) => Promise<void>;
  addProject: (project: Omit<UserProjectItem, 'id' | 'createdAt'>) => Promise<void>;
  removeProject: (projectId: string) => Promise<void>;
  addCertification: (cert: Omit<UserCertificationItem, 'id'>) => Promise<void>;
  removeCertification: (certId: string) => Promise<void>;
  loadDemoAccount: (role?: 'talent' | 'mentor' | 'company') => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const createCleanProfile = (
  userId: string, 
  email: string, 
  firstName: string = '', 
  lastName: string = '', 
  accountType: AccountType = 'talent'
): Profile => {
  const cleanUsername = `${(firstName || '').toLowerCase().replace(/\s+/g, '')}_${(lastName || '').toLowerCase().replace(/\s+/g, '')}`.replace(/^_+|_+$/g, '') || `user_${userId.slice(0, 6)}`;
  const randomSuffix = Math.floor(10000 + Math.random() * 90000);
  
  return {
    id: `prof-${userId}`,
    user_id: userId,
    first_name: firstName || email.split('@')[0],
    last_name: lastName || '',
    username: cleanUsername,
    headline: null,
    avatar_url: null,
    bio: null,
    location: null,
    country: null,
    account_type: accountType,
    website: null,
    linkedin_url: null,
    instagram_url: null,
    tiktok_url: null,
    github_url: null,
    availability: 'Disponible pour opportunités et projets',
    profile_visibility: 'public',
    passport_id: `SB-2026-${randomSuffix}`,
    passport_score: 20,
    skills: [],
    projects: [],
    certifications: [],
    validations: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const isConfigured = isSupabaseConfigured();

  // Load from local storage or initialize
  const loadLocalState = useCallback(() => {
    try {
      const savedProfile = localStorage.getItem(STORAGE_KEY_PROFILE);
      const savedUser = localStorage.getItem(STORAGE_KEY_USER);

      if (savedProfile && savedUser) {
        setProfile(JSON.parse(savedProfile));
        setUser(JSON.parse(savedUser));
      } else {
        setProfile(null);
        setUser(null);
      }
    } catch (e) {
      console.warn('Error accessing local storage:', e);
      setProfile(null);
      setUser(null);
    }
  }, []);

  const saveProfileLocally = (newProfile: Profile) => {
    setProfile(newProfile);
    try {
      localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(newProfile));
    } catch (e) {
      console.warn('Error writing profile to localStorage', e);
    }
  };

  // Fetch or create profile for active user
  const loadUserProfile = useCallback(async (activeUser: User) => {
    try {
      if (isConfigured) {
        const metadata = activeUser.user_metadata as {
          first_name?: string;
          last_name?: string;
          username?: string;
          account_type?: AccountType;
        };

        const { profile: userProfile, error: profileErr } = await ProfileService.getOrCreateProfile(
          activeUser.id,
          activeUser.email || '',
          metadata
        );

        if (profileErr) {
          console.error('Error loading profile:', profileErr);
          setError(profileErr);
          loadLocalState();
        } else if (userProfile) {
          // Merge with extra properties if missing
          const fullProfile: Profile = {
            ...createCleanProfile(activeUser.id, activeUser.email || '', userProfile.first_name, userProfile.last_name, userProfile.account_type),
            ...userProfile,
            skills: userProfile.skills || [],
            projects: userProfile.projects || [],
            certifications: userProfile.certifications || [],
            validations: userProfile.validations || []
          };
          setProfile(fullProfile);
          try {
            localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(fullProfile));
          } catch (e) {
            console.warn(e);
          }
        }
      } else {
        loadLocalState();
      }
    } catch (err: unknown) {
      console.error('Unexpected error loading profile:', err);
      loadLocalState();
    }
  }, [isConfigured, loadLocalState]);

  // Initial session recovery
  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      setIsLoading(true);
      setError(null);

      if (!isConfigured) {
        loadLocalState();
        setIsLoading(false);
        return;
      }

      try {
        const { session: currentSession, error: sessionErr } = await AuthService.getSession();
        if (sessionErr) {
          if (isMounted) setError(sessionErr);
          loadLocalState();
        }

        if (isMounted) {
          setSession(currentSession);
          setUser(currentSession?.user || null);

          if (currentSession?.user) {
            await loadUserProfile(currentSession.user);
          } else {
            loadLocalState();
          }
        }
      } catch (err: unknown) {
        console.error('Error during auth initialization:', err);
        loadLocalState();
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    if (isConfigured) {
      const subscription = AuthService.onAuthStateChange(async (_event, newSession) => {
        if (!isMounted) return;

        setSession(newSession);
        const newUser = newSession?.user || null;
        setUser(newUser);

        if (newUser) {
          await loadUserProfile(newUser);
        }
        setIsLoading(false);
      });

      return () => {
        isMounted = false;
        subscription.unsubscribe();
      };
    }
  }, [isConfigured, loadUserProfile, loadLocalState]);

  const refreshProfile = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    await loadUserProfile(user);
    setIsLoading(false);
  }, [user, loadUserProfile]);

  const signUp = async (params: SignUpParams): Promise<{ success: boolean; error?: string }> => {
    setError(null);
    setIsLoading(true);

    if (isConfigured) {
      const { user: newUser, session: newSession, error: signUpErr } = await AuthService.signUp(params);
      if (signUpErr) {
        setError(signUpErr);
        setIsLoading(false);
        return { success: false, error: signUpErr };
      }
      if (newUser) {
        setUser(newUser);
        setSession(newSession);
        await loadUserProfile(newUser);
      }
    } else {
      // Local fallback account creation
      const localId = `sb_usr_${Date.now()}`;
      const localUser = {
        id: localId,
        email: params.email,
        user_metadata: {
          first_name: params.firstName,
          last_name: params.lastName,
          username: params.username,
          account_type: params.accountType
        }
      } as unknown as User;

      const newProf = createCleanProfile(localId, params.email, params.firstName, params.lastName, params.accountType);
      newProf.skills = [];
      newProf.projects = [];
      newProf.certifications = [];
      newProf.validations = [];
      newProf.passport_score = 40;

      setUser(localUser);
      saveProfileLocally(newProf);
      try {
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(localUser));
      } catch (e) {
        console.warn(e);
      }
    }

    setIsLoading(false);
    return { success: true };
  };

  const signIn = async (params: SignInParams): Promise<{ success: boolean; error?: string }> => {
    setError(null);
    setIsLoading(true);

    if (isConfigured) {
      const { user: loggedUser, session: loggedSession, error: signInErr } = await AuthService.signIn(params);
      if (signInErr) {
        setError(signInErr);
        setIsLoading(false);
        return { success: false, error: signInErr };
      }
      if (loggedUser) {
        setUser(loggedUser);
        setSession(loggedSession);
        await loadUserProfile(loggedUser);
      }
    } else {
      // Local login fallback: load existing user or create clean account for this email
      const savedUserStr = localStorage.getItem(STORAGE_KEY_USER);
      const savedProfStr = localStorage.getItem(STORAGE_KEY_PROFILE);
      if (savedUserStr && savedProfStr) {
        setUser(JSON.parse(savedUserStr));
        setProfile(JSON.parse(savedProfStr));
      } else {
        const localId = `sb_usr_${Date.now()}`;
        const namePart = params.email.split('@')[0] || 'Talent';
        const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
        const localUser = {
          id: localId,
          email: params.email,
          user_metadata: {
            first_name: formattedName,
            last_name: '',
            username: namePart.toLowerCase(),
            account_type: 'talent'
          }
        } as unknown as User;
        const newProf = createCleanProfile(localId, params.email, formattedName, '', 'talent');
        setUser(localUser);
        saveProfileLocally(newProf);
        try {
          localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(localUser));
        } catch (e) {
          console.warn(e);
        }
      }
    }

    setIsLoading(false);
    return { success: true };
  };

  const loadDemoAccount = (role: 'talent' | 'mentor' | 'company' = 'talent') => {
    const demoId = `demo_${role}_${Date.now()}`;
    const first = role === 'mentor' ? 'Dr. Ousmane' : role === 'company' ? 'Koffi' : 'Aïcha';
    const last = role === 'mentor' ? 'Sylla' : role === 'company' ? 'Tech Corp' : 'Konaté';
    const email = `${first.toLowerCase().replace(/[^a-z]/g, '')}@skillbridge.africa`;
    
    const demoUser = {
      id: demoId,
      email,
      user_metadata: {
        first_name: first,
        last_name: last,
        username: `${first.toLowerCase().replace(/[^a-z]/g, '')}_${last.toLowerCase().replace(/[^a-z]/g, '')}`,
        account_type: role
      }
    } as unknown as User;

    const demoProfile = createCleanProfile(demoId, email, first, last, role);
    demoProfile.headline = role === 'mentor' ? 'Lead Architecte Cloud & Mentor' : role === 'company' ? 'Directeur Recrutement & Partenariats' : 'Ingénieur Logiciel & Systèmes Distribués';
    demoProfile.location = 'Dakar';
    demoProfile.country = 'Sénégal';
    demoProfile.bio = 'Passionné par l\'ingénierie logicielle d\'excellence et l\'impact technologique en Afrique.';
    
    setUser(demoUser);
    saveProfileLocally(demoProfile);
    try {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(demoUser));
    } catch (e) {
      console.warn(e);
    }
  };

  const signOut = async (): Promise<void> => {
    setError(null);
    setIsLoading(true);
    if (isConfigured) {
      await AuthService.signOut();
    }
    setUser(null);
    setSession(null);
    setProfile(null);
    try {
      localStorage.removeItem(STORAGE_KEY_USER);
      localStorage.removeItem(STORAGE_KEY_PROFILE);
    } catch (e) {
      console.warn(e);
    }
    setIsLoading(false);
  };

  const updateProfile = async (input: ProfileUpdateInput): Promise<{ success: boolean; error?: string }> => {
    if (!profile) {
      return { success: false, error: 'Aucun profil actif.' };
    }

    setError(null);

    // Calculate dynamic passport score based on real verified items
    const skillsCount = (input.skills || profile.skills).length;
    const verifiedSkillsCount = (input.skills || profile.skills).filter(s => s.stage === 'verified' || s.stage === 'demonstrated').length;
    const projectsCount = (input.projects || profile.projects).length;
    const certsCount = (input.certifications || profile.certifications).length;
    const hasPhoto = Boolean(input.avatar_url || profile.avatar_url);

    const calculatedScore = Math.min(
      100,
      35 + (hasPhoto ? 10 : 0) + (skillsCount * 5) + (verifiedSkillsCount * 8) + (projectsCount * 10) + (certsCount * 8)
    );

    const updatedProfile: Profile = {
      ...profile,
      first_name: input.first_name !== undefined ? input.first_name : profile.first_name,
      last_name: input.last_name !== undefined ? input.last_name : profile.last_name,
      username: input.username !== undefined ? input.username : profile.username,
      headline: input.headline !== undefined ? input.headline : profile.headline,
      bio: input.bio !== undefined ? input.bio : profile.bio,
      location: input.location !== undefined ? input.location : profile.location,
      country: input.country !== undefined ? input.country : profile.country,
      account_type: input.account_type !== undefined ? input.account_type : profile.account_type,
      website: input.website !== undefined ? input.website : profile.website,
      linkedin_url: input.linkedin_url !== undefined ? input.linkedin_url : profile.linkedin_url,
      github_url: input.github_url !== undefined ? input.github_url : profile.github_url,
      availability: input.availability !== undefined ? input.availability : profile.availability,
      avatar_url: input.avatar_url !== undefined ? input.avatar_url : profile.avatar_url,
      skills: input.skills !== undefined ? input.skills : profile.skills,
      projects: input.projects !== undefined ? input.projects : profile.projects,
      certifications: input.certifications !== undefined ? input.certifications : profile.certifications,
      validations: input.validations !== undefined ? input.validations : profile.validations,
      passport_score: input.passport_score !== undefined ? input.passport_score : calculatedScore,
      updated_at: new Date().toISOString()
    };

    saveProfileLocally(updatedProfile);

    if (isConfigured && user) {
      await ProfileService.updateProfile(user.id, input);
    }

    return { success: true };
  };

  const uploadAvatar = async (fileOrDataUrl: File | string): Promise<{ success: boolean; url?: string; error?: string }> => {
    if (!profile) {
      return { success: false, error: 'Aucun profil actif.' };
    }

    setError(null);

    let finalUrl = '';

    if (typeof fileOrDataUrl === 'string') {
      finalUrl = fileOrDataUrl;
    } else if (fileOrDataUrl instanceof File) {
      if (isConfigured && user) {
        const { url, error: uploadErr } = await StorageService.uploadAvatar(user.id, fileOrDataUrl);
        if (uploadErr || !url) {
          setError(uploadErr || 'Échec du téléversement.');
          return { success: false, error: uploadErr || 'Échec du téléversement.' };
        }
        finalUrl = url;
      } else {
        // Read file as Base64 data URL for local storage
        finalUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(fileOrDataUrl);
        });
      }
    }

    await updateProfile({ avatar_url: finalUrl });
    return { success: true, url: finalUrl };
  };

  const deleteAvatar = async (): Promise<{ success: boolean; error?: string }> => {
    if (!profile) {
      return { success: false, error: 'Aucun profil actif.' };
    }

    setError(null);
    if (isConfigured && user && profile.avatar_url) {
      await StorageService.deleteAvatar(user.id, profile.avatar_url);
    }

    await updateProfile({ avatar_url: null });
    return { success: true };
  };

  const addSkill = async (newSkillData: Omit<UserSkillItem, 'id'>) => {
    if (!profile) return;
    const newSkill: UserSkillItem = {
      ...newSkillData,
      id: `sk-${Date.now()}`
    };
    const updatedSkills = [newSkill, ...(profile.skills || [])];
    await updateProfile({ skills: updatedSkills });
  };

  const updateSkillStage = async (skillId: string, stage: SkillStage) => {
    if (!profile) return;
    const stageLevelMap: Record<SkillStage, number> = {
      declared: 30,
      learning: 50,
      practicing: 70,
      demonstrated: 85,
      verified: 95
    };
    const updatedSkills = profile.skills.map((s) => {
      if (s.id === skillId) {
        return {
          ...s,
          stage,
          level: stageLevelMap[stage]
        };
      }
      return s;
    });
    await updateProfile({ skills: updatedSkills });
  };

  const addSkillProof = async (skillId: string, proofData: Omit<SkillProof, 'id'>) => {
    if (!profile) return;
    const newProof: SkillProof = {
      ...proofData,
      id: `prf-${Date.now()}`
    };
    const updatedSkills = profile.skills.map((s) => {
      if (s.id === skillId) {
        return {
          ...s,
          stage: s.stage === 'declared' || s.stage === 'learning' ? ('practicing' as SkillStage) : s.stage,
          proofs: [newProof, ...(s.proofs || [])]
        };
      }
      return s;
    });
    await updateProfile({ skills: updatedSkills });
  };

  const removeSkill = async (skillId: string) => {
    if (!profile) return;
    const updatedSkills = profile.skills.filter(s => s.id !== skillId);
    await updateProfile({ skills: updatedSkills });
  };

  const addProject = async (projectData: Omit<UserProjectItem, 'id' | 'createdAt'>) => {
    if (!profile) return;
    const newProject: UserProjectItem = {
      ...projectData,
      id: `prj-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    const updatedProjects = [newProject, ...(profile.projects || [])];
    await updateProfile({ projects: updatedProjects });
  };

  const removeProject = async (projectId: string) => {
    if (!profile) return;
    const updatedProjects = profile.projects.filter(p => p.id !== projectId);
    await updateProfile({ projects: updatedProjects });
  };

  const addCertification = async (certData: Omit<UserCertificationItem, 'id'>) => {
    if (!profile) return;
    const newCert: UserCertificationItem = {
      ...certData,
      id: `cert-${Date.now()}`
    };
    const updatedCerts = [newCert, ...(profile.certifications || [])];
    await updateProfile({ certifications: updatedCerts });
  };

  const removeCertification = async (certId: string) => {
    if (!profile) return;
    const updatedCerts = profile.certifications.filter(c => c.id !== certId);
    await updateProfile({ certifications: updatedCerts });
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        isLoading,
        isConfigured,
        error,
        signUp,
        signIn,
        signOut,
        refreshProfile,
        updateProfile,
        uploadAvatar,
        deleteAvatar,
        addSkill,
        updateSkillStage,
        addSkillProof,
        removeSkill,
        addProject,
        removeProject,
        addCertification,
        removeCertification,
        loadDemoAccount,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
