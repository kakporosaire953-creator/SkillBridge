import React from 'react';
import { ViewType } from '../types/platform';
import { SkillBridgeLogo } from './SkillBridgeLogo';

interface FooterProps {
  onNavigate: (view: ViewType) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="relative z-10 w-full bg-[#101820] text-white border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 space-y-16">
        
        {/* 4 Main Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          
          {/* Col 1 : Brand & Vision */}
          <div className="lg:col-span-4 space-y-4">
            <div 
              onClick={() => onNavigate('home')}
              className="cursor-pointer inline-block"
            >
              <SkillBridgeLogo isDark={true} withTagline={true} />
            </div>
            <p className="text-xs text-stone-400 font-light leading-relaxed max-w-sm pt-2">
              L'infrastructure numérique reliant les compétences, les talents, l'expérience et les opportunités professionnelles à travers toute l'Afrique.
            </p>
          </div>

          {/* Col 2 : Plateforme */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-heading text-xs font-mono font-bold uppercase tracking-wider text-[#C8F169]">
              Plateforme
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <button type="button" onClick={() => onNavigate('talents')} className="hover:text-white transition-colors cursor-pointer">
                  Talents & Profils
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('mentors')} className="hover:text-white transition-colors cursor-pointer">
                  Réseau de Mentors
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('companies')} className="hover:text-white transition-colors cursor-pointer">
                  Espace Entreprises
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('passport')} className="hover:text-white transition-colors cursor-pointer">
                  Skill Passport
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('challenges')} className="hover:text-white transition-colors cursor-pointer">
                  Challenges & Bounties
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3 : Écosystème */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-heading text-xs font-mono font-bold uppercase tracking-wider text-[#C8F169]">
              Écosystème
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <button type="button" onClick={() => onNavigate('about')} className="hover:text-white transition-colors cursor-pointer">
                  À propos de SkillBridge
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('about')} className="hover:text-white transition-colors cursor-pointer">
                  Notre Vision & Mission
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('resources')} className="hover:text-white transition-colors cursor-pointer">
                  Ressources & Articles
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('home')} className="hover:text-white transition-colors cursor-pointer">
                  Le Modèle du Pont
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4 : Légal & Contact */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="font-heading text-xs font-mono font-bold uppercase tracking-wider text-[#C8F169]">
              Légal & Contact
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <button type="button" onClick={() => onNavigate('contact')} className="hover:text-white transition-colors cursor-pointer">
                  Contactez-nous
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('terms')} className="hover:text-white transition-colors cursor-pointer">
                  Conditions d'Utilisation
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('privacy')} className="hover:text-white transition-colors cursor-pointer">
                  Politique de Confidentialité
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-500 font-mono">
          <p>© 2026 SkillBridge. Tous droits réservés. <button type="button" onClick={() => onNavigate('admin-auth')} className="ml-2 text-stone-700 hover:text-stone-500 transition-colors">DA</button></p>
          <p className="text-stone-400">Conçu pour connecter les compétences à travers l'Afrique.</p>
        </div>

      </div>
    </footer>
  );
};
