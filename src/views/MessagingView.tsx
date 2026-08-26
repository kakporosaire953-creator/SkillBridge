import React from 'react';
import { ViewType } from '../types/platform';
import { FaIcon } from '../components/FaIcon';
import { faSearch, faPaperPlane } from '@fortawesome/free-solid-svg-icons';

export const MessagingView: React.FC<{onNavigate: (view: ViewType) => void}> = () => {
  return (
    <div className="flex-1 w-full h-[calc(100vh-80px)] lg:h-screen flex bg-white overflow-hidden">
      {/* Sidebar */}
      <div className="w-full lg:w-80 flex-shrink-0 border-r border-[#E2E8E5] flex flex-col bg-[#F5F7F6]">
        <div className="p-4 border-b border-[#E2E8E5] bg-white">
          <h2 className="text-xl font-heading font-bold text-[#101820] mb-4">Messages</h2>
          <div className="relative">
            <FaIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-sm" />
            <input 
              type="text" 
              placeholder="Rechercher..." 
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#E2E8E5] bg-[#F5F7F6] text-sm focus:outline-none focus:border-[#59B83E]"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {/* Empty state for conversations */}
          <div className="text-center py-10 px-4">
            <p className="text-sm text-stone-500">Aucune conversation pour le moment.</p>
          </div>
        </div>
      </div>
      
      {/* Main Chat Area */}
      <div className="hidden lg:flex flex-1 flex-col bg-white">
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
          <div className="w-16 h-16 rounded-full bg-stone-50 border border-stone-100 flex items-center justify-center mb-4 text-stone-300 text-2xl">
            <FaIcon icon={faPaperPlane} />
          </div>
          <h3 className="text-lg font-heading font-bold text-[#101820]">Vos messages</h3>
          <p className="text-sm text-stone-500 max-w-sm mt-2">
            Sélectionnez une conversation dans le menu de gauche ou commencez un nouvel échange depuis le profil d'un membre.
          </p>
        </div>
      </div>
    </div>
  );
};
