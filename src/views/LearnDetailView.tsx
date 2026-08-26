import React, { useState } from 'react';
import { ViewType } from '../types/platform';
import { useLearning } from '../context/LearningContext';
import { useAuth } from '../context/AuthContext';
import { 
  ArrowLeft, 
  Play, 
  CheckCircle2, 
  Clock, 
  Award, 
  FileText, 
  Download, 
  Calendar, 
  ShieldCheck, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Sparkles
} from 'lucide-react';

interface LearnDetailProps {
  onNavigate: (view: ViewType) => void;
}

export const LearnDetailView: React.FC<LearnDetailProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { 
    activeContent, 
    isEnrolled, 
    getEnrollment, 
    enrollInContent, 
    setActiveLessonId, 
    setSelectedMentorId 
  } = useLearning();

  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({
    'mod-1': true,
    'mod-ts-1': true,
    'mod-f1': true
  });
  const [enrolling, setEnrolling] = useState(false);

  if (!activeContent) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-stone-800">Contenu introuvable</h2>
        <p className="text-sm text-stone-500">Le cours ou la formation demandée n'existe pas ou a été déplacée.</p>
        <button
          type="button"
          onClick={() => onNavigate('learn')}
          className="px-5 py-2.5 rounded-xl bg-[#123B5D] text-white text-xs font-bold"
        >
          Retour à l'espace Apprendre
        </button>
      </div>
    );
  }

  const enrolled = isEnrolled(activeContent.id);
  const enrollment = getEnrollment(activeContent.id);

  const toggleModule = (modId: string) => {
    setExpandedModules((prev) => ({ ...prev, [modId]: !prev[modId] }));
  };

  const handleStartOrContinue = async () => {
    if (!user) {
      onNavigate('auth');
      return;
    }

    if (!enrolled) {
      setEnrolling(true);
      await enrollInContent(activeContent.id);
      setEnrolling(false);
    }

    // Set active lesson to first available lesson or user's current progress
    const firstLessonId = enrollment?.currentLessonId || activeContent.modules?.[0]?.lessons?.[0]?.id;
    if (firstLessonId) {
      setActiveLessonId(firstLessonId);
    }

    onNavigate('lesson-player');
  };

  const handleOpenMentor = () => {
    setSelectedMentorId(activeContent.mentorId);
    onNavigate('mentor-profile');
  };

  // Calculate total lessons
  const totalLessonsCount = (activeContent.modules || []).reduce(
    (acc, m) => acc + (m.lessons || []).length, 
    0
  );

  return (
    <div className="w-full bg-[#F5F7F6] min-h-screen pb-24">
      
      {/* Top Breadcrumb Header */}
      <div className="bg-white border-b border-[#E2E8E5] py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            type="button"
            onClick={() => onNavigate('learn')}
            className="inline-flex items-center gap-2 text-xs font-semibold text-stone-600 hover:text-[#123B5D] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour aux programmes</span>
          </button>

          <div className="flex items-center gap-2 text-xs text-stone-500 font-mono">
            <span>{activeContent.category}</span>
            <span>•</span>
            <span className="text-[#123B5D] font-bold uppercase">{activeContent.type}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left / Main Column (7 or 8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Main Title & Hero info */}
          <div className="bg-white rounded-3xl border border-[#E2E8E5] p-6 sm:p-8 shadow-2xs space-y-6">
            
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-md bg-[#123B5D] text-white text-xs font-bold uppercase">
                {activeContent.type === 'course' ? 'Cours Certifiant' : activeContent.type === 'formation' ? 'Formation Complète' : 'Masterclass'}
              </span>
              <span className="px-3 py-1 rounded-md bg-stone-100 text-stone-700 text-xs font-semibold">
                {activeContent.level}
              </span>
              <span className="px-3 py-1 rounded-md bg-stone-100 text-stone-700 text-xs font-mono">
                {activeContent.language}
              </span>
            </div>

            <div className="space-y-3">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#101820] leading-tight">
                {activeContent.title}
              </h1>
              <p className="text-base text-stone-600 leading-relaxed">
                {activeContent.headline}
              </p>
            </div>

            {/* Mentor Bar */}
            <div 
              onClick={handleOpenMentor}
              className="flex items-center gap-4 p-4 rounded-2xl bg-stone-50 border border-stone-200/80 hover:bg-stone-100 transition-colors cursor-pointer"
            >
              <img
                src={activeContent.mentorAvatar}
                alt={activeContent.mentorName}
                className="w-12 h-12 rounded-2xl object-cover border border-[#59B83E]"
                referrerPolicy="no-referrer"
              />
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#59B83E]">Mentor Référent</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-[#59B83E]" />
                </div>
                <div className="text-sm font-bold text-[#101820]">{activeContent.mentorName}</div>
                <div className="text-xs text-stone-500">{activeContent.mentorRole}</div>
              </div>
            </div>

            {/* Target Skills Blueprint */}
            <div className="space-y-3 pt-4 border-t border-stone-100">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-700">
                <Sparkles className="w-3.5 h-3.5 text-[#59B83E]" />
                <span>Compétences développées et valorisées</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {activeContent.targetSkills.map((skill) => (
                  <div
                    key={skill}
                    className="px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200/80 text-blue-900 text-xs font-semibold flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                    <span>{skill}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Description Section */}
          <div className="bg-white rounded-3xl border border-[#E2E8E5] p-6 sm:p-8 shadow-2xs space-y-4">
            <h2 className="text-xl font-bold text-[#123B5D]">À propos de ce programme</h2>
            <div className="text-sm text-stone-700 leading-relaxed whitespace-pre-line">
              {activeContent.description}
            </div>

            {activeContent.prerequisites && activeContent.prerequisites.length > 0 && (
              <div className="pt-6 border-t border-stone-100 space-y-3">
                <h3 className="text-sm font-bold text-stone-800">Prérequis conseillés :</h3>
                <ul className="space-y-2">
                  {activeContent.prerequisites.map((p, idx) => (
                    <li key={idx} className="text-xs text-stone-600 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#123B5D] mt-1.5 flex-shrink-0" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Masterclass Specific Details */}
          {activeContent.type === 'masterclass' && (
            <div className="bg-white rounded-3xl border border-[#E2E8E5] p-6 sm:p-8 shadow-2xs space-y-6">
              <h2 className="text-xl font-bold text-[#123B5D]">Informations de la Masterclass</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
                  <div className="text-xs text-stone-500 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#123B5D]" />
                    <span>Date et Heure</span>
                  </div>
                  <div className="text-sm font-bold text-stone-900">
                    {activeContent.masterclassDate ? `${activeContent.masterclassDate} à ${activeContent.masterclassTime}` : 'Date sur demande'}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
                  <div className="text-xs text-stone-500 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#123B5D]" />
                    <span>Durée de la session</span>
                  </div>
                  <div className="text-sm font-bold text-stone-900">
                    {activeContent.estimatedDuration}
                  </div>
                </div>
              </div>

              {activeContent.liveAccessUrl && (
                <div className="p-5 rounded-2xl bg-[#59B83E]/10 border border-[#59B83E]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-[#123B5D] uppercase">Accès à la salle en direct</div>
                    <p className="text-xs text-stone-600">Rejoignez l'espace de visioconférence interactif avec le mentor.</p>
                  </div>
                  <a
                    href={activeContent.liveAccessUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-xl bg-[#123B5D] text-white text-xs font-bold flex items-center gap-2 hover:bg-[#101820] transition-colors"
                  >
                    <span>Ouvrir la salle live</span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#C8F169]" />
                  </a>
                </div>
              )}

              {activeContent.companionResources && activeContent.companionResources.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-stone-100">
                  <h3 className="text-sm font-bold text-stone-800">Ressources & Supports partagés</h3>
                  <div className="space-y-2">
                    {activeContent.companionResources.map((res, i) => (
                      <div key={i} className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 font-medium text-stone-800">
                          <FileText className="w-4 h-4 text-[#123B5D]" />
                          <span>{res.title}</span>
                          {res.size && <span className="text-[10px] text-stone-400">({res.size})</span>}
                        </div>
                        <a
                          href={res.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#123B5D] hover:underline font-bold flex items-center gap-1"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Télécharger</span>
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Syllabus & Modules Section (For Course and Formation) */}
          {(activeContent.modules || []).length > 0 && (
            <div className="bg-white rounded-3xl border border-[#E2E8E5] p-6 sm:p-8 shadow-2xs space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-[#123B5D]">Programme détaillé</h2>
                  <p className="text-xs text-stone-500">
                    {activeContent.modules.length} module{activeContent.modules.length > 1 ? 's' : ''} • {totalLessonsCount} leçons et activités
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {activeContent.modules.map((mod, modIdx) => {
                  const isExpanded = expandedModules[mod.id] ?? false;
                  return (
                    <div
                      key={mod.id}
                      className="border border-stone-200 rounded-2xl overflow-hidden bg-stone-50/50"
                    >
                      {/* Module Header Bar */}
                      <button
                        type="button"
                        onClick={() => toggleModule(mod.id)}
                        className="w-full p-4.5 text-left flex items-center justify-between hover:bg-stone-100/80 transition-colors cursor-pointer"
                      >
                        <div className="space-y-1">
                          <div className="text-xs font-mono font-bold text-[#123B5D]">
                            Module {modIdx + 1}
                          </div>
                          <div className="text-sm font-bold text-[#101820]">
                            {mod.title}
                          </div>
                          {mod.description && (
                            <p className="text-xs text-stone-500">{mod.description}</p>
                          )}
                        </div>

                        <div className="flex items-center gap-3 text-xs text-stone-500">
                          <span>{mod.lessons.length} leçon{mod.lessons.length > 1 ? 's' : ''}</span>
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </div>
                      </button>

                      {/* Lessons List Accordion */}
                      {isExpanded && (
                        <div className="border-t border-stone-200 bg-white divide-y divide-stone-100">
                          {mod.lessons.map((lesson) => {
                            const isCompleted = enrollment?.completedLessonIds?.includes(lesson.id);
                            
                            // Check block types present in this lesson
                            const hasVideo = lesson.blocks.some((b) => b.type === 'video');
                            const hasQuiz = lesson.blocks.some((b) => b.type === 'quiz');
                            const hasProject = lesson.blocks.some((b) => b.type === 'project' || b.type === 'exercise');
                            const hasDoc = lesson.blocks.some((b) => b.type === 'document');

                            return (
                              <div
                                key={lesson.id}
                                className="p-4 flex items-center justify-between hover:bg-stone-50 transition-colors"
                              >
                                <div className="flex items-center gap-3.5">
                                  {isCompleted ? (
                                    <CheckCircle2 className="w-5 h-5 text-[#59B83E] flex-shrink-0" />
                                  ) : (
                                    <div className="w-5 h-5 rounded-full border-2 border-stone-300 flex-shrink-0" />
                                  )}
                                  
                                  <div className="space-y-0.5">
                                    <div className="text-xs font-semibold text-stone-900">
                                      {lesson.title}
                                    </div>
                                    {lesson.description && (
                                      <p className="text-[11px] text-stone-500">{lesson.description}</p>
                                    )}
                                  </div>
                                </div>

                                <div className="flex items-center gap-2">
                                  {hasVideo && (
                                    <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-bold">Vidéo</span>
                                  )}
                                  {hasQuiz && (
                                    <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 text-[10px] font-bold">Quiz</span>
                                  )}
                                  {hasProject && (
                                    <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 text-[10px] font-bold">Projet</span>
                                  )}
                                  {hasDoc && (
                                    <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-600 text-[10px]">PDF</span>
                                  )}
                                  <span className="text-xs font-mono text-stone-400 ml-1">{lesson.durationMinutes}m</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* Right / Sidebar Column (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Sticky Enrollment Action Card */}
          <div className="sticky top-24 bg-white rounded-3xl border border-[#E2E8E5] p-6 shadow-md space-y-6">
            
            {/* Cover Image Preview */}
            <div className="relative rounded-2xl overflow-hidden bg-stone-900 aspect-video">
              <img
                src={activeContent.coverImage}
                alt={activeContent.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <button
                  type="button"
                  onClick={handleStartOrContinue}
                  className="w-14 h-14 rounded-full bg-[#59B83E] text-white flex items-center justify-center hover:scale-105 transition-transform shadow-lg cursor-pointer"
                >
                  <Play className="w-6 h-6 fill-current text-white ml-0.5" />
                </button>
              </div>
            </div>

            {/* Pricing / Access Tag */}
            <div className="space-y-1">
              <div className="text-xs text-stone-500">Tarif d'accès au programme :</div>
              <div className="text-2xl font-bold text-[#123B5D]">
                {activeContent.accessType === 'free' ? (
                  <span className="text-[#59B83E]">100% Gratuit</span>
                ) : (
                  <span>{activeContent.price} {activeContent.currency || 'EUR'}</span>
                )}
              </div>
            </div>

            {/* Enrolled Status Info */}
            {enrolled && enrollment && (
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200/70 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-blue-900">
                  <span>Votre progression</span>
                  <span className="font-mono">{enrollment.progressPercent}%</span>
                </div>
                <div className="w-full bg-blue-200/60 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#59B83E] h-full rounded-full transition-all"
                    style={{ width: `${enrollment.progressPercent}%` }}
                  />
                </div>
                <p className="text-[11px] text-blue-800">
                  {enrollment.completedLessonIds.length} sur {totalLessonsCount} leçons validées
                </p>
              </div>
            )}

            {/* Primary CTA Button */}
            <button
              type="button"
              disabled={enrolling}
              onClick={handleStartOrContinue}
              className="w-full py-4 rounded-2xl bg-[#123B5D] hover:bg-[#101820] text-white font-bold text-sm tracking-wide transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer group"
            >
              {enrolled ? (
                <>
                  <Play className="w-4 h-4 fill-current text-[#C8F169]" />
                  <span>Continuer l'apprentissage</span>
                </>
              ) : activeContent.accessType === 'free' ? (
                <>
                  <span>Commencer gratuitement</span>
                  <CheckCircle2 className="w-4 h-4 text-[#C8F169]" />
                </>
              ) : (
                <>
                  <span>S'inscrire ({activeContent.price} {activeContent.currency})</span>
                  <Award className="w-4 h-4 text-[#C8F169]" />
                </>
              )}
            </button>

            {/* Inclusions checklist */}
            <div className="space-y-3 pt-4 border-t border-stone-100 text-xs text-stone-600">
              <div className="font-bold text-stone-800">Ce qui est inclus :</div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#59B83E]" />
                  <span>Accès illimité aux leçons et vidéos</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#59B83E]" />
                  <span>Exercices et validation des compétences</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#59B83E]" />
                  <span>Enregistrement automatique sur votre Skill Passport</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
