import React, { useState } from 'react';
import { ViewType, ResourceArticle } from '../types/platform';
import { 
  ArrowRight, 
  X 
} from 'lucide-react';

interface ResourcesViewProps {
  onNavigate?: (view: ViewType) => void;
}

const SAMPLE_ARTICLES: ResourceArticle[] = [
  {
    id: 'res-01',
    title: 'De la compétence théorique à la preuve vérifiable en production',
    category: 'Compétences',
    readTime: '6 min',
    date: 'Février 2026',
    excerpt: 'Pourquoi le marché technologique mondial délaisse les CV au profit de dépôts audités, d\'architectures scalables et d\'évaluations par les pairs.',
    content: 'Dans un écosystème technologique en mutation rapide, la valeur d\'un profil ne réside plus dans une liste de mots-clés statiques. SkillBridge instaure le principe de la preuve de travail : chaque compétence déclarée doit pouvoir être étayée par un arbitrage technique documenté, un commit de production ou une revue par un mentor reconnu. Cet article détaille les 5 piliers pour structurer son passeport technique.'
  },
  {
    id: 'res-02',
    title: 'Concevoir pour le contexte panafricain : L\'impératif de l\'architecture Offline-First',
    category: 'Technologie',
    readTime: '8 min',
    date: 'Janvier 2026',
    excerpt: 'Gérer les déconnexions intermittentes, la résolution de conflits de données et l\'optimisation drastique de la bande passante.',
    content: 'Bâtir des applications pour le continent africain impose de concevoir la connectivité réseau comme un état exceptionnel et non continu. À travers des cas concrets en AgriTech et Micro-finance, découvrez les modèles CRDTs (Conflict-free Replicated Data Types) et les moteurs locaux synchronisés.'
  },
  {
    id: 'res-03',
    title: 'Le rôle de la transmission intergénérationnelle dans la maturité tech',
    category: 'Mentorat',
    readTime: '5 min',
    date: 'Janvier 2026',
    excerpt: 'Comment 45 minutes d\'échange avec un architecte senior évitent des mois d\'erreurs structurelles.',
    content: 'L\'expérience accumulée sur des systèmes à haute criticité ne se lit pas dans les tutoriels. Le mentorat 1-on-1 sur SkillBridge permet de transférer l\'intuition d\'ingénierie, les choix de gouvernance de données et la sérénité face aux pannes complexes.'
  },
  {
    id: 'res-04',
    title: 'Recruter au-delà des biais géographiques : Guide pour les scale-ups',
    category: 'Entrepreneuriat',
    readTime: '7 min',
    date: 'Décembre 2025',
    excerpt: 'Les meilleures pratiques pour identifier, tester et onboarder des développeurs d\'élite à travers 12 pays africains.',
    content: 'Les frontières ne doivent plus limiter l\'accès aux meilleurs cerveaux. Ce guide propose une grille d\'évaluation objective basée sur des challenges techniques rémunérés et le Skill Passport pour un recrutement transparent et efficace.'
  }
];

