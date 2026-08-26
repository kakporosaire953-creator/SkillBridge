import React, { useState } from 'react';
import { ViewType } from '../types/platform';
import { FaIcon } from '../components/FaIcon';
import { faRetweet, faPlus } from '@fortawesome/free-solid-svg-icons';

export const SkillExchangeView: React.FC<{onNavigate: (view: ViewType) => void}> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'suggestions' | 'sent' | 'received'>('suggestions');

  return (
    <div className="flex-1 w-full min-h-screen bg-[#F5F7F6] py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-heading font-bold text-[#101820]">Skill Exchange</h1>
            <p className="text-sm text-stone-500 mt-1">Partagez votre expertise et apprenez des autres.</p>
          </div>
          <button className="px-5 py-2.5 rounded-xl bg-[#123B5D] text-white text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#0A2338] transition-colors">
            <FaIcon icon={faPlus} />
            Nouvelle demande
          </button>
        </div>

        <div className="flex border-b border-[#E2E8E5]">
          <button 
            onClick={() => setActiveTab('suggestions')}
            className={`py-3 px-4 font-medium text-sm transition-colors border-b-2 ${activeTab === 'suggestions' ? 'border-[#59B83E] text-[#123B5D]' : 'border-transparent text-stone-500 hover:text-stone-700'}`}
          >
            Suggestions de Match
          </button>
          <button 
            onClick={() => setActiveTab('sent')}
            className={`py-3 px-4 font-medium text-sm transition-colors border-b-2 ${activeTab === 'sent' ? 'border-[#59B83E] text-[#123B5D]' : 'border-transparent text-stone-500 hover:text-stone-700'}`}
          >
            Demandes envoyées
          </button>
          <button 
            onClick={() => setActiveTab('received')}
            className={`py-3 px-4 font-medium text-sm transition-colors border-b-2 ${activeTab === 'received' ? 'border-[#59B83E] text-[#123B5D]' : 'border-transparent text-stone-500 hover:text-stone-700'}`}
          >
            Demandes reçues
          </button>
        </div>

        <div className="bg-white rounded-3xl border border-[#E2E8E5] p-12 text-center shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-stone-50 border border-stone-100 flex items-center justify-center mx-auto mb-4 text-[#123B5D] text-2xl">
            <FaIcon icon={faRetweet} />
          </div>
          <h3 className="text-lg font-heading font-bold text-[#101820] mb-2">
            Complétez votre profil
          </h3>
          <p className="text-sm text-stone-500 max-w-md mx-auto">
            Pour recevoir des suggestions d'échange pertinentes, renseignez les compétences que vous maîtrisez et celles que vous souhaitez apprendre.
          </p>
          <button 
            onClick={() => onNavigate('dashboard-talent')}
            className="mt-6 px-6 py-2.5 rounded-xl bg-stone-100 text-stone-600 font-bold text-sm hover:bg-stone-200 transition-colors"
          >
            Mettre à jour mes compétences
          </button>
        </div>

      </div>
    </div>
  );
};
