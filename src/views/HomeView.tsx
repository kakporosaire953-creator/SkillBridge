import React, { useState } from 'react';
import { ViewType } from '../types/platform';
import { HeroBridgeVisual } from '../components/HeroBridgeVisual';
import { PremiumGridBackground } from '../components/PremiumGridBackground';
import { 
  ArrowRight, 
  CheckCircle2, 
  Share2
} from 'lucide-react';

interface HomeViewProps {
  onNavigate: (view: ViewType) => void;
  onOpenAuth?: () => void;
  isAuthenticated?: boolean;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate }) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSent, setNewsletterSent] = useState(false);
  const [challengeEmail, setChallengeEmail] = useState('');
  const [challengeSent, setChallengeSent] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterSent(true);
    setTimeout(() => {
      setNewsletterEmail('');
    }, 4000);
  };

  const handleChallengeNotify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!challengeEmail) return;
    setChallengeSent(true);
    setTimeout(() => {
      setChallengeEmail('');
    }, 4000);
  };

  return (
    <div className="flex-1 w-full text-[#101820] overflow-x-hidden selection:bg-[#59B83E] selection:text-white relative">
      <PremiumGridBackground />
      
      {/* 07 — HERO SECTION */}
      <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 border-b border-[#E2E8E5] z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto space-y-8">
            
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#E2E8E5] text-[#123B5D] text-xs font-bold tracking-widest uppercase shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#59B83E]" />
              <span>L'ÉCOSYSTÈME AFRICAIN DES COMPÉTENCES</span>
            </div>

            {/* Headline */}
            <h1 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#101820] tracking-tight leading-[1.15]">
              Les compétences existent. <br className="hidden sm:inline" />
              Nous construisons les{' '}
              <span className="text-[#59B83E] underline decoration-[#C8F169] decoration-4 underline-offset-8">
                ponts
              </span>{' '}
              qui leur permettent d'aller plus loin.
            </h1>

            {/* Description */}
            <p className="text-stone-600 text-base sm:text-lg max-w-2xl mx-auto font-light leading-relaxed">
              SkillBridge connecte les compétences, les talents, l'expérience et les opportunités pour construire un écosystème où chacun peut apprendre, progresser, démontrer son savoir-faire et aller plus loin.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <button
                type="button"
                onClick={() => onNavigate('onboarding')}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#123B5D] hover:bg-[#101820] text-white font-bold text-sm sm:text-base tracking-wide transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2.5 cursor-pointer group"
              >
                <span>Rejoindre SkillBridge</span>
                <ArrowRight className="w-4 h-4 text-[#C8F169] group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                type="button"
                onClick={() => onNavigate('about')}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white hover:bg-stone-50 border border-[#E2E8E5] text-[#123B5D] font-bold text-sm sm:text-base transition-all flex items-center justify-center gap-2 cursor-pointer hover:border-[#123B5D]"
              >
                <span>Découvrir notre vision</span>
              </button>
            </div>

            {/* Architectural Abstract Visual */}
            <div className="pt-10">
              <HeroBridgeVisual />
            </div>

          </div>
        </div>
      </section>

      {/* 08 — SECTION PROBLÈME : THE GAP */}
      <section className="relative py-24 bg-white border-b border-[#E2E8E5] z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mb-16 space-y-3">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#59B83E] block">
              THE GAP
            </span>
            <h2 className="font-heading text-2xl sm:text-4xl font-extrabold text-[#101820] leading-tight">
              Le talent est partout. <br />
              Les opportunités ne le sont pas toujours.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="p-8 rounded-2xl bg-[#F5F7F6] border border-[#E2E8E5] space-y-3 flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-[#123B5D] uppercase tracking-wider block mb-2">
                  01 / TALENTS
                </span>
                <h3 className="font-heading text-lg font-bold text-[#101820]">
                  Visibilité
                </h3>
              </div>
              <p className="text-sm text-stone-600 leading-relaxed font-light">
                Des personnes compétentes restent invisibles et peinent à faire reconnaître leurs capacités réelles.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-[#F5F7F6] border border-[#E2E8E5] space-y-3 flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-[#123B5D] uppercase tracking-wider block mb-2">
                  02 / EXPÉRIENCE
                </span>
                <h3 className="font-heading text-lg font-bold text-[#101820]">
                  Transmission
                </h3>
              </div>
              <p className="text-sm text-stone-600 leading-relaxed font-light">
                Des savoir-faire précieux restent difficiles à transmettre entre les générations de professionnels.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-[#F5F7F6] border border-[#E2E8E5] space-y-3 flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-[#123B5D] uppercase tracking-wider block mb-2">
                  03 / APPRENTISSAGE
                </span>
                <h3 className="font-heading text-lg font-bold text-[#101820]">
                  Orientation
                </h3>
              </div>
              <p className="text-sm text-stone-600 leading-relaxed font-light">
                Beaucoup veulent progresser sans trouver les bons chemins ni les retours d'expérience concrets.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-[#F5F7F6] border border-[#E2E8E5] space-y-3 flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-[#123B5D] uppercase tracking-wider block mb-2">
                  04 / OPPORTUNITÉS
                </span>
                <h3 className="font-heading text-lg font-bold text-[#101820]">
                  Confiance
                </h3>
              </div>
              <p className="text-sm text-stone-600 leading-relaxed font-light">
                Les organisations ne voient pas toujours ce que les talents savent réellement faire sur le terrain.
              </p>
            </div>

          </div>

          {/* Conclusion */}
          <div className="mt-14 pt-8 border-t border-[#E2E8E5] text-center">
            <p className="font-heading text-lg sm:text-xl font-bold text-[#123B5D]">
              SkillBridge est né pour réduire cette distance.
            </p>
          </div>

        </div>
      </section>

      {/* 09 — THE BRIDGE MODEL */}
      <section className="relative py-24 bg-white/70 border-b border-[#E2E8E5] z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#59B83E] block">
              THE BRIDGE MODEL
            </span>
            <h2 className="font-heading text-2xl sm:text-4xl font-extrabold text-[#101820]">
              Un pont. Quatre mouvements.
            </h2>
          </div>

          {/* Continuous Bridge Line with 4 steps */}
          <div className="relative">
            {/* Desktop connecting line */}
            <div className="hidden lg:block absolute top-7 left-[10%] right-[10%] h-0.5 bg-[#E2E8E5] z-0">
              <div className="h-full w-full bg-gradient-to-r from-[#123B5D] via-[#59B83E] to-[#123B5D] opacity-40" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
              
              {/* Step 1 */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E2E8E5] space-y-4 shadow-xs">
                <div className="w-12 h-12 rounded-xl bg-[#123B5D] text-white flex items-center justify-center font-bold text-sm">
                  01
                </div>
                <h3 className="font-heading text-base font-bold text-[#101820] uppercase tracking-wider">
                  APPRENDRE
                </h3>
                <p className="text-sm text-stone-600 font-light leading-relaxed">
                  Acquérir les compétences qui permettent d'avancer et de répondre aux exigences de demain.
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E2E8E5] space-y-4 shadow-xs">
                <div className="w-12 h-12 rounded-xl bg-[#59B83E] text-white flex items-center justify-center font-bold text-sm">
                  02
                </div>
                <h3 className="font-heading text-base font-bold text-[#101820] uppercase tracking-wider">
                  TRANSMETTRE
                </h3>
                <p className="text-sm text-stone-600 font-light leading-relaxed">
                  Partager l'expérience et le savoir entre praticiens confirmés et nouvelles générations.
                </p>
              </div>

              {/* Step 3 */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E2E8E5] space-y-4 shadow-xs">
                <div className="w-12 h-12 rounded-xl bg-[#123B5D] text-white flex items-center justify-center font-bold text-sm">
                  03
                </div>
                <h3 className="font-heading text-base font-bold text-[#101820] uppercase tracking-wider">
                  PROUVER
                </h3>
                <p className="text-sm text-stone-600 font-light leading-relaxed">
                  Transformer ses compétences en preuves concrètes, mesurables et vérifiables par les pairs.
                </p>
              </div>

              {/* Step 4 */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E2E8E5] space-y-4 shadow-xs">
                <div className="w-12 h-12 rounded-xl bg-[#101820] text-[#C8F169] flex items-center justify-center font-bold text-sm">
                  04
                </div>
                <h3 className="font-heading text-base font-bold text-[#101820] uppercase tracking-wider">
                  ÉVOLUER
                </h3>
                <p className="text-sm text-stone-600 font-light leading-relaxed">
                  Accéder à de nouvelles opportunités professionnelles, projets d'envergure et collaborations.
                </p>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 10 — TALENT SECTION */}
      <section className="relative py-24 bg-white border-b border-[#E2E8E5] z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left pitch */}
            <div className="lg:col-span-5 space-y-6">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#59B83E] block">
                TALENT IDENTITY
              </span>
              <h2 className="font-heading text-2xl sm:text-4xl font-extrabold text-[#101820] leading-tight">
                Votre talent mérite d'être découvert.
              </h2>
              <p className="text-stone-600 text-sm sm:text-base font-light leading-relaxed">
                Ne réduisez plus votre parcours à un CV traditionnel. Construisez une véritable identité professionnelle numérique axée sur vos réalisations réelles, vos preuves de code, vos certifications et les recommandations de vos pairs.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => onNavigate('talents')}
                  className="px-6 py-3.5 rounded-xl bg-[#123B5D] hover:bg-[#101820] text-white font-bold text-sm transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Créer mon profil</span>
                  <ArrowRight className="w-4 h-4 text-[#C8F169]" />
                </button>
              </div>
            </div>

            {/* Right: UI Representation of a Next-Gen Talent Profile */}
            <div className="lg:col-span-7">
              <div className="bg-[#F5F7F6] border border-[#E2E8E5] rounded-3xl p-6 sm:p-8 shadow-lg space-y-6">
                
                {/* Profile Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E2E8E5]">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-[#123B5D] text-white flex items-center justify-center font-bold text-lg">
                      AK
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-heading font-bold text-lg text-[#101820]">Aïcha Konaté</h4>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#59B83E]/10 text-[#59B83E] text-[11px] font-bold">
                          <CheckCircle2 className="w-3 h-3" /> Vérifiée
                        </span>
                      </div>
                      <p className="text-xs text-stone-500 font-medium">
                        Senior Systems Architect · Dakar, Sénégal
                      </p>
                    </div>
                  </div>

                  <div className="text-right sm:text-right">
                    <span className="text-[10px] text-stone-400 uppercase font-mono block">Passport Score</span>
                    <span className="text-xl font-bold font-mono text-[#123B5D]">94 / 100</span>
                  </div>
                </div>

                {/* Skills & Proofs */}
                <div className="space-y-2.5">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-stone-500 block">
                    Compétences & Preuves de Travail
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                    <div className="p-3 bg-white border border-[#E2E8E5] rounded-xl space-y-1">
                      <div className="font-semibold text-[#101820]">Distributed Systems</div>
                      <div className="text-[11px] text-[#59B83E] font-medium font-mono">4 preuves vérifiées</div>
                    </div>
                    <div className="p-3 bg-white border border-[#E2E8E5] rounded-xl space-y-1">
                      <div className="font-semibold text-[#101820]">TypeScript / Go</div>
                      <div className="text-[11px] text-[#59B83E] font-medium font-mono">6 dépôts examinés</div>
                    </div>
                    <div className="p-3 bg-white border border-[#E2E8E5] rounded-xl space-y-1">
                      <div className="font-semibold text-[#101820]">PostgreSQL / RLS</div>
                      <div className="text-[11px] text-[#59B83E] font-medium font-mono">3 certifications</div>
                    </div>
                  </div>
                </div>

                {/* Latest Verified Project */}
                <div className="p-4 bg-white border border-[#E2E8E5] rounded-2xl space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-[#123B5D]">Projet : Panafrican Realtime Settlement Core</span>
                    <span className="text-[11px] text-stone-400 font-mono">Prod 2025</span>
                  </div>
                  <p className="text-stone-600 font-light">
                    Moteur de compensation multidevises à latence sub-seconde avec audit cryptographique.
                  </p>
                </div>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 11 — SKILL PASSPORT (DARK SECTION #101820) */}
      <section className="relative py-24 bg-[#101820] text-white border-b border-stone-800 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[#C8F169] text-xs font-mono font-semibold">
                <span>SKILL PASSPORT</span>
              </div>
              
              <h2 className="font-heading text-3xl sm:text-5xl font-extrabold text-white leading-tight">
                Votre parcours. <br />
                Vos compétences. <br />
                <span className="text-[#59B83E]">Vos preuves.</span>
              </h2>

              <p className="text-stone-300 text-sm sm:text-base font-light leading-relaxed">
                Le Skill Passport est un document professionnel numérique nouvelle génération. Il consolide vos compétences attestées, vos projets de production, vos preuves de code et les recommandations directes de vos mentors.
              </p>

              <div className="pt-2 flex flex-wrap gap-4">
                <button
                  type="button"
                  onClick={() => onNavigate('passport')}
                  className="px-6 py-3.5 rounded-xl bg-[#59B83E] hover:bg-[#4ea536] text-white font-bold text-sm transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Voir un exemple</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>

            {/* Passport UI Card Object */}
            <div className="lg:col-span-7">
              <div className="bg-[#123B5D]/60 border border-white/15 rounded-3xl p-6 sm:p-8 backdrop-blur-md space-y-6 shadow-2xl">
                
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#59B83E] flex items-center justify-center font-bold text-white text-xs">
                      SP
                    </div>
                    <div>
                      <span className="text-xs font-mono tracking-widest text-[#C8F169] uppercase block">
                        PASSEPORT NUMÉRIQUE SOUVERAIN
                      </span>
                      <span className="text-xs text-stone-300">ID: SB-AFR-882910</span>
                    </div>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-[#59B83E]/20 text-[#C8F169] font-mono border border-[#59B83E]/30">
                    Statut : ACTIF
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
                    <span className="text-stone-400 block font-mono text-[10px]">SKILLS VALIDÉS</span>
                    <span className="text-base font-bold text-white font-mono">14 Compétences</span>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
                    <span className="text-stone-400 block font-mono text-[10px]">PREUVES DE CODE</span>
                    <span className="text-base font-bold text-[#C8F169] font-mono">19 Dépôts vérifiés</span>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
                    <span className="text-stone-400 block font-mono text-[10px]">MENTOR REVIEWS</span>
                    <span className="text-base font-bold text-white font-mono">8 Évaluations</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2 text-xs">
                  <span className="text-stone-300 font-mono text-[10px] uppercase tracking-wider block">
                    URL Publique Partageable
                  </span>
                  <div className="flex items-center justify-between text-stone-300 font-mono text-xs bg-black/40 px-3 py-2 rounded-lg">
                    <span>skillbridge.africa/talent/aicha-konate</span>
                    <Share2 className="w-3.5 h-3.5 text-[#C8F169]" />
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 12 — INTERGENERATIONAL KNOWLEDGE */}
      <section className="relative py-24 bg-white/85 border-b border-[#E2E8E5] z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#59B83E] block">
              TRANSMISSION
            </span>
            <h2 className="font-heading text-2xl sm:text-4xl font-extrabold text-[#101820] leading-tight">
              L'expérience ne devrait pas s'arrêter à une génération.
            </h2>
            <p className="text-stone-600 text-sm sm:text-base font-light leading-relaxed">
              Nous concevons des flux directs de transmission où les professionnels établis guident, conseillent et challengent les talents émergents à travers des sessions 1-on-1 structurées.
            </p>
          </div>

          {/* Architectural transmission diagram */}
          <div className="max-w-4xl mx-auto p-8 rounded-3xl bg-[#F5F7F6] border border-[#E2E8E5] space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="space-y-2">
                <span className="text-xs font-mono font-bold text-[#123B5D]">SENIORITÉ & ARCHITECTURE</span>
                <p className="text-xs text-stone-600">Partage des arbitrages d'ingénierie et de gouvernance d'entreprise.</p>
              </div>
              <div className="flex items-center justify-center">
                <div className="h-0.5 w-full bg-gradient-to-r from-[#123B5D] to-[#59B83E] hidden md:block" />
                <span className="px-3 py-1 bg-white border border-[#E2E8E5] text-[#59B83E] font-bold text-xs rounded-full">
                  Flux Continu
                </span>
                <div className="h-0.5 w-full bg-gradient-to-r from-[#59B83E] to-[#123B5D] hidden md:block" />
              </div>
              <div className="space-y-2">
                <span className="text-xs font-mono font-bold text-[#123B5D]">TALENTS ÉMERGENTS</span>
                <p className="text-xs text-stone-600">Accélération de la maîtrise technique et intégration industrielle.</p>
              </div>
            </div>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => onNavigate('mentors')}
                className="px-6 py-3.5 rounded-xl bg-[#123B5D] hover:bg-[#101820] text-white font-bold text-sm transition-all inline-flex items-center gap-2 cursor-pointer"
              >
                <span>Découvrir les mentors</span>
                <ArrowRight className="w-4 h-4 text-[#C8F169]" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 14 — BUSINESS SECTION (DEEP BLUE BACKGROUND #123B5D) */}
      <section className="relative py-24 bg-[#123B5D] text-white border-b border-stone-800 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mb-16 space-y-4">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#C8F169] block">
              ENTREPRISES & ORGANISATIONS
            </span>
            <h2 className="font-heading text-2xl sm:text-4xl font-extrabold text-white leading-tight">
              Découvrez le talent au-delà du CV.
            </h2>
            <p className="text-stone-300 text-sm sm:text-base font-light leading-relaxed">
              Accédez aux compétences éprouvées. Évaluez sur la base de réalisations réelles, de projets vérifiés et de recommandations authentiques.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-white/10 border border-white/15 space-y-4">
              <span className="text-xs font-mono font-bold text-[#C8F169] uppercase tracking-wider block">
                01 / DISCOVER
              </span>
              <h3 className="font-heading text-xl font-bold text-white">
                Découvrez les compétences réelles
              </h3>
              <p className="text-xs sm:text-sm text-stone-300 font-light leading-relaxed">
                Filtrez les profils par capacités techniques concrètes, stack technologique et preuves de travail vérifiées.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-white/10 border border-white/15 space-y-4">
              <span className="text-xs font-mono font-bold text-[#C8F169] uppercase tracking-wider block">
                02 / CONNECT
              </span>
              <h3 className="font-heading text-xl font-bold text-white">
                Entrez en relation directe
              </h3>
              <p className="text-xs sm:text-sm text-stone-300 font-light leading-relaxed">
                Échangez sans intermédiaire avec des développeurs, data scientists et leaders d'ingénierie disponibles.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-white/10 border border-white/15 space-y-4">
              <span className="text-xs font-mono font-bold text-[#C8F169] uppercase tracking-wider block">
                03 / OPPORTUNITIES
              </span>
              <h3 className="font-heading text-xl font-bold text-white">
                Transformez en valeur
              </h3>
              <p className="text-xs sm:text-sm text-stone-300 font-light leading-relaxed">
                Publiez vos opportunités ou soumettez des challenges pour recruter les talents les plus réactifs.
              </p>
            </div>
          </div>

          <div className="mt-12 pt-6">
            <button
              type="button"
              onClick={() => onNavigate('companies')}
              className="px-6 py-3.5 rounded-xl bg-[#59B83E] hover:bg-[#4ea536] text-white font-bold text-sm transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Collaborer avec SkillBridge</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </button>
          </div>

        </div>
      </section>

      {/* 17 — CHALLENGES (COMING SOON) */}
      <section className="relative py-24 bg-transparent border-b border-[#E2E8E5] z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4 mb-12">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#59B83E] block mb-2">
                COMING SOON
              </span>
              <h2 className="font-heading text-2xl sm:text-4xl font-extrabold text-[#101820]">
                Prove what you can do.
              </h2>
            </div>
            <span className="text-xs text-stone-500 font-mono">SKILLBRIDGE CHALLENGES · SAISON 01</span>
          </div>

          <div className="p-8 sm:p-12 rounded-3xl bg-[#F5F7F6] border border-[#E2E8E5] space-y-8">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E2E8E5] pb-6">
              <div>
                <span className="text-xs font-mono font-bold text-[#123B5D] uppercase tracking-wider block">
                  CHALLENGE #001
                </span>
                <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#101820]">
                  Design System & Expérience Mobile Panafricaine
                </h3>
              </div>

              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-md bg-white border border-[#E2E8E5] text-xs font-mono font-bold text-stone-600">
                  DURÉE : 07 JOURS
                </span>
                <span className="px-3 py-1 rounded-md bg-[#59B83E]/10 border border-[#59B83E]/30 text-xs font-mono font-bold text-[#59B83E]">
                  STATUS : COMING SOON
                </span>
              </div>
            </div>

            <p className="text-sm text-stone-600 font-light max-w-2xl leading-relaxed">
              Ce challenge évaluera l'aptitude à concevoir une interface bancaire ultra-fluide pour le contexte africain (faible connectivité, multilinguisme et clarté typographique).
            </p>

            {/* Notification Form */}
            <form onSubmit={handleChallengeNotify} className="flex flex-col sm:flex-row items-center gap-3 max-w-md">
              <input
                type="email"
                required
                value={challengeEmail}
                onChange={(e) => setChallengeEmail(e.target.value)}
                placeholder="Votre adresse email..."
                className="w-full px-4 py-3 rounded-xl bg-white border border-[#E2E8E5] text-xs text-[#101820] focus:outline-hidden focus:border-[#123B5D]"
              />
              <button
                type="submit"
                className="w-full sm:w-auto shrink-0 px-5 py-3 rounded-xl bg-[#123B5D] hover:bg-[#101820] text-white text-xs font-bold transition-all cursor-pointer"
              >
                {challengeSent ? 'Inscrit ✓' : 'Être informé du lancement →'}
              </button>
            </form>

          </div>

        </div>
      </section>

      {/* 20 — VISION SECTION (MASSIVE WHITE SPACE) */}
      <section className="relative py-32 bg-white border-b border-[#E2E8E5] z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-10">
          
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#59B83E]">
            NOTRE VISION
          </span>

          <h2 className="font-heading text-2xl sm:text-4xl lg:text-5xl font-extrabold text-[#101820] leading-snug tracking-tight">
            «Nous ne voulons pas simplement créer une plateforme. <br className="hidden sm:inline" />
            Nous voulons construire une infrastructure où les compétences africaines peuvent circuler, être découvertes et créer de nouvelles opportunités.»
          </h2>

          <div className="pt-4">
            <p className="font-editorial italic text-xl sm:text-2xl text-[#123B5D]">
              From skills to proof. From proof to opportunity.
            </p>
          </div>

        </div>
      </section>

      {/* 21 — COMMUNITY CTA SECTION */}
      <section className="relative py-24 bg-transparent z-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          
          <h2 className="font-heading text-2xl sm:text-4xl font-extrabold text-[#101820]">
            Soyez là dès le début.
          </h2>

          <p className="text-sm sm:text-base text-stone-600 font-light max-w-xl mx-auto leading-relaxed">
            SkillBridge est encore au commencement de son histoire. Rejoignez les premières personnes qui suivent sa construction.
          </p>

          <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
            <input
              type="email"
              required
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder="Votre adresse e-mail"
              className="w-full px-5 py-3.5 rounded-xl bg-white border border-[#E2E8E5] text-sm text-[#101820] placeholder-stone-400 focus:outline-hidden focus:border-[#123B5D]"
            />
            <button
              type="submit"
              className="w-full sm:w-auto shrink-0 px-6 py-3.5 rounded-xl bg-[#123B5D] hover:bg-[#101820] text-white text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>{newsletterSent ? 'Inscrit avec succès ✓' : 'Rejoindre SkillBridge →'}</span>
            </button>
          </form>

        </div>
      </section>

    </div>
  );
};
