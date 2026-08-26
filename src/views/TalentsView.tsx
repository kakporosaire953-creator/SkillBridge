import React, { useState } from 'react';
import { ViewType, TalentProfileData } from '../types/platform';
import { 
  ArrowRight, 
  Search, 
  X
} from 'lucide-react';

import { FadeInUp } from '../components/motion/FadeInUp';
import { StaggerContainer } from '../components/motion/StaggerContainer';
import { ScaleOnHover } from '../components/motion/ScaleOnHover';

interface TalentsViewProps {
  onNavigate: (view: ViewType) => void;
}

const SAMPLE_TALENTS: TalentProfileData[] = [
  {
    id: 't-01',
    name: 'Aïcha Konaté',
    headline: 'Senior Distributed Systems Architect',
    location: 'Dakar',
    country: 'Sénégal',
    passportScore: 94,
    skills: [
      { name: 'Distributed Systems', level: 95, proofCount: 4, category: 'Backend' },
      { name: 'Go / Rust', level: 90, proofCount: 6, category: 'Backend' },
      { name: 'PostgreSQL & RLS', level: 92, proofCount: 3, category: 'Data' }
    ],
    experience: [
      { role: 'Staff Engineer', organization: 'WariPay Infrastructure', period: '2022 - Présent', description: 'Conception du moteur transactionnel haute disponibilité à 25k TPS.' }
    ],
    projects: [
      { title: 'Panafrican Settlement Engine', description: 'Moteur de compensation instantané sans point de défaillance unique.', tech: ['Go', 'PostgreSQL', 'Docker'], verified: true }
    ],
    skillProofs: [
      { title: 'Audit de sécurité & résilience de la couche API', type: 'github', date: 'Janv 2026' }
    ],
    achievements: ['Speaker DevFest Dakar', 'Contributeur Core Linux Kernel'],
    recommendations: [
      { author: 'Moussa Diop', role: 'CTO', company: 'Sahel Scale', text: 'Une des plus grandes rigueurs architecturales du continent.' }
    ]
  },
  {
    id: 't-02',
    name: 'Kofi Mensah',
    headline: 'Lead Mobile & Offline-First Engineer',
    location: 'Accra',
    country: 'Ghana',
    passportScore: 91,
    skills: [
      { name: 'React Native', level: 94, proofCount: 5, category: 'Mobile' },
      { name: 'SQLite / WatermelonDB', level: 90, proofCount: 4, category: 'Data' },
      { name: 'TypeScript', level: 92, proofCount: 8, category: 'Frontend' }
    ],
    experience: [
      { role: 'Lead Mobile Developer', organization: 'AgroSync West Africa', period: '2023 - Présent', description: 'Application de traçabilité agricole fonctionnant à 100% hors-ligne.' }
    ],
    projects: [
      { title: 'AgroSync Offline Core', description: 'Synchronisation vectorielle de données pour 40 000 coopératives.', tech: ['React Native', 'TypeScript'], verified: true }
    ],
    skillProofs: [
      { title: 'Dépôt open-source de synchronisation P2P', type: 'github', date: 'Fév 2026' }
    ],
    achievements: ['Lauréat Hackathon AgriTech 2025'],
    recommendations: [
      { author: 'Ama Osei', role: 'Head of Product', company: 'FinGrow', text: 'Capacité exceptionnelle à résoudre les contraintes de réseau réelles.' }
    ]
  },
  {
    id: 't-03',
    name: 'Fatouma Traoré',
    headline: 'AI & Natural Language Processing Specialist',
    location: 'Abidjan',
    country: 'Côte d\'Ivoire',
    passportScore: 93,
    skills: [
      { name: 'NLP / Multilingual LLMs', level: 96, proofCount: 5, category: 'AI' },
      { name: 'Python / PyTorch', level: 92, proofCount: 7, category: 'AI' },
      { name: 'FastAPI Microservices', level: 88, proofCount: 4, category: 'Backend' }
    ],
    experience: [
      { role: 'AI Research Engineer', organization: 'Ivorian LinguaTech Lab', period: '2022 - Présent', description: 'Modélisation et fine-tuning de modèles vocaux pour les langues locales.' }
    ],
    projects: [
      { title: 'Baoulé & Dioula Speech Corpus', description: 'Reconnaissance vocale haute précision sur terminaux mobiles légers.', tech: ['PyTorch', 'ONNX', 'Python'], verified: true }
    ],
    skillProofs: [
      { title: 'Publication académique & modèles HuggingFace vérifiés', type: 'peer_review', date: 'Déc 2025' }
    ],
    achievements: ['Prix Recherche & Innovation IA 2025'],
    recommendations: [
      { author: 'Dr. Jean Kouassi', role: 'Directeur de Recherche', company: 'INP-HB', text: 'Rigueur mathématique et impact social remarquable.' }
    ]
  }
];

