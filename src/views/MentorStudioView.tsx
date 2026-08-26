import React, { useState } from 'react';
import { ViewType } from '../types/platform';
import { useLearning } from '../context/LearningContext';
import { 
  PlusCircle, 
  Calendar, 
  Users, 
  BarChart3, 
  Edit3, 
  Trash2, 
  Eye, 
  ArrowLeft, 
  CheckCircle2, 
  FileText, 
  Image as ImageIcon, 
  Video, 
  HelpCircle, 
  Code2, 
  Award, 
  Save, 
  ExternalLink, 
  ShieldCheck, 
  Check, 
  ChevronRight 
} from 'lucide-react';
import { 
  LearningItem, 
  LearningContentType, 
  ContentDifficulty, 
  AccessType, 
  LessonBlockType, 
  LessonBlock, 
  Lesson, 
  Module, 
  UserSubmission 
} from '../types/learning';

interface MentorStudioProps {
  onNavigate: (view: ViewType) => void;
}

export const MentorStudioView: React.FC<MentorStudioProps> = ({ onNavigate }) => {
  const { 
    allContents, 
    myAuthoredContents, 
    createOrUpdateContent, 
    deleteContent, 
    mentorLearners, 
    mentorSubmissions, 
    gradeSubmission,
    setActiveContentId 
  } = useLearning();

  const [activeTab, setActiveTab] = useState<'contents' | 'create' | 'learners' | 'analytics'>('contents');
  const [editingContent, setEditingContent] = useState<Partial<LearningItem> | null>(null);
  const [creationStep, setCreationStep] = useState<1 | 2 | 3>(1);
  const [selectedModuleIndex, setSelectedModuleIndex] = useState<number>(0);
  const [selectedLessonIndex, setSelectedLessonIndex] = useState<number>(0);

  // Review submission modal state
  const [activeReviewSubmission, setActiveReviewSubmission] = useState<UserSubmission | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [gradeValue, setGradeValue] = useState<number>(90);
  const [savedSuccessMsg, setSavedSuccessMsg] = useState<string | null>(null);

  // Initial blank content template
  const initBlankContent = (type: LearningContentType = 'course'): Partial<LearningItem> => ({
    type,
    title: '',
    headline: '',
    description: '',
    coverImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
    category: 'Systèmes & Cloud',
    targetSkills: ['Architecture Logicielle'],
    level: 'Intermédiaire',
    language: 'Français',
    estimatedDuration: '3h',
    accessType: 'free',
    price: 0,
    currency: 'EUR',
    published: true,
    modules: [
      {
        id: `mod-${Date.now()}-1`,
        title: 'Module 1 : Fondements',
        description: 'Introduction aux principes fondamentaux',
        order: 1,
        lessons: [
          {
            id: `les-${Date.now()}-1`,
            title: '1. Introduction & Objectifs',
            durationMinutes: 15,
            order: 1,
            isFreePreview: true,
            blocks: [
              {
                id: `blk-${Date.now()}-1`,
                type: 'text',
                order: 1,
                content: {
                  markdown: '### Bienvenue dans ce nouveau cours\n\nDécrivez ici l\'introduction à vos apprenants.'
                }
              }
            ]
          }
        ]
      }
    ],
    companionResources: [],
    prerequisites: []
  });

  const handleStartCreate = (type: LearningContentType = 'course') => {
    setEditingContent(initBlankContent(type));
    setCreationStep(1);
    setSelectedModuleIndex(0);
    setSelectedLessonIndex(0);
    setActiveTab('create');
  };

  const handleEditContent = (item: LearningItem) => {
    setEditingContent(JSON.parse(JSON.stringify(item)));
    setCreationStep(1);
    setSelectedModuleIndex(0);
    setSelectedLessonIndex(0);
    setActiveTab('create');
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Voulez-vous vraiment supprimer ce contenu pédagogique ?')) {
      await deleteContent(id);
    }
  };

  const handleSaveContent = async () => {
    if (!editingContent || !editingContent.title) {
      alert('Veuillez au moins renseigner le titre du contenu.');
      return;
    }

    const res = await createOrUpdateContent(editingContent);
    if (res.success) {
      setSavedSuccessMsg('Contenu enregistré et publié avec succès.');
      setTimeout(() => {
        setSavedSuccessMsg(null);
        setActiveTab('contents');
      }, 1500);
    }
  };

  const handleGradeSubmit = async (status: 'approved' | 'rejected') => {
    if (!activeReviewSubmission) return;
    await gradeSubmission({
      submissionId: activeReviewSubmission.id,
      status,
      feedback: feedbackText,
      grade: gradeValue
    });
    setActiveReviewSubmission(null);
    setFeedbackText('');
  };

  // Block management helpers
  const currentModule = editingContent?.modules?.[selectedModuleIndex];
  const currentLesson = currentModule?.lessons?.[selectedLessonIndex];

  const handleAddBlock = (type: LessonBlockType) => {
    if (!editingContent || !editingContent.modules || !currentLesson) return;

    let defaultContent: any = {};
    if (type === 'text') defaultContent = { markdown: '### Nouveau bloc de texte\n\nAjoutez vos explications ici.' };
    if (type === 'video') defaultContent = { videoUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ', title: 'Vidéo explicative' };
    if (type === 'image') defaultContent = { imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80', caption: 'Illustration' };
    if (type === 'document') defaultContent = { title: 'Support de cours (PDF)', fileUrl: 'https://example.com/doc.pdf', fileSize: '1.5 MB' };
    if (type === 'exercise') defaultContent = { title: 'Exercice pratique', instructions: 'Consignes de l\'exercice', expectedDeliverable: 'Extrait de code validé' };
    if (type === 'quiz') {
      defaultContent = {
        title: 'Quiz de validation',
        passingScorePercent: 75,
        questions: [
          {
            id: `q-${Date.now()}`,
            question: 'Question de compréhension ?',
            options: [
              { id: 'opt-1', text: 'Option 1 (correcte)', isCorrect: true },
              { id: 'opt-2', text: 'Option 2', isCorrect: false }
            ],
            explanation: 'Explication détaillée de la réponse.'
          }
        ]
      };
    }
    if (type === 'project') {
      defaultContent = {
        title: 'Projet Capstone',
        context: 'Mise en situation réelle.',
        objectives: ['Construire une solution fonctionnelle'],
        instructions: 'Déposez votre lien de dépôt GitHub.',
        deliverableType: 'github',
        evaluationCriteria: ['Qualité du code', 'Documentation']
      };
    }

    const newBlock: LessonBlock = {
      id: `blk-${Date.now()}`,
      type,
      title: `${type.toUpperCase()} : ${currentLesson.title}`,
      order: (currentLesson.blocks || []).length + 1,
      content: defaultContent
    };

    const updatedModules = [...editingContent.modules];
    updatedModules[selectedModuleIndex].lessons[selectedLessonIndex].blocks.push(newBlock);

    setEditingContent({ ...editingContent, modules: updatedModules });
  };

  const handleRemoveBlock = (blockIndex: number) => {
    if (!editingContent || !editingContent.modules || !currentLesson) return;
    const updatedModules = [...editingContent.modules];
    updatedModules[selectedModuleIndex].lessons[selectedLessonIndex].blocks.splice(blockIndex, 1);
    setEditingContent({ ...editingContent, modules: updatedModules });
  };

  return (
    <div className="w-full bg-[#F5F7F6] min-h-screen pb-20">
      
      {/* Header Banner */}
      <div className="bg-[#123B5D] text-white py-8 px-4 sm:px-6 lg:px-8 border-b border-stone-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => onNavigate('learn')}
              className="inline-flex items-center gap-1.5 text-xs text-[#C8F169] hover:underline font-semibold"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Retour à l'espace Apprendre</span>
            </button>
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2.5">
              <span>Espace Mentor Studio</span>
              <ShieldCheck className="w-6 h-6 text-[#59B83E]" />
            </h1>
            <p className="text-xs text-stone-300">
              Gérez vos cours, créez des leçons riches et validez les projets de vos apprenants.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleStartCreate('course')}
              className="px-4 py-2.5 rounded-xl bg-[#59B83E] hover:bg-[#4ea236] text-white font-bold text-xs flex items-center gap-2 transition-all shadow-sm cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Créer un cours</span>
            </button>

            <button
              type="button"
              onClick={() => handleStartCreate('masterclass')}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs flex items-center gap-2 transition-all cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-[#C8F169]" />
              <span>Planifier une masterclass</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-[#E2E8E5] sticky top-0 z-20 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 py-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('contents')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer ${
              activeTab === 'contents' ? 'bg-[#123B5D] text-white' : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            Mes contenus ({myAuthoredContents.length || allContents.length})
          </button>

          <button
            type="button"
            onClick={() => handleStartCreate('course')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'create' ? 'bg-[#123B5D] text-white' : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Studio de Création</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('learners')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'learners' ? 'bg-[#123B5D] text-white' : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Apprenants & Soumissions ({mentorSubmissions.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'analytics' ? 'bg-[#123B5D] text-white' : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Performances & Impact</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* Toast success message */}
        {savedSuccessMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>{savedSuccessMsg}</span>
          </div>
        )}

        {/* 1. Mes Contenus Tab */}
        {activeTab === 'contents' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-[#123B5D]">Mes programmes et publications</h2>
                <p className="text-xs text-stone-500">Tous les cours et masterclasses créés sous votre identité mentor.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allContents.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-[#E2E8E5] overflow-hidden shadow-2xs flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-40 bg-stone-900">
                      <img
                        src={item.coverImage}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-md bg-[#123B5D] text-white text-[11px] font-bold uppercase">
                        {item.type}
                      </div>
                      <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-emerald-600 text-white text-[10px] font-bold">
                        {item.published ? 'Publié' : 'Brouillon'}
                      </div>
                    </div>

                    <div className="p-5 space-y-2">
                      <div className="text-[11px] font-mono text-stone-400">{item.category}</div>
                      <h3 className="text-base font-bold text-[#101820] line-clamp-1">{item.title}</h3>
                      <p className="text-xs text-stone-500 line-clamp-2">{item.headline}</p>
                      
                      <div className="pt-2 text-xs text-stone-600 flex items-center gap-3">
                        <span>{item.modules?.length || 0} modules</span>
                        <span>•</span>
                        <span>{item.accessType === 'free' ? 'Gratuit' : `${item.price} ${item.currency}`}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 pt-0 border-t border-stone-100 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveContentId(item.id);
                        onNavigate('learn-detail');
                      }}
                      className="text-xs text-stone-600 hover:text-[#123B5D] flex items-center gap-1 font-semibold"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Aperçu</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleEditContent(item)}
                        className="p-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-[#123B5D] text-xs font-semibold flex items-center gap-1"
                        title="Modifier"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(item.id)}
                        className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-semibold"
                        title="Supprimer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2. Studio de Création Multistep */}
        {activeTab === 'create' && editingContent && (
          <div className="bg-white rounded-3xl border border-[#E2E8E5] p-6 sm:p-8 shadow-sm space-y-8">
            
            {/* Step Indicator */}
            <div className="flex items-center justify-between pb-6 border-b border-stone-200">
              <div className="flex items-center gap-3 sm:gap-6">
                <button
                  type="button"
                  onClick={() => setCreationStep(1)}
                  className={`flex items-center gap-2 text-xs font-bold cursor-pointer ${
                    creationStep === 1 ? 'text-[#123B5D]' : 'text-stone-400'
                  }`}
                >
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                    creationStep === 1 ? 'bg-[#123B5D] text-white' : 'bg-stone-100 text-stone-500'
                  }`}>1</span>
                  <span>Infos Générales</span>
                </button>

                <ChevronRight className="w-4 h-4 text-stone-300" />

                <button
                  type="button"
                  onClick={() => setCreationStep(2)}
                  className={`flex items-center gap-2 text-xs font-bold cursor-pointer ${
                    creationStep === 2 ? 'text-[#123B5D]' : 'text-stone-400'
                  }`}
                >
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                    creationStep === 2 ? 'bg-[#123B5D] text-white' : 'bg-stone-100 text-stone-500'
                  }`}>2</span>
                  <span>Structure Modules & Leçons</span>
                </button>

                <ChevronRight className="w-4 h-4 text-stone-300" />

                <button
                  type="button"
                  onClick={() => setCreationStep(3)}
                  className={`flex items-center gap-2 text-xs font-bold cursor-pointer ${
                    creationStep === 3 ? 'text-[#123B5D]' : 'text-stone-400'
                  }`}
                >
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                    creationStep === 3 ? 'bg-[#123B5D] text-white' : 'bg-stone-100 text-stone-500'
                  }`}>3</span>
                  <span>Blocs de Contenu Riches</span>
                </button>
              </div>

              <button
                type="button"
                onClick={handleSaveContent}
                className="px-5 py-2.5 rounded-xl bg-[#59B83E] hover:bg-[#4ea236] text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Enregistrer & Publier</span>
              </button>
            </div>

            {/* Step 1: General Info */}
            {creationStep === 1 && (
              <div className="space-y-6 max-w-3xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-700">Type de contenu *</label>
                    <select
                      value={editingContent.type}
                      onChange={(e) => setEditingContent({ ...editingContent, type: e.target.value as LearningContentType })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs font-semibold text-stone-800"
                    >
                      <option value="course">Cours structuré</option>
                      <option value="formation">Formation complète (Bootcamp)</option>
                      <option value="masterclass">Masterclass (Live ou Replay)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-700">Catégorie *</label>
                    <input
                      type="text"
                      value={editingContent.category}
                      onChange={(e) => setEditingContent({ ...editingContent, category: e.target.value })}
                      placeholder="Ex: Systèmes & Cloud, Frontend & UI..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700">Titre du programme *</label>
                  <input
                    type="text"
                    required
                    value={editingContent.title}
                    onChange={(e) => setEditingContent({ ...editingContent, title: e.target.value })}
                    placeholder="Ex: Architecture Systèmes Distribués & Résilience Réseau"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs font-bold text-[#101820]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700">Sous-titre / Accroche *</label>
                  <input
                    type="text"
                    value={editingContent.headline}
                    onChange={(e) => setEditingContent({ ...editingContent, headline: e.target.value })}
                    placeholder="Ex: Concevoir des architectures tolérantes aux pannes..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700">Description pédagogique détaillée</label>
                  <textarea
                    rows={4}
                    value={editingContent.description}
                    onChange={(e) => setEditingContent({ ...editingContent, description: e.target.value })}
                    placeholder="Détaillez les compétences que les apprenants vont acquérir..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-700">Niveau</label>
                    <select
                      value={editingContent.level}
                      onChange={(e) => setEditingContent({ ...editingContent, level: e.target.value as ContentDifficulty })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs"
                    >
                      <option value="Débutant">Débutant</option>
                      <option value="Intermédiaire">Intermédiaire</option>
                      <option value="Avancé">Avancé</option>
                      <option value="Tous niveaux">Tous niveaux</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-700">Durée estimée</label>
                    <input
                      type="text"
                      value={editingContent.estimatedDuration}
                      onChange={(e) => setEditingContent({ ...editingContent, estimatedDuration: e.target.value })}
                      placeholder="Ex: 4h 30m"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-700">Accès</label>
                    <select
                      value={editingContent.accessType}
                      onChange={(e) => setEditingContent({ ...editingContent, accessType: e.target.value as AccessType })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs font-semibold"
                    >
                      <option value="free">Gratuit</option>
                      <option value="paid">Payant</option>
                    </select>
                  </div>
                </div>

                {editingContent.accessType === 'paid' && (
                  <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-stone-50 border border-stone-200">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-stone-700">Prix</label>
                      <input
                        type="number"
                        min="1"
                        value={editingContent.price || 45}
                        onChange={(e) => setEditingContent({ ...editingContent, price: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-stone-700">Devise</label>
                      <select
                        value={editingContent.currency || 'EUR'}
                        onChange={(e) => setEditingContent({ ...editingContent, currency: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs"
                      >
                        <option value="EUR">EUR (€)</option>
                        <option value="USD">USD ($)</option>
                        <option value="XOF">XOF (FCFA)</option>
                      </select>
                    </div>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700">Image de couverture (URL)</label>
                  <input
                    type="url"
                    value={editingContent.coverImage}
                    onChange={(e) => setEditingContent({ ...editingContent, coverImage: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs"
                  />
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setCreationStep(2)}
                    className="px-6 py-2.5 rounded-xl bg-[#123B5D] text-white font-bold text-xs flex items-center gap-2 cursor-pointer"
                  >
                    <span>Continuer vers la structure</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Modules & Lessons Structure */}
            {creationStep === 2 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-[#123B5D]">Définition des Modules & Leçons</h3>
                  <button
                    type="button"
                    onClick={() => {
                      const newMod: Module = {
                        id: `mod-${Date.now()}`,
                        title: `Module ${(editingContent.modules?.length || 0) + 1} : Nouveau Module`,
                        order: (editingContent.modules?.length || 0) + 1,
                        lessons: [
                          {
                            id: `les-${Date.now()}`,
                            title: '1. Nouvelle leçon',
                            durationMinutes: 20,
                            order: 1,
                            blocks: []
                          }
                        ]
                      };
                      setEditingContent({
                        ...editingContent,
                        modules: [...(editingContent.modules || []), newMod]
                      });
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-[#123B5D] text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Ajouter un module</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {(editingContent.modules || []).map((mod, mIdx) => (
                    <div key={mod.id} className="p-5 rounded-2xl border border-stone-200 bg-stone-50 space-y-4">
                      <div className="flex items-center justify-between gap-3">
                        <input
                          type="text"
                          value={mod.title}
                          onChange={(e) => {
                            const updated = [...(editingContent.modules || [])];
                            updated[mIdx].title = e.target.value;
                            setEditingContent({ ...editingContent, modules: updated });
                          }}
                          className="flex-1 px-3 py-1.5 rounded-lg border border-stone-300 font-bold text-xs text-[#101820] bg-white"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...(editingContent.modules || [])];
                            updated.splice(mIdx, 1);
                            setEditingContent({ ...editingContent, modules: updated });
                          }}
                          className="text-xs text-rose-600 hover:underline"
                        >
                          Supprimer
                        </button>
                      </div>

                      {/* Lessons inside module */}
                      <div className="space-y-2 pl-4 border-l-2 border-stone-200">
                        {mod.lessons.map((les, lIdx) => (
                          <div key={les.id} className="flex items-center justify-between gap-3 bg-white p-3 rounded-xl border border-stone-200">
                            <input
                              type="text"
                              value={les.title}
                              onChange={(e) => {
                                const updated = [...(editingContent.modules || [])];
                                updated[mIdx].lessons[lIdx].title = e.target.value;
                                setEditingContent({ ...editingContent, modules: updated });
                              }}
                              className="flex-1 px-2.5 py-1 text-xs border border-stone-200 rounded"
                            />
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                value={les.durationMinutes}
                                onChange={(e) => {
                                  const updated = [...(editingContent.modules || [])];
                                  updated[mIdx].lessons[lIdx].durationMinutes = parseInt(e.target.value) || 10;
                                  setEditingContent({ ...editingContent, modules: updated });
                                }}
                                className="w-16 px-2 py-1 text-xs border border-stone-200 rounded"
                                title="Durée en minutes"
                              />
                              <span className="text-[11px] text-stone-400">min</span>
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedModuleIndex(mIdx);
                                  setSelectedLessonIndex(lIdx);
                                  setCreationStep(3);
                                }}
                                className="px-3 py-1 rounded bg-[#123B5D] text-white text-[11px] font-bold"
                              >
                                Éditer le contenu ({les.blocks?.length || 0} blocs)
                              </button>
                            </div>
                          </div>
                        ))}

                        <button
                          type="button"
                          onClick={() => {
                            const newLesson: Lesson = {
                              id: `les-${Date.now()}`,
                              title: `${mod.lessons.length + 1}. Nouvelle leçon`,
                              durationMinutes: 15,
                              order: mod.lessons.length + 1,
                              blocks: []
                            };
                            const updated = [...(editingContent.modules || [])];
                            updated[mIdx].lessons.push(newLesson);
                            setEditingContent({ ...editingContent, modules: updated });
                          }}
                          className="text-xs font-semibold text-[#123B5D] hover:underline flex items-center gap-1 mt-2"
                        >
                          <PlusCircle className="w-3.5 h-3.5" />
                          <span>Ajouter une leçon à ce module</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setCreationStep(1)}
                    className="px-5 py-2 rounded-xl border border-stone-200 text-xs font-bold"
                  >
                    Retour
                  </button>

                  <button
                    type="button"
                    onClick={() => setCreationStep(3)}
                    className="px-6 py-2.5 rounded-xl bg-[#123B5D] text-white font-bold text-xs flex items-center gap-2 cursor-pointer"
                  >
                    <span>Continuer vers les blocs de contenu</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Rich Blocks Editor */}
            {creationStep === 3 && currentLesson && (
              <div className="space-y-6">
                <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200/80 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-mono text-blue-700 uppercase">Édition de la leçon :</span>
                    <h4 className="text-sm font-bold text-blue-950">{currentLesson.title}</h4>
                  </div>
                  <div className="text-xs text-blue-800 font-semibold">
                    {currentLesson.blocks?.length || 0} blocs configurés
                  </div>
                </div>

                {/* Add block toolbar */}
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                  <div className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                    <PlusCircle className="w-4 h-4 text-[#59B83E]" />
                    <span>+ Ajouter un bloc de contenu</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => handleAddBlock('text')}
                      className="px-3 py-1.5 rounded-lg bg-white border border-stone-200 text-xs font-medium hover:border-[#123B5D] flex items-center gap-1.5 cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5 text-blue-600" />
                      <span>Texte / Markdown</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleAddBlock('video')}
                      className="px-3 py-1.5 rounded-lg bg-white border border-stone-200 text-xs font-medium hover:border-[#123B5D] flex items-center gap-1.5 cursor-pointer"
                    >
                      <Video className="w-3.5 h-3.5 text-rose-600" />
                      <span>Vidéo</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleAddBlock('image')}
                      className="px-3 py-1.5 rounded-lg bg-white border border-stone-200 text-xs font-medium hover:border-[#123B5D] flex items-center gap-1.5 cursor-pointer"
                    >
                      <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Image</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleAddBlock('document')}
                      className="px-3 py-1.5 rounded-lg bg-white border border-stone-200 text-xs font-medium hover:border-[#123B5D] flex items-center gap-1.5 cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5 text-stone-600" />
                      <span>Document / PDF</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleAddBlock('quiz')}
                      className="px-3 py-1.5 rounded-lg bg-white border border-stone-200 text-xs font-medium hover:border-[#123B5D] flex items-center gap-1.5 cursor-pointer"
                    >
                      <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                      <span>Quiz Interactif</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleAddBlock('exercise')}
                      className="px-3 py-1.5 rounded-lg bg-white border border-stone-200 text-xs font-medium hover:border-[#123B5D] flex items-center gap-1.5 cursor-pointer"
                    >
                      <Code2 className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Exercice de code</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleAddBlock('project')}
                      className="px-3 py-1.5 rounded-lg bg-white border border-stone-200 text-xs font-medium hover:border-[#123B5D] flex items-center gap-1.5 cursor-pointer"
                    >
                      <Award className="w-3.5 h-3.5 text-purple-600" />
                      <span>Projet / Challenge</span>
                    </button>
                  </div>
                </div>

                {/* List of existing blocks */}
                <div className="space-y-4">
                  {currentLesson.blocks.map((block, bIdx) => (
                    <div key={block.id} className="p-4 rounded-2xl border border-stone-200 bg-white space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                        <span className="px-2 py-0.5 rounded bg-stone-100 font-mono text-[10px] font-bold text-stone-700 uppercase">
                          Bloc #{bIdx + 1} — {block.type}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveBlock(bIdx)}
                          className="text-xs text-rose-600 hover:underline"
                        >
                          Supprimer le bloc
                        </button>
                      </div>

                      {/* Block edit fields based on type */}
                      {block.type === 'text' && (
                        <textarea
                          rows={3}
                          value={(block.content as any).markdown}
                          onChange={(e) => {
                            const updated = [...(editingContent.modules || [])];
                            (updated[selectedModuleIndex].lessons[selectedLessonIndex].blocks[bIdx].content as any).markdown = e.target.value;
                            setEditingContent({ ...editingContent, modules: updated });
                          }}
                          className="w-full p-2.5 text-xs font-mono border border-stone-200 rounded-xl"
                        />
                      )}

                      {block.type === 'video' && (
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="text"
                            placeholder="URL Vidéo (ex: embed YouTube ou directe)"
                            value={(block.content as any).videoUrl}
                            onChange={(e) => {
                              const updated = [...(editingContent.modules || [])];
                              (updated[selectedModuleIndex].lessons[selectedLessonIndex].blocks[bIdx].content as any).videoUrl = e.target.value;
                              setEditingContent({ ...editingContent, modules: updated });
                            }}
                            className="w-full p-2 text-xs border border-stone-200 rounded-xl"
                          />
                          <input
                            type="text"
                            placeholder="Titre de la vidéo"
                            value={(block.content as any).title}
                            onChange={(e) => {
                              const updated = [...(editingContent.modules || [])];
                              (updated[selectedModuleIndex].lessons[selectedLessonIndex].blocks[bIdx].content as any).title = e.target.value;
                              setEditingContent({ ...editingContent, modules: updated });
                            }}
                            className="w-full p-2 text-xs border border-stone-200 rounded-xl"
                          />
                        </div>
                      )}

                      {block.type === 'project' && (
                        <div className="space-y-2">
                          <input
                            type="text"
                            placeholder="Titre du projet"
                            value={(block.content as any).title}
                            onChange={(e) => {
                              const updated = [...(editingContent.modules || [])];
                              (updated[selectedModuleIndex].lessons[selectedLessonIndex].blocks[bIdx].content as any).title = e.target.value;
                              setEditingContent({ ...editingContent, modules: updated });
                            }}
                            className="w-full p-2 text-xs font-bold border border-stone-200 rounded-xl"
                          />
                          <textarea
                            rows={2}
                            placeholder="Consignes et contexte"
                            value={(block.content as any).context}
                            onChange={(e) => {
                              const updated = [...(editingContent.modules || [])];
                              (updated[selectedModuleIndex].lessons[selectedLessonIndex].blocks[bIdx].content as any).context = e.target.value;
                              setEditingContent({ ...editingContent, modules: updated });
                            }}
                            className="w-full p-2 text-xs border border-stone-200 rounded-xl"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="pt-4 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setCreationStep(2)}
                    className="px-5 py-2 rounded-xl border border-stone-200 text-xs font-bold"
                  >
                    Retour à la structure
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveContent}
                    className="px-6 py-2.5 rounded-xl bg-[#59B83E] hover:bg-[#4ea236] text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md"
                  >
                    <Save className="w-4 h-4" />
                    <span>Enregistrer et publier le cours</span>
                  </button>
                </div>
              </div>
            )}

          </div>
        )}

        {/* 3. Apprenants & Soumissions Tab */}
        {activeTab === 'learners' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-[#123B5D]">Apprenants inscrits & Projets soumis</h2>
              <p className="text-xs text-stone-500">Revues de code et évaluations en attente de validation.</p>
            </div>

            {mentorSubmissions.length === 0 ? (
              <div className="bg-white rounded-2xl border border-[#E2E8E5] p-10 text-center space-y-2">
                <Users className="w-8 h-8 text-stone-300 mx-auto" />
                <h3 className="text-sm font-bold text-stone-800">Aucune soumission en attente</h3>
                <p className="text-xs text-stone-500">Les projets soumis par vos apprenants apparaîtront ici pour revue.</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-[#E2E8E5] divide-y divide-stone-100 overflow-hidden shadow-2xs">
                {mentorSubmissions.map((sub) => (
                  <div key={sub.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#101820]">{sub.userName}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          sub.status === 'approved' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                        }`}>
                          {sub.status === 'approved' ? 'Validé' : 'En attente de revue'}
                        </span>
                      </div>
                      <div className="text-xs text-stone-600 font-semibold">{sub.blockTitle}</div>
                      <a
                        href={sub.deliverableUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                      >
                        <span>{sub.deliverableUrl}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setActiveReviewSubmission(sub);
                        setFeedbackText(sub.feedback || 'Excellent travail sur la résilience et la modularité.');
                      }}
                      className="px-4 py-2 rounded-xl bg-[#123B5D] hover:bg-[#101820] text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Award className="w-3.5 h-3.5 text-[#C8F169]" />
                      <span>Évaluer & Valider</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 4. Performances & Impact */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-[#123B5D]">Performances Pédagogiques Réelles</h2>
              <p className="text-xs text-stone-500">Statistiques collectées sur vos contenus publiés.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-white border border-[#E2E8E5] space-y-1 shadow-2xs">
                <div className="text-xs text-stone-500 font-semibold">Total Inscriptions</div>
                <div className="text-3xl font-bold text-[#123B5D]">{mentorLearners.length}</div>
                <p className="text-[11px] text-[#59B83E]">Apprenants actifs</p>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-[#E2E8E5] space-y-1 shadow-2xs">
                <div className="text-xs text-stone-500 font-semibold">Projets Soumis</div>
                <div className="text-3xl font-bold text-[#123B5D]">{mentorSubmissions.length}</div>
                <p className="text-[11px] text-stone-400">Preuves auditées</p>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-[#E2E8E5] space-y-1 shadow-2xs">
                <div className="text-xs text-stone-500 font-semibold">Contenus Publiés</div>
                <div className="text-3xl font-bold text-[#123B5D]">{allContents.length}</div>
                <p className="text-[11px] text-stone-400">Cours & Masterclasses</p>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Review Submission Modal */}
      {activeReviewSubmission && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#E2E8E5] p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl">
            <div className="space-y-1">
              <span className="text-xs font-mono font-bold text-[#59B83E] uppercase">Revue de projet mentor</span>
              <h3 className="text-lg font-bold text-[#101820]">{activeReviewSubmission.blockTitle}</h3>
              <p className="text-xs text-stone-500">Apprenant : {activeReviewSubmission.userName}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 text-xs">
              <strong>Lien du livrable :</strong>{' '}
              <a href={activeReviewSubmission.deliverableUrl} target="_blank" rel="noreferrer" className="text-blue-600 underline">
                {activeReviewSubmission.deliverableUrl}
              </a>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700">Note attribuée (sur 100)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={gradeValue}
                onChange={(e) => setGradeValue(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs font-bold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700">Feedback et recommandations pédagogiques *</label>
              <textarea
                rows={3}
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Rédigez vos retours sur la qualité du code..."
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setActiveReviewSubmission(null)}
                className="px-4 py-2 rounded-xl border border-stone-200 text-xs font-semibold text-stone-700"
              >
                Annuler
              </button>

              <button
                type="button"
                onClick={() => handleGradeSubmit('approved')}
                className="px-5 py-2.5 rounded-xl bg-[#59B83E] hover:bg-[#4ea236] text-white text-xs font-bold flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Valider la compétence (Vérifiée)</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
