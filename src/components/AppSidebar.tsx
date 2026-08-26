import React from 'react';
import { ViewType } from '../types/platform';
import { useAuth } from '../context/AuthContext';
import { useLearning } from '../context/LearningContext';
import { UserAvatar } from './UserAvatar';
import { FaIcon } from './FaIcon';
import { SkillBridgeLogo } from './SkillBridgeLogo';
import { 
  faHouse, 
  faGraduationCap, 
  faCompass, 
  faShieldHalved, 
  faCertificate, 
  faBell, 
  faArrowRightFromBracket, 
  faGear, 
  faAward,
  faChevronRight,
  faRetweet,
  faComments,
  faFolderOpen,
  faBriefcase,
  faBookmark
} from '@fortawesome/free-solid-svg-icons';

interface AppSidebarProps {
  currentView: ViewType;
  onNavigate: (view: ViewType) => void;
  onOpenNotifications: () => void;
  onOpenProfileModal: () => void;
  unreadNotificationsCount?: number;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  currentView,
  onNavigate,
  onOpenNotifications,
  onOpenProfileModal,
  unreadNotificationsCount = 0
}) => {
  const { user, profile, signOut } = useAuth();
  const { userCertificates } = useLearning();

  const isViewActive = (navKey: string): boolean => {
    switch (navKey) {
      case 'dashboard':
        return currentView === 'dashboard-talent' || currentView === 'dashboard-mentor' || currentView === 'dashboard-company';
      case 'learn':
        return currentView === 'learn' || currentView === 'learn-detail' || currentView === 'lesson-player' || currentView === 'mentor-studio';
      case 'explore':
        return currentView === 'talents' || currentView === 'challenges' || currentView === 'mentors' || currentView === 'companies';
      case 'passport':
        return currentView === 'passport';
      case 'certificates':
        return currentView === 'certificates';
      default:
        return false;
    }
  };

  const navItems = [
    {
      key: 'dashboard',
      label: 'Accueil',
      view: 'dashboard-talent' as ViewType,
      icon: faHouse,
      active: isViewActive('dashboard')
    },
    {
      key: 'explore',
      label: 'Explorer',
      view: 'explorer' as ViewType,
      icon: faCompass,
      active: isViewActive('explore')
    },
    {
      key: 'skill-exchange',
      label: 'Échanges',
      view: 'skill-exchange' as ViewType,
      icon: faRetweet,
      active: isViewActive('skill-exchange')
    },
    {
      key: 'messaging',
      label: 'Messages',
      view: 'messaging' as ViewType,
      icon: faComments,
      active: isViewActive('messaging')
    },
    {
      key: 'learn',
      label: 'Apprendre',
      view: 'learn' as ViewType,
      icon: faGraduationCap,
      active: isViewActive('learn')
    },
    {
      key: 'projects',
      label: 'Projets',
      view: 'project-publish' as ViewType,
      icon: faFolderOpen,
      active: isViewActive('projects')
    },
    {
      key: 'opportunities',
      label: 'Opportunités',
      view: 'opportunities' as ViewType,
      icon: faBriefcase,
      active: isViewActive('opportunities')
    },
    {
      key: 'passport',
      label: 'Skill Passport',
      view: 'passport' as ViewType,
      icon: faShieldHalved,
      active: isViewActive('passport'),
      highlight: true
    },
    {
      key: 'certificates',
      label: 'Certifications',
      view: 'certificates' as ViewType,
      icon: faCertificate,
      active: isViewActive('certificates'),
      count: userCertificates.length
    },
    {
      key: 'favorites',
      label: 'Favoris',
      view: 'favorites' as ViewType,
      icon: faBookmark,
      active: isViewActive('favorites')
    }
  ];

  const displayName = profile?.first_name || profile?.last_name
    ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim()
    : user?.email?.split('@')[0] || 'Mon Compte';

  const userRole = profile?.account_type === 'mentor'
    ? 'Mentor & Formateur'
    : profile?.account_type === 'company'
    ? 'Entreprise Partenaire'
    : 'Talent Souverain';

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen sticky top-0 bg-[#FAFCFB] border-r border-[#E2E8E5] shrink-0 z-30 select-none">
      {/* Top Brand Area */}
      <div className="p-6 border-b border-[#E2E8E5]/70 flex items-center justify-between">
        <button
          type="button"
          onClick={() => onNavigate('dashboard-talent')}
          className="flex items-center group text-left cursor-pointer"
        >
          <SkillBridgeLogo size="sm" isDark={false} />
        </button>

        {/* Notifications Quick Trigger */}
        <button
          type="button"
          onClick={onOpenNotifications}
          className="relative p-2 rounded-xl text-stone-500 hover:text-[#123B5D] hover:bg-stone-100 transition-colors cursor-pointer"
          title="Notifications"
          aria-label="Notifications"
        >
          <FaIcon icon={faBell} />
          {unreadNotificationsCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#59B83E] ring-2 ring-white sb-pulse-dot" />
          )}
        </button>
      </div>

      {/* Main Navigation Menu */}
      <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-mono font-bold uppercase tracking-wider text-stone-400">
          Navigation
        </div>

        {navItems.map((item) => {
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onNavigate(item.view)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-medium transition-all group cursor-pointer hover:translate-x-0.5 ${
                item.active
                  ? 'bg-white text-[#123B5D] shadow-xs border border-[#E2E8E5] font-semibold'
                  : 'text-stone-600 hover:text-[#101820] hover:bg-white/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-1.5 rounded-xl transition-colors ${
                  item.active 
                    ? 'bg-[#123B5D] text-white shadow-2xs' 
                    : 'bg-stone-100 text-stone-500 group-hover:text-[#123B5D] group-hover:bg-stone-200/80'
                }`}>
                  <FaIcon icon={item.icon} className="text-xs" />
                </div>
                <span>{item.label}</span>
              </div>

              {item.highlight && (
                <span className="px-2 py-0.5 rounded-full bg-[#59B83E]/10 text-[#59B83E] text-[10px] font-mono font-bold">
                  Souverain
                </span>
              )}

              {item.count !== undefined && item.count > 0 && (
                <span className="px-1.5 py-0.5 rounded-md bg-stone-100 text-stone-600 text-[10px] font-mono font-bold">
                  {item.count}
                </span>
              )}
            </button>
          );
        })}

        {/* Separator */}
        <div className="pt-6 pb-2 px-3 text-[10px] font-mono font-bold uppercase tracking-wider text-stone-400">
          Services
        </div>

        <button
          type="button"
          onClick={() => onNavigate('challenges')}
          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-medium transition-all group cursor-pointer ${
            currentView === 'challenges'
              ? 'bg-white text-[#123B5D] shadow-xs border border-[#E2E8E5]'
              : 'text-stone-600 hover:text-[#101820] hover:bg-white/60'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-xl bg-stone-100 text-stone-500 group-hover:text-[#123B5D]">
              <FaIcon icon={faAward} className="text-xs" />
            </div>
            <span>Défis & Preuves</span>
          </div>
          <FaIcon icon={faChevronRight} className="text-stone-400 text-[10px] opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>

        <button
          type="button"
          onClick={() => onNavigate('verify')}
          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-medium transition-all group cursor-pointer ${
            currentView === 'verify'
              ? 'bg-white text-[#123B5D] shadow-xs border border-[#E2E8E5]'
              : 'text-stone-600 hover:text-[#101820] hover:bg-white/60'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-xl bg-stone-100 text-stone-500 group-hover:text-[#123B5D]">
              <FaIcon icon={faShieldHalved} className="text-[#59B83E] text-xs" />
            </div>
            <span>Registre de Vérification</span>
          </div>
          <FaIcon icon={faChevronRight} className="text-stone-400 text-[10px] opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
      </nav>

      {/* Bottom User Area */}
      <div className="p-3 m-3 rounded-2xl bg-white border border-[#E2E8E5] shadow-xs space-y-3">
        <div 
          onClick={onOpenProfileModal}
          className="flex items-center gap-3 cursor-pointer p-1.5 rounded-xl hover:bg-stone-50 transition-colors"
          title="Modifier mon profil"
        >
          <UserAvatar profile={profile} size="sm" showBorder />
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold text-[#101820] truncate">
              {displayName}
            </div>
            <div className="text-[10px] text-stone-400 truncate">
              {userRole}
            </div>
          </div>
        </div>

        {/* Quick Action buttons */}
        <div className="grid grid-cols-2 gap-1.5 pt-1 border-t border-stone-100">
          <button
            type="button"
            onClick={onOpenProfileModal}
            className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl text-[11px] font-medium text-stone-600 hover:text-[#123B5D] hover:bg-stone-50 transition-colors cursor-pointer"
          >
            <FaIcon icon={faGear} className="text-stone-400 text-[11px]" />
            <span>Profil</span>
          </button>

          <button
            type="button"
            onClick={() => signOut()}
            className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl text-[11px] font-medium text-stone-600 hover:text-rose-600 hover:bg-rose-50/50 transition-colors cursor-pointer"
            title="Se déconnecter"
          >
            <FaIcon icon={faArrowRightFromBracket} className="text-stone-400 text-[11px]" />
            <span>Quitter</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