export const TalentsView: React.FC<TalentsViewProps> = ({ onNavigate }) => {
  const [talents] = useState<TalentProfileData[]>(SAMPLE_TALENTS);
  const [selectedTalent, setSelectedTalent] = useState<TalentProfileData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Tous');

  const filteredTalents = talents.filter((t) => {
    const matchSearch = 
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.headline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.skills.some(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchCat = categoryFilter === 'Tous' || t.skills.some(s => s.category === categoryFilter);
    return matchSearch && matchCat;
  });

  return (
    <div className="flex-1 w-full bg-[#F5F7F6] text-[#101820]">
      
      {/* Hero */}
      <section className="py-20 sm:py-28 border-b border-[#E2E8E5] bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F5F7F6] border border-[#E2E8E5] text-[#123B5D] text-xs font-mono font-bold uppercase tracking-wider">
            <span>ESPACE TALENTS SKILLBRIDGE</span>
          </div>

          <h1 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#101820] leading-tight">
            Votre potentiel mérite plus qu'un CV.
          </h1>

          <p className="text-stone-600 text-base sm:text-xl font-light leading-relaxed max-w-2xl mx-auto">
            Créez votre profil, attestez de vos compétences par des preuves concrètes, recevez les retours de pairs et accédez aux opportunités professionnelles les plus exigeantes.
          </p>

          <div className="pt-2 flex justify-center">
            <button
              type="button"
              onClick={() => onNavigate('onboarding')}
              className="px-8 py-4 rounded-xl bg-[#123B5D] hover:bg-[#101820] text-white font-bold text-sm sm:text-base transition-all flex items-center gap-2.5 cursor-pointer shadow-md"
            >
              <span>Construire mon profil</span>
              <ArrowRight className="w-4 h-4 text-[#C8F169]" />
            </button>
          </div>
        </div>
      </section>

      {/* Talent Ecosystem Features */}
      <section className="py-20 border-b border-[#E2E8E5] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInUp>
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
              <span className="text-xs font-mono font-bold uppercase text-[#59B83E] tracking-wider">
                FONCTIONNALITÉS ESSENTIELLES
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#101820]">
                Comment SkillBridge valorise votre travail
              </h2>
            </div>
          </FadeInUp>

          <StaggerContainer staggerDelay={0.1} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ScaleOnHover>
              <div className="p-6 bg-[#F5F7F6] border border-[#E2E8E5] rounded-2xl space-y-2 h-full">
                <span className="font-mono text-xs font-bold text-[#123B5D]">01 · SKILL PROOFS</span>
                <h3 className="font-heading font-bold text-base text-[#101820]">Preuves Vérifiées</h3>
                <p className="text-xs text-stone-600 font-light">Associez vos dépôts GitHub, démos et audits examinés par des pairs.</p>
              </div>
            </ScaleOnHover>

            <ScaleOnHover>
              <div className="p-6 bg-[#F5F7F6] border border-[#E2E8E5] rounded-2xl space-y-2 h-full">
                <span className="font-mono text-xs font-bold text-[#59B83E]">02 · PASSPORT SCORE</span>
                <h3 className="font-heading font-bold text-base text-[#101820]">Indice d'Aptitude</h3>
                <p className="text-xs text-stone-600 font-light">Un score transparent et souverain calculé à partir de données réelles.</p>
              </div>
            </ScaleOnHover>

            <ScaleOnHover>
              <div className="p-6 bg-[#F5F7F6] border border-[#E2E8E5] rounded-2xl space-y-2 h-full">
                <span className="font-mono text-xs font-bold text-[#123B5D]">03 · MENTOR REVIEWS</span>
                <h3 className="font-heading font-bold text-base text-[#101820]">Recommandations</h3>
                <p className="text-xs text-stone-600 font-light">Des avis authentifiés rédigés par des ingénieurs et leads seniors.</p>
              </div>
            </ScaleOnHover>

            <ScaleOnHover>
              <div className="p-6 bg-[#F5F7F6] border border-[#E2E8E5] rounded-2xl space-y-2 h-full">
                <span className="font-mono text-xs font-bold text-[#101820]">04 · OPPORTUNITÉS</span>
                <h3 className="font-heading font-bold text-base text-[#101820]">Contact Direct</h3>
                <p className="text-xs text-stone-600 font-light">Soyez sollicité directement par les organisations pour vos capacités.</p>
              </div>
            </ScaleOnHover>
          </StaggerContainer>
        </div>
      </section>

      {/* Directory & Sample Profiles */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        <FadeInUp>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#E2E8E5]">
            <div className="space-y-1">
              <span className="text-xs font-mono font-bold uppercase text-[#59B83E] tracking-wider">
                ANNUAIRE & PROFILS DÉMONSTRATION
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#101820]">
                Découvrez des profils certifiés SkillBridge
              </h2>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                {['Tous', 'Ingénierie & Systèmes', 'UI/UX', 'Cloud'].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategoryFilter(cat)}
                    className={`sb-btn px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer whitespace-nowrap ${
                      categoryFilter === cat
                        ? 'bg-[#123B5D] text-white'
                        : 'bg-white border border-[#E2E8E5] text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher une compétence..."
                  className="sb-focus w-full pl-10 pr-4 py-2 rounded-xl bg-white border border-[#E2E8E5] text-xs text-[#101820] focus:outline-hidden focus:border-[#123B5D]"
                />
              </div>
            </div>
          </div>
        </FadeInUp>

        {/* Talents List */}
        <StaggerContainer staggerDelay={0.08} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredTalents.map((t) => (
            <ScaleOnHover key={t.id}>
              <div
                onClick={() => setSelectedTalent(t)}
                className="bg-white border border-[#E2E8E5] rounded-3xl p-6 space-y-5 hover:border-[#123B5D] transition-all cursor-pointer shadow-xs hover:shadow-md flex flex-col justify-between h-full"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-[#123B5D] text-white flex items-center justify-center font-bold text-base">
                        {t.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-heading font-bold text-base text-[#101820]">{t.name}</h4>
                        <p className="text-xs text-stone-500">{t.location}, {t.country}</p>
                      </div>
                    </div>

                    <span className="text-xs font-mono font-bold px-2 py-1 rounded-lg bg-[#59B83E]/10 text-[#59B83E]">
                      {t.passportScore}/100
                    </span>
                  </div>

                  <p className="text-xs text-stone-600 font-medium line-clamp-2">
                    {t.headline}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {t.skills.map((s) => (
                      <span key={s.name} className="text-[11px] px-2.5 py-1 rounded-lg bg-[#F5F7F6] border border-[#E2E8E5] text-[#101820] font-medium">
                        {s.name}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-[#E2E8E5] flex items-center justify-between text-xs text-[#123B5D] font-bold">
                  <span>Voir le profil complet</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </ScaleOnHover>
          ))}
        </StaggerContainer>

      </section>

      {/* Talent Detail Modal */}
      {selectedTalent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white border border-[#E2E8E5] rounded-3xl p-6 sm:p-10 max-w-2xl w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto relative">
            
            <button
              type="button"
              onClick={() => setSelectedTalent(null)}
              className="absolute top-6 right-6 p-2 rounded-xl bg-[#F5F7F6] text-stone-500 hover:text-[#101820]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4 border-b border-[#E2E8E5] pb-6">
              <div className="w-16 h-16 rounded-2xl bg-[#123B5D] text-white flex items-center justify-center font-bold text-xl">
                {selectedTalent.name.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h3 className="font-heading text-2xl font-bold text-[#101820]">{selectedTalent.name}</h3>
                <p className="text-xs text-stone-500 font-medium">{selectedTalent.headline} · {selectedTalent.location}, {selectedTalent.country}</p>
                <span className="text-xs font-mono font-bold text-[#59B83E] mt-1 inline-block">Score Passport : {selectedTalent.passportScore}/100</span>
              </div>
            </div>

            {/* Skills & Proofs */}
            <div className="space-y-3">
              <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-[#123B5D]">
                Compétences vérifiées
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {selectedTalent.skills.map((s) => (
                  <div key={s.name} className="p-3 rounded-xl bg-[#F5F7F6] border border-[#E2E8E5] space-y-1 text-xs">
                    <div className="flex justify-between font-bold text-[#101820]">
                      <span>{s.name}</span>
                      <span className="font-mono text-[#59B83E]">{s.level}%</span>
                    </div>
                    <span className="text-[11px] text-stone-500">{s.proofCount} preuves de code auditées</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Projects */}
            <div className="space-y-3">
              <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-[#123B5D]">
                Projet en Production
              </h4>
              {selectedTalent.projects.map((p, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-[#F5F7F6] border border-[#E2E8E5] space-y-2 text-xs">
                  <div className="font-bold text-[#101820]">{p.title}</div>
                  <p className="text-stone-600 font-light">{p.description}</p>
                </div>
              ))}
            </div>

            {/* Recommendation */}
            <div className="space-y-3">
              <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-[#123B5D]">
                Recommandation de pair
              </h4>
              {selectedTalent.recommendations.map((r, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-white border border-[#E2E8E5] space-y-1 text-xs">
                  <p className="italic text-stone-700">« {r.text} »</p>
                  <span className="text-[11px] font-bold text-[#123B5D] block pt-1">— {r.author}, {r.role} chez {r.company}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-[#E2E8E5] flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setSelectedTalent(null);
                  onNavigate('onboarding');
                }}
                className="px-6 py-2.5 rounded-xl bg-[#123B5D] text-white font-bold text-xs cursor-pointer"
              >
                Créer un profil similaire
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
