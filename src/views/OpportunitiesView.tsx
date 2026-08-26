import React from 'react';
import { ViewType } from '../types/platform';
import { FaIcon } from '../components/FaIcon';
import { faBriefcase, faSearch, faFilter } from '@fortawesome/free-solid-svg-icons';

export const OpportunitiesView: React.FC<{onNavigate: (view: ViewType) => void}> = () => {
  return (
    <div className="flex-1 w-full min-h-screen bg-[#F5F7F6] pb-24 lg:pb-8">
      <div className="bg-white border-b border-[#E2E8E5] sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-heading font-bold text-[#101820]">Opportunités</h1>
              <p className="text-sm text-stone-500 mt-1">Missions, emplois et projets collaboratifs.</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <FaIcon icon={faSearch} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
              <input 
                type="text" 
                placeholder="Rechercher par poste, mot-clé ou entreprise..."
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-[#E2E8E5] bg-[#F5F7F6] focus:bg-white focus:outline-none focus:border-[#59B83E] transition-all text-sm"
              />
            </div>
            <button className="px-4 py-3 rounded-xl border border-[#E2E8E5] bg-white text-stone-600 hover:text-[#123B5D] hover:bg-stone-50 transition-colors shrink-0 flex items-center gap-2 text-sm font-medium">
              <FaIcon icon={faFilter} />
              <span className="hidden sm:inline">Filtres</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center py-20 bg-white rounded-3xl border border-[#E2E8E5] shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-stone-50 border border-stone-100 flex items-center justify-center mx-auto mb-4 text-[#123B5D] text-2xl">
            <FaIcon icon={faBriefcase} />
          </div>
          <h3 className="text-lg font-heading font-bold text-[#101820] mb-2">
            Aucune opportunité
          </h3>
          <p className="text-sm text-stone-500 max-w-sm mx-auto">
            Les entreprises publieront bientôt leurs offres et missions ici.
          </p>
        </div>
      </div>
    </div>
  );
};
