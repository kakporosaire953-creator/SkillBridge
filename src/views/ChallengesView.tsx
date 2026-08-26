import React, { useState } from 'react';
import { ViewType } from '../types/platform';

interface ChallengesViewProps {
  onNavigate?: (view: ViewType) => void;
}

interface UpcomingChallenge {
  number: string;
  title: string;
  track: string;
  duration: string;
  rewards: string;
  status: 'COMING SOON';
  description: string;
  evaluationCriteria: string[];
}

const UPCOMING_CHALLENGES: UpcomingChallenge[] = [
  {
    number: '001',
    title: 'Design System & Expérience Mobile Panafricaine',
    track: 'UI/UX DESIGN',
    duration: '07 JOURS',
    rewards: 'Dotation financière & Recrutement direct',
    status: 'COMING SOON',
    description: 'Conception d\'un système de design sobre, lisible et performant pour terminaux à connectivité variable.',
    evaluationCriteria: ['Clarté typographique', 'Accessibilité WCAG AAA', 'Sobriété des micro-interactions']
  },
  {
    number: '002',
    title: 'Moteur de Compensation Multidevises Résilient',
    track: 'DISTRIBUTED ARCHITECTURE',
    duration: '10 JOURS',
    rewards: 'Bounty & Invitation Architecture Review',
    status: 'COMING SOON',
    description: 'Implémentation d\'un consensus distribué tolérant aux partitions réseau régionales avec audit de latence.',
    evaluationCriteria: ['Gestion des idempotences', 'Tolérance aux pannes Byzance', 'Tests de charge à 30k TPS']
  },
  {
    number: '003',
    title: 'Moteur de Synchronisation Offline-First Vectoriel',
    track: 'MOBILE & DATA SYSTEMS',
    duration: '07 JOURS',
    rewards: 'Bounty & Attestation Skill Passport',
    status: 'COMING SOON',
    description: 'Moteur SQLite/CRDT local permettant l\'enregistrement et la réconciliation transparente de données agricoles.',
    evaluationCriteria: ['Zéro perte de données en coupure', 'Consommation mémoire sub-15Mo', 'Résolution déterministe de conflits']
  }
];

export const ChallengesView: React.FC<ChallengesViewProps> = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleNotify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    setTimeout(() => {
      setEmail('');
    }, 4000);
  };

  return (
    <div className="flex-1 w-full bg-[#F5F7F6] text-[#101820]">
      
      {/* Hero */}
      <section className="py-20 sm:py-28 border-b border-[#E2E8E5] bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F5F7F6] border border-[#E2E8E5] text-[#123B5D] text-xs font-mono font-bold uppercase tracking-wider">
            <span>SKILLBRIDGE CHALLENGES · SAISON 01</span>
          </div>

          <h1 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#101820] leading-tight">
            Prove what you can do.
          </h1>

          <p className="text-stone-600 text-base sm:text-xl font-light leading-relaxed max-w-2xl mx-auto">
            Les challenges SkillBridge sont des épreuves d'ingénierie et de design industriel. Résolvez des problèmes concrets, gagnez des dotations et enrichissez votre Skill Passport de preuves irréfutables.
          </p>

          <div className="pt-2 flex justify-center">
            <span className="px-4 py-1.5 rounded-full bg-[#59B83E]/10 border border-[#59B83E]/30 text-xs font-mono font-bold text-[#59B83E]">
              STATUS GÉNÉRAL : LANCEMENT PROCHAIN
            </span>
          </div>
        </div>
      </section>

      {/* Challenges List */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="font-heading text-2xl sm:text-4xl font-bold text-[#101820]">
            Prochains Défis au Programme
          </h2>
          <p className="text-sm text-stone-600 font-light">
            Inscrivez-vous pour être prévenu dès l'ouverture des dépôts et des cahiers des charges.
          </p>
        </div>

        <div className="space-y-6">
          {UPCOMING_CHALLENGES.map((ch) => (
            <div
              key={ch.number}
              className="bg-white border border-[#E2E8E5] rounded-3xl p-8 sm:p-10 space-y-6 hover:border-[#123B5D] transition-all shadow-xs"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#E2E8E5] pb-6">
                <div>
                  <div className="flex items-center gap-3 mb-1.5">
                    <span className="text-xs font-mono font-bold text-[#123B5D] uppercase tracking-wider">
                      CHALLENGE #{ch.number}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-md bg-[#F5F7F6] text-[11px] font-mono font-semibold text-stone-600">
                      {ch.track}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-md bg-[#59B83E]/10 text-[11px] font-mono font-bold text-[#59B83E]">
                      {ch.status}
                    </span>
                  </div>
                  <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#101820]">
                    {ch.title}
                  </h3>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono text-stone-500 shrink-0">
                  <span>DURÉE : {ch.duration}</span>
                  <span className="text-[#123B5D] font-bold">RÉCOMPENSES PRÉVUES</span>
                </div>
              </div>

              <p className="text-sm text-stone-600 font-light leading-relaxed max-w-3xl">
                {ch.description}
              </p>

              <div className="space-y-2">
                <span className="text-xs font-mono font-bold uppercase text-[#123B5D] tracking-wider block">
                  Critères d'évaluation clés :
                </span>
                <div className="flex flex-wrap gap-2">
                  {ch.evaluationCriteria.map((c, i) => (
                    <span key={i} className="text-xs px-3 py-1 bg-[#F5F7F6] border border-[#E2E8E5] rounded-lg text-[#101820]">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Global Waitlist Box */}
        <div className="bg-[#123B5D] text-white rounded-3xl p-8 sm:p-14 text-center space-y-6 max-w-3xl mx-auto shadow-xl">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#C8F169] block">
            ACCÈS ANTICIPÉ AUX CHALLENGES
          </span>
          <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-white">
            Recevez le cahier des charges dès l'ouverture
          </h3>
          <p className="text-stone-300 text-xs sm:text-sm font-light max-w-lg mx-auto leading-relaxed">
            Les premiers inscrits recevront les spécifications techniques et l'accès au dépôt starter 48 heures avant l'ouverture officielle.
          </p>

          <form onSubmit={handleNotify} className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto pt-2">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Votre adresse e-mail..."
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-stone-400 text-xs focus:outline-hidden focus:border-[#C8F169]"
            />
            <button
              type="submit"
              className="w-full sm:w-auto shrink-0 px-6 py-3 rounded-xl bg-[#59B83E] hover:bg-[#4ea536] text-white text-xs font-bold transition-all cursor-pointer"
            >
              {submitted ? 'Enregistré ✓' : 'Être informé du lancement →'}
            </button>
          </form>
        </div>

      </section>

    </div>
  );
};
