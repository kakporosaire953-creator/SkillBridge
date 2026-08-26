import React, { useState } from 'react';
import { ViewType } from '../types/platform';
import { useLearning } from '../context/LearningContext';
import { LearningItem } from '../types/learning';
import { PaidCheckoutModal } from '../components/PaidCheckoutModal';
import { FaIcon } from '../components/FaIcon';
import { 
  faGraduationCap, 
  faCertificate, 
  faCompass, 
  faBookOpen, 
  faShieldHalved, 
  faPlay, 
  faLock, 
  faClock, 
  faMagnifyingGlass, 
  faVideo, 
  faPlus
} from '@fortawesome/free-solid-svg-icons';

interface LearnViewProps {
  onNavigate: (view: ViewType) => void;
}

export const LearnView: React.FC<LearnViewProps> = ({ onNavigate }) => {
  const { 
    allContents, 
    masterclasses, 
    officialPrograms,
    mentorContents,
    myLearnings, 
    userCertificates,
    setActiveContentId, 
    isMentor,
    isAdmin,
    isEnrolled,
    getEnrollment,
    enrollInContent
  } = useLearning();

  const [activeTab, setActiveTab] = useState<'discover' | 'official' | 'mentors' | 'masterclasses' | 'my-learnings'>('discover');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedAccess, setSelectedAccess] = useState<'all' | 'free' | 'paid'>('all');
  const [selectedCertOnly, setSelectedCertOnly] = useState<boolean>(false);

  // Paid Checkout Modal
  const [checkoutItem, setCheckoutItem] = useState<LearningItem | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Categories extraction
  const categories = Array.from(new Set(allContents.map((c) => c.category)));

  // Filter items based on current tab and filters
  const getItemsForCurrentTab = () => {
    switch (activeTab) {
      case 'official':
        return officialPrograms;
      case 'mentors':
        return mentorContents;
      case 'masterclasses':
        return masterclasses;
      case 'my-learnings':
        return myLearnings.map((ml) => ml.item);
      case 'discover':
      default:
        return allContents;
    }
  };

  const filteredItems = getItemsForCurrentTab().filter((item) => {
    const matchSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.targetSkills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.mentorName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchCat = selectedCategory === 'all' || item.category === selectedCategory;
    const matchLevel = selectedLevel === 'all' || item.level === selectedLevel;
    const matchAccess = selectedAccess === 'all' || item.accessType === selectedAccess;
    const matchCert = !selectedCertOnly || Boolean(item.isCertifying);

    return matchSearch && matchCat && matchLevel && matchAccess && matchCert;
  });

  const handleItemClick = (item: LearningItem) => {
    setActiveContentId(item.id);
    onNavigate('learn-detail');
  };

  const handleEnrollOrStart = async (e: React.MouseEvent, item: LearningItem) => {
    e.stopPropagation();

    if (isEnrolled(item.id)) {
      setActiveContentId(item.id);
      onNavigate('lesson-player');
      return;
    }

    if (item.accessType === 'paid') {
      setCheckoutItem(item);
      setIsCheckoutOpen(true);
      return;
    }

    // Free enrollment
    await enrollInContent(item.id);
    setActiveContentId(item.id);
    onNavigate('lesson-player');
  };

  return (
    <div className="w-full bg-[#F5F7F6] min-h-screen py-8 sm:py-12 px-4 sm:px-6 lg:px-10">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#E2E8E5]">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#123B5D]/5 text-[#123B5D] text-xs font-mono font-bold">
              <FaIcon icon={faShieldHalved} className="text-[#59B83E]" />
              <span>Souveraineté Pédagogique & Compétences</span>
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#101820] tracking-tight">
              Espace Apprendre & Formations
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 max-w-2xl">
              Formations officielles SkillBridge délivrant des certifications souveraines, et masterclasses pratiques animées par nos mentors certifiés.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate('certificates')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#E2E8E5] bg-white hover:bg-stone-50 text-xs font-bold text-stone-700 shadow-2xs transition-colors cursor-pointer"
            >
              <FaIcon icon={faCertificate} className="text-[#59B83E]" />
              <span>Mes Certifications ({userCertificates.length})</span>
            </button>

            {(isMentor || isAdmin) && (
              <button
                type="button"
                onClick={() => onNavigate('mentor-studio')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#123B5D] hover:bg-[#0A2338] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
              >
                <FaIcon icon={faPlus} className="text-[#59B83E]" />
                <span>Studio Formateur</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab Navigation (Sources de contenus) */}
        <div className="flex items-center gap-2 border-b border-[#E2E8E5] pb-px overflow-x-auto select-none no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab('discover')}
            className={`px-4 py-3 text-xs font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === 'discover'
                ? 'border-[#123B5D] text-[#123B5D]'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <FaIcon icon={faCompass} />
            <span>Tous les Programmes ({allContents.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('official')}
            className={`px-4 py-3 text-xs font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === 'official'
                ? 'border-[#123B5D] text-[#123B5D]'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <div className="w-2 h-2 rounded-full bg-[#59B83E]" />
            <span>Formations Officielles SkillBridge ({officialPrograms.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('mentors')}
            className={`px-4 py-3 text-xs font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === 'mentors'
                ? 'border-[#123B5D] text-[#123B5D]'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <FaIcon icon={faGraduationCap} />
            <span>Contenus des Mentors ({mentorContents.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('masterclasses')}
            className={`px-4 py-3 text-xs font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === 'masterclasses'
                ? 'border-[#123B5D] text-[#123B5D]'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <FaIcon icon={faVideo} />
            <span>Masterclasses ({masterclasses.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('my-learnings')}
            className={`px-4 py-3 text-xs font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === 'my-learnings'
                ? 'border-[#123B5D] text-[#123B5D]'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <FaIcon icon={faBookOpen} />
            <span>Mes Inscriptions ({myLearnings.length})</span>
          </button>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white rounded-2xl border border-[#E2E8E5] p-4 shadow-2xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          
          {/* Search Input */}
          <div className="relative flex-1 min-w-[240px]">
            <FaIcon icon={faMagnifyingGlass} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 text-xs" />
            <input
              type="text"
              placeholder="Rechercher un cours, compétence, formateur..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs focus:ring-2 focus:ring-[#123B5D]/20 focus:border-[#123B5D] outline-none"
            />
          </div>

          {/* Filters dropdowns */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Category */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-700 outline-none cursor-pointer"
            >
              <option value="all">Toutes Catégories</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            {/* Level */}
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="px-3 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-700 outline-none cursor-pointer"
            >
              <option value="all">Tous Niveaux</option>
              <option value="Débutant">Débutant</option>
              <option value="Intermédiaire">Intermédiaire</option>
              <option value="Avancé">Avancé</option>
            </select>

            {/* Access Type */}
            <select
              value={selectedAccess}
              onChange={(e) => setSelectedAccess(e.target.value as any)}
              className="px-3 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-700 outline-none cursor-pointer"
            >
              <option value="all">Tous Accès</option>
              <option value="free">Gratuit</option>
              <option value="paid">Payant</option>
            </select>

            {/* Certifying Only Toggle */}
            <button
              type="button"
              onClick={() => setSelectedCertOnly(!selectedCertOnly)}
              className={`px-3 py-2.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                selectedCertOnly
                  ? 'border-[#59B83E] bg-[#59B83E]/10 text-[#123B5D]'
                  : 'border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100'
              }`}
            >
              <FaIcon icon={faCertificate} className={selectedCertOnly ? 'text-[#59B83E]' : 'text-stone-400'} />
              <span>Certifiant uniquement</span>
            </button>
          </div>

        </div>

        {/* Content Cards Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => {
              const enrolled = isEnrolled(item.id);
              const enrollment = getEnrollment(item.id);
              const totalLessons = item.modules.reduce((acc, m) => acc + m.lessons.length, 0);
              const completedCount = enrollment?.completedLessonIds?.length || 0;
              const progressPct = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

              return (
                <div
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  className="bg-white rounded-3xl border border-[#E2E8E5] overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group cursor-pointer"
                >
                  {/* Top Cover Image / Banner */}
                  <div className="relative aspect-video w-full bg-stone-100 overflow-hidden">
                    <img
                      src={item.coverImage}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />

                    {/* Official vs Mentor Badge */}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                      {item.isOfficialSkillBridge ? (
                        <span className="px-2.5 py-1 rounded-full bg-[#123B5D]/90 text-white backdrop-blur-md font-mono text-[10px] font-bold flex items-center gap-1.5 shadow-xs">
                          <span className="w-2 h-2 rounded-full bg-[#59B83E]" />
                          <span>SkillBridge Officiel</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-black/60 text-white backdrop-blur-md font-mono text-[10px] font-bold">
                          Par {item.mentorName}
                        </span>
                      )}

                      {item.isCertifying && (
                        <span className="px-2 py-1 rounded-full bg-[#59B83E] text-white font-mono text-[10px] font-bold flex items-center gap-1 shadow-xs">
                          <FaIcon icon={faCertificate} />
                          <span>Certifiant</span>
                        </span>
                      )}
                    </div>

                    {/* Price Tag */}
                    <div className="absolute top-3 right-3">
                      <span className={`px-2.5 py-1 rounded-full backdrop-blur-md font-mono text-[10px] font-bold shadow-xs ${
                        item.accessType === 'free'
                          ? 'bg-[#59B83E]/90 text-white'
                          : 'bg-[#123B5D]/90 text-white'
                      }`}>
                        {item.accessType === 'free' ? 'Gratuit' : item.price ? `${item.price.toLocaleString('fr-FR')} ${item.currency || 'FCFA'}` : 'Payant'}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[11px] text-stone-400 font-mono">
                        <span>{item.category}</span>
                        <span>•</span>
                        <span>{item.level}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <FaIcon icon={faClock} className="text-[10px]" />
                          <span>{item.estimatedDuration}</span>
                        </span>
                      </div>

                      <h3 className="font-heading text-base font-bold text-[#101820] group-hover:text-[#123B5D] transition-colors line-clamp-2">
                        {item.title}
                      </h3>

                      <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                        {item.headline || item.description}
                      </p>
                    </div>

                    {/* Skills pills */}
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {item.targetSkills.slice(0, 3).map((s) => (
                        <span
                          key={s}
                          className="px-2 py-0.5 rounded-md bg-[#FAFCFB] border border-stone-200 text-[10px] font-mono text-stone-600"
                        >
                          {s}
                        </span>
                      ))}
                      {item.targetSkills.length > 3 && (
                        <span className="px-1 py-0.5 text-[10px] font-mono text-stone-400">
                          +{item.targetSkills.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Bottom Action Footer */}
                  <div className="px-5 py-4 bg-[#FAFCFB] border-t border-[#E2E8E5] flex items-center justify-between">
                    {enrolled ? (
                      <div className="w-full flex items-center justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                            <span className="text-stone-500">Progression</span>
                            <span className="font-bold text-[#59B83E]">{progressPct}%</span>
                          </div>
                          <div className="w-full h-1 bg-stone-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#59B83E] rounded-full"
                              style={{ width: `${progressPct}%` }}
                            />
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => handleEnrollOrStart(e, item)}
                          className="px-3.5 py-2 rounded-xl bg-[#123B5D] hover:bg-[#0A2338] text-white text-xs font-bold flex items-center gap-1.5 shrink-0 transition-colors shadow-2xs"
                        >
                          <FaIcon icon={faPlay} className="text-[10px] text-[#59B83E]" />
                          <span>Reprendre</span>
                        </button>
                      </div>
                    ) : (
                      <div className="w-full flex items-center justify-between gap-2">
                        <span className="text-xs text-stone-500 font-mono">
                          {totalLessons} leçons
                        </span>

                        <button
                          type="button"
                          onClick={(e) => handleEnrollOrStart(e, item)}
                          className="px-4 py-2 rounded-xl bg-[#123B5D] hover:bg-[#0A2338] text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
                        >
                          {item.accessType === 'paid' ? (
                            <>
                              <FaIcon icon={faLock} className="text-[10px] text-[#59B83E]" />
                              <span>S'inscrire</span>
                            </>
                          ) : (
                            <>
                              <FaIcon icon={faGraduationCap} className="text-[10px] text-[#59B83E]" />
                              <span>Accéder Gratuitement</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-[#E2E8E5] p-12 text-center space-y-4 shadow-2xs">
            <div className="w-14 h-14 rounded-2xl bg-stone-100 flex items-center justify-center text-stone-400 mx-auto">
              <FaIcon icon={faBookOpen} className="text-2xl" />
            </div>
            <div className="space-y-1 max-w-md mx-auto">
              <h3 className="font-heading text-base font-bold text-[#101820]">
                Aucun résultat pour cette recherche
              </h3>
              <p className="text-xs text-stone-500">
                Essayez de réinitialiser vos filtres de recherche ou sélectionnez un autre onglet.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedLevel('all');
                setSelectedAccess('all');
                setSelectedCertOnly(false);
              }}
              className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-colors cursor-pointer"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}

      </div>

      {/* Paid Checkout Modal */}
      <PaidCheckoutModal
        item={checkoutItem}
        isOpen={isCheckoutOpen}
        onClose={() => {
          setIsCheckoutOpen(false);
          setCheckoutItem(null);
        }}
        onConfirmEnroll={async (paymentSimulated) => {
          if (checkoutItem) {
            await enrollInContent(checkoutItem.id, paymentSimulated);
            setActiveContentId(checkoutItem.id);
            onNavigate('lesson-player');
          }
        }}
      />

    </div>
  );
};
