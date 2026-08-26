import React from 'react';
import { ViewType } from '../types/platform';
import { ArrowRight } from 'lucide-react';

interface AboutViewProps {
  onNavigate: (view: ViewType) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onNavigate }) => {
  return (
    <div className="flex-1 w-full bg-[#F5F7F6] text-[#101820]">
      
      {/* Hero */}
      <section className="py-20 sm:py-28 border-b border-[#E2E8E5] bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F5F7F6] border border-[#E2E8E5] text-[#123B5D] text-xs font-mono font-bold uppercase tracking-wider">
            <span>À PROPOS DE SKILLBRIDGE</span>
          </div>

          <h1 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#101820] leading-tight">
            Nous construisons les <span className="text-[#59B83E]">ponts</span> qui manquent.
          </h1>

          <p className="text-stone-600 text-base sm:text-xl font-light leading-relaxed max-w-3xl mx-auto">
            SkillBridge n'est pas simplement une plateforme. C'est une vision visant à connecter durablement les personnes, les compétences réelles, les connaissances et les opportunités à travers l'Afrique.
          </p>
        </div>
      </section>

      {/* Core Sections Grid */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* 1. Notre Vision & Notre Mission */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 sm:p-10 rounded-3xl border border-[#E2E8E5] space-y-4 shadow-xs">
            <span className="text-xs font-mono font-bold uppercase text-[#59B83E] tracking-wider block">
              01 / NOTRE VISION
            </span>
            <h3 className="font-heading text-2xl font-bold text-[#101820]">
              Une infrastructure souveraine pour le génie africain
            </h3>
            <p className="text-sm text-stone-600 font-light leading-relaxed">
              Nous envisageons une Afrique où chaque talent, quelle que soit son origine géographique ou son milieu, dispose d'un moyen irréfutable de prouver sa valeur technique et de collaborer avec les meilleures organisations mondiales.
            </p>
          </div>

          <div className="bg-white p-8 sm:p-10 rounded-3xl border border-[#E2E8E5] space-y-4 shadow-xs">
            <span className="text-xs font-mono font-bold uppercase text-[#123B5D] tracking-wider block">
              02 / NOTRE MISSION
            </span>
            <h3 className="font-heading text-2xl font-bold text-[#101820]">
              Relier l'apprentissage à la preuve et à l'opportunité
            </h3>
            <p className="text-sm text-stone-600 font-light leading-relaxed">
              Créer des outils numériques rigoureux, comme le Skill Passport, des challenges de haut niveau et des canaux directs de mentorat pour éliminer les asymétries d'information sur le marché des talents.
            </p>
          </div>
        </div>

        {/* 2. Pourquoi SkillBridge & Notre Approche */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 sm:p-10 rounded-3xl border border-[#E2E8E5] space-y-4 shadow-xs">
            <span className="text-xs font-mono font-bold uppercase text-[#123B5D] tracking-wider block">
              03 / POURQUOI SKILLBRIDGE
            </span>
            <h3 className="font-heading text-2xl font-bold text-[#101820]">
              Dépasser les limites du simple CV
            </h3>
            <p className="text-sm text-stone-600 font-light leading-relaxed">
              Les diplômes et les CV déclaratifs ne reflètent plus la réalité du travail moderne. Ce qui compte, c'est ce que vous êtes capable de concevoir, d'optimiser et de délivrer en production.
            </p>
          </div>

          <div className="bg-white p-8 sm:p-10 rounded-3xl border border-[#E2E8E5] space-y-4 shadow-xs">
            <span className="text-xs font-mono font-bold uppercase text-[#59B83E] tracking-wider block">
              04 / NOTRE APPROCHE
            </span>
            <h3 className="font-heading text-2xl font-bold text-[#101820]">
              L'évaluation par les pairs et la transmission
            </h3>
            <p className="text-sm text-stone-600 font-light leading-relaxed">
              L'excellence ne s'auto-proclame pas : elle se valide par la revue de code, la résolution de problèmes réels et les conseils de praticiens chevronnés.
            </p>
          </div>
        </div>

        {/* 3. L'Afrique de Demain */}
        <div className="bg-[#123B5D] text-white p-10 sm:p-16 rounded-3xl space-y-6">
          <span className="text-xs font-mono font-bold uppercase text-[#C8F169] tracking-widest block">
            05 / L'AFRIQUE DE DEMAIN
          </span>
          <h2 className="font-heading text-2xl sm:text-4xl font-extrabold max-w-2xl leading-tight">
            Le continent est le premier vivier de talents de demain.
          </h2>
          <p className="text-stone-300 text-sm sm:text-base font-light max-w-3xl leading-relaxed">
            D'ici 2035, l'Afrique comptera la population active la plus jeune au monde. Construire dès aujourd'hui les passerelles entre ces capacités et les infrastructures industrielles est notre engagement absolu.
          </p>

          <div className="pt-6 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="font-editorial italic text-xl text-[#C8F169]">
              From skills to proof. From proof to opportunity.
            </p>

            <button
              type="button"
              onClick={() => onNavigate('onboarding')}
              className="px-6 py-3.5 rounded-xl bg-[#59B83E] hover:bg-[#4ea536] text-white font-bold text-xs transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Rejoindre l'infrastructure</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

      </section>

    </div>
  );
};
