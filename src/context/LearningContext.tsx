import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { 
  LearningItem, 
  UserEnrollment, 
  UserSubmission, 
  MentorApplication,
  UserCertificate
} from '../types/learning';
import { INITIAL_LEARNING_ITEMS, INITIAL_MENTOR_APPLICATIONS } from '../data/learningData';
import { useAuth } from './AuthContext';
import { SkillProof } from '../types';

const STORAGE_KEY_LEARNING_ITEMS = 'sb_learning_items_v3';
const STORAGE_KEY_ENROLLMENTS = 'sb_user_enrollments_v3';
const STORAGE_KEY_APPLICATIONS = 'sb_mentor_applications_v3';
const STORAGE_KEY_CERTIFICATES = 'sb_user_certificates_v3';

interface LearningContextType {
  // Contents
  allContents: LearningItem[];
  courses: LearningItem[];
  formations: LearningItem[];
  masterclasses: LearningItem[];
  officialPrograms: LearningItem[];
  mentorContents: LearningItem[];
  
  // Navigation & Selection state
  activeContentId: string | null;
  activeContent: LearningItem | null;
  setActiveContentId: (id: string | null) => void;
  activeLessonId: string | null;
  setActiveLessonId: (id: string | null) => void;
  selectedMentorId: string | null;
  setSelectedMentorId: (id: string | null) => void;
  selectedMentorProfile: {
    id: string;
    name: string;
    role: string;
    company?: string;
    avatar: string;
    bio?: string;
    items: LearningItem[];
  } | null;

  // Enrollments & Learner Progress
  userEnrollments: UserEnrollment[];
  myLearnings: { item: LearningItem; enrollment: UserEnrollment }[];
  isEnrolled: (contentId: string) => boolean;
  getEnrollment: (contentId: string) => UserEnrollment | undefined;
  enrollInContent: (contentId: string, paymentSimulated?: boolean) => Promise<{ success: boolean; error?: string }>;
  completePaidEnrollment: (contentId: string, paymentData: { method: string; transactionId?: string }) => Promise<{ success: boolean; error?: string }>;
  toggleLessonCompletion: (contentId: string, lessonId: string) => Promise<void>;
  submitQuizResult: (contentId: string, blockId: string, score: number, passed: boolean) => Promise<void>;
  submitProject: (params: {
    contentId: string;
    lessonId: string;
    blockId: string;
    blockTitle: string;
    deliverableUrl: string;
    notes?: string;
  }) => Promise<{ success: boolean; error?: string }>;

  // Certifications & Verification
  userCertificates: UserCertificate[];
  allCertificates: UserCertificate[];
  generateCertificate: (contentId: string) => Promise<{ success: boolean; certificate?: UserCertificate; error?: string }>;
  getCertificateById: (certificateId: string) => UserCertificate | null;
  verifyCertificateId: (certificateId: string) => UserCertificate | null;

  // Mentor / Content Creator Actions
  isMentor: boolean;
  isAdmin: boolean;
  myAuthoredContents: LearningItem[];
  createOrUpdateContent: (item: Partial<LearningItem>) => Promise<{ success: boolean; id?: string; error?: string }>;
  deleteContent: (contentId: string) => Promise<{ success: boolean; error?: string }>;
  mentorLearners: { enrollment: UserEnrollment; content: LearningItem; submissionCount: number }[];
  mentorSubmissions: UserSubmission[];
  gradeSubmission: (params: {
    submissionId: string;
    status: 'approved' | 'rejected' | 'reviewed';
    feedback: string;
    grade?: number;
  }) => Promise<{ success: boolean; error?: string }>;

  // Mentor Applications
  mentorApplications: MentorApplication[];
  userMentorApplication: MentorApplication | undefined;
  applyForMentorStatus: (data: Omit<MentorApplication, 'id' | 'userId' | 'status' | 'submittedAt'>) => Promise<{ success: boolean; error?: string }>;
  reviewMentorApplication: (appId: string, status: MentorApplication['status'], adminNotes?: string) => Promise<{ success: boolean; error?: string }>;
}

const LearningContext = createContext<LearningContextType | undefined>(undefined);

