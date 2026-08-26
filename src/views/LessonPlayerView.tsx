import React, { useState, useEffect } from 'react';
import { ViewType } from '../types/platform';
import { useLearning } from '../context/LearningContext';
import { FaIcon } from '../components/FaIcon';
import { CertificateModal } from '../components/CertificateModal';
import { 
  faArrowLeft, 
  faCheckCircle, 
  faBars, 
  faXmark, 
  faCircleQuestion, 
  faPaperPlane, 
  faAward, 
  faCertificate,
  faChevronRight, 
  faChevronLeft, 
  faCheck,
  faShieldHalved,
  faPlay
} from '@fortawesome/free-solid-svg-icons';
import { 
  Lesson, 
  LessonBlock, 
  QuizBlockContent, 
  ProjectBlockContent, 
  TextBlockContent,
  ImageBlockContent,
  VideoBlockContent,
  UserCertificate
} from '../types/learning';

interface LessonPlayerProps {
  onNavigate: (view: ViewType) => void;
}

export const LessonPlayerView: React.FC<LessonPlayerProps> = ({ onNavigate }) => {
  const { 
    activeContent, 
    activeLessonId, 
    setActiveLessonId, 
    getEnrollment, 
    toggleLessonCompletion, 
    submitQuizResult, 
    submitProject,
    generateCertificate,
    userCertificates
  } = useLearning();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedImageModal, setSelectedImageModal] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeGeneratedCert, setActiveGeneratedCert] = useState<UserCertificate | null>(null);
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);

  const enrollment = activeContent ? getEnrollment(activeContent.id) : undefined;

  // Flatten all lessons for navigation
  const allLessons: { lesson: Lesson; moduleTitle: string }[] = [];
  (activeContent?.modules || []).forEach((m) => {
    (m.lessons || []).forEach((l) => {
      allLessons.push({ lesson: l, moduleTitle: m.title });
    });
  });

  // Current active lesson
  const currentLessonIndex = allLessons.findIndex((item) => item.lesson.id === activeLessonId);
  const currentItem = currentLessonIndex >= 0 ? allLessons[currentLessonIndex] : allLessons[0];
  const currentLesson = currentItem?.lesson;

  // Set initial lesson if none
  useEffect(() => {
    if (!activeLessonId && allLessons.length > 0) {
      setActiveLessonId(allLessons[0].lesson.id);
    }
  }, [activeLessonId, allLessons, setActiveLessonId]);

  if (!activeContent || !currentLesson) {
    return (
      <div className="max-w-xl mx-auto py-24 px-4 text-center space-y-4">
        <h2 className="text-xl font-bold text-[#101820]">Aucune leçon sélectionnée</h2>
        <p className="text-xs text-stone-500">Veuillez choisir un cours depuis votre espace d'apprentissage.</p>
        <button
          type="button"
          onClick={() => onNavigate('learn')}
          className="px-5 py-2.5 rounded-xl bg-[#123B5D] text-white text-xs font-bold cursor-pointer"
        >
          Retour à l'espace Apprendre
        </button>
      </div>
    );
  }

  const isCompleted = enrollment?.completedLessonIds?.includes(currentLesson.id) ?? false;
  const isAllCompleted = allLessons.length > 0 && 
    (enrollment?.completedLessonIds?.length || 0) >= allLessons.length;

  const existingCert = userCertificates.find((c) => c.contentId === activeContent.id);

  const handleToggleComplete = async () => {
    await toggleLessonCompletion(activeContent.id, currentLesson.id);
    showToast('Progression enregistrée sur votre profil.');
  };

  const handleNextLesson = () => {
    if (currentLessonIndex < allLessons.length - 1) {
      setActiveLessonId(allLessons[currentLessonIndex + 1].lesson.id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevLesson = () => {
    if (currentLessonIndex > 0) {
      setActiveLessonId(allLessons[currentLessonIndex - 1].lesson.id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleClaimCertificate = async () => {
    if (existingCert) {
      setActiveGeneratedCert(existingCert);
      setIsCertModalOpen(true);
      return;
    }

    const res = await generateCertificate(activeContent.id);
    if (res.success && res.certificate) {
      setActiveGeneratedCert(res.certificate);
      setIsCertModalOpen(true);
      showToast('Certificat officiel émis avec succès !');
    } else {
      showToast(res.error || 'Impossible d\'émettre le certificat.');
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="w-full bg-[#F5F7F6] min-h-screen flex flex-col">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#123B5D] text-white px-4 py-3 rounded-2xl shadow-xl border border-white/20 text-xs flex items-center gap-2 animate-slideUp">
          <FaIcon icon={faCheckCircle} className="text-[#59B83E] text-base shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Player Navigation Bar */}
      <header className="bg-white border-b border-[#E2E8E5] px-4 sm:px-6 py-3.5 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onNavigate('learn')}
            className="p-2 rounded-xl text-stone-600 hover:text-[#101820] hover:bg-stone-100 transition-colors cursor-pointer"
            aria-label="Quitter le cours"
          >
            <FaIcon icon={faArrowLeft} />
          </button>

          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-xl text-stone-600 hover:text-[#101820] hover:bg-stone-100 transition-colors cursor-pointer"
            aria-label="Afficher/Masquer le sommaire"
          >
            <FaIcon icon={faBars} />
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-stone-400">
                {activeContent.isOfficialSkillBridge ? 'Programme Officiel' : 'Cours Mentor'}
              </span>
              {activeContent.isCertifying && (
                <span className="px-2 py-0.5 rounded-full bg-[#59B83E]/10 text-[#59B83E] text-[10px] font-mono font-bold">
                  Certifiant
                </span>
              )}
            </div>
            <h1 className="text-xs sm:text-sm font-bold text-[#101820] truncate max-w-md">
              {activeContent.title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Complete Lesson Checkbox */}
          <button
            type="button"
            onClick={handleToggleComplete}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              isCompleted
                ? 'bg-[#59B83E]/10 text-[#59B83E] border border-[#59B83E]/30'
                : 'bg-[#123B5D] text-white hover:bg-[#0A2338]'
            }`}
          >
            <FaIcon icon={isCompleted ? faCheckCircle : faCheck} className="text-xs" />
            <span className="hidden sm:inline">
              {isCompleted ? 'Leçon terminée' : 'Marquer comme terminée'}
            </span>
          </button>

          {/* Certificate Claim Button if finished */}
          {(isAllCompleted || existingCert) && activeContent.isCertifying && (
            <button
              type="button"
              onClick={handleClaimCertificate}
              className="px-3.5 py-2 rounded-xl bg-[#59B83E] hover:bg-[#4ea834] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <FaIcon icon={faCertificate} />
              <span className="hidden sm:inline">
                {existingCert ? 'Voir mon Certificat' : 'Obtenir le Certificat'}
              </span>
            </button>
          )}
        </div>
      </header>

      {/* Main Layout: Sidebar + Lesson Viewer */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Course Syllabus Sidebar */}
        <aside
          className={`${
            sidebarOpen ? 'w-80' : 'w-0'
          } transition-all duration-300 bg-white border-r border-[#E2E8E5] flex flex-col shrink-0 overflow-hidden select-none`}
        >
          <div className="p-4 border-b border-[#E2E8E5] flex items-center justify-between bg-[#FAFCFB]">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-stone-500">
              Plan de formation
            </span>
            <span className="text-[11px] font-mono text-stone-400">
              {allLessons.length} leçons
            </span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-stone-100">
            {activeContent.modules.map((mod, modIdx) => (
              <div key={mod.id} className="py-2">
                <div className="px-4 py-2 text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                  Module {modIdx + 1} : {mod.title}
                </div>

                <div className="space-y-1 px-2">
                  {mod.lessons.map((les) => {
                    const isActive = les.id === currentLesson.id;
                    const lesCompleted = enrollment?.completedLessonIds?.includes(les.id);

                    return (
                      <button
                        key={les.id}
                        type="button"
                        onClick={() => {
                          setActiveLessonId(les.id);
                          if (window.innerWidth < 1024) setSidebarOpen(false);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className={`w-full p-2.5 rounded-xl text-left flex items-start gap-2.5 transition-all text-xs cursor-pointer ${
                          isActive
                            ? 'bg-[#123B5D] text-white font-bold shadow-2xs'
                            : 'text-stone-700 hover:bg-stone-100'
                        }`}
                      >
                        {lesCompleted ? (
                          <FaIcon icon={faCheckCircle} className={`mt-0.5 shrink-0 ${isActive ? 'text-[#59B83E]' : 'text-[#59B83E]'}`} />
                        ) : (
                          <div className={`w-3.5 h-3.5 mt-0.5 rounded-full border-2 shrink-0 ${isActive ? 'border-white/60' : 'border-stone-300'}`} />
                        )}

                        <div className="flex-1 min-w-0">
                          <div className="truncate">{les.title}</div>
                          <div className={`text-[10px] ${isActive ? 'text-white/70' : 'text-stone-400'}`}>
                            {les.durationMinutes} min
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar Footer: Skill Passport Sync Indicator */}
          <div className="p-4 border-t border-[#E2E8E5] bg-[#F5F7F6]">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#123B5D]">
              <FaIcon icon={faShieldHalved} className="text-[#59B83E]" />
              <span>Skill Passport Connecté</span>
            </div>
            <p className="text-[11px] text-stone-500 mt-1">
              Vos quiz et projets enrichissent directement votre profil audité.
            </p>
          </div>
        </aside>

        {/* Main Lesson Content Canvas */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-8 py-8 lg:py-10 max-w-4xl mx-auto w-full space-y-8">
          
          {/* Lesson Title Header */}
          <div className="space-y-2 pb-6 border-b border-stone-200">
            <div className="text-xs font-mono font-semibold text-[#59B83E] uppercase tracking-wider">
              {currentItem?.moduleTitle}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#101820]">
              {currentLesson.title}
            </h1>
            {currentLesson.description && (
              <p className="text-sm text-stone-600 leading-relaxed">
                {currentLesson.description}
              </p>
            )}
          </div>

          {/* Sequential Lesson Blocks */}
          <div className="space-y-8">
            {currentLesson.blocks.map((block) => (
              <RenderLessonBlock 
                key={block.id} 
                block={block} 
                onImageClick={(url) => setSelectedImageModal(url)}
                onQuizPass={(score) => {
                  submitQuizResult(activeContent.id, block.id, score, true);
                  showToast('Quiz réussi avec succès ! Votre compétence progresse.');
                }}
                onSubmitProject={async (deliverableUrl, notes) => {
                  const res = await submitProject({
                    contentId: activeContent.id,
                    lessonId: currentLesson.id,
                    blockId: block.id,
                    blockTitle: block.title || currentLesson.title,
                    deliverableUrl,
                    notes
                  });
                  if (res.success) {
                    showToast('Projet soumis ! Une preuve a été ajoutée à votre Skill Passport.');
                  }
                }}
              />
            ))}
          </div>

          {/* End of Course Certification Callout Banner */}
          {activeContent.isCertifying && (
            <div className="bg-gradient-to-r from-[#123B5D] to-[#0A2338] text-white rounded-3xl p-6 sm:p-8 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="space-y-2 max-w-md">
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#59B83E]/20 text-[#59B83E] text-xs font-mono font-bold">
                  <FaIcon icon={faCertificate} />
                  <span>Certification Officielle</span>
                </div>
                <h3 className="font-heading text-lg sm:text-xl font-bold text-white">
                  Obtenez votre Titre de Compétence SkillBridge
                </h3>
                <p className="text-xs text-stone-300">
                  Complétez toutes les leçons et les quiz du programme pour générer votre certificat vérifiable sur le registre public.
                </p>
              </div>

              <button
                type="button"
                onClick={handleClaimCertificate}
                className="px-5 py-3 rounded-xl bg-[#59B83E] hover:bg-[#4ea834] text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer whitespace-nowrap"
              >
                <FaIcon icon={faAward} />
                <span>{existingCert ? 'Consulter le Certificat' : 'Délivrer mon Certificat'}</span>
              </button>
            </div>
          )}

          {/* Bottom Navigation Buttons */}
          <div className="pt-8 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              type="button"
              disabled={currentLessonIndex === 0}
              onClick={handlePrevLesson}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-100 disabled:opacity-40 disabled:pointer-events-none text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <FaIcon icon={faChevronLeft} />
              <span>Leçon précédente</span>
            </button>

            <button
              type="button"
              onClick={async () => {
                if (!isCompleted) {
                  await handleToggleComplete();
                }
                handleNextLesson();
              }}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#123B5D] hover:bg-[#0A2338] text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-all"
            >
              <span>{currentLessonIndex === allLessons.length - 1 ? 'Terminer le programme' : 'Leçon suivante'}</span>
              <FaIcon icon={faChevronRight} className="text-[#59B83E]" />
            </button>
          </div>

        </main>
      </div>

      {/* Certificate Modal */}
      <CertificateModal
        certificate={activeGeneratedCert}
        isOpen={isCertModalOpen}
        onClose={() => {
          setIsCertModalOpen(false);
          setActiveGeneratedCert(null);
        }}
        onNavigateToVerification={() => onNavigate('verify')}
      />

      {/* Image Lightbox Modal */}
      {selectedImageModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedImageModal(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <img
              src={selectedImageModal}
              alt="Agrandissement"
              className="w-full h-full object-contain rounded-2xl"
              referrerPolicy="no-referrer"
            />
            <button
              type="button"
              onClick={() => setSelectedImageModal(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/70 text-white hover:bg-black transition-colors cursor-pointer"
            >
              <FaIcon icon={faXmark} />
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

// Sub-Component: Dynamic Block Renderer
const RenderLessonBlock: React.FC<{
  block: LessonBlock;
  onImageClick: (url: string) => void;
  onQuizPass: (score: number) => void;
  onSubmitProject: (url: string, notes?: string) => Promise<void>;
}> = ({ block, onImageClick, onQuizPass, onSubmitProject }) => {
  switch (block.type) {
    case 'text': {
      const c = block.content as TextBlockContent;
      return (
        <div className="bg-white rounded-2xl border border-[#E2E8E5] p-6 sm:p-8 shadow-2xs space-y-4">
          <div className="prose prose-stone max-w-none text-xs sm:text-sm leading-relaxed text-stone-700 whitespace-pre-wrap">
            {c.markdown}
          </div>
        </div>
      );
    }
    case 'image': {
      const c = block.content as ImageBlockContent;
      return (
        <div className="bg-white rounded-2xl border border-[#E2E8E5] overflow-hidden shadow-2xs p-4">
          <img 
            src={c.imageUrl} 
            alt={c.altText || block.title || 'Image'} 
            className="w-full h-auto rounded-xl cursor-zoom-in"
            onClick={() => onImageClick(c.imageUrl)}
            referrerPolicy="no-referrer"
          />
          {c.caption && (
            <p className="text-center text-[11px] text-stone-500 mt-3 italic">{c.caption}</p>
          )}
        </div>
      );
    }
    case 'video': {
      const c = block.content as VideoBlockContent;
      return (
        <div className="bg-white rounded-2xl border border-[#E2E8E5] overflow-hidden shadow-2xs space-y-3 p-4">
          <div className="relative aspect-video rounded-xl overflow-hidden bg-black flex items-center justify-center">
            {c.videoUrl.includes('youtube.com') || c.videoUrl.includes('youtu.be') ? (
              <iframe
                src={c.videoUrl}
                title={block.title || 'Vidéo de cours'}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="text-center text-white space-y-2 p-6">
                <div className="w-14 h-14 rounded-full bg-[#59B83E] flex items-center justify-center mx-auto text-[#123B5D]">
                  <FaIcon icon={faPlay} className="text-xl ml-1" />
                </div>
                <div className="text-xs font-bold">{c.videoUrl}</div>
              </div>
            )}
          </div>
          {c.caption && (
            <p className="text-xs text-stone-500 font-light px-2">{c.caption}</p>
          )}
        </div>
      );
    }
    case 'quiz': {
      const c = block.content as QuizBlockContent;
      return <InteractiveQuiz quiz={c} onPass={onQuizPass} />;
    }
    case 'project': {
      const c = block.content as ProjectBlockContent;
      return <InteractiveProjectDeliverable project={c} onSubmit={onSubmitProject} />;
    }
    default:
      return null;
  }
};

// Interactive Quiz Subcomponent
const InteractiveQuiz: React.FC<{
  quiz: QuizBlockContent;
  onPass: (score: number) => void;
}> = ({ quiz, onPass }) => {
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  const handleSelect = (questionId: string, optionId: string) => {
    if (submitted) return;
    setSelectedOptions((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const handleValidate = () => {
    let correctCount = 0;
    quiz.questions.forEach((q) => {
      const selectedOptId = selectedOptions[q.id];
      const correctOptId = q.options.find(o => o.isCorrect)?.id;
      if (selectedOptId === correctOptId) {
        correctCount += 1;
      }
    });

    const calculatedScore = Math.round((correctCount / quiz.questions.length) * 100);
    setScore(calculatedScore);
    setSubmitted(true);

    if (calculatedScore >= (quiz.passingScorePercent || 70)) {
      onPass(calculatedScore);
    }
  };

  const passed = score !== null && score >= (quiz.passingScorePercent || 70);

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8E5] p-6 sm:p-8 shadow-2xs space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#123B5D]">
          <FaIcon icon={faCircleQuestion} />
          <span>Évaluation des Connaissances</span>
        </div>
        <span className="px-2.5 py-0.5 rounded-md bg-stone-100 text-stone-600 font-mono text-[10px] font-bold">
          Seuil de réussite : {quiz.passingScorePercent || 70}%
        </span>
      </div>

      <div className="space-y-6">
        {quiz.questions.map((q, qIndex) => (
          <div key={q.id} className="space-y-3 pb-4 border-b border-stone-100 last:border-0">
            <h4 className="text-xs sm:text-sm font-bold text-[#101820]">
              {qIndex + 1}. {q.question}
            </h4>

            <div className="space-y-2">
              {q.options.map((opt) => {
                const isSelected = selectedOptions[q.id] === opt.id;
                const isCorrect = opt.isCorrect;

                let btnStyle = 'border-stone-200 hover:bg-stone-50 text-stone-700';
                if (submitted) {
                  if (isCorrect) {
                    btnStyle = 'border-[#59B83E] bg-[#59B83E]/10 text-[#123B5D] font-bold';
                  } else if (isSelected && !isCorrect) {
                    btnStyle = 'border-rose-300 bg-rose-50 text-rose-800';
                  }
                } else if (isSelected) {
                  btnStyle = 'border-[#123B5D] bg-[#123B5D]/5 text-[#123B5D] font-bold';
                }

                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleSelect(q.id, opt.id)}
                    className={`w-full p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                  >
                    <span>{opt.text}</span>
                    {submitted && isCorrect && <FaIcon icon={faCheckCircle} className="text-[#59B83E]" />}
                  </button>
                );
              })}
            </div>

            {submitted && q.explanation && (
              <div className="p-3 rounded-xl bg-stone-50 text-[11px] text-stone-600">
                <strong>Explication :</strong> {q.explanation}
              </div>
            )}
          </div>
        ))}
      </div>

      {!submitted ? (
        <button
          type="button"
          onClick={handleValidate}
          disabled={Object.keys(selectedOptions).length < quiz.questions.length}
          className="w-full py-3 rounded-xl bg-[#123B5D] hover:bg-[#0A2338] disabled:opacity-40 text-white font-bold text-xs cursor-pointer transition-all shadow-xs"
        >
          Valider mes réponses
        </button>
      ) : (
        <div className={`p-4 rounded-xl text-center space-y-2 ${passed ? 'bg-[#59B83E]/10 text-[#123B5D]' : 'bg-rose-50 text-rose-900'}`}>
          <div className="font-heading text-base font-extrabold">
            Résultat : {score}% {passed ? '— Validé avec succès !' : '— Score insuffisant.'}
          </div>
          <p className="text-xs">
            {passed
              ? 'Félicitations ! Vos compétences ont été enregistrées sur votre Passeport.'
              : 'Vous pouvez réviser le contenu et retenter ce quiz.'}
          </p>
        </div>
      )}
    </div>
  );
};

// Interactive Project Deliverable Subcomponent
const InteractiveProjectDeliverable: React.FC<{
  project: ProjectBlockContent;
  onSubmit: (url: string, notes?: string) => Promise<void>;
}> = ({ project, onSubmit }) => {
  const [deliverableUrl, setDeliverableUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deliverableUrl) return;

    setIsSubmitting(true);
    await onSubmit(deliverableUrl, notes);
    setIsSubmitting(false);
    setIsSubmittedSuccess(true);
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8E5] p-6 sm:p-8 shadow-2xs space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#123B5D]">
          <FaIcon icon={faAward} />
          <span>Projet Pratique — Démonstration de Compétence</span>
        </div>
        <span className="px-2.5 py-0.5 rounded-md bg-[#59B83E]/10 text-[#59B83E] font-mono text-[10px] font-bold">
          Stade : Démontrée
        </span>
      </div>

      <div className="space-y-2">
        <h4 className="text-base font-bold text-[#101820]">{project.title}</h4>
        <p className="text-xs text-stone-600 leading-relaxed">{project.context}</p>
      </div>

      {project.objectives && project.objectives.length > 0 && (
        <div className="space-y-2">
          <h5 className="text-xs font-bold text-stone-700">Objectifs du livrable :</h5>
          <ul className="space-y-1 pl-4 list-disc text-xs text-stone-600">
            {project.objectives.map((obj, i) => (
              <li key={i}>{obj}</li>
            ))}
          </ul>
        </div>
      )}

      {isSubmittedSuccess ? (
        <div className="p-4 rounded-xl bg-[#59B83E]/10 border border-[#59B83E]/30 text-[#123B5D] text-xs flex items-center gap-3">
          <FaIcon icon={faCheckCircle} className="text-[#59B83E] text-base shrink-0" />
          <div>
            <strong>Livrable transmis avec succès !</strong> Votre projet est indexé sur votre Skill Passport.
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 pt-2 border-t border-stone-100">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-700">
              Lien vers le livrable public (GitHub / Démo en ligne) *
            </label>
            <input
              type="url"
              required
              placeholder="https://github.com/votre-compte/projet-resilience"
              value={deliverableUrl}
              onChange={(e) => setDeliverableUrl(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8E5] text-xs focus:ring-2 focus:ring-[#123B5D]/20 focus:border-[#123B5D] outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-700">
              Notes complémentaires pour la revue
            </label>
            <textarea
              rows={2}
              placeholder="Précisez les choix techniques..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8E5] text-xs focus:ring-2 focus:ring-[#123B5D]/20 focus:border-[#123B5D] outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !deliverableUrl}
            className="w-full py-3 rounded-xl bg-[#123B5D] hover:bg-[#0A2338] disabled:opacity-40 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all shadow-xs"
          >
            <FaIcon icon={faPaperPlane} className="text-[#59B83E]" />
            <span>{isSubmitting ? 'Enregistrement...' : 'Soumettre le projet et certifier la compétence'}</span>
          </button>
        </form>
      )}
    </div>
  );
};
