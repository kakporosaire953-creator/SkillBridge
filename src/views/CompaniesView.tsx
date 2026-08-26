import React, { useState } from 'react';
import { ViewType, CompanyOpportunity } from '../types/platform';
import { 
  ArrowRight, 
  Search, 
  Plus, 
  X 
} from 'lucide-react';

interface CompaniesViewProps {
  onNavigate: (view: ViewType) => void;
}

const SAMPLE_OPPORTUNITIES: CompanyOpportunity[] = [
  {
    id: 'op-01',
    title: 'Lead Cloud Infrastructure Architect',
    company: 'FinTech Alliance West Africa',
    location: 'Dakar / Abidjan',
    workplaceType: 'Hybride',
    contractType: 'CDI',
    requiredSkills: ['Kubernetes', 'PostgreSQL', 'Terraform', 'Distributed Systems'],
    domain: 'Infrastructure & Cloud',
    description: 'Pilotage de l\'infrastructure cloud de compensation financière régionale à haute disponibilité.'
  },
  {
    id: 'op-02',
    title: 'Senior Frontend Engineer (Design Systems)',
    company: 'Sahel Scale Ventures',
    location: 'Panafricain',
    workplaceType: 'Télétravail',
    contractType: 'CDI',
    requiredSkills: ['TypeScript', 'React', 'Design Systems', 'Tailwind CSS', 'Accessibility'],
    domain: 'Product & Frontend',
    description: 'Création et standardisation des composants d\'interface pour une suite d\'applications SaaS B2B.'
  },
  {
    id: 'op-03',
    title: 'Machine Learning Engineer (NLP & Audio)',
    company: 'LinguaTech Labs',
    location: 'Lomé / Cotonou',
    workplaceType: 'Sur site',
    contractType: 'Mission',
    requiredSkills: ['PyTorch', 'Python', 'Speech-to-Text', 'FastAPI'],
    domain: 'Intelligence Artificielle',
    description: 'Entraînement et déploiement de modèles de transcription vocale adaptés aux langues d\'Afrique de l\'Ouest.'
  }
];

