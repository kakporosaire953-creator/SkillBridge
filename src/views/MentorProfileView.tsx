import React, { useState } from 'react';
import { ViewType } from '../types/platform';
import { useLearning } from '../context/LearningContext';
import { 
  ArrowLeft, 
  ShieldCheck, 
  Sparkles, 
  MessageSquare, 
  CheckCircle2, 
  Mail, 
  Clock, 
  ChevronRight
} from 'lucide-react';

interface MentorProfileProps {
  onNavigate: (view: ViewType) => void;
}

export const MentorProfileView: React.FC<MentorProfileProps> = ({ onNavigate }) => {
  const { 
    selectedMentorId, 
    allContents, 
    setActiveContentId 
  } = useLearning();

  const [messageSent, setMessageSent] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [contactMessage, setContactMessage] = useState('');

  // Find mentor content
  const mentorContents = allContents.filter(
    (c) => c.mentorId === selectedMentorId || !selectedMentorId
  );

  const sampleMentor = {
    name: mentorContents[0]?.mentorName || 'Dr. Alexandre Mercier',
    role: mentorContents[0]?.mentorRole || 'Principal Cloud Architect & Mentor Référent',
    avatar: mentorContents[0]?.mentorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    bio: 'Architecte systèmes avec plus de 12 ans d\'expérience dans la conception d\'infrastructures distribuées à haute disponibilité. Mentor actif sur SkillBridge pour accompagner les ingénieurs dans la validation de preuves concrètes et audités.',
    company: 'Ex-Tech Lead @ ScalableCloud',
    location: 'Paris, France',
    stats: {
      totalCourses: mentorContents.length,
      verifiedSkills: ['Systèmes Distribués', 'Kubernetes', 'Go / Golang', 'Résilience Réseau', 'Architecture Cloud']
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    setMessageSent(true);
    setTimeout(() => {
      setMessageSent(false);
      setContactModalOpen(false);
      setContactMessage('');
    }, 2000);
  };

  return (
    <div className="w-full bg-[#F5F7F6] min-h-screen pb-24">
      
      {/* Top Breadcrumb Header */}
      <div className="bg-white border-b border-[#E2E8E5] py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            type="button"
            onClick={() => onNavigate('learn')}
            className="inline-flex items-center gap-2 text-xs font-semibold text-stone-600 hover:text-[#123B5D] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour à l'espace Apprendre</span>
          </button>

          <span className="text-xs font-mono text-[#59B83E] font-bold uppercase flex items-center gap-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Profil Mentor Certifié</span>
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Mentor Identity Card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl border border-[#E2E8E5] p-6 shadow-2xs space-y-6 text-center">
            <div className="relative inline-block mx-auto">
              <img
                src={sampleMentor.avatar}
                alt={sampleMentor.name}
                className="w-28 h-28 rounded-3xl object-cover border-2 border-[#59B83E] shadow-sm mx-auto"
                referrerPolicy="no-referrer"
              />
              <div className="absolute -bottom-2 right-2 p-1.5 rounded-full bg-[#59B83E] text-white shadow">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>

            <div className="space-y-1">
              <h1 className="text-xl font-bold text-[#101820]">{sampleMentor.name}</h1>
              <p className="text-xs font-medium text-[#123B5D]">{sampleMentor.role}</p>
              <p className="text-xs text-stone-500">{sampleMentor.company}</p>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed text-left border-t border-stone-100 pt-4">
              {sampleMentor.bio}
            </p>

            <button
              type="button"
              onClick={() => setContactModalOpen(true)}
              className="w-full py-3 rounded-2xl bg-[#123B5D] hover:bg-[#101820] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
            >
              <MessageSquare className="w-4 h-4 text-[#C8F169]" />
              <span>Contacter le mentor</span>
            </button>
          </div>

          {/* Mentoring Expertise Areas */}
          <div className="bg-white rounded-3xl border border-[#E2E8E5] p-6 shadow-2xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#59B83E]" />
              <span>Domaines d'expertise audités</span>
            </h3>

            <div className="flex flex-wrap gap-2">
              {sampleMentor.stats.verifiedSkills.map((skill) => (
                <div
                  key={skill}
                  className="px-3 py-1 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs font-semibold flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{skill}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Published Courses and Masterclasses */}
        <div className="lg:col-span-8 space-y-6">
          <div>
            <h2 className="text-xl font-bold text-[#123B5D]">Programmes créés par {sampleMentor.name}</h2>
            <p className="text-xs text-stone-500">
              Formations certifiantes, cours pratiques et masterclasses en direct.
            </p>
          </div>

          <div className="space-y-4">
            {mentorContents.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-[#E2E8E5] p-5 shadow-2xs hover:border-[#123B5D] transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={item.coverImage}
                    alt={item.title}
                    className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-[#123B5D] text-white text-[10px] font-bold uppercase">
                        {item.type}
                      </span>
                      <span className="text-[11px] font-mono text-stone-400">{item.level}</span>
                    </div>
                    <h3 className="text-sm font-bold text-[#101820]">{item.title}</h3>
                    <p className="text-xs text-stone-500 line-clamp-1">{item.headline}</p>
                    <div className="text-[11px] text-stone-400 flex items-center gap-2">
                      <Clock className="w-3 h-3" />
                      <span>{item.estimatedDuration}</span>
                      <span>•</span>
                      <span>{item.accessType === 'free' ? 'Gratuit' : `${item.price} ${item.currency}`}</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setActiveContentId(item.id);
                    onNavigate('learn-detail');
                  }}
                  className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-[#123B5D] hover:text-white text-[#123B5D] text-xs font-bold flex items-center gap-1.5 transition-all flex-shrink-0 cursor-pointer"
                >
                  <span>Découvrir</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Contact Modal */}
      {contactModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#E2E8E5] p-6 sm:p-8 max-w-md w-full space-y-6 shadow-2xl">
            <div className="space-y-1">
              <span className="text-xs font-mono font-bold text-[#59B83E] uppercase">Messagerie Mentor</span>
              <h3 className="text-lg font-bold text-[#101820]">Poser une question à {sampleMentor.name}</h3>
            </div>

            {messageSent ? (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Votre message a été transmis au mentor.</span>
              </div>
            ) : (
              <form onSubmit={handleSendMessage} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700">Votre question ou demande d'accompagnement *</label>
                  <textarea
                    required
                    rows={4}
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    placeholder="Bonjour Dr. Mercier, j'aimerais échanger sur..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-[#123B5D]"
                  />
                </div>

                <div className="flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setContactModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-stone-200 text-xs font-semibold text-stone-700"
                  >
                    Annuler
                  </button>

                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-[#123B5D] text-white text-xs font-bold flex items-center gap-1.5"
                  >
                    <Mail className="w-3.5 h-3.5 text-[#C8F169]" />
                    <span>Envoyer le message</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
