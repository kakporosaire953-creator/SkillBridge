import React, { useState, useMemo } from 'react';
import { ViewType } from '../types/platform';
import { FaIcon } from '../components/FaIcon';
import {
  faArrowLeft,
  faSearch,
  faPlus,
  faTimes,
  faStar,
  faWrench,
  faCheckCircle,
  faLayerGroup
} from '@fortawesome/free-solid-svg-icons';
import { FadeInUp } from '../components/motion/FadeInUp';
import { StaggerContainer } from '../components/motion/StaggerContainer';
import { ScaleOnHover } from '../components/motion/ScaleOnHover';
import { 
  skillsCatalog, 
  skillCategories, 
  toolsCatalog, 
  SkillLevel, 
  SkillExperience
} from '../data/skillsCatalog';

interface SkillsManagerViewProps {
  onNavigate: (view: ViewType) => void;
}

interface UserSkillDetail {
  skillId: string;
  level: SkillLevel;
  experience?: SkillExperience;
  isCore: boolean;
  tools: string[];
}

const LEVEL_LABELS: Record<SkillLevel, { label: string; pct: number }> = {
  beginner: { label: 'Débutant', pct: 25 },
  intermediate: { label: 'Intermédiaire', pct: 50 },
  advanced: { label: 'Avancé', pct: 75 },
  expert: { label: 'Expert', pct: 100 },
};

const EXP_LABELS: Record<SkillExperience, string> = {
  '0-6 months': '0-6 mois',
  '1 year': '1 an',
  '2 years': '2 ans',
  '3+ years': '3+ ans'
};

