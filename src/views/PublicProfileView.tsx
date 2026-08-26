import React from 'react';
import { ViewType } from '../types/platform';
import { FaIcon } from '../components/FaIcon';
import { 
  faArrowLeft, 
  faCheckCircle, 
  faMapMarkerAlt, 
  faFolderOpen, 
  faCode, 
  faCertificate,
  faEnvelope
} from '@fortawesome/free-solid-svg-icons';

interface PublicProfileViewProps {
  onNavigate: (view: ViewType) => void;
}

export const PublicProfileView: React.FC<PublicProfileViewProps> = ({ onNavigate }) => {
  return (
    <div className="flex-1 w-full min-h-screen bg-[#F5F7F6] py-8 lg:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Back navigation */}
        <button 
          onClick={() => onNavigate('explorer')} 
          className="p-2 mb-6 rounded-xl border border-[#E2E8E5] bg-white text-stone-500 hover:text-[#101820] transition-colors inline-flex items-center gap-2"
        >
          <FaIcon icon={faArrowLeft} />
          <span className="text-sm font-medium">Retour à l'explorateur</span>
        </button>

        {/* Profile Header */}
        <div className="bg-white rounded-3xl border border-[#E2E8E5] p-6 sm:p-10 shadow-xs mb-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#123B5D] to-[#59B83E] flex items-center justify-center text-white text-3xl font-bold font-heading shadow-md shrink-0">
              J
            </div>
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
                <h1 className="text-2xl sm:text-3xl font-heading font-bold text-[#101820]">Jean Dupont</h1>
                <span className="px-3 py-1 rounded-full bg-[#59B83E]/10 text-[#59B83E] text-xs font-bold flex items-center justify-center gap-1.5 w-max mx-auto sm:mx-0">
                  <FaIcon icon={faCheckCircle} /> Identité Vérifiée
                </span>
              </div>
              <p className="text-[#123B5D] font-medium text-lg mb-2">Développeur Full Stack Senior</p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-sm text-stone-500 mb-6">
                <span className="flex items-center gap-1.5"><FaIcon icon={faMapMarkerAlt} /> Dakar, Sénégal</span>
              </div>
              
              <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
                <button 
                  onClick={() => onNavigate('messaging')}
                  className="px-6 py-2.5 rounded-xl bg-[#123B5D] text-white font-bold text-sm hover:bg-[#0A2338] transition-colors flex items-center gap-2"
                >
                  <FaIcon icon={faEnvelope} /> Contacter
                </button>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-[#E2E8E5]">
            <h3 className="text-sm font-bold text-[#101820] uppercase tracking-wider mb-4">À propos</h3>
            <p className="text-stone-600 text-sm leading-relaxed">
              Passionné par la création de solutions numériques scalables et accessibles. Spécialisé en React, Node.js et architecture cloud. J'aide également les développeurs juniors à monter en compétence via le mentorat.
            </p>
          </div>
        </div>

        {/* Content Tabs area - Displaying standard layout */}
        <div className="space-y-6">
          <h2 className="text-xl font-heading font-bold text-[#101820]">Projets Récents</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-[#E2E8E5] p-5 shadow-2xs hover:shadow-md transition-shadow group">
              <div className="w-12 h-12 rounded-xl bg-[#123B5D]/5 text-[#123B5D] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FaIcon icon={faFolderOpen} className="text-lg" />
              </div>
              <h3 className="font-bold text-[#101820] mb-2">E-commerce Plateforme</h3>
              <p className="text-sm text-stone-500 mb-4 line-clamp-2">Refonte complète d'une plateforme e-commerce africaine avec paiement mobile intégré.</p>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-stone-100 text-stone-600 text-[10px] font-bold rounded-md">React</span>
                <span className="px-2 py-1 bg-stone-100 text-stone-600 text-[10px] font-bold rounded-md">Node.js</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-[#E2E8E5] p-5 shadow-2xs hover:shadow-md transition-shadow group">
              <div className="w-12 h-12 rounded-xl bg-[#59B83E]/10 text-[#59B83E] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FaIcon icon={faCode} className="text-lg" />
              </div>
              <h3 className="font-bold text-[#101820] mb-2">API Open Data</h3>
              <p className="text-sm text-stone-500 mb-4 line-clamp-2">Développement d'une API publique d'agrégation de données météorologiques.</p>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-stone-100 text-stone-600 text-[10px] font-bold rounded-md">Python</span>
                <span className="px-2 py-1 bg-stone-100 text-stone-600 text-[10px] font-bold rounded-md">PostgreSQL</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-6">
          <h2 className="text-xl font-heading font-bold text-[#101820]">Certifications & Badge</h2>
          <div className="bg-white rounded-2xl border border-[#E2E8E5] p-5 shadow-2xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#123B5D] text-[#59B83E] flex items-center justify-center shrink-0">
              <FaIcon icon={faCertificate} className="text-xl" />
            </div>
            <div>
              <h3 className="font-bold text-[#101820]">SkillBridge Verified Mentor</h3>
              <p className="text-xs text-stone-500">Délivré en Mars 2026</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