export const ResourcesView: React.FC<ResourcesViewProps> = () => {
  const [articles] = useState<ResourceArticle[]>(SAMPLE_ARTICLES);
  const [selectedCategory, setSelectedCategory] = useState<string>('Tous');
  const [activeArticle, setActiveArticle] = useState<ResourceArticle | null>(null);

  const categories = [
    'Tous',
    'Compétences',
    'Technologie',
    'Mentorat',
    'Entrepreneuriat',
    'Conseils carrière',
    'Guides',
    'Opportunités'
  ];

  const filteredArticles = articles.filter((a) => {
    return selectedCategory === 'Tous' || a.category === selectedCategory;
  });

  return (
    <div className="flex-1 w-full bg-[#F5F7F6] text-[#101820]">
      
      {/* Hero */}
      <section className="py-20 sm:py-28 border-b border-[#E2E8E5] bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F5F7F6] border border-[#E2E8E5] text-[#123B5D] text-xs font-mono font-bold uppercase tracking-wider">
            <span>RESSOURCES & PUBLICATIONS ÉDITORIALES</span>
          </div>

          <h1 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#101820] leading-tight">
            Réflexions sur l'ingénierie, <br className="hidden sm:inline" />
            <span className="text-[#59B83E]">le savoir et les compétences.</span>
          </h1>

          <p className="text-stone-600 text-base sm:text-xl font-light leading-relaxed max-w-2xl mx-auto">
            Analyses d'architecture, méthodologies de transmission et guides pratiques rédigés par et pour l'écosystème tech panafricain.
          </p>
        </div>
      </section>

      {/* Magazine Layout */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-2 pb-6 border-b border-[#E2E8E5]">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#123B5D] text-white shadow-xs'
                  : 'bg-white border border-[#E2E8E5] text-[#101820] hover:bg-stone-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Featured Article */}
        {filteredArticles.length > 0 && (
          <div 
            onClick={() => setActiveArticle(filteredArticles[0])}
            className="bg-white border border-[#E2E8E5] rounded-3xl p-8 sm:p-12 hover:border-[#123B5D] transition-all cursor-pointer shadow-xs space-y-6 group"
          >
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-[#59B83E]/10 text-[#59B83E] text-xs font-bold font-mono">
                {filteredArticles[0].category}
              </span>
              <span className="text-xs text-stone-400 font-mono">
                {filteredArticles[0].date} · {filteredArticles[0].readTime} de lecture
              </span>
            </div>

            <h2 className="font-heading text-2xl sm:text-4xl font-extrabold text-[#101820] group-hover:text-[#123B5D] transition-colors leading-snug">
              {filteredArticles[0].title}
            </h2>

            <p className="text-sm sm:text-base text-stone-600 font-light leading-relaxed max-w-3xl">
              {filteredArticles[0].excerpt}
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs font-bold text-[#123B5D]">
              <span>Lire l'article complet</span>
              <ArrowRight className="w-4 h-4 text-[#59B83E] group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        )}

        {/* Secondary Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filteredArticles.slice(1).map((art) => (
            <div
              key={art.id}
              onClick={() => setActiveArticle(art)}
              className="bg-white border border-[#E2E8E5] rounded-3xl p-8 space-y-4 hover:border-[#123B5D] transition-all cursor-pointer shadow-xs flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-stone-400 font-mono">
                  <span className="text-[#59B83E] font-bold">{art.category}</span>
                  <span>{art.readTime}</span>
                </div>

                <h3 className="font-heading font-bold text-lg text-[#101820] group-hover:text-[#123B5D] transition-colors">
                  {art.title}
                </h3>

                <p className="text-xs text-stone-600 font-light leading-relaxed line-clamp-3">
                  {art.excerpt}
                </p>
              </div>

              <div className="pt-4 border-t border-[#E2E8E5] flex items-center justify-between text-xs text-[#123B5D] font-bold">
                <span>Lire l'article</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>

      </section>

      {/* Article Reader Modal */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white border border-[#E2E8E5] rounded-3xl p-6 sm:p-12 max-w-3xl w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto relative">
            
            <button
              type="button"
              onClick={() => setActiveArticle(null)}
              className="absolute top-6 right-6 p-2 rounded-xl bg-[#F5F7F6] text-stone-500 hover:text-[#101820]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-3 border-b border-[#E2E8E5] pb-6">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#59B83E] block">
                {activeArticle.category} · {activeArticle.readTime} DE LECTURE
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#101820] pr-8">
                {activeArticle.title}
              </h2>
              <p className="text-xs text-stone-400 font-mono">Publié en {activeArticle.date} par la rédaction SkillBridge</p>
            </div>

            <div className="space-y-4 text-stone-700 font-light leading-relaxed text-sm sm:text-base">
              <p className="font-medium text-stone-900">{activeArticle.excerpt}</p>
              <p>{activeArticle.content}</p>
            </div>

            <div className="pt-6 border-t border-[#E2E8E5] flex justify-between items-center">
              <span className="font-editorial italic text-stone-500 text-sm">SkillBridge Infrastructure Research</span>
              <button
                type="button"
                onClick={() => setActiveArticle(null)}
                className="px-6 py-2.5 rounded-xl bg-[#123B5D] text-white font-bold text-xs"
              >
                Fermer
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
