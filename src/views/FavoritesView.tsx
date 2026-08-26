import React, { useState } from 'react';
import { ViewType } from '../types/platform';
import { FaIcon } from '../components/FaIcon';
import { faBookmark, faFolderOpen, faGraduationCap, faBriefcase } from '@fortawesome/free-solid-svg-icons';

export const FavoritesView: React.FC<{onNavigate: (view: ViewType) => void}> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'projets' | 'formations' | 'opportunites'>('projets');

  return (
    <div className="flex-1 w-full min-h-screen bg-[#F5F7F6] py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-[#101820]">Favoris</h1>
          <p className="text-sm text-stone-500 mt-1">Retrouvez vos contenus sauvegardés.</p>
        </div>

        <div className="flex border-b border-[#E2E8E5]">
          <button 
            onClick={() => setActiveTab('projets')}
            className={`py-3 px-4 font-medium text-sm transition-colors border-b-2 flex items-center gap-2 ${activeTab === 'projets' ? 'border-[#59B83E] text-[#123B5D]' : 'border-transparent text-stone-500 hover:text-stone-700'}`}
          >
            <FaIcon icon={faFolderOpen} />
            Projets
          </button>
          <button 
            onClick={() => setActiveTab('formations')}
            className={`py-3 px-4 font-medium text-sm transition-colors border-b-2 flex items-center gap-2 ${activeTab === 'formations' ? 'border-[#59B83E] text-[#123B5D]' : 'border-transparent text-stone-500 hover:text-stone-700'}`}
          >
            <FaIcon icon={faGraduationCap} />
            Formations
          </button>
          <button 
            onClick={() => setActiveTab('opportunites')}
            className={`py-3 px-4 font-medium text-sm transition-colors border-b-2 flex items-center gap-2 ${activeTab === 'opportunites' ? 'border-[#59B83E] text-[#123B5D]' : 'border-transparent text-stone-500 hover:text-stone-700'}`}
          >
            <FaIcon icon={faBriefcase} />
            Opportunités
          </button>
        </div>

        <div className="bg-white rounded-3xl border border-[#E2E8E5] p-12 text-center shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-stone-50 border border-stone-100 flex items-center justify-center mx-auto mb-4 text-stone-300 text-2xl">
            <FaIcon icon={faBookmark} />
          </div>
          <h3 className="text-lg font-heading font-bold text-[#101820] mb-2">
            Rien de sauvegardé
          </h3>
          <p className="text-sm text-stone-500 max-w-sm mx-auto">
            Vous n'avez pas encore ajouté de contenu à vos favoris.
          </p>
          <button 
            onClick={() => onNavigate('explorer')}
            className="mt-6 px-6 py-2.5 rounded-xl bg-stone-100 text-stone-600 font-bold text-sm hover:bg-stone-200 transition-colors"
          >
            Explorer le catalogue
          </button>
        </div>

      </div>
    </div>
  );
};
