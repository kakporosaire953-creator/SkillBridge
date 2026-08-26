import React, { useEffect, useState } from 'react';
import { ViewType, SkillPassportData } from '../types/platform';
import { SkillPassport } from '../components/SkillPassport';
import { ShieldCheck, ArrowLeft } from 'lucide-react';
import { SkillBridgeLogo } from '../components/SkillBridgeLogo';

interface PublicPassportVerificationViewProps {
  onNavigate: (view: ViewType) => void;
  passportId?: string;
}

export const PublicPassportVerificationView: React.FC<PublicPassportVerificationViewProps> = ({ 
  onNavigate, 
  passportId 
}) => {
  const [isValidating, setIsValidating] = useState(true);
  
  // Simulate public user data (in a real app, this is fetched via passportId)
  const [publicData, setPublicData] = useState<{user: any, passport: SkillPassportData} | null>(null);

  useEffect(() => {
    // Simulate backend fetch
    setTimeout(() => {
      setPublicData({
        user: {
          first_name: 'KOFFI',
          last_name: 'DAVID',
          avatar_url: '',
          headline: 'DÉVELOPPEUR FULL STACK',
          role: 'talent',
          location: 'COTONOU',
          country: 'BÉNIN',
          created_at: '2024-01-01T00:00:00Z'
        },
        passport: {
          passportId: passportId || 'SB-24-08-7F3A9C',
          userId: 'mock-id',
          status: 'ACTIVE',
          issuedAt: '2024-04-20T00:00:00Z',
          expiresAt: '2026-04-20T00:00:00Z',
          publicVisibility: true,
          skills: [
            { name: 'DÉVELOPPEMENT WEB', level: 'AVANCÉ', status: 'VÉRIFIÉ' },
            { name: 'JAVASCRIPT', level: 'AVANCÉ', status: 'VÉRIFIÉ' },
            { name: 'REACT.JS', level: 'AVANCÉ', status: 'VÉRIFIÉ' },
            { name: 'NODE.JS', level: 'INTERMÉDIAIRE', status: 'VÉRIFIÉ' },
            { name: 'BASES DE DONNÉES', level: 'AVANCÉ', status: 'VÉRIFIÉ' },
            { name: 'CLOUD (AWS)', level: 'INTERMÉDIAIRE', status: 'VÉRIFIÉ' }
          ],
          metrics: {
            projects: 8,
            challenges: 5,
            evaluations: 4,
            validations: 3,
            certifications: 2
          }
        }
      });
      setIsValidating(false);
    }, 1500);
  }, [passportId]);

  if (isValidating) {
    return (
      <div className="flex-1 w-full min-h-screen bg-[#F5F7F6] flex flex-col items-center justify-center space-y-6">
        <SkillBridgeLogo isDark={false} withTagline={false} />
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-4 border-[#E2E8E5] border-t-[#59B83E] animate-spin" />
          <p className="text-sm font-bold text-[#123B5D] animate-pulse uppercase tracking-widest">
            Vérification cryptographique...
          </p>
        </div>
      </div>
    );
  }

  if (!publicData) {
    return (
      <div className="flex-1 w-full min-h-screen bg-[#F5F7F6] flex flex-col items-center justify-center">
        <p className="text-xl font-bold text-rose-600">PASSPORT NOT FOUND</p>
        <button onClick={() => onNavigate('home')} className="mt-4 text-[#123B5D] underline">Retour à l'accueil</button>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full min-h-screen bg-[#FAFCFB] pb-24">
      {/* Public Verification Header */}
      <div className="bg-[#0A192F] text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center space-y-4">
          <SkillBridgeLogo isDark={true} withTagline={false} />
          <div className="flex items-center gap-2 px-4 py-2 bg-[#59B83E]/20 text-[#59B83E] rounded-full">
            <ShieldCheck className="w-5 h-5" />
            <span className="text-xs font-bold tracking-widest uppercase">Verified by SkillBridge</span>
          </div>
          <p className="text-xs text-stone-400 max-w-md">
            Ce Skill Passport est une certification officielle numérique attestant des compétences et de l'expérience de ce profil sur la plateforme SkillBridge.
          </p>
        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center">
        <SkillPassport user={publicData.user} passport={publicData.passport} />
        
        <div className="mt-12 text-center">
          <button 
            onClick={() => onNavigate('home')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-[#E2E8E5] text-[#123B5D] font-bold text-xs hover:bg-stone-50 transition-colors shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à l'accueil
          </button>
        </div>
      </div>
    </div>
  );
};
