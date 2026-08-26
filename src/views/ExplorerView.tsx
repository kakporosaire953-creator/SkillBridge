import React, { useState } from 'react';
import { ViewType } from '../types/platform';
import { FaIcon } from '../components/FaIcon';
import { 
  faBriefcase, 
  faFolderOpen, 
  faUsers, 
  faBuilding, 
  faGraduationCap, 
  faSearch, 
  faFilter 
} from '@fortawesome/free-solid-svg-icons';

interface ExplorerViewProps {
  onNavigate: (view: ViewType) => void;
}

export const ExplorerView: React.FC<ExplorerViewProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'opportunites' | 'projets' | 'personnes' | 'entreprises' | 'formations'>('opportunites');

  const tabs = [
    { id: 'opportunites', label: 'Opportunités', icon: faBriefcase },
    { id: 'projets', label: 'Projets', icon: faFolderOpen },
    { id: 'personnes', label: 'Talents & Mentors', icon: faUsers },
    { id: 'entreprises', label: 'Entreprises', icon: faBuilding },
    { id: 'formations', label: 'Formations', icon: faGraduationCap },
  ];

  return (
    <div className="flex-1 w-full min-h-screen bg-[#F5F7F6] pb-24 lg:pb-8">
      {/* Search Header */}
      <div className="bg-white border-b border-[#E2E8E5] sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl sm:text-3xl font-heading font-bold text-[#101820]">Explorer</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <FaIcon icon={faSearch} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
              <input 
                type="text" 
                placeholder="Rechercher des compétences, projets, entreprises..."
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-[#E2E8E5] bg-[#F5F7F6] focus:bg-white focus:outline-none focus:border-[#59B83E] focus:ring-1 focus:ring-[#59B83E] transition-all text-sm"
              />
            </div>
            <button className="p-3 rounded-xl border border-[#E2E8E5] bg-white text-stone-600 hover:text-[#123B5D] hover:bg-stone-50 transition-colors shrink-0">
              <FaIcon icon={faFilter} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto hide-scrollbar border-t border-[#E2E8E5]">
            <div className="flex space-x-6 min-w-max">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-[#59B83E] text-[#123B5D]'
                      : 'border-transparent text-stone-500 hover:text-stone-700'
                  }`}
                >
                  <FaIcon icon={tab.icon} className={activeTab === tab.id ? 'text-[#59B83E]' : 'text-stone-400'} />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area (Empty States) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {activeTab === 'personnes' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div 
              onClick={() => onNavigate('public-profile')}
              className="bg-white p-6 rounded-2xl border border-[#E2E8E5] shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#123B5D] to-[#59B83E] flex items-center justify-center text-white text-xl font-bold font-heading mb-4">
                J
              </div>
              <h3 className="font-bold text-[#101820] text-lg">Jean Dupont</h3>
              <p className="text-sm text-[#123B5D] font-medium mb-1">Développeur Full Stack</p>
              <p className="text-xs text-stone-500 mb-4">Dakar, Sénégal</p>
              <div className="flex flex-wrap gap-2 justify-center">
                <span className="px-2 py-1 bg-stone-100 text-stone-600 text-[10px] font-bold rounded-md">React</span>
                <span className="px-2 py-1 bg-stone-100 text-stone-600 text-[10px] font-bold rounded-md">Node.js</span>
              </div>
            </div>
            <div 
              onClick={() => onNavigate('public-profile')}
              className="bg-white p-6 rounded-2xl border border-[#E2E8E5] shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#59B83E] to-[#123B5D] flex items-center justify-center text-white text-xl font-bold font-heading mb-4">
                A
              </div>
              <h3 className="font-bold text-[#101820] text-lg">Amina Diallo</h3>
              <p className="text-sm text-[#123B5D] font-medium mb-1">UI/UX Designer</p>
              <p className="text-xs text-stone-500 mb-4">Abidjan, Côte d'Ivoire</p>
              <div className="flex flex-wrap gap-2 justify-center">
                <span className="px-2 py-1 bg-stone-100 text-stone-600 text-[10px] font-bold rounded-md">Figma</span>
                <span className="px-2 py-1 bg-stone-100 text-stone-600 text-[10px] font-bold rounded-md">Design System</span>
              </div>
            </div>
          </div>
        ) : (

        <div className="text-center py-20 bg-white rounded-3xl border border-[#E2E8E5] shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-stone-50 border border-stone-100 flex items-center justify-center mx-auto mb-4 text-stone-400 text-2xl">
            <FaIcon icon={tabs.find(t => t.id === activeTab)?.icon || faSearch} />
          </div>
          <h3 className="text-lg font-heading font-bold text-[#101820] mb-2">
            Aucun contenu trouvé
          </h3>
          <p className="text-sm text-stone-500 max-w-sm mx-auto">
            Il n'y a pas encore de données disponibles pour cette section. Revenez bientôt !
          </p>
          <button 
            onClick={() => onNavigate('dashboard-talent')}
            className="mt-6 px-6 py-2.5 rounded-xl bg-stone-100 text-stone-600 font-bold text-sm hover:bg-stone-200 transition-colors"
          >
            Retour au Dashboard
          </button>
        </div>
        )}
      </div>
    </div>
  );
};
