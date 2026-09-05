import React from 'react';
import { ViewType } from '../types/platform';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { UserAvatar } from '../components/UserAvatar';
import { FaIcon } from '../components/FaIcon';
import { 
  faShieldHalved, 
  faCertificate, 
  faArrowRight, 
  faChevronRight, 
  faCircleCheck,
  faFolderOpen,
  faBriefcase
} from '@fortawesome/free-solid-svg-icons';

import { FadeInUp } from '../components/motion/FadeInUp';
import { StaggerContainer } from '../components/motion/StaggerContainer';
import { ScaleOnHover } from '../components/motion/ScaleOnHover';

interface DashboardTalentViewProps {
  onNavigate: (view: ViewType) => void;
}

export const DashboardTalentView: React.FC<DashboardTalentViewProps> = ({ onNavigate }) => {
  const { profile } = useAuth();
  const { t } = useLanguage();

  return (
    <div className="flex-1 w-full min-h-screen bg-[#FAFCFB] pb-24 lg:pb-8">
      {/* Header section */}
      <FadeInUp delay={0.05} yOffset={16}>
        <div className="bg-white border-b border-[#E2E8E5]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
              <UserAvatar profile={profile} size="xl" className="shadow-xs border-4 border-white" />
              <div className="space-y-1">
                <h1 className="text-2xl sm:text-3xl font-heading font-black text-[#101820]">
                  {t('dash.welcome')}, {profile?.first_name || 'Talent'}
                </h1>
                <p className="text-sm text-stone-500 font-medium max-w-lg">
                  {t('dash.subtitle')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </FadeInUp>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Top Banner or Notification */}
        <FadeInUp delay={0.08}>
          <div className="bg-[#123B5D] rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
            <div className="relative z-10 space-y-2 text-center sm:text-left">
              <h2 className="text-xl sm:text-2xl font-heading font-black text-white">
                Skill Intelligence System
              </h2>
              <p className="text-stone-300 text-sm max-w-xl">
                Définissez précisément vos compétences principales, votre niveau d'expertise et les outils que vous maîtrisez pour améliorer votre <strong className="text-white">Profile Strength</strong>.
              </p>
            </div>
            <button 
              onClick={() => onNavigate('skills-manager')}
              className="relative z-10 shrink-0 sb-btn px-6 py-3 rounded-xl bg-[#59B83E] hover:bg-[#4ea536] text-white font-bold text-sm tracking-wide transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Gérer mes compétences</span>
              <FaIcon icon={faArrowRight} />
            </button>
          </div>
        </FadeInUp>

        {/* Empty States Section */}
        <StaggerContainer staggerDelay={0.1} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <ScaleOnHover>
            <div className="bg-white rounded-3xl border border-[#E2E8E5] p-8 text-center space-y-4 shadow-2xs h-full">
              <div className="w-12 h-12 rounded-2xl bg-[#123B5D]/5 text-[#123B5D] flex items-center justify-center mx-auto">
                <FaIcon icon={faFolderOpen} className="text-xl text-[#59B83E]" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-[#101820]">{t('dash.my_projects')}</h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  {t('dash.my_projects_desc')}
                </p>
              </div>
              <button 
                onClick={() => onNavigate('project-publish')}
                className="sb-btn px-5 py-2.5 rounded-xl bg-[#123B5D] hover:bg-[#0A2338] text-white text-xs font-bold inline-flex items-center gap-2 transition-colors shadow-2xs cursor-pointer"
              >
                <span>{t('dash.publish_project')}</span>
                <FaIcon icon={faArrowRight} />
              </button>
            </div>
          </ScaleOnHover>

          <ScaleOnHover>
            <div className="bg-white rounded-3xl border border-[#E2E8E5] p-8 text-center space-y-4 shadow-2xs h-full">
              <div className="w-12 h-12 rounded-2xl bg-[#123B5D]/5 text-[#123B5D] flex items-center justify-center mx-auto">
                <FaIcon icon={faBriefcase} className="text-xl text-[#59B83E]" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-[#101820]">{t('dash.my_opportunities')}</h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  {t('dash.my_opportunities_desc')}
                </p>
              </div>
              <button 
                onClick={() => onNavigate('opportunities')}
                className="sb-btn px-5 py-2.5 rounded-xl bg-[#123B5D] hover:bg-[#0A2338] text-white text-xs font-bold inline-flex items-center gap-2 transition-colors shadow-2xs cursor-pointer"
              >
                <span>{t('dash.explore_jobs')}</span>
                <FaIcon icon={faArrowRight} />
              </button>
            </div>
          </ScaleOnHover>

        </StaggerContainer>

        {/* Quick Hub Grid */}
        <StaggerContainer staggerDelay={0.08} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <ScaleOnHover>
            <div className="bg-white rounded-3xl border border-[#E2E8E5] p-6 shadow-2xs space-y-4 flex flex-col justify-between h-full">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-[#123B5D] text-white flex items-center justify-center shadow-xs">
                  <FaIcon icon={faCertificate} className="text-[#59B83E]" />
                </div>
                <h3 className="font-heading text-base font-bold text-[#101820]">
                  Certifications
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Vos diplômes et titres de compétences souverains, auditables par les recruteurs avec code de validation.
                </p>
              </div>
              <button 
                onClick={() => onNavigate('certificates')}
                className="sb-btn w-full py-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-xs font-bold text-[#123B5D] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Accéder (0)</span>
                <FaIcon icon={faChevronRight} className="text-[10px]" />
              </button>
            </div>
          </ScaleOnHover>

          <ScaleOnHover>
            <div className="bg-white rounded-3xl border border-[#E2E8E5] p-6 shadow-2xs space-y-4 flex flex-col justify-between h-full">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-[#123B5D] text-white flex items-center justify-center shadow-xs">
                  <FaIcon icon={faShieldHalved} className="text-[#59B83E]" />
                </div>
                <h3 className="font-heading text-base font-bold text-[#101820]">
                  Skill Passport
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Votre profil audité par des pairs, regroupant preuves GitHub, démos déployées et validations d'experts.
                </p>
              </div>
              <button 
                onClick={() => onNavigate('passport')}
                className="sb-btn w-full py-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-xs font-bold text-[#123B5D] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>{t('nav.passport')}</span>
                <FaIcon icon={faChevronRight} className="text-[10px]" />
              </button>
            </div>
          </ScaleOnHover>

          <ScaleOnHover>
            <div className="bg-white rounded-3xl border border-[#E2E8E5] p-6 shadow-2xs space-y-4 flex flex-col justify-between h-full">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-[#123B5D] text-white flex items-center justify-center shadow-xs">
                  <FaIcon icon={faCircleCheck} className="text-[#59B83E]" />
                </div>
                <h3 className="font-heading text-base font-bold text-[#101820]">
                  Verification
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Permet à n'importe quel tiers ou recruteur d'attester l'authenticité de vos certifications SkillBridge.
                </p>
              </div>
              <button 
                onClick={() => onNavigate('verify')}
                className="sb-btn w-full py-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-xs font-bold text-[#123B5D] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Test</span>
                <FaIcon icon={faChevronRight} className="text-[10px]" />
              </button>
            </div>
          </ScaleOnHover>

        </StaggerContainer>
      </div>
    </div>
  );
};
