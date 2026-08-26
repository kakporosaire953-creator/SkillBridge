import React, { useState } from 'react';
import { ViewType } from '../types/platform';
import { useAuth } from '../context/AuthContext';
import { AppSidebar } from './AppSidebar';
import { NotificationsModal } from './NotificationsModal';
import { ProfileModal } from './ProfileModal';
import { UserAvatar } from './UserAvatar';
import { FaIcon } from './FaIcon';
import { 
  faHouse, 
  faGraduationCap, 
  faCompass, 
  faShieldHalved, 
  
  faBell,
  faComments
} from '@fortawesome/free-solid-svg-icons';

import { SkillBridgeLogo } from './SkillBridgeLogo';

interface AppShellProps {
  children: React.ReactNode;
  currentView: ViewType;
  onNavigate: (view: ViewType) => void;
}

export const AppShell: React.FC<AppShellProps> = ({
  children,
  currentView,
  onNavigate
}) => {
  const { profile } = useAuth();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const isViewActive = (navKey: string): boolean => {
    switch (navKey) {
      case 'dashboard':
        return currentView === 'dashboard-talent' || currentView === 'dashboard-mentor' || currentView === 'dashboard-company';
      case 'learn':
        return currentView === 'learn' || currentView === 'learn-detail' || currentView === 'lesson-player' || currentView === 'mentor-studio';
      case 'certificates':
        return currentView === 'certificates';
      case 'explore':
        return currentView === 'talents' || currentView === 'challenges' || currentView === 'mentors' || currentView === 'companies';
      case 'passport':
        return currentView === 'passport';
      default:
        return false;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F5F7F6] text-[#101820] antialiased">
      {/* Desktop Sidebar */}
      <AppSidebar
        currentView={currentView}
        onNavigate={onNavigate}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        unreadNotificationsCount={2}
      />

      {/* Main View Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-0">
        {/* Mobile Header Bar */}
        <header className="lg:hidden sticky top-0 z-40 bg-[#FAFCFB]/95 backdrop-blur-md border-b border-[#E2E8E5] px-4 py-3 flex items-center justify-between">
          <button
            type="button"
            onClick={() => onNavigate('dashboard-talent')}
            className="flex items-center gap-2 cursor-pointer"
          >
            <SkillBridgeLogo size="sm" isDark={false} />
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsNotificationsOpen(true)}
              className="relative p-2 rounded-xl text-stone-600 hover:bg-stone-100 transition-colors cursor-pointer"
              aria-label="Notifications"
            >
              <FaIcon icon={faBell} className="text-xs" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#59B83E] sb-pulse-dot" />
            </button>

            <button
              type="button"
              onClick={() => setIsProfileModalOpen(true)}
              className="p-1 rounded-xl hover:ring-2 hover:ring-[#123B5D]/20 transition-all cursor-pointer"
              aria-label="Mon Profil"
            >
              <UserAvatar profile={profile} size="xs" />
            </button>
          </div>
        </header>

        {/* Dynamic View Content */}
        <main className="flex-1">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E2E8E5] px-3 py-2 flex items-center justify-around shadow-lg">
        <button
          type="button"
          onClick={() => onNavigate('dashboard-talent')}
          className={`flex flex-col items-center gap-1 p-1 rounded-xl text-[10px] font-medium transition-colors cursor-pointer ${
            isViewActive('dashboard') ? 'text-[#123B5D] font-bold' : 'text-stone-500'
          }`}
        >
          <div className={`p-1.5 rounded-lg ${isViewActive('dashboard') ? 'bg-[#123B5D] text-white shadow-2xs' : 'bg-transparent'}`}>
            <FaIcon icon={faHouse} className="text-xs" />
          </div>
          <span>Accueil</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('explorer')}
          className={`flex flex-col items-center gap-1 p-1 rounded-xl text-[10px] font-medium transition-colors cursor-pointer ${
            isViewActive('explore') ? 'text-[#123B5D] font-bold' : 'text-stone-500'
          }`}
        >
          <div className={`p-1.5 rounded-lg ${isViewActive('explore') ? 'bg-[#123B5D] text-white shadow-2xs' : 'bg-transparent'}`}>
            <FaIcon icon={faCompass} className="text-xs" />
          </div>
          <span>Explorer</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('messaging')}
          className={`flex flex-col items-center gap-1 p-1 rounded-xl text-[10px] font-medium transition-colors cursor-pointer ${
            isViewActive('messaging') ? 'text-[#123B5D] font-bold' : 'text-stone-500'
          }`}
        >
          <div className={`p-1.5 rounded-lg ${isViewActive('messaging') ? 'bg-[#123B5D] text-white shadow-2xs' : 'bg-transparent'}`}>
            <FaIcon icon={faComments} className="text-xs" />
          </div>
          <span>Messages</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('learn')}
          className={`flex flex-col items-center gap-1 p-1 rounded-xl text-[10px] font-medium transition-colors cursor-pointer ${
            isViewActive('learn') ? 'text-[#123B5D] font-bold' : 'text-stone-500'
          }`}
        >
          <div className={`p-1.5 rounded-lg ${isViewActive('learn') ? 'bg-[#123B5D] text-white shadow-2xs' : 'bg-transparent'}`}>
            <FaIcon icon={faGraduationCap} className="text-xs" />
          </div>
          <span>Apprendre</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('passport')}
          className={`flex flex-col items-center gap-1 p-1 rounded-xl text-[10px] font-medium transition-colors cursor-pointer ${
            isViewActive('passport') ? 'text-[#123B5D] font-bold' : 'text-stone-500'
          }`}
        >
          <div className={`p-1.5 rounded-lg ${isViewActive('passport') ? 'bg-[#123B5D] text-[#59B83E] shadow-2xs' : 'bg-transparent'}`}>
            <FaIcon icon={faShieldHalved} className="text-xs" />
          </div>
          <span>Passeport</span>
        </button>
      </nav>

      {/* Modals */}
      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onNavigate={onNavigate}
      />

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </div>
  );
};
