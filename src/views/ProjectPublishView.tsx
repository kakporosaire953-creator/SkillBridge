import React from 'react';
import { ViewType } from '../types/platform';
import { FaIcon } from '../components/FaIcon';
import { faArrowLeft, faImage, faSave, faEye, faPaperPlane } from '@fortawesome/free-solid-svg-icons';

export const ProjectPublishView: React.FC<{onNavigate: (view: ViewType) => void}> = ({ onNavigate }) => {
  return (
    <div className="flex-1 w-full min-h-screen bg-[#F5F7F6] py-8 lg:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => onNavigate('dashboard-talent')} className="p-2 rounded-xl border border-[#E2E8E5] bg-white text-stone-500 hover:text-[#101820] transition-colors">
            <FaIcon icon={faArrowLeft} />
          </button>
          <div>
            <h1 className="text-2xl font-heading font-bold text-[#101820]">Publier un projet</h1>
            <p className="text-sm text-stone-500">Partagez vos réalisations avec la communauté</p>
          </div>
        </div>
        
        <div className="bg-white rounded-3xl border border-[#E2E8E5] p-6 sm:p-8 shadow-xs space-y-8">
          
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-[#101820] uppercase tracking-wider">Informations Principales</h3>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-stone-700">Titre du projet *</label>
              <input type="text" placeholder="Ex: Application de gestion de tâches" className="w-full p-3 rounded-xl border border-[#E2E8E5] focus:border-[#59B83E] focus:outline-none" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-stone-700">Image principale *</label>
              <div className="w-full h-48 rounded-xl border-2 border-dashed border-[#E2E8E5] bg-stone-50 flex flex-col items-center justify-center text-stone-400 cursor-pointer hover:bg-stone-100 transition-colors">
                <FaIcon icon={faImage} className="text-2xl mb-2" />
                <span className="text-sm font-medium">Cliquez ou glissez une image</span>
                <span className="text-xs">PNG, JPG jusqu'à 5MB</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-stone-700">Description détaillée *</label>
              <textarea rows={5} placeholder="Expliquez le contexte, les défis et la solution apportée..." className="w-full p-3 rounded-xl border border-[#E2E8E5] focus:border-[#59B83E] focus:outline-none resize-none"></textarea>
            </div>
          </div>

          <div className="space-y-4 pt-6 border-t border-[#E2E8E5]">
            <h3 className="text-sm font-bold text-[#101820] uppercase tracking-wider">Compétences & Rôle</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700">Votre rôle</label>
                <input type="text" placeholder="Ex: Développeur Frontend" className="w-full p-3 rounded-xl border border-[#E2E8E5] focus:border-[#59B83E] focus:outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700">Compétences utilisées</label>
                <input type="text" placeholder="Ex: React, Node.js, Figma" className="w-full p-3 rounded-xl border border-[#E2E8E5] focus:border-[#59B83E] focus:outline-none" />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-6 border-t border-[#E2E8E5]">
            <h3 className="text-sm font-bold text-[#101820] uppercase tracking-wider">Liens (Optionnel)</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700">URL du projet en direct</label>
                <input type="url" placeholder="https://" className="w-full p-3 rounded-xl border border-[#E2E8E5] focus:border-[#59B83E] focus:outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700">Lien GitHub / Figma</label>
                <input type="url" placeholder="https://" className="w-full p-3 rounded-xl border border-[#E2E8E5] focus:border-[#59B83E] focus:outline-none" />
              </div>
            </div>
          </div>

        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <button className="px-6 py-3 rounded-xl text-stone-600 font-bold hover:bg-stone-100 transition-colors flex items-center gap-2">
            <FaIcon icon={faSave} />
            Brouillon
          </button>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none px-6 py-3 rounded-xl border border-[#123B5D] text-[#123B5D] font-bold hover:bg-stone-50 transition-colors flex items-center justify-center gap-2">
              <FaIcon icon={faEye} />
              Aperçu
            </button>
            <button className="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-[#59B83E] text-white font-bold hover:bg-[#4ea834] transition-colors flex items-center justify-center gap-2 shadow-sm">
              <FaIcon icon={faPaperPlane} />
              Publier
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
