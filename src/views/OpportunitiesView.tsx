import React, { useState, useEffect } from 'react';
import { ViewType } from '../types/platform';
import { Opportunity } from '../types';
import { useAuth } from '../context/AuthContext';
import { OpportunityService } from '../services/opportunityService';
import { FaIcon } from '../components/FaIcon';
import { 
  faBriefcase, 
  faSearch, 
  faMapMarkerAlt, 
  faMoneyBillWave, 
  faPaperPlane, 
  faTimes, 
  faCheck,
  faPlus
} from '@fortawesome/free-solid-svg-icons';

export const OpportunitiesView: React.FC<{ onNavigate: (view: ViewType) => void }> = () => {
  const { user, profile } = useAuth();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Application Modal state
  const [selectedOpp, setSelectedOpp] = useState<Opportunity | null>(null);
  const [coverMessage, setCoverMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Create Opportunity Modal state (for companies/mentors)
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newType, setNewType] = useState<Opportunity['type']>('emploi');
  const [newLocation, setNewLocation] = useState('');
  const [newSkills, setNewSkills] = useState('');
  const [newSalary, setNewSalary] = useState('');

  const loadOpportunities = async () => {
    setIsLoading(true);
    const res = await OpportunityService.getPublishedOpportunities(selectedType);
    setOpportunities(res.data || []);
    setIsLoading(false);
  };

  useEffect(() => {
    loadOpportunities();
  }, [selectedType]);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profile || !selectedOpp) return;

    setIsSubmitting(true);
    const res = await OpportunityService.applyToOpportunity(user.id, profile.id, {
      opportunity_id: selectedOpp.id,
      cover_message: coverMessage,
      passport_sbid: profile.passport_id || undefined,
    });
    setIsSubmitting(false);

    if (res.data) {
      setSelectedOpp(null);
      setCoverMessage('');
      setSuccessNotice(`Candidature envoyée avec succès à ${selectedOpp.title} avec votre Skill Passport !`);
      setTimeout(() => setSuccessNotice(null), 5000);
    }
  };

  const handleCreateOpportunity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profile) return;

    setIsSubmitting(true);
    const skillsArray = newSkills.split(',').map((s) => s.trim()).filter(Boolean);
    const salaryNum = newSalary ? parseInt(newSalary, 10) : undefined;

    const res = await OpportunityService.createOpportunity(user.id, profile.id, {
      title: newTitle,
      description: newDesc,
      type: newType,
      location: newLocation || undefined,
      required_skills: skillsArray,
      salary_min: salaryNum,
      currency: 'XOF',
    });
    setIsSubmitting(false);

    if (res.data) {
      setIsCreateOpen(false);
      setNewTitle('');
      setNewDesc('');
      setNewLocation('');
      setNewSkills('');
      setNewSalary('');
      setSuccessNotice('Opportunité publiée avec succès !');
      loadOpportunities();
      setTimeout(() => setSuccessNotice(null), 4000);
    }
  };

  const filteredOpps = opportunities.filter((o) => {
    const q = searchQuery.toLowerCase().trim();
    return (
      !q ||
      o.title.toLowerCase().includes(q) ||
      o.description.toLowerCase().includes(q) ||
      o.required_skills.some((s) => s.toLowerCase().includes(q))
    );
  });

  const isCompanyOrMentor = profile?.account_type === 'company' || profile?.account_type === 'mentor';

  return (
    <div className="flex-1 w-full min-h-screen bg-[#F5F7F6] pb-24 lg:pb-8">
      {/* Header */}
      <div className="bg-white border-b border-[#E2E8E5] sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-heading font-bold text-[#101820]">Opportunités Réelles</h1>
              <p className="text-sm text-stone-500 mt-1">Postulez directement avec la preuve certifiée de votre Skill Passport.</p>
            </div>
            {isCompanyOrMentor && (
              <button
                onClick={() => setIsCreateOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-[#123B5D] text-white text-xs font-bold hover:bg-[#0A2338] transition-colors flex items-center gap-2 shadow-sm"
              >
                <FaIcon icon={faPlus} />
                Publier une offre
              </button>
            )}
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <FaIcon icon={faSearch} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 text-sm" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher par titre, compétences requises, mot-clé..."
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-[#E2E8E5] bg-[#F5F7F6] focus:bg-white focus:outline-none focus:border-[#59B83E] transition-all text-xs"
              />
            </div>
            
            {/* Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
              {['all', 'emploi', 'stage', 'freelance', 'collaboration'].map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-colors ${
                    selectedType === type
                      ? 'bg-[#123B5D] text-white'
                      : 'bg-white border border-[#E2E8E5] text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  {type === 'all' ? 'Toutes' : type}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {successNotice && (
          <div className="p-4 rounded-2xl bg-[#ECFDF5] border border-[#59B83E]/20 text-[#59B83E] text-xs font-bold flex items-center gap-2">
            <FaIcon icon={faCheck} />
            {successNotice}
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-20 text-xs text-stone-400">Chargement des opportunités...</div>
        ) : filteredOpps.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-[#E2E8E5] shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-stone-50 border border-stone-100 flex items-center justify-center mx-auto mb-4 text-[#123B5D] text-2xl">
              <FaIcon icon={faBriefcase} />
            </div>
            <h3 className="text-lg font-heading font-bold text-[#101820] mb-2">
              Aucune opportunité disponible
            </h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              Revenez régulièrement ou modifiez vos filtres de recherche.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOpps.map((opp) => (
              <div key={opp.id} className="bg-white rounded-2xl border border-[#E2E8E5] p-6 shadow-xs flex flex-col justify-between hover:border-[#123B5D]/30 transition-all">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#EBF3F8] text-[#123B5D]">
                      {opp.type}
                    </span>
                    {opp.location && (
                      <span className="text-xs text-stone-400 flex items-center gap-1">
                        <FaIcon icon={faMapMarkerAlt} />
                        {opp.location}
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-base text-[#101820] leading-snug">{opp.title}</h3>
                  <p className="text-xs text-stone-500 line-clamp-3">{opp.description}</p>

                  {opp.salary_min && (
                    <div className="text-xs font-semibold text-[#59B83E] flex items-center gap-1.5 pt-1">
                      <FaIcon icon={faMoneyBillWave} />
                      {opp.salary_min.toLocaleString()} {opp.currency}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {opp.required_skills.map((s, idx) => (
                      <span key={idx} className="text-[10px] font-semibold bg-stone-100 text-stone-600 px-2 py-0.5 rounded-md">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-5 mt-4 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-[11px] text-stone-400">{opp.applications_count} candidatures</span>
                  <button
                    onClick={() => setSelectedOpp(opp)}
                    className="px-5 py-2 rounded-xl bg-[#123B5D] text-white text-xs font-bold hover:bg-[#0A2338] transition-colors flex items-center gap-1.5"
                  >
                    <FaIcon icon={faPaperPlane} />
                    Postuler
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Apply Modal */}
      {selectedOpp && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl border border-stone-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold font-heading text-[#101820]">
                  Postuler à : {selectedOpp.title}
                </h3>
                <p className="text-xs text-stone-400 mt-0.5">Votre Skill Passport sera automatiquement attaché</p>
              </div>
              <button onClick={() => setSelectedOpp(null)} className="text-stone-400 hover:text-stone-600">
                <FaIcon icon={faTimes} />
              </button>
            </div>

            {profile?.passport_id && (
              <div className="p-3.5 rounded-xl bg-[#ECFDF5] border border-[#59B83E]/20 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-[#101820] block">Skill Passport Certifié</span>
                  <span className="font-mono text-[#59B83E] font-bold text-[11px]">{profile.passport_id}</span>
                </div>
                <span className="px-2 py-1 bg-white rounded-md font-bold text-[10px] text-[#59B83E] shadow-2xs">
                  Score : {profile.passport_score || 0}/100
                </span>
              </div>
            )}

            <form onSubmit={handleApply} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  Message de motivation :
                </label>
                <textarea
                  rows={4}
                  required
                  value={coverMessage}
                  onChange={(e) => setCoverMessage(e.target.value)}
                  placeholder="Présentez vos points forts et votre pertinence pour cette mission..."
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8E5] text-xs focus:border-[#123B5D] focus:outline-none"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedOpp(null)}
                  className="flex-1 py-2.5 rounded-xl bg-stone-100 text-stone-600 font-bold text-xs hover:bg-stone-200"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 rounded-xl bg-[#59B83E] text-white font-bold text-xs hover:bg-[#4ea834] disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  <FaIcon icon={faPaperPlane} />
                  {isSubmitting ? 'Envoi...' : 'Transmettre ma candidature'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Opportunity Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl border border-stone-100">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold font-heading text-[#101820]">Publier une opportunité</h3>
              <button onClick={() => setIsCreateOpen(false)} className="text-stone-400 hover:text-stone-600">
                <FaIcon icon={faTimes} />
              </button>
            </div>

            <form onSubmit={handleCreateOpportunity} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Titre du poste *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ex: Développeur React & TypeScript"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8E5] text-xs focus:border-[#123B5D] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8E5] text-xs focus:border-[#123B5D] focus:outline-none bg-white"
                  >
                    <option value="emploi">Emploi / CDI / CDD</option>
                    <option value="stage">Stage</option>
                    <option value="freelance">Mission Freelance</option>
                    <option value="collaboration">Collaboration</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Localisation</label>
                  <input
                    type="text"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    placeholder="Ex: Télétravail / Dakar"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8E5] text-xs focus:border-[#123B5D] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Compétences requises (virgules)</label>
                <input
                  type="text"
                  value={newSkills}
                  onChange={(e) => setNewSkills(e.target.value)}
                  placeholder="Ex: React, Tailwind, Supabase"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8E5] text-xs focus:border-[#123B5D] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Rémunération estimée (XOF)</label>
                <input
                  type="number"
                  value={newSalary}
                  onChange={(e) => setNewSalary(e.target.value)}
                  placeholder="Ex: 500000"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8E5] text-xs focus:border-[#123B5D] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Description détaillée *</label>
                <textarea
                  rows={4}
                  required
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Détaillez les missions, responsabilités et profil recherché..."
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8E5] text-xs focus:border-[#123B5D] focus:outline-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-stone-100 text-stone-600 font-bold text-xs hover:bg-stone-200"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 rounded-xl bg-[#123B5D] text-white font-bold text-xs hover:bg-[#0A2338] disabled:opacity-50"
                >
                  {isSubmitting ? 'Publication...' : 'Publier l’offre'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
