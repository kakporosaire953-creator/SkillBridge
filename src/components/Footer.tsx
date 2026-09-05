import React from 'react';
import { ViewType } from '../types/platform';
import { SkillBridgeLogo } from './SkillBridgeLogo';
import { useLanguage } from '../context/LanguageContext';

interface FooterProps {
  onNavigate: (view: ViewType) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { t } = useLanguage();

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
              {t('footer.desc')}
            </p>
          </div>

          {/* Col 2 : Plateforme */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-heading text-xs font-mono font-bold uppercase tracking-wider text-[#C8F169]">
              {t('footer.platform')}
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <button type="button" onClick={() => onNavigate('talents')} className="hover:text-white transition-colors cursor-pointer">
                  {t('nav.talents')}
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('mentors')} className="hover:text-white transition-colors cursor-pointer">
                  {t('nav.mentors')}
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('companies')} className="hover:text-white transition-colors cursor-pointer">
                  {t('nav.companies')}
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('passport')} className="hover:text-white transition-colors cursor-pointer">
                  {t('nav.passport')}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3 : Écosystème */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-heading text-xs font-mono font-bold uppercase tracking-wider text-[#C8F169]">
              {t('footer.community')}
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <button type="button" onClick={() => onNavigate('about')} className="hover:text-white transition-colors cursor-pointer">
                  SkillBridge
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('resources')} className="hover:text-white transition-colors cursor-pointer">
                  {t('nav.resources')}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4 : Légal & Contact */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="font-heading text-xs font-mono font-bold uppercase tracking-wider text-[#C8F169]">
              {t('footer.legal')}
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <button type="button" onClick={() => onNavigate('terms')} className="hover:text-white transition-colors cursor-pointer">
                  Terms
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('privacy')} className="hover:text-white transition-colors cursor-pointer">
                  Privacy
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-500 font-mono">
          <p>© 2026 SkillBridge. {t('footer.rights')} <button type="button" onClick={() => onNavigate('admin-auth')} className="ml-2 text-stone-700 hover:text-stone-500 transition-colors">DA</button></p>
        </div>

      </div>
    </footer>
  );
};