export const CompaniesView: React.FC<CompaniesViewProps> = ({ onNavigate }) => {
  const [opportunities, setOpportunities] = useState<CompanyOpportunity[]>(SAMPLE_OPPORTUNITIES);
  const [searchSkill, setSearchSkill] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('Tous');
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const domains = ['Tous', 'Infrastructure & Cloud', 'Product & Frontend', 'Intelligence Artificielle'];

  const filteredOpps = opportunities.filter((o) => {
    const matchDomain = selectedDomain === 'Tous' || o.domain === selectedDomain;
    const matchSearch = searchSkill === '' || o.requiredSkills.some(s => s.toLowerCase().includes(searchSkill.toLowerCase())) || o.title.toLowerCase().includes(searchSkill.toLowerCase());
    return matchDomain && matchSearch;
  });

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    const created: CompanyOpportunity = {
      id: `op-${Date.now()}`,
      title: newTitle,
      company: newCompany,
      location: newLocation,
      workplaceType: 'Télétravail',
      contractType: 'CDI',
      requiredSkills: ['TypeScript', 'Architecture'],
      domain: 'Infrastructure & Cloud',
      description: newDesc
    };
    setOpportunities([created, ...opportunities]);
    setIsPublishModalOpen(false);
    setNewTitle('');
    setNewCompany('');
    setNewLocation('');
    setNewDesc('');
    alert('Votre opportunité a été publiée sur le réseau SkillBridge.');
  };

  return (
    <div className="flex-1 w-full bg-[#F5F7F6] text-[#101820]">
      
      {/* Hero */}
      <section className="py-20 sm:py-28 border-b border-[#E2E8E5] bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F5F7F6] border border-[#E2E8E5] text-[#123B5D] text-xs font-mono font-bold uppercase tracking-wider">
            <span>ESPACE ENTREPRISES & ORGANISATIONS</span>
          </div>

          <h1 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#101820] leading-tight">
            Recrutez des capacités. <br className="hidden sm:inline" />
            <span className="text-[#59B83E]">Pas seulement des CV.</span>
          </h1>

          <p className="text-stone-600 text-base sm:text-xl font-light leading-relaxed max-w-2xl mx-auto">
            Accédez à un vivier vérifié de développeurs, data scientists et architectes. Évaluez leurs compétences réelles sur la base de preuves tangibles et de projets concrets.
          </p>

          <div className="pt-2 flex justify-center gap-4">
            <button
              type="button"
              onClick={() => setIsPublishModalOpen(true)}
              className="px-8 py-4 rounded-xl bg-[#123B5D] hover:bg-[#101820] text-white font-bold text-sm sm:text-base transition-all flex items-center gap-2.5 cursor-pointer shadow-md"
            >
              <Plus className="w-4 h-4 text-[#C8F169]" />
              <span>Publier une opportunité</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('talents')}
              className="px-6 py-4 rounded-xl bg-[#F5F7F6] hover:bg-stone-100 border border-[#E2E8E5] text-[#123B5D] font-bold text-sm sm:text-base transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Explorer les talents</span>
            </button>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="py-16 bg-white border-b border-[#E2E8E5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-6 bg-[#F5F7F6] border border-[#E2E8E5] rounded-2xl space-y-1">
              <span className="font-mono text-xs font-bold text-[#123B5D]">01 · RECHERCHE PAR SKILL</span>
              <p className="text-xs text-stone-600">Trouvez précisément la stack technique maîtrisée.</p>
            </div>
            <div className="p-6 bg-[#F5F7F6] border border-[#E2E8E5] rounded-2xl space-y-1">
              <span className="font-mono text-xs font-bold text-[#59B83E]">02 · SKILL PROOFS</span>
              <p className="text-xs text-stone-600">Examinez le code réel et les revues de pairs.</p>
            </div>
            <div className="p-6 bg-[#F5F7F6] border border-[#E2E8E5] rounded-2xl space-y-1">
              <span className="font-mono text-xs font-bold text-[#123B5D]">03 · SANS INTERMÉDIAIRE</span>
              <p className="text-xs text-stone-600">Entrez en contact direct avec les talents.</p>
            </div>
            <div className="p-6 bg-[#F5F7F6] border border-[#E2E8E5] rounded-2xl space-y-1">
              <span className="font-mono text-xs font-bold text-[#101820]">04 · CHALLENGES DÉDIÉS</span>
              <p className="text-xs text-stone-600">Sponsorisez des défis pour recruter les meilleurs.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Opportunities Directory & Search */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#E2E8E5]">
          <div className="space-y-1">
            <span className="text-xs font-mono font-bold uppercase text-[#59B83E] tracking-wider">
              OPPORTUNITÉS OUVERTES SUR LE RÉSEAU
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#101820]">
              Postes & Missions Actives
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchSkill}
                onChange={(e) => setSearchSkill(e.target.value)}
                placeholder="Filtrer par compétence..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-white border border-[#E2E8E5] text-xs text-[#101820] focus:outline-hidden focus:border-[#123B5D]"
              />
            </div>
          </div>
        </div>

        {/* Domain Filter Pills */}
        <div className="flex flex-wrap gap-2">
          {domains.map((dom) => (
            <button
              key={dom}
              type="button"
              onClick={() => setSelectedDomain(dom)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedDomain === dom
                  ? 'bg-[#123B5D] text-white shadow-xs'
                  : 'bg-white border border-[#E2E8E5] text-[#101820] hover:bg-stone-50'
              }`}
            >
              {dom}
            </button>
          ))}
        </div>

        {/* Opportunities List */}
        <div className="space-y-4">
          {filteredOpps.map((opp) => (
            <div
              key={opp.id}
              className="bg-white border border-[#E2E8E5] rounded-3xl p-6 sm:p-8 space-y-4 hover:border-[#123B5D] transition-all shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="space-y-2 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-mono font-bold text-[#123B5D] uppercase tracking-wider">
                    {opp.company}
                  </span>
                  <span className="text-[11px] px-2 py-0.5 rounded-md bg-[#F5F7F6] border border-[#E2E8E5] text-stone-600">
                    {opp.contractType} · {opp.workplaceType}
                  </span>
                  <span className="text-[11px] text-[#59B83E] font-bold">
                    {opp.location}
                  </span>
                </div>

                <h3 className="font-heading text-lg sm:text-xl font-bold text-[#101820]">
                  {opp.title}
                </h3>

                <p className="text-xs text-stone-600 font-light leading-relaxed">
                  {opp.description}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {opp.requiredSkills.map((s) => (
                    <span key={s} className="text-[11px] px-2.5 py-1 rounded-lg bg-[#F5F7F6] text-[#101820] font-medium border border-[#E2E8E5]">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => alert(`Pour postuler à ${opp.title}, rejoignez SkillBridge en tant que Talent !`)}
                className="shrink-0 px-6 py-3 rounded-xl bg-[#123B5D] hover:bg-[#101820] text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Postuler via Skill Passport</span>
                <ArrowRight className="w-4 h-4 text-[#C8F169]" />
              </button>
            </div>
          ))}
        </div>

      </section>

      {/* Publish Opportunity Modal */}
      {isPublishModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white border border-[#E2E8E5] rounded-3xl p-6 sm:p-10 max-w-lg w-full shadow-2xl space-y-6 relative">
            
            <button
              type="button"
              onClick={() => setIsPublishModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-xl bg-[#F5F7F6] text-stone-500 hover:text-[#101820]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#59B83E] block">
                NOUVELLE OPPORTUNITÉ
              </span>
              <h2 className="font-heading text-2xl font-bold text-[#101820]">
                Publier une offre de recrutement
              </h2>
            </div>

            <form onSubmit={handlePublish} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#123B5D] mb-1">
                  Intitulé du poste
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ex: Senior Backend Go Engineer"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F5F7F6] border border-[#E2E8E5] text-xs text-[#101820] focus:outline-hidden focus:border-[#123B5D]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#123B5D] mb-1">
                  Nom de l'organisation
                </label>
                <input
                  type="text"
                  required
                  value={newCompany}
                  onChange={(e) => setNewCompany(e.target.value)}
                  placeholder="Ex: Sahel Pay Services"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F5F7F6] border border-[#E2E8E5] text-xs text-[#101820] focus:outline-hidden focus:border-[#123B5D]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#123B5D] mb-1">
                  Localisation & Modalité
                </label>
                <input
                  type="text"
                  required
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  placeholder="Ex: Dakar / Télétravail"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F5F7F6] border border-[#E2E8E5] text-xs text-[#101820] focus:outline-hidden focus:border-[#123B5D]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#123B5D] mb-1">
                  Description succincte des capacités requises
                </label>
                <textarea
                  rows={3}
                  required
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Précisez les exigences techniques et missions clés..."
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F5F7F6] border border-[#E2E8E5] text-xs text-[#101820] focus:outline-hidden focus:border-[#123B5D]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#123B5D] hover:bg-[#101820] text-white font-bold text-xs cursor-pointer"
                >
                  Publier l'opportunité
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