export const LearningProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, profile, updateProfile, addSkill, updateSkillStage, addSkillProof, addCertification } = useAuth();
  const currentUserId = user?.id || profile?.user_id || 'demo-user-1';

  const [allContents, setAllContents] = useState<LearningItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_LEARNING_ITEMS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return INITIAL_LEARNING_ITEMS;
  });

  const [enrollments, setEnrollments] = useState<UserEnrollment[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ENROLLMENTS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    // Default sample enrollment for the logged-in demo talent
    return [
      {
        id: 'enr-sample-1',
        userId: currentUserId,
        contentId: 'lrn-course-1',
        contentType: 'course',
        progressPercent: 66,
        completedLessonIds: ['les-1-1', 'les-1-2'],
        currentLessonId: 'les-2-1',
        quizScores: {
          'blk-4': { score: 100, passed: true, completedAt: '2026-02-20T14:00:00Z' }
        },
        submissions: [],
        enrolledAt: '2026-02-18T10:00:00Z',
        lastAccessedAt: '2026-02-25T16:00:00Z'
      }
    ];
  });

  const [certificates, setCertificates] = useState<UserCertificate[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CERTIFICATES);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return [
      {
        id: 'SB-CERT-2026-89421A',
        userId: currentUserId,
        userName: `${profile?.first_name || 'Aïcha'} ${profile?.last_name || 'Konaté'}`,
        userAvatar: profile?.avatar_url,
        contentId: 'sb-prog-cloud-resilience',
        contentTitle: 'Programme Officiel SkillBridge : Ingénierie Cloud & Résilience des Systèmes Panafricains',
        contentType: 'formation',
        issuer: 'SkillBridge Academy & Certification Authority',
        issueDate: '15 Février 2026',
        verificationUrl: `${window.location.origin}/#verify?cert=SB-CERT-2026-89421A`,
        skillsValidated: ['Architecture Cloud', 'Haute Disponibilité', 'Résilience Réseau'],
        scorePercent: 94,
        status: 'valid',
        signatureAuthority: 'Dr. Ousmane Sylla — Président du Collège d\'Évaluation',
        credentialFingerprint: 'SHA256: 4f8b9e1c2d3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c'
      }
    ];
  });

  const [applications, setApplications] = useState<MentorApplication[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_APPLICATIONS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return INITIAL_MENTOR_APPLICATIONS;
  });

  const [activeContentId, setActiveContentId] = useState<string | null>(null);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [selectedMentorId, setSelectedMentorId] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_LEARNING_ITEMS, JSON.stringify(allContents));
    } catch {
      // ignore
    }
  }, [allContents]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ENROLLMENTS, JSON.stringify(enrollments));
    } catch {
      // ignore
    }
  }, [enrollments]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CERTIFICATES, JSON.stringify(certificates));
    } catch {
      // ignore
    }
  }, [certificates]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_APPLICATIONS, JSON.stringify(applications));
    } catch {
      // ignore
    }
  }, [applications]);

  // Derived lists
  const courses = allContents.filter((c) => c.type === 'course' && c.published);
  const formations = allContents.filter((c) => c.type === 'formation' && c.published);
  const masterclasses = allContents.filter((c) => c.type === 'masterclass' && c.published);
  
  // Official vs Mentor classification
  const officialPrograms = allContents.filter((c) => (c.isOfficialSkillBridge || c.authorType === 'skillbridge') && c.published);
  const mentorContents = allContents.filter((c) => !c.isOfficialSkillBridge && c.authorType !== 'skillbridge' && c.published);

  const activeContent = allContents.find((c) => c.id === activeContentId) || null;

  // Mentor & Admin roles
  const isMentor = Boolean(profile?.account_type === 'mentor' || profile?.account_type === 'institution');
  const isAdmin = Boolean(profile?.account_type === 'company' || profile?.username === 'admin' || user?.email?.includes('admin'));

  // User's active enrollments
  const userEnrollments = enrollments.filter((e) => e.userId === currentUserId);

  // User's certificates
  const userCertificates = certificates.filter((c) => c.userId === currentUserId);

  const myLearnings = userEnrollments
    .map((enr) => {
      const item = allContents.find((c) => c.id === enr.contentId);
      if (!item) return null;
      return { item, enrollment: enr };
    })
    .filter(Boolean) as { item: LearningItem; enrollment: UserEnrollment }[];

  const isEnrolled = useCallback((contentId: string): boolean => {
    return userEnrollments.some((e) => e.contentId === contentId);
  }, [userEnrollments]);

  const getEnrollment = useCallback((contentId: string): UserEnrollment | undefined => {
    return userEnrollments.find((e) => e.contentId === contentId);
  }, [userEnrollments]);

  // Enroll in content
  const enrollInContent = async (contentId: string, paymentSimulated?: boolean): Promise<{ success: boolean; error?: string }> => {
    const item = allContents.find((c) => c.id === contentId);
    if (!item) {
      return { success: false, error: 'Contenu introuvable.' };
    }

    if (isEnrolled(contentId)) {
      return { success: true };
    }

    if (item.accessType === 'paid' && !paymentSimulated) {
      return { success: false, error: 'Cette formation est payante. Veuillez procéder au paiement pour débloquer l\'accès.' };
    }

    const firstLessonId = item.modules?.[0]?.lessons?.[0]?.id;

    const newEnrollment: UserEnrollment = {
      id: `enr-${Date.now()}`,
      userId: currentUserId,
      contentId,
      contentType: item.type,
      progressPercent: 0,
      completedLessonIds: [],
      currentLessonId: firstLessonId,
      quizScores: {},
      submissions: [],
      paymentStatus: paymentSimulated ? 'paid' : 'free',
      enrolledAt: new Date().toISOString(),
      lastAccessedAt: new Date().toISOString()
    };

    setEnrollments((prev) => [newEnrollment, ...prev]);

    // Connect with user's skills
    if (profile && item.targetSkills && item.targetSkills.length > 0) {
      const existingSkillNames = (profile.skills || []).map((s) => s.name.toLowerCase());
      
      for (const skillName of item.targetSkills) {
        if (!existingSkillNames.includes(skillName.toLowerCase())) {
          await addSkill({
            name: skillName,
            category: item.category || 'Compétences Techniques',
            stage: 'learning',
            level: 40,
            proofs: []
          });
        }
      }
    }

    return { success: true };
  };

  // Complete Paid Enrollment (Simulated Real Checkout)
  const completePaidEnrollment = async (
    contentId: string,
    paymentData: { method: string; transactionId?: string }
  ): Promise<{ success: boolean; error?: string }> => {
    const item = allContents.find((c) => c.id === contentId);
    if (!item) {
      return { success: false, error: 'Contenu introuvable.' };
    }

    const firstLessonId = item.modules?.[0]?.lessons?.[0]?.id;
    const txId = paymentData.transactionId || `TX-SB-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    if (isEnrolled(contentId)) {
      // Update existing enrollment
      setEnrollments((prev) =>
        prev.map((enr) =>
          enr.userId === currentUserId && enr.contentId === contentId
            ? { ...enr, paymentStatus: 'paid', paymentTransactionId: txId }
            : enr
        )
      );
      return { success: true };
    }

    const newEnrollment: UserEnrollment = {
      id: `enr-${Date.now()}`,
      userId: currentUserId,
      contentId,
      contentType: item.type,
      progressPercent: 0,
      completedLessonIds: [],
      currentLessonId: firstLessonId,
      quizScores: {},
      submissions: [],
      paymentStatus: 'paid',
      paymentTransactionId: txId,
      enrolledAt: new Date().toISOString(),
      lastAccessedAt: new Date().toISOString()
    };

    setEnrollments((prev) => [newEnrollment, ...prev]);

    // Add target skills
    if (profile && item.targetSkills && item.targetSkills.length > 0) {
      const existingSkillNames = (profile.skills || []).map((s) => s.name.toLowerCase());
      for (const skillName of item.targetSkills) {
        if (!existingSkillNames.includes(skillName.toLowerCase())) {
          await addSkill({
            name: skillName,
            category: item.category || 'Compétences Techniques',
            stage: 'learning',
            level: 45,
            proofs: []
          });
        }
      }
    }

    return { success: true };
  };

  // Toggle Lesson Completion
  const toggleLessonCompletion = async (contentId: string, lessonId: string) => {
    const item = allContents.find((c) => c.id === contentId);
    if (!item) return;

    // Calculate total lessons in content
    const allLessonIds: string[] = [];
    (item.modules || []).forEach((m) => {
      (m.lessons || []).forEach((l) => allLessonIds.push(l.id));
    });

    setEnrollments((prev) => {
      return prev.map((enr) => {
        if (enr.userId === currentUserId && enr.contentId === contentId) {
          const isCompleted = enr.completedLessonIds.includes(lessonId);
          const newCompleted = isCompleted 
            ? enr.completedLessonIds.filter((id) => id !== lessonId)
            : [...enr.completedLessonIds, lessonId];

          const progressPercent = allLessonIds.length > 0
            ? Math.round((newCompleted.length / allLessonIds.length) * 100)
            : 100;

          return {
            ...enr,
            completedLessonIds: newCompleted,
            progressPercent,
            completedAt: progressPercent === 100 ? (enr.completedAt || new Date().toISOString()) : undefined,
            lastAccessedAt: new Date().toISOString()
          };
        }
        return enr;
      });
    });
  };

  // Submit Quiz Result
  const submitQuizResult = async (contentId: string, blockId: string, score: number, passed: boolean) => {
    setEnrollments((prev) => {
      return prev.map((enr) => {
        if (enr.userId === currentUserId && enr.contentId === contentId) {
          return {
            ...enr,
            quizScores: {
              ...enr.quizScores,
              [blockId]: { score, passed, completedAt: new Date().toISOString() }
            },
            lastAccessedAt: new Date().toISOString()
          };
        }
        return enr;
      });
    });

    // Elevate skill stage if passed
    const item = allContents.find((c) => c.id === contentId);
    if (passed && profile && item?.targetSkills) {
      item.targetSkills.forEach((sName) => {
        const found = (profile.skills || []).find((s) => s.name.toLowerCase() === sName.toLowerCase());
        if (found && (found.stage === 'declared' || found.stage === 'learning')) {
          updateSkillStage(found.id, 'practicing');
        }
      });
    }
  };

  // Submit Project Deliverable
  const submitProject = async (params: {
    contentId: string;
    lessonId: string;
    blockId: string;
    blockTitle: string;
    deliverableUrl: string;
    notes?: string;
  }): Promise<{ success: boolean; error?: string }> => {
    const item = allContents.find((c) => c.id === params.contentId);
    if (!item) {
      return { success: false, error: 'Contenu introuvable.' };
    }

    const newSubmission: UserSubmission = {
      id: `sub-${Date.now()}`,
      blockId: params.blockId,
      blockTitle: params.blockTitle,
      lessonId: params.lessonId,
      contentId: params.contentId,
      userId: currentUserId,
      userName: `${profile?.first_name || 'Apprenant'} ${profile?.last_name || ''}`.trim(),
      userAvatar: profile?.avatar_url || undefined,
      deliverableUrl: params.deliverableUrl,
      notes: params.notes,
      submittedAt: new Date().toISOString(),
      status: 'submitted'
    };

    setEnrollments((prev) => {
      return prev.map((enr) => {
        if (enr.userId === currentUserId && enr.contentId === params.contentId) {
          return {
            ...enr,
            submissions: [...(enr.submissions || []), newSubmission],
            lastAccessedAt: new Date().toISOString()
          };
        }
        return enr;
      });
    });

    // Mark lesson as complete
    await toggleLessonCompletion(params.contentId, params.lessonId);

    // Create a real verifiable SkillProof and elevate skill to 'demonstrated'
    if (profile && item.targetSkills && item.targetSkills.length > 0) {
      const primarySkillName = item.targetSkills[0];
      const foundSkill = (profile.skills || []).find(
        (s) => s.name.toLowerCase() === primarySkillName.toLowerCase()
      );

      const proofData: Omit<SkillProof, 'id'> = {
        title: `Projet validé : ${params.blockTitle}`,
        url: params.deliverableUrl,
        type: params.deliverableUrl.includes('github') ? 'github' : 'live',
        date: new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }),
        verified: true
      };

      if (foundSkill) {
        await addSkillProof(foundSkill.id, proofData);
        if (foundSkill.stage !== 'verified') {
          await updateSkillStage(foundSkill.id, 'demonstrated');
        }
      } else {
        await addSkill({
          name: primarySkillName,
          category: item.category || 'Développement',
          stage: 'demonstrated',
          level: 75,
          proofs: [{ id: `prf-${Date.now()}`, ...proofData }]
        });
      }
    }

    return { success: true };
  };

  // Generate Official / Mentor Certificate
  const generateCertificate = async (contentId: string): Promise<{ success: boolean; certificate?: UserCertificate; error?: string }> => {
    const item = allContents.find((c) => c.id === contentId);
    if (!item) {
      return { success: false, error: 'Contenu introuvable.' };
    }

    const enrollment = getEnrollment(contentId);
    if (!enrollment) {
      return { success: false, error: 'Vous devez d\'abord être inscrit à cette formation.' };
    }

    // Verify completion requirements
    const allLessonIds: string[] = [];
    (item.modules || []).forEach((m) => {
      (m.lessons || []).forEach((l) => allLessonIds.push(l.id));
    });

    const isAllLessonsCompleted = allLessonIds.every((id) => enrollment.completedLessonIds.includes(id));
    if (!isAllLessonsCompleted) {
      return { 
        success: false, 
        error: `Conditions non remplies : ${enrollment.completedLessonIds.length}/${allLessonIds.length} leçons terminées.` 
      };
    }

    // Calculate score
    const quizScoreEntries = Object.values(enrollment.quizScores || {});
    const avgScore = quizScoreEntries.length > 0
      ? Math.round(quizScoreEntries.reduce((acc, q) => acc + q.score, 0) / quizScoreEntries.length)
      : 90;

    const minRequired = item.certificationCriteria?.minPassingScorePercent || 75;
    if (avgScore < minRequired) {
      return {
        success: false,
        error: `Score insuffisant (${avgScore}%). Un score minimum de ${minRequired}% est requis pour obtenir le certificat.`
      };
    }

    // Check if certificate already exists
    const existingCert = certificates.find((c) => c.contentId === contentId && c.userId === currentUserId);
    if (existingCert) {
      return { success: true, certificate: existingCert };
    }

    const certCode = `SB-CERT-2026-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const issueDateStr = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

    const newCertificate: UserCertificate = {
      id: certCode,
      userId: currentUserId,
      userName: `${profile?.first_name || 'Apprenant'} ${profile?.last_name || 'SkillBridge'}`.trim(),
      userAvatar: profile?.avatar_url || undefined,
      contentId: item.id,
      contentTitle: item.title,
      contentType: item.type,
      issuer: item.isOfficialSkillBridge 
        ? 'SkillBridge Academy & Certification Board' 
        : `${item.mentorName} (Certifié SkillBridge)`,
      issueDate: issueDateStr,
      verificationUrl: `${window.location.origin}/#verify?cert=${certCode}`,
      skillsValidated: item.targetSkills || ['Ingénierie Logicielle'],
      scorePercent: avgScore,
      status: 'valid',
      signatureAuthority: item.isOfficialSkillBridge
        ? 'Direction Pédagogique SkillBridge'
        : `${item.mentorName} — Formateur Certifié`,
      credentialFingerprint: `SHA256: ${Array.from({length: 16}, () => Math.floor(Math.random()*16).toString(16)).join('')}`
    };

    setCertificates((prev) => [newCertificate, ...prev]);

    // Update enrollment with certificate ID
    setEnrollments((prev) =>
      prev.map((e) =>
        e.id === enrollment.id
          ? { ...e, certificateId: certCode, certifiedAt: new Date().toISOString() }
          : e
      )
    );

    // Also add to profile.certifications for the Skill Passport
    if (profile) {
      await addCertification({
        title: item.title,
        issuer: newCertificate.issuer,
        date: issueDateStr,
        verified: true,
        credentialUrl: newCertificate.verificationUrl
      });
    }

    return { success: true, certificate: newCertificate };
  };

  // Get certificate by ID (for public verification)
  const getCertificateById = (certificateId: string): UserCertificate | null => {
    return certificates.find((c) => c.id.toLowerCase() === certificateId.trim().toLowerCase()) || null;
  };

  const verifyCertificateId = (certificateId: string): UserCertificate | null => {
    return getCertificateById(certificateId);
  };

  // Authored contents for mentor / admin
  const myAuthoredContents = allContents.filter(
    (c) => c.mentorId === profile?.id || c.mentorName?.toLowerCase().includes(profile?.first_name?.toLowerCase() || '___')
  );

  // Mentor learners & submissions
  const mentorLearners = enrollments
    .map((enr) => {
      const content = allContents.find((c) => c.id === enr.contentId);
      if (!content) return null;
      if (isAdmin || content.mentorId === profile?.id || content.mentorName?.toLowerCase().includes(profile?.first_name?.toLowerCase() || '___')) {
        return {
          enrollment: enr,
          content,
          submissionCount: (enr.submissions || []).length
        };
      }
      return null;
    })
    .filter(Boolean) as { enrollment: UserEnrollment; content: LearningItem; submissionCount: number }[];

  const mentorSubmissions = mentorLearners.flatMap((ml) => ml.enrollment.submissions || []);

  // Grade Submission by Mentor
  const gradeSubmission = async (params: {
    submissionId: string;
    status: 'approved' | 'rejected' | 'reviewed';
    feedback: string;
    grade?: number;
  }): Promise<{ success: boolean; error?: string }> => {
    setEnrollments((prev) => {
      return prev.map((enr) => {
        const hasSub = (enr.submissions || []).some((s) => s.id === params.submissionId);
        if (!hasSub) return enr;

        const updatedSubs = enr.submissions.map((s) => {
          if (s.id === params.submissionId) {
            return {
              ...s,
              status: params.status,
              feedback: params.feedback,
              grade: params.grade
            };
          }
          return s;
        });

        return {
          ...enr,
          submissions: updatedSubs
        };
      });
    });

    return { success: true };
  };

  // Create or Update content
  const createOrUpdateContent = async (itemData: Partial<LearningItem>): Promise<{ success: boolean; id?: string; error?: string }> => {
    if (!isMentor && !isAdmin) {
      return { success: false, error: 'Seuls les mentors ou administrateurs autorisés peuvent publier du contenu.' };
    }

    if (itemData.id) {
      // Update
      setAllContents((prev) =>
        prev.map((item) => {
          if (item.id === itemData.id) {
            return {
              ...item,
              ...itemData,
              updatedAt: new Date().toISOString()
            } as LearningItem;
          }
          return item;
        })
      );
      return { success: true, id: itemData.id };
    } else {
      // Create new
      const isOfficial = itemData.isOfficialSkillBridge ?? isAdmin;
      const newId = isOfficial 
        ? `sb-prog-${Date.now()}` 
        : `lrn-${itemData.type || 'course'}-${Date.now()}`;

      const newItem: LearningItem = {
        id: newId,
        type: itemData.type || 'formation',
        title: itemData.title || (isOfficial ? 'Nouvelle Formation Officielle SkillBridge' : 'Nouveau cours mentor'),
        slug: (itemData.title || 'nouvelle-formation').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        headline: itemData.headline || '',
        description: itemData.description || '',
        coverImage: itemData.coverImage || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
        category: itemData.category || 'Développement & Cloud',
        targetSkills: itemData.targetSkills || ['Architecture & Systèmes'],
        level: itemData.level || 'Tous niveaux',
        language: itemData.language || 'Français',
        estimatedDuration: itemData.estimatedDuration || '4h',
        accessType: itemData.accessType || 'free',
        price: itemData.price,
        currency: itemData.currency || 'EUR',
        isOfficialSkillBridge: isOfficial,
        authorType: isOfficial ? 'skillbridge' : 'mentor',
        isCertifying: itemData.isCertifying ?? true,
        certificationCriteria: itemData.certificationCriteria || {
          minPassingScorePercent: 80,
          requireAllLessons: true,
          requireCapstoneProject: false
        },
        mentorId: isOfficial ? 'skillbridge-official-faculty' : (profile?.id || 'prof-mentor-current'),
        mentorName: isOfficial ? 'SkillBridge Official Academy' : `${profile?.first_name || 'Mentor'} ${profile?.last_name || 'SkillBridge'}`.trim(),
        mentorRole: isOfficial ? 'Direction Pédagogique & Certification' : (profile?.headline || 'Expert & Mentor SkillBridge'),
        mentorCompany: isOfficial ? 'SkillBridge Certification Board' : (profile?.location || 'SkillBridge Expert Network'),
        mentorAvatar: isOfficial 
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
          : (profile?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'),
        mentorBio: isOfficial 
          ? 'Programmes académiques et professionnels certifiés par la faculté SkillBridge.'
          : (profile?.bio || ''),
        modules: itemData.modules || [
          {
            id: `mod-${Date.now()}-1`,
            title: 'Module 1 : Fondements & Objectifs Clés',
            order: 1,
            lessons: [
              {
                id: `les-${Date.now()}-1`,
                title: '1. Introduction & Objectifs de Certification',
                durationMinutes: 20,
                order: 1,
                isFreePreview: true,
                blocks: [
                  {
                    id: `blk-${Date.now()}-1`,
                    type: 'text',
                    order: 1,
                    content: {
                      markdown: '### Bienvenue dans ce programme certifiant\n\nDécouvrez les compétences clés que vous allez valider tout au long de ce parcours.'
                    }
                  }
                ]
              }
            ]
          }
        ],
        prerequisites: itemData.prerequisites || [],
        includedResources: itemData.includedResources || [],
        masterclassDate: itemData.masterclassDate,
        masterclassTime: itemData.masterclassTime,
        liveAccessUrl: itemData.liveAccessUrl,
        replayVideoUrl: itemData.replayVideoUrl,
        maxSeats: itemData.maxSeats,
        companionResources: itemData.companionResources || [],
        published: itemData.published ?? true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      setAllContents((prev) => [newItem, ...prev]);
      return { success: true, id: newId };
    }
  };

  // Delete content
  const deleteContent = async (contentId: string): Promise<{ success: boolean; error?: string }> => {
    if (!isMentor && !isAdmin) {
      return { success: false, error: 'Non autorisé.' };
    }
    setAllContents((prev) => prev.filter((c) => c.id !== contentId));
    return { success: true };
  };

  // User Mentor Application
  const userMentorApplication = applications.find(
    (a) => a.userId === currentUserId || a.email === user?.email
  );

  const applyForMentorStatus = async (
    data: Omit<MentorApplication, 'id' | 'userId' | 'status' | 'submittedAt'>
  ): Promise<{ success: boolean; error?: string }> => {
    const newApp: MentorApplication = {
      id: `app-${Date.now()}`,
      userId: currentUserId,
      ...data,
      status: 'pending',
      submittedAt: new Date().toISOString()
    };

    setApplications((prev) => [newApp, ...prev.filter((a) => a.userId !== currentUserId)]);
    return { success: true };
  };

  // Admin Review Application
  const reviewMentorApplication = async (
    appId: string,
    status: MentorApplication['status'],
    adminNotes?: string
  ): Promise<{ success: boolean; error?: string }> => {
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id === appId) {
          return {
            ...app,
            status,
            adminNotes: adminNotes || app.adminNotes,
            reviewedAt: new Date().toISOString()
          };
        }
        return app;
      })
    );

    // If approved and it's the current user, upgrade their profile to 'mentor'
    const targetApp = applications.find((a) => a.id === appId);
    if (status === 'approved' && targetApp?.userId === currentUserId) {
      await updateProfile({ account_type: 'mentor' });
    }

    return { success: true };
  };

  // Selected mentor profile helper
  const selectedMentorProfile = selectedMentorId ? (() => {
    const mentorItem = allContents.find((c) => c.mentorId === selectedMentorId);
    const mentorItems = allContents.filter((c) => c.mentorId === selectedMentorId && c.published);
    if (!mentorItem) return null;
    return {
      id: mentorItem.mentorId,
      name: mentorItem.mentorName,
      role: mentorItem.mentorRole,
      company: mentorItem.mentorCompany,
      avatar: mentorItem.mentorAvatar,
      bio: mentorItem.mentorBio,
      items: mentorItems
    };
  })() : null;

  return (
    <LearningContext.Provider
      value={{
        allContents,
        courses,
        formations,
        masterclasses,
        officialPrograms,
        mentorContents,
        activeContentId,
        activeContent,
        setActiveContentId,
        activeLessonId,
        setActiveLessonId,
        selectedMentorId,
        setSelectedMentorId,
        selectedMentorProfile,
        userEnrollments,
        myLearnings,
        isEnrolled,
        getEnrollment,
        enrollInContent,
        completePaidEnrollment,
        toggleLessonCompletion,
        submitQuizResult,
        submitProject,
        userCertificates,
        allCertificates: certificates,
        generateCertificate,
        getCertificateById,
        verifyCertificateId,
        isMentor,
        isAdmin,
        myAuthoredContents,
        createOrUpdateContent,
        deleteContent,
        mentorLearners,
        mentorSubmissions,
        gradeSubmission,
        mentorApplications: applications,
        userMentorApplication,
        applyForMentorStatus,
        reviewMentorApplication
      }}
    >
      {children}
    </LearningContext.Provider>
  );
};

export const useLearning = () => {
  const context = useContext(LearningContext);
  if (!context) {
    throw new Error('useLearning must be used within a LearningProvider');
  }
  return context;
};
