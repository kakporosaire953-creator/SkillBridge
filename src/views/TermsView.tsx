import React from 'react';
import { ViewType } from '../types/platform';
import { ArrowLeft } from 'lucide-react';

interface TermsViewProps {
  onNavigate: (view: ViewType) => void;
}

export const TermsView: React.FC<TermsViewProps> = ({ onNavigate }) => {
  return (
    <div className="flex-1 w-full bg-[#F5F7F6] text-[#101820] py-20 sm:py-28">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 bg-white border border-[#E2E8E5] rounded-3xl p-8 sm:p-12 shadow-xs space-y-8">
        
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#123B5D] hover:underline cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Retour à l'accueil</span>
        </button>

        <div className="space-y-2">
          <span className="text-xs font-mono font-bold uppercase text-[#59B83E] tracking-wider block">
            DOCUMENT JURIDIQUE
          </span>
          <h1 className="font-heading text-3xl font-extrabold text-[#101820]">
            Conditions d'Utilisation
          </h1>
          <p className="text-xs text-stone-400 font-mono">Dernière mise à jour : Février 2026</p>
        </div>

        <div className="space-y-6 text-xs sm:text-sm text-stone-700 font-light leading-relaxed">
          <section className="space-y-2">
            <h2 className="font-heading font-bold text-base text-[#123B5D]">1. Objet de la plateforme</h2>
            <p>SkillBridge est une infrastructure numérique dédiée à la mise en relation des compétences professionnelles, des projets, des mentors et des opportunités d'emploi à l'échelle panafricaine.</p>
          </section>

          <section className="space-y-2">
            <h2 className="font-heading font-bold text-base text-[#123B5D]">2. Authenticité des preuves de compétences</h2>
            <p>Les utilisateurs inscrits en qualité de Talents s'engagent à ne soumettre que des travaux, dépôts de code et réalisations authentiques dont ils sont les auteurs légitimes.</p>
          </section>

          <section className="space-y-2">
            <h2 className="font-heading font-bold text-base text-[#123B5D]">3. Rôle du Mentorat</h2>
            <p>Les sessions de mentorat constituent des échanges d'orientation professionnelle et technique bénévoles ou conventionnés selon les modalités définies.</p>
          </section>
        </div>

      </div>
    </div>
  );
};