export const SkillsManagerView: React.FC<SkillsManagerViewProps> = ({ onNavigate }) => {

  const [userSkills, setUserSkills] = useState<UserSkillDetail[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  // Modal / Selection State
  const [editingSkillId, setEditingSkillId] = useState<string | null>(null);

  // Derivations
  const coreSkillsCount = userSkills.filter(s => s.isCore).length;
  
  const calculateStrength = () => {
    let score = 0;
    if (userSkills.length > 0) score += 20; // Has skills
    if (userSkills.length >= 3) score += 20; // Variety
    if (coreSkillsCount > 0) score += 20; // Defined core
    if (userSkills.some(s => s.tools.length > 0)) score += 20; // Knows tools
    if (userSkills.some(s => s.experience && s.level === 'expert' || s.level === 'advanced')) score += 20; // Demonstrated depth
    return Math.min(score, 100);
  };
  const profileStrength = calculateStrength();

  const filteredCatalog = useMemo(() => {
    return skillsCatalog.filter(skill => {
      const matchesSearch = skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            skill.synonyms?.some(syn => syn.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = activeCategory ? skill.categoryId === activeCategory : true;
      const isAlreadyAdded = userSkills.some(us => us.skillId === skill.id);
      
      return matchesSearch && matchesCategory && !isAlreadyAdded;
    });
  }, [searchQuery, activeCategory, userSkills]);

  const addSkill = (skillId: string) => {
    setUserSkills(prev => [...prev, {
      skillId,
      level: 'beginner',
      isCore: coreSkillsCount < 3, // Auto-mark as core if they have less than 3
      tools: []
    }]);
    setSearchQuery('');
  };

  const removeSkill = (skillId: string) => {
    setUserSkills(prev => prev.filter(s => s.skillId !== skillId));
  };

  const updateSkill = (skillId: string, updates: Partial<UserSkillDetail>) => {
    setUserSkills(prev => prev.map(s => {
      if (s.skillId === skillId) {
        // Enforce max core skills
        if (updates.isCore && !s.isCore && coreSkillsCount >= 3) {
          alert('Vous ne pouvez avoir que 3 compétences principales (Core Skills).');
          return s;
        }
        return { ...s, ...updates };
      }
      return s;
    }));
  };

  const renderSkillLevelBar = (level: SkillLevel) => {
    const pct = LEVEL_LABELS[level].pct;
    return (
      <div className="flex items-center gap-2 mt-1">
        <div className="flex-1 h-1.5 bg-stone-100 rounded-full overflow-hidden flex">
          <div className={`h-full ${pct >= 25 ? 'bg-[#59B83E]' : 'bg-transparent'}`} style={{ width: '25%' }} />
          <div className={`h-full ${pct >= 50 ? 'bg-[#59B83E]' : 'bg-transparent'}`} style={{ width: '25%' }} />
          <div className={`h-full ${pct >= 75 ? 'bg-[#59B83E]' : 'bg-transparent'}`} style={{ width: '25%' }} />
          <div className={`h-full ${pct >= 100 ? 'bg-[#59B83E]' : 'bg-transparent'}`} style={{ width: '25%' }} />
        </div>
        <span className="text-[10px] font-bold text-stone-400 font-mono w-8 text-right">{pct}%</span>
      </div>
    );
  };

  return (
    <div className="flex-1 w-full min-h-screen bg-[#FAFCFB] pb-24 lg:pb-8">
      {/* Header */}
      <div className="bg-white border-b border-[#E2E8E5] sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => onNavigate('dashboard-talent')}
                className="w-10 h-10 shrink-0 rounded-xl bg-stone-100 hover:bg-stone-200 text-[#123B5D] flex items-center justify-center transition-colors cursor-pointer"
              >
                <FaIcon icon={faArrowLeft} />
              </button>
              <div>
                <h1 className="text-xl sm:text-2xl font-heading font-black text-[#101820]">
                  Skill Intelligence
                </h1>
                <p className="text-xs sm:text-sm text-stone-500 font-medium">
                  Organisez vos Core Skills et Supporting Skills
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 bg-stone-50 px-4 py-2 rounded-xl border border-stone-200">
              <div className="text-right">
                <div className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Profile Strength</div>
                <div className={`text-lg font-black ${profileStrength >= 80 ? 'text-[#59B83E]' : 'text-[#123B5D]'}`}>
                  {profileStrength}%
                </div>
              </div>
              <div className="w-12 h-12 relative flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path className="text-stone-200" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path className={`${profileStrength >= 80 ? 'text-[#59B83E]' : 'text-[#123B5D]'}`} strokeDasharray={`${profileStrength}, 100`} strokeWidth="3" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN : SEARCH & SUGGESTIONS */}
          <div className="lg:col-span-5 space-y-6">
            <FadeInUp>
              <div className="bg-white rounded-3xl border border-[#E2E8E5] p-6 shadow-2xs space-y-6">
                <div>
                  <h2 className="text-lg font-heading font-black text-[#101820] mb-2">Ajouter une compétence</h2>
                  <p className="text-xs text-stone-500">Recherchez parmi l'écosystème numérique (Dev, Design, Marketing, etc.)</p>
                </div>
                
                {/* Search Box */}
                <div className="relative">
                  <FaIcon icon={faSearch} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    placeholder="Ex: UI/UX Design, SEO, Frontend..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-[#59B83E] focus:ring-1 focus:ring-[#59B83E] transition-all"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600">
                      <FaIcon icon={faTimes} />
                    </button>
                  )}
                </div>

                {/* Categories Filter */}
                {!searchQuery && (
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setActiveCategory(null)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${!activeCategory ? 'bg-[#123B5D] text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}`}
                    >
                      Tout
                    </button>
                    {skillCategories.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${activeCategory === cat.id ? 'bg-[#123B5D] text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                )}

                {/* Results list */}
                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {filteredCatalog.length === 0 ? (
                    <div className="text-center py-8 text-stone-400 text-sm">
                      Aucune compétence trouvée.
                    </div>
                  ) : (
                    filteredCatalog.map(skill => (
                      <div key={skill.id} className="flex items-center justify-between p-3 rounded-xl border border-stone-100 hover:border-[#C8F169] hover:bg-stone-50 transition-all group">
                        <div>
                          <div className="font-bold text-[#101820] text-sm">{skill.name}</div>
                          <div className="text-[10px] text-stone-500 font-medium">{skillCategories.find(c => c.id === skill.categoryId)?.name}</div>
                        </div>
                        <button
                          onClick={() => addSkill(skill.id)}
                          className="w-8 h-8 rounded-lg bg-white border border-stone-200 text-[#123B5D] flex items-center justify-center group-hover:bg-[#59B83E] group-hover:text-white group-hover:border-[#59B83E] transition-all cursor-pointer"
                        >
                          <FaIcon icon={faPlus} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </FadeInUp>
          </div>

          {/* RIGHT COLUMN : MY SKILLS */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Core Skills */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#123B5D]/5 text-[#123B5D] flex items-center justify-center">
                    <FaIcon icon={faStar} />
                  </div>
                  <h2 className="text-xl font-heading font-black text-[#101820]">Core Skills</h2>
                </div>
                <span className="text-xs font-bold text-stone-500 bg-stone-100 px-2.5 py-1 rounded-md">{coreSkillsCount}/3 Max</span>
              </div>
              
              {userSkills.filter(s => s.isCore).length === 0 ? (
                <div className="bg-white border border-dashed border-stone-300 rounded-2xl p-8 text-center">
                  <p className="text-sm text-stone-500 font-medium">Vos compétences principales apparaîtront ici.</p>
                </div>
              ) : (
                <StaggerContainer className="space-y-3">
                  {userSkills.filter(s => s.isCore).map(us => {
                    const catalogInfo = skillsCatalog.find(c => c.id === us.skillId)!;
                    return (
                      <ScaleOnHover key={us.skillId}>
                        <div className="bg-white border border-[#E2E8E5] rounded-2xl p-5 shadow-2xs relative overflow-hidden group">
                          {/* Accent line */}
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#123B5D]" />
                          
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center gap-2">
                                <h3 className="font-bold text-[#101820] text-base">{catalogInfo.name}</h3>
                                <button 
                                  onClick={() => updateSkill(us.skillId, { isCore: false })}
                                  className="text-[10px] px-2 py-0.5 rounded bg-stone-100 hover:bg-red-50 text-stone-500 hover:text-red-500 font-bold uppercase transition-colors"
                                  title="Retirer des compétences principales"
                                >
                                  Demote
                                </button>
                              </div>
                              <div className="text-xs text-stone-500 flex items-center gap-2">
                                <span>{skillCategories.find(c => c.id === catalogInfo.categoryId)?.name}</span>
                                {us.experience && (
                                  <>
                                    <span>•</span>
                                    <span className="font-medium text-[#123B5D]">{EXP_LABELS[us.experience]} d'expérience</span>
                                  </>
                                )}
                              </div>
                            </div>
                            
                            <div className="w-full sm:w-48 shrink-0">
                              <div className="flex items-center justify-between text-xs mb-1">
                                <span className="font-bold text-[#101820]">{LEVEL_LABELS[us.level].label}</span>
                                <button 
                                  onClick={() => setEditingSkillId(us.skillId)}
                                  className="text-stone-400 hover:text-[#59B83E] transition-colors"
                                >
                                  Éditer
                                </button>
                              </div>
                              {renderSkillLevelBar(us.level)}
                            </div>
                          </div>
                          
                          {/* Tools Section */}
                          {us.tools.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-stone-100">
                              <div className="flex flex-wrap items-center gap-2">
                                <FaIcon icon={faWrench} className="text-[10px] text-stone-400" />
                                {us.tools.map(toolId => {
                                  const toolName = toolsCatalog.find(t => t.id === toolId)?.name || toolId;
                                  return (
                                    <span key={toolId} className="px-2 py-1 bg-stone-50 border border-stone-200 rounded-md text-[10px] font-medium text-stone-600">
                                      {toolName}
                                    </span>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      </ScaleOnHover>
                    );
                  })}
                </StaggerContainer>
              )}
            </div>

            {/* Supporting Skills */}
            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-stone-100 text-stone-500 flex items-center justify-center">
                  <FaIcon icon={faLayerGroup} />
                </div>
                <h2 className="text-xl font-heading font-black text-[#101820]">Supporting Skills</h2>
              </div>
              
              {userSkills.filter(s => !s.isCore).length === 0 ? (
                <div className="bg-white border border-dashed border-stone-300 rounded-2xl p-8 text-center">
                  <p className="text-sm text-stone-500 font-medium">Ajoutez des compétences complémentaires.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {userSkills.filter(s => !s.isCore).map(us => {
                    const catalogInfo = skillsCatalog.find(c => c.id === us.skillId)!;
                    return (
                      <ScaleOnHover key={us.skillId}>
                        <div className="bg-white border border-[#E2E8E5] rounded-2xl p-4 shadow-2xs relative group">
                          <button 
                            onClick={() => removeSkill(us.skillId)}
                            className="absolute top-2 right-2 w-6 h-6 rounded bg-stone-50 text-stone-400 hover:text-red-500 hover:bg-red-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                          >
                            <FaIcon icon={faTimes} className="text-xs" />
                          </button>
                          
                          <div className="pr-6 space-y-3">
                            <div>
                              <h3 className="font-bold text-[#101820] text-sm truncate pr-2">{catalogInfo.name}</h3>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[10px] text-stone-500">{LEVEL_LABELS[us.level].label}</span>
                                <button 
                                  onClick={() => setEditingSkillId(us.skillId)}
                                  className="text-[10px] text-[#59B83E] hover:underline"
                                >
                                  Éditer
                                </button>
                              </div>
                            </div>
                            
                            {renderSkillLevelBar(us.level)}
                            
                            <button
                              onClick={() => updateSkill(us.skillId, { isCore: true })}
                              className="text-[10px] font-bold text-stone-500 hover:text-[#123B5D] w-full text-left flex items-center gap-1 mt-2"
                              disabled={coreSkillsCount >= 3}
                            >
                              <FaIcon icon={faStar} className={coreSkillsCount >= 3 ? 'opacity-30' : ''} />
                              <span className={coreSkillsCount >= 3 ? 'opacity-30' : ''}>Make Core Skill</span>
                            </button>
                          </div>
                        </div>
                      </ScaleOnHover>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* MODAL: EDIT SKILL */}
      {editingSkillId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#101820]/40 backdrop-blur-sm" onClick={() => setEditingSkillId(null)} />
          <div className="relative bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {(() => {
              const us = userSkills.find(s => s.skillId === editingSkillId)!;
              const catalogInfo = skillsCatalog.find(c => c.id === us.skillId)!;
              
              // Local state for modal to prevent immediate closure issues if needed, but direct update is simpler for this prototype
              return (
                <>
                  <div className="p-6 border-b border-stone-100 flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-heading font-black text-[#101820]">{catalogInfo.name}</h3>
                      <p className="text-sm text-stone-500">Configurez votre niveau et vos outils.</p>
                    </div>
                    <button onClick={() => setEditingSkillId(null)} className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center">
                      <FaIcon icon={faTimes} />
                    </button>
                  </div>
                  
                  <div className="p-6 overflow-y-auto custom-scrollbar space-y-8">
                    
                    {/* LEVEL */}
                    <div className="space-y-3">
                      <label className="text-sm font-bold text-[#101820] block">Niveau de maîtrise</label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {(Object.keys(LEVEL_LABELS) as SkillLevel[]).map(lvl => (
                          <button
                            key={lvl}
                            onClick={() => updateSkill(us.skillId, { level: lvl })}
                            className={`p-3 rounded-xl border-2 text-xs font-bold transition-all ${us.level === lvl ? 'border-[#59B83E] bg-[#59B83E]/5 text-[#59B83E]' : 'border-stone-100 bg-white text-stone-600 hover:border-stone-200'}`}
                          >
                            {LEVEL_LABELS[lvl].label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* EXPERIENCE */}
                    <div className="space-y-3">
                      <label className="text-sm font-bold text-[#101820] block">Années d'expérience (Optionnel)</label>
                      <div className="flex flex-wrap gap-2">
                        {(Object.keys(EXP_LABELS) as SkillExperience[]).map(exp => (
                          <button
                            key={exp}
                            onClick={() => updateSkill(us.skillId, { experience: us.experience === exp ? undefined : exp })}
                            className={`px-4 py-2 rounded-lg border text-xs font-bold transition-all ${us.experience === exp ? 'border-[#123B5D] bg-[#123B5D] text-white' : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'}`}
                          >
                            {EXP_LABELS[exp]}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* TOOLS */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-bold text-[#101820] block">Outils & Technologies liés</label>
                        <span className="text-[10px] text-stone-400 font-medium">Sélectionnez les outils que vous utilisez</span>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {/* Always show suggested tools first, then other popular tools or just a long list for simplicity */}
                        {catalogInfo.suggestedTools?.map(toolId => {
                          const tool = toolsCatalog.find(t => t.id === toolId);
                          if (!tool) return null;
                          const isSelected = us.tools.includes(toolId);
                          return (
                            <button
                              key={toolId}
                              onClick={() => {
                                const newTools = isSelected 
                                  ? us.tools.filter(t => t !== toolId)
                                  : [...us.tools, toolId];
                                updateSkill(us.skillId, { tools: newTools });
                              }}
                              className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all flex items-center gap-1.5 ${isSelected ? 'border-[#59B83E] bg-[#59B83E] text-white' : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'}`}
                            >
                              {isSelected && <FaIcon icon={faCheckCircle} className="text-[10px]" />}
                              {tool.name}
                            </button>
                          );
                        })}
                      </div>
                      
                      {/* For a real MVP we would add a combobox here to search ANY tool from toolsCatalog */}
                    </div>
                  </div>
                  
                  <div className="p-4 border-t border-stone-100 bg-stone-50 flex justify-end">
                    <button 
                      onClick={() => setEditingSkillId(null)}
                      className="sb-btn px-6 py-2.5 rounded-xl bg-[#101820] hover:bg-[#202c38] text-white text-sm font-bold transition-colors"
                    >
                      Terminer
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}

    </div>
  );
};
