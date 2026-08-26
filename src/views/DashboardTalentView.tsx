import React from 'react';
import { ViewType } from '../types/platform';
import { useAuth } from '../context/AuthContext';
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

interface DashboardTalentViewProps {
  onNavigate: (view: ViewType) => void;
}

export const DashboardTalentView: React.FC<DashboardTalentViewProps> = ({ onNavigate }) => {
  const { profile } = useAuth();

  return (
    <div className="flex-1 w-full min-h-screen bg-[#FAFCFB] pb-24 lg:pb-8">
      {/* Header section */}
      <div className="bg-white border-b border-[#E2E8E5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
            <UserAvatar profile={profile} size="xl" className="shadow-xs border-4 border-white" />
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-heading font-black text-[#101820]">
                Bienvenue, {profile?.first_name || 'Talent'}
              </h1>
              <p className="text-sm text-stone-500 font-medium max-w-lg">
                Votre espace personnel. Retrouvez ici vos statistiques, vos candidatures et les recommandations adaptées à votre profil.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Empty States Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="bg-white rounded-3xl border border-[#E2E8E5] p-8 text-center space-y-4 shadow-2xs">
            <div className="w-12 h-12 rounded-2xl bg-[#123B5D]/5 text-[#123B5D] flex items-center justify-center mx-auto">
              <FaIcon icon={faFolderOpen} className="text-xl text-[#59B83E]" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-[#101820]">Mes Projets</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Vous n'avez pas encore publié de projets pour enrichir votre portefeuille.
              </p>
            </div>
            <button 
              onClick={() => onNavigate('project-publish')}
              className="px-5 py-2.5 rounded-xl bg-[#123B5D] hover:bg-[#0A2338] text-white text-xs font-bold inline-flex items-center gap-2 transition-colors shadow-2xs"
            >
              <span>Publier un projet</span>
              <FaIcon icon={faArrowRight} />
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-[#E2E8E5] p-8 text-center space-y-4 shadow-2xs">
            <div className="w-12 h-12 rounded-2xl bg-[#123B5D]/5 text-[#123B5D] flex items-center justify-center mx-auto">
              <FaIcon icon={faBriefcase} className="text-xl text-[#59B83E]" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-[#101820]">Mes Opportunités</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Vous n'avez aucune candidature en cours actuellement.
              </p>
            </div>
            <button 
              onClick={() => onNavigate('opportunities')}
              className="px-5 py-2.5 rounded-xl bg-[#123B5D] hover:bg-[#0A2338] text-white text-xs font-bold inline-flex items-center gap-2 transition-colors shadow-2xs"
            >
              <span>Explorer les offres</span>
              <FaIcon icon={faArrowRight} />
            </button>
          </div>

        </section>

        {/* Quick Hub Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-white rounded-3xl border border-[#E2E8E5] p-6 shadow-2xs space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-[#123B5D] text-white flex items-center justify-center shadow-xs">
                <FaIcon icon={faCertificate} className="text-[#59B83E]" />
              </div>
              <h3 className="font-heading text-base font-bold text-[#101820]">
                Mes Certifications
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Vos diplômes et titres de compétences souverains, auditables par les recruteurs avec code de validation.
              </p>
            </div>
            <button 
              onClick={() => onNavigate('certificates')}
              className="w-full py-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-xs font-bold text-[#123B5D] flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Accéder aux certificats (0)</span>
              <FaIcon icon={faChevronRight} className="text-[10px]" />
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-[#E2E8E5] p-6 shadow-2xs space-y-4 flex flex-col justify-between">
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
              className="w-full py-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-xs font-bold text-[#123B5D] flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Voir mon Passeport</span>
              <FaIcon icon={faChevronRight} className="text-[10px]" />
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-[#E2E8E5] p-6 shadow-2xs space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-[#123B5D] text-white flex items-center justify-center shadow-xs">
                <FaIcon icon={faCircleCheck} className="text-[#59B83E]" />
              </div>
              <h3 className="font-heading text-base font-bold text-[#101820]">
                Registre de Vérification
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Permet à n'importe quel tiers ou recruteur d'attester l'authenticité de vos certifications SkillBridge.
              </p>
            </div>
            <button 
              onClick={() => onNavigate('verify')}
              className="w-full py-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-xs font-bold text-[#123B5D] flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Tester le vérificateur</span>
              <FaIcon icon={faChevronRight} className="text-[10px]" />
            </button>
          </div>

        </section>
      </div>
    </div>
  );
};
