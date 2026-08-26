import React, { useState } from 'react';
import { ViewType, MentorProfileData } from '../types/platform';
import { 
  ArrowRight, 
  CheckCircle2, 
  X 
} from 'lucide-react';

interface MentorsViewProps {
  onNavigate: (view: ViewType) => void;
}

const SAMPLE_MENTORS: MentorProfileData[] = [
  {
    id: 'm-01',
    name: 'Dr. Ousmane Sylla',
    role: 'VP Engineering & Architecture',
    company: 'FinTech Alliance West Africa',
    country: 'Sénégal',
    experienceYears: 16,
    expertise: ['Distributed Architecture', 'High Throughput Systems', 'Engineering Leadership'],
    bio: '16 ans à bâtir et scaler des architectures critiques de paiement à travers l\'UEMOA. Mentor passionné par la rigueur mathématique et la transmission.',
    sessionsConducted: 48,
    rating: 4.9,
    availability: '2 créneaux disponibles cette semaine'
  },
  {
    id: 'm-02',
    name: 'Amara Diabaté',
    role: 'Head of Product & Design Strategy',
    company: 'Sahel Scale Ventures',
    country: 'Mali / Côte d\'Ivoire',
    experienceYears: 12,
    expertise: ['Product Strategy', 'Design Systems', 'Go-To-Market'],
    bio: 'Accompagne les créateurs de produits numériques africains à concevoir des expériences sobres, accessibles et à forte valeur perçue.',
    sessionsConducted: 36,
    rating: 5.0,
    availability: 'Disponible jeudis soirs'
  },
  {
    id: 'm-03',
    name: 'Chinedu Eze',
    role: 'Staff Cloud Infrastructure Architect',
    company: 'Lagos Cloud Labs',
    country: 'Nigéria',
    experienceYears: 14,
    expertise: ['Kubernetes', 'Cloud Security', 'Cost Optimization'],
    bio: 'Spécialiste de l\'infrastructure cloud résiliente aux coupures réseau et de l\'optimisation drastique des coûts d\'hébergement.',
    sessionsConducted: 52,
    rating: 4.8,
    availability: 'Disponible samedis matins'
  }
];

