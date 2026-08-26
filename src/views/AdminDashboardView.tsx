import React, { useState } from 'react';
import { ViewType } from '../types/platform';
import { FaIcon } from '../components/FaIcon';
import { 
  faShieldHalved, 
  faUsers, 
  faGraduationCap, 
  faBriefcase, 
  faFolderOpen, 
  faChartLine,
  faSignOutAlt,
  faTriangleExclamation
} from '@fortawesome/free-solid-svg-icons';

export const AdminDashboardView: React.FC<{onNavigate: (view: ViewType) => void}> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Vue Globale', icon: faChartLine },
    { id: 'users', label: 'Utilisateurs', icon: faUsers },
    { id: 'learning', label: 'Formations', icon: faGraduationCap },
    { id: 'opportunities', label: 'Opportunités', icon: faBriefcase },
    { id: 'projects', label: 'Projets', icon: faFolderOpen },
    { id: 'moderation', label: 'Modération', icon: faTriangleExclamation },
  ];

  return (
    <div className="flex-1 w-full min-h-screen bg-[#F5F7F6] flex flex-col md:flex-row">
      {/* Sidebar Admin */}
      <div className="w-full md:w-64 bg-[#101820] text-white flex flex-col shrink-0">
        <div className="p-6 border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#59B83E] flex items-center justify-center">
              <FaIcon icon={faShieldHalved} className="text-white" />
            </div>
            <div>
              <div className="font-heading font-bold text-sm leading-tight">Admin Center</div>
              <div className="text-[10px] text-[#59B83E] font-mono tracking-widest uppercase">System Active</div>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors text-left ${
                activeTab === tab.id 
                  ? 'bg-white/10 text-white' 
                  : 'text-stone-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <FaIcon icon={tab.icon} className={activeTab === tab.id ? 'text-[#59B83E]' : 'text-stone-500'} />
              {tab.label}
            </button>
          ))}
        </nav>
        
        <div className="p-4 border-t border-stone-800">
          <button 
            onClick={() => onNavigate('home')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-stone-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <FaIcon icon={faSignOutAlt} className="text-rose-500" />
            Quitter l'Admin
          </button>
        </div>
      </div>

      {/* Main Content Admin */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        <div className="p-8">
          <h1 className="text-2xl font-heading font-bold text-[#101820] mb-8">
            {tabs.find(t => t.id === activeTab)?.label}
          </h1>

          {/* Dummy Dashboard Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl border border-[#E2E8E5] shadow-xs">
              <div className="text-sm font-medium text-stone-500 mb-2">Talents Inscrits</div>
              <div className="text-3xl font-heading font-bold text-[#101820]">0</div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-[#E2E8E5] shadow-xs">
              <div className="text-sm font-medium text-stone-500 mb-2">Mentors Actifs</div>
              <div className="text-3xl font-heading font-bold text-[#101820]">0</div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-[#E2E8E5] shadow-xs">
              <div className="text-sm font-medium text-stone-500 mb-2">Requêtes Serveur</div>
              <div className="text-3xl font-heading font-bold text-[#59B83E]">Sécurisé</div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-[#E2E8E5] p-12 text-center shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-stone-50 border border-stone-100 flex items-center justify-center mx-auto mb-4 text-stone-300 text-2xl">
              <FaIcon icon={faShieldHalved} />
            </div>
            <h3 className="text-lg font-heading font-bold text-[#101820] mb-2">
              Panneau d'administration prêt
            </h3>
            <p className="text-sm text-stone-500 max-w-md mx-auto">
              L'intégration avec le backend (Supabase / Postgres) permettra d'afficher les vraies données utilisateurs ici.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
