import React, { useState } from 'react';
import { ViewType, UserRoleChoice } from '../types/platform';
import { useAuth } from '../context/AuthContext';
import { 
  ArrowRight, 
  CheckCircle2, 
  User, 
  Compass, 
  Building, 
  ArrowLeft
} from 'lucide-react';

interface OnboardingViewProps {
  onNavigate: (view: ViewType) => void;
}

export const OnboardingView: React.FC<OnboardingViewProps> = ({ onNavigate }) => {
  const { updateProfile } = useAuth();
  
  // Step state: 0 = Role selection, 1 = Identity, 2 = Skills & Proofs, 3 = Goals, 4 = Finalized
  const [selectedRole, setSelectedRole] = useState<UserRoleChoice>('talent');
  const [currentStep, setCurrentStep] = useState<number>(0);

  // Form inputs
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [headline, setHeadline] = useState('');
  const [country, setCountry] = useState('Sénégal');
  const [city, setCity] = useState('Dakar');
  const [bio, setBio] = useState('');

  // Step 2
  const [primarySkill, setPrimarySkill] = useState('TypeScript & Distributed Systems');
  const [secondarySkill, setSecondarySkill] = useState('PostgreSQL & Architecture');
  const [proofUrl, setProofUrl] = useState('');
  const [projectTitle, setProjectTitle] = useState('');

  // Step 3
  const [opportunityType, setOpportunityType] = useState('Télétravail');
  const [availability, setAvailability] = useState('Immédiate');

  const handleRoleSelect = (role: UserRoleChoice) => {
    setSelectedRole(role);
    setCurrentStep(1);
  };

  const handleFinishOnboarding = async () => {
    try {
      if (updateProfile) {
        await updateProfile({
          first_name: firstName || 'Talent',
          last_name: lastName || 'SkillBridge',
          bio: bio || headline || 'Ingénieur Logiciel',
          country: country,
          location: city,
          account_type: selectedRole === 'talent' ? 'talent' : selectedRole === 'mentor' ? 'mentor' : 'company',
          availability: availability
        });
      }
    } catch (e) {
      console.log('Profile local updated');
    }
    
    // Redirect to respective dashboard
    if (selectedRole === 'talent') {
      onNavigate('dashboard-talent');
    } else if (selectedRole === 'mentor') {
      onNavigate('dashboard-mentor');
    } else {
      onNavigate('dashboard-company');
    }
  };

  return (
    <div className="flex-1 w-full bg-[#F5F7F6] text-[#101820] py-16 sm:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* STEP 0 : CHOIX DU RÔLE (SECTION 23 DU MASTER PROMPT) */}
        {currentStep === 0 && (
          <div className="space-y-12 animate-in fade-in duration-300">
            <div className="text-center space-y-4 max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#E2E8E5] text-[#123B5D] text-xs font-mono font-bold uppercase tracking-wider">
                <span>REJOINDRE L'INFRASTRUCTURE</span>
              </div>
              <h1 className="font-heading text-3xl sm:text-5xl font-extrabold text-[#101820] leading-tight">
                Comment souhaitez-vous participer à <span className="text-[#59B83E]">SkillBridge</span> ?
              </h1>
              <p className="text-stone-600 text-sm sm:text-base font-light">
                Sélectionnez votre profil d'entrée dans l'écosystème panafricain.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* TALENT */}
              <div
                onClick={() => handleRoleSelect('talent')}
                className="bg-white border-2 border-[#E2E8E5] hover:border-[#123B5D] p-8 rounded-3xl space-y-5 cursor-pointer transition-all shadow-xs hover:shadow-lg group flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#123B5D] text-white flex items-center justify-center font-bold">
                    <User className="w-6 h-6 text-[#C8F169]" />
                  </div>
                  <div>
                    <span className="text-xs font-mono font-bold text-[#123B5D] uppercase tracking-wider block">01 / PROFIL</span>
                    <h3 className="font-heading text-xl font-bold text-[#101820] group-hover:text-[#123B5D]">
                      TALENT
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
                    Construire mon profil, prouver mes compétences par le code et accéder à des opportunités exigeantes.
                  </p>
                </div>

                <div className="pt-4 border-t border-[#E2E8E5] flex items-center justify-between text-xs font-bold text-[#123B5D]">
                  <span>Commencer comme Talent</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-[#59B83E]" />
                </div>
              </div>

              {/* MENTOR */}
              <div
                onClick={() => handleRoleSelect('mentor')}
                className="bg-white border-2 border-[#E2E8E5] hover:border-[#59B83E] p-8 rounded-3xl space-y-5 cursor-pointer transition-all shadow-xs hover:shadow-lg group flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#59B83E] text-white flex items-center justify-center font-bold">
                    <Compass className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <span className="text-xs font-mono font-bold text-[#59B83E] uppercase tracking-wider block">02 / PROFIL</span>
                    <h3 className="font-heading text-xl font-bold text-[#101820] group-hover:text-[#59B83E]">
                      MENTOR
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
                    Partager mon expérience, guider la prochaine génération d'ingénieurs et transmettre les bonnes pratiques.
                  </p>
                </div>

                <div className="pt-4 border-t border-[#E2E8E5] flex items-center justify-between text-xs font-bold text-[#59B83E]">
                  <span>Commencer comme Mentor</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-[#59B83E]" />
                </div>
              </div>

              {/* ENTREPRISE */}
              <div
                onClick={() => handleRoleSelect('company')}
                className="bg-white border-2 border-[#E2E8E5] hover:border-[#101820] p-8 rounded-3xl space-y-5 cursor-pointer transition-all shadow-xs hover:shadow-lg group flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#101820] text-white flex items-center justify-center font-bold">
                    <Building className="w-6 h-6 text-[#C8F169]" />
                  </div>
                  <div>
                    <span className="text-xs font-mono font-bold text-stone-600 uppercase tracking-wider block">03 / PROFIL</span>
                    <h3 className="font-heading text-xl font-bold text-[#101820] group-hover:text-[#101820]">
                      ENTREPRISE
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
                    Découvrir des talents vérifiés, recruter selon les compétences réelles et proposer des challenges.
                  </p>
                </div>

                <div className="pt-4 border-t border-[#E2E8E5] flex items-center justify-between text-xs font-bold text-[#101820]">
                  <span>Commencer comme Entreprise</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-[#59B83E]" />
                </div>
              </div>

            </div>
          </div>
        )}

        {/* STEP 1 TO 3 : ONBOARDING FORM */}
        {currentStep > 0 && (
          <div className="bg-white border border-[#E2E8E5] rounded-3xl p-6 sm:p-12 shadow-xl space-y-8 animate-in fade-in duration-300">
            
            {/* Progress Bar */}
            <div className="space-y-3 pb-6 border-b border-[#E2E8E5]">
              <div className="flex items-center justify-between text-xs font-mono font-bold text-stone-500">
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="flex items-center gap-1 text-[#123B5D] hover:underline cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Retour</span>
                </button>
                <span>Étape {currentStep} sur 3 · Profil {selectedRole.toUpperCase()}</span>
              </div>
              <div className="w-full h-1.5 bg-[#F5F7F6] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#123B5D] transition-all duration-300"
                  style={{ width: `${(currentStep / 3) * 100}%` }}
                />
              </div>
            </div>

            {/* STEP 1 : IDENTITÉ & POSITIONNEMENT */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-heading text-2xl font-bold text-[#101820]">
                    1. Votre identité professionnelle
                  </h2>
                  <p className="text-xs text-stone-500">Ces informations figureront sur votre passeport public.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-[#123B5D] mb-1">Prénom</label>
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Ex: Aïcha"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#F5F7F6] border border-[#E2E8E5] text-xs text-[#101820] focus:outline-hidden focus:border-[#123B5D]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-[#123B5D] mb-1">Nom</label>
                    <input
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Ex: Konaté"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#F5F7F6] border border-[#E2E8E5] text-xs text-[#101820] focus:outline-hidden focus:border-[#123B5D]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#123B5D] mb-1">Titre professionnel</label>
                  <input
                    type="text"
                    required
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    placeholder="Ex: Senior Distributed Systems Architect"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F5F7F6] border border-[#E2E8E5] text-xs text-[#101820] focus:outline-hidden focus:border-[#123B5D]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-[#123B5D] mb-1">Pays</label>
                    <input
                      type="text"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      placeholder="Ex: Sénégal"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#F5F7F6] border border-[#E2E8E5] text-xs text-[#101820] focus:outline-hidden focus:border-[#123B5D]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-[#123B5D] mb-1">Ville</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Ex: Dakar"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#F5F7F6] border border-[#E2E8E5] text-xs text-[#101820] focus:outline-hidden focus:border-[#123B5D]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#123B5D] mb-1">Bio concise</label>
                  <textarea
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Résumez votre philosophie d'ingénierie et vos centres d'intérêt..."
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F5F7F6] border border-[#E2E8E5] text-xs text-[#101820] focus:outline-hidden focus:border-[#123B5D]"
                  />
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="px-6 py-3 rounded-xl bg-[#123B5D] text-white font-bold text-xs flex items-center gap-2 cursor-pointer"
                  >
                    <span>Continuer vers les compétences</span>
                    <ArrowRight className="w-4 h-4 text-[#C8F169]" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2 : COMPÉTENCES & PREUVES */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-heading text-2xl font-bold text-[#101820]">
                    2. Compétences & Preuves de travail
                  </h2>
                  <p className="text-xs text-stone-500">Associez des preuves concrètes à ce que vous savez faire.</p>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#123B5D] mb-1">Compétence Principale</label>
                  <input
                    type="text"
                    value={primarySkill}
                    onChange={(e) => setPrimarySkill(e.target.value)}
                    placeholder="Ex: Go / Rust / Systems Engineering"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F5F7F6] border border-[#E2E8E5] text-xs text-[#101820] focus:outline-hidden focus:border-[#123B5D]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#123B5D] mb-1">Compétence Secondaire</label>
                  <input
                    type="text"
                    value={secondarySkill}
                    onChange={(e) => setSecondarySkill(e.target.value)}
                    placeholder="Ex: PostgreSQL, Kubernetes, Design Systems"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F5F7F6] border border-[#E2E8E5] text-xs text-[#101820] focus:outline-hidden focus:border-[#123B5D]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#123B5D] mb-1">Titre de votre projet phare</label>
                  <input
                    type="text"
                    value={projectTitle}
                    onChange={(e) => setProjectTitle(e.target.value)}
                    placeholder="Ex: Moteur de paiement instantané offline-first"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F5F7F6] border border-[#E2E8E5] text-xs text-[#101820] focus:outline-hidden focus:border-[#123B5D]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#123B5D] mb-1">Lien de preuve (GitHub, Article, Démo)</label>
                  <input
                    type="url"
                    value={proofUrl}
                    onChange={(e) => setProofUrl(e.target.value)}
                    placeholder="https://github.com/mon-compte/mon-projet"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F5F7F6] border border-[#E2E8E5] text-xs text-[#101820] focus:outline-hidden focus:border-[#123B5D]"
                  />
                </div>

                <div className="pt-4 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="px-5 py-3 rounded-xl bg-stone-100 text-stone-700 font-bold text-xs cursor-pointer"
                  >
                    Précédent
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="px-6 py-3 rounded-xl bg-[#123B5D] text-white font-bold text-xs flex items-center gap-2 cursor-pointer"
                  >
                    <span>Continuer vers les objectifs</span>
                    <ArrowRight className="w-4 h-4 text-[#C8F169]" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3 : OBJECTIFS & FINALISATION */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-heading text-2xl font-bold text-[#101820]">
                    3. Modalités & Finalisation
                  </h2>
                  <p className="text-xs text-stone-500">Configurez vos préférences de mise en relation.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-[#123B5D] mb-1">Disponibilité</label>
                    <select
                      value={availability}
                      onChange={(e) => setAvailability(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#F5F7F6] border border-[#E2E8E5] text-xs text-[#101820] focus:outline-hidden focus:border-[#123B5D]"
                    >
                      <option value="Immédiate">Disponible immédiatement</option>
                      <option value="Sous 1 mois">Disponible sous 1 mois</option>
                      <option value="À l'écoute">À l'écoute d'opportunités</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-[#123B5D] mb-1">Type de collaboration</label>
                    <select
                      value={opportunityType}
                      onChange={(e) => setOpportunityType(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#F5F7F6] border border-[#E2E8E5] text-xs text-[#101820] focus:outline-hidden focus:border-[#123B5D]"
                    >
                      <option value="Télétravail">100% Télétravail</option>
                      <option value="Hybride">Hybride</option>
                      <option value="Missions courtes">Missions de consulting</option>
                    </select>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#59B83E]/10 border border-[#59B83E]/20 text-xs space-y-1">
                  <div className="font-bold text-[#123B5D] flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#59B83E]" />
                    <span>Création immédiate de votre Skill Passport</span>
                  </div>
                  <p className="text-stone-600 font-light">
                    Votre passeport souverain sera généré et prêt à être partagé avec les mentors et entreprises de l'écosystème.
                  </p>
                </div>

                <div className="pt-4 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="px-5 py-3 rounded-xl bg-stone-100 text-stone-700 font-bold text-xs cursor-pointer"
                  >
                    Précédent
                  </button>
                  <button
                    type="button"
                    onClick={handleFinishOnboarding}
                    className="px-8 py-3 rounded-xl bg-[#59B83E] hover:bg-[#4ea536] text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md"
                  >
                    <CheckCircle2 className="w-4 h-4 text-white" />
                    <span>Générer mon passeport & Accéder au tableau de bord</span>
                  </button>
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};