export const MentorsView: React.FC<MentorsViewProps> = ({ onNavigate }) => {
  const [mentors] = useState<MentorProfileData[]>(SAMPLE_MENTORS);
  const [activeMentor, setActiveMentor] = useState<MentorProfileData | null>(null);
  const [bookingTopic, setBookingTopic] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const handleBookSession = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setActiveMentor(null);
      setBookingTopic('');
      setBookingDate('');
      alert(`Session 1-on-1 confirmée avec ${activeMentor?.name} !`);
    }, 1500);
  };

  return (
    <div className="flex-1 w-full bg-[#F5F7F6] text-[#101820]">
      
      {/* Hero */}
      <section className="py-20 sm:py-28 border-b border-[#E2E8E5] bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F5F7F6] border border-[#E2E8E5] text-[#123B5D] text-xs font-mono font-bold uppercase tracking-wider">
            <span>RÉSEAU DE MENTORAT PANAFRICAIN</span>
          </div>

          <h1 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#101820] leading-tight">
            L'expérience devient plus puissante <br className="hidden sm:inline" />
            <span className="text-[#59B83E]">lorsqu'elle est transmise.</span>
          </h1>

          <p className="text-stone-600 text-base sm:text-xl font-light leading-relaxed max-w-2xl mx-auto">
            Échangez avec des architectes, VPs produit et leaders techniques établis pour débloquer vos défis d'ingénierie et accélérer votre trajectoire.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => onNavigate('learn')}
              className="px-8 py-4 rounded-xl bg-[#59B83E] hover:bg-[#4ea236] text-white font-bold text-sm sm:text-base transition-all flex items-center gap-2.5 cursor-pointer shadow-md"
            >
              <span>Explorer les cours & masterclasses</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </button>

            <button
              type="button"
              onClick={() => onNavigate('onboarding')}
              className="px-8 py-4 rounded-xl bg-[#123B5D] hover:bg-[#101820] text-white font-bold text-sm sm:text-base transition-all flex items-center gap-2.5 cursor-pointer shadow-md"
            >
              <span>Devenir mentor</span>
              <ArrowRight className="w-4 h-4 text-[#C8F169]" />
            </button>
          </div>
        </div>
      </section>

      {/* Mentors Directory */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#E2E8E5]">
          <div className="space-y-1">
            <span className="text-xs font-mono font-bold uppercase text-[#59B83E] tracking-wider">
              PROFILS D'EXEMPLES CERTIFIÉS
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#101820]">
              Mentors disponibles pour des sessions 1-on-1
            </h2>
          </div>
          <p className="text-xs text-stone-500 font-mono">Sessions d'accompagnement de 45 minutes</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {mentors.map((m) => (
            <div
              key={m.id}
              className="bg-white border border-[#E2E8E5] rounded-3xl p-8 space-y-6 shadow-xs flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-[#123B5D] text-white flex items-center justify-center font-bold text-lg">
                    {m.name.slice(0, 2).toUpperCase()}
                  </div>
                  <span className="text-xs font-mono font-bold text-[#59B83E] bg-[#59B83E]/10 px-2.5 py-1 rounded-md">
                    ★ {m.rating} ({m.sessionsConducted} sessions)
                  </span>
                </div>

                <div>
                  <h3 className="font-heading font-bold text-lg text-[#101820]">{m.name}</h3>
                  <p className="text-xs text-stone-500 font-medium">{m.role} · {m.company}</p>
                  <p className="text-[11px] text-[#123B5D] font-mono mt-0.5">{m.country} · {m.experienceYears} ans d'expérience</p>
                </div>

                <p className="text-xs text-stone-600 font-light leading-relaxed">
                  {m.bio}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {m.expertise.map((e) => (
                    <span key={e} className="text-[10px] px-2.5 py-1 rounded-lg bg-[#F5F7F6] border border-[#E2E8E5] text-[#101820]">
                      {e}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-[#E2E8E5] flex items-center justify-between">
                <span className="text-[11px] text-[#59B83E] font-medium font-mono">
                  {m.availability}
                </span>

                <button
                  type="button"
                  onClick={() => setActiveMentor(m)}
                  className="px-4 py-2 rounded-xl bg-[#123B5D] hover:bg-[#101820] text-white text-xs font-bold transition-all cursor-pointer"
                >
                  Réserver un créneau
                </button>
              </div>
            </div>
          ))}
        </div>

      </section>

      {/* Booking Modal */}
      {activeMentor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white border border-[#E2E8E5] rounded-3xl p-6 sm:p-10 max-w-lg w-full shadow-2xl space-y-6 relative">
            
            <button
              type="button"
              onClick={() => setActiveMentor(null)}
              className="absolute top-6 right-6 p-2 rounded-xl bg-[#F5F7F6] text-stone-500 hover:text-[#101820]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#59B83E] block">
                SESSION DE MENTORAT 1-ON-1 · 45 MIN
              </span>
              <h2 className="font-heading text-2xl font-bold text-[#101820]">
                Réserver avec {activeMentor.name}
              </h2>
              <p className="text-xs text-stone-500">
                {activeMentor.role} chez {activeMentor.company}
              </p>
            </div>

            <form onSubmit={handleBookSession} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#123B5D] mb-1.5">
                  Objectif principal de la session
                </label>
                <input
                  type="text"
                  required
                  value={bookingTopic}
                  onChange={(e) => setBookingTopic(e.target.value)}
                  placeholder="Ex: Revue d'architecture microservices, transition de carrière..."
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F5F7F6] border border-[#E2E8E5] text-xs text-[#101820] focus:outline-hidden focus:border-[#123B5D]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#123B5D] mb-1.5">
                  Créneau horaire
                </label>
                <select
                  required
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F5F7F6] border border-[#E2E8E5] text-xs text-[#101820] focus:outline-hidden focus:border-[#123B5D]"
                >
                  <option value="">Sélectionner une plage horaire</option>
                  <option value="jeudi-18h">Jeudi à 18h00 GMT</option>
                  <option value="samedi-10h">Samedi à 10h00 GMT</option>
                  <option value="lundi-19h">Lundi à 19h00 GMT</option>
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={bookingSuccess}
                  className="w-full py-3 rounded-xl bg-[#123B5D] hover:bg-[#101820] text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#C8F169]" />
                  <span>{bookingSuccess ? 'Confirmation en cours...' : 'Confirmer la réservation'}</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
