import React, { useState } from 'react';
import { ViewType } from '../types/platform';
import { Send } from 'lucide-react';

interface ContactViewProps {
  onNavigate?: (view: ViewType) => void;
}

export const ContactView: React.FC<ContactViewProps> = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
      setSubmitted(false);
      alert('Votre message a été transmis à l\'équipe SkillBridge. Nous vous répondrons sous 24 heures.');
    }, 1500);
  };

  return (
    <div className="flex-1 w-full bg-[#F5F7F6] text-[#101820] py-20 sm:py-28">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#E2E8E5] text-[#123B5D] text-xs font-mono font-bold uppercase tracking-wider">
            <span>CONTACT & ÉCHANGES</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-5xl font-extrabold text-[#101820] leading-tight">
            Entrons en <span className="text-[#59B83E]">contact</span>.
          </h1>
          <p className="text-stone-600 text-sm sm:text-base font-light">
            Pour toute question sur l'écosystème, les partenariats d'entreprise ou l'adhésion au réseau de mentors.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white border border-[#E2E8E5] rounded-3xl p-6 space-y-3 shadow-xs">
              <span className="font-mono text-xs font-bold text-[#59B83E] uppercase block">DIRECT EMAIL</span>
              <p className="text-xs text-stone-600">Pour les demandes générales et la presse :</p>
              <p className="text-xs font-bold text-[#123B5D] font-mono">contact@skillbridge.africa</p>
            </div>

            <div className="bg-white border border-[#E2E8E5] rounded-3xl p-6 space-y-3 shadow-xs">
              <span className="font-mono text-xs font-bold text-[#123B5D] uppercase block">BUREAUX & HUBS</span>
              <p className="text-xs text-stone-600">Présence et correspondants :</p>
              <p className="text-xs font-semibold text-[#101820]">Dakar · Abidjan · Lagos · Nairobi</p>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="bg-white border border-[#E2E8E5] rounded-3xl p-8 shadow-xs space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-[#123B5D] mb-1">Votre Nom</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Nom complet"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#F5F7F6] border border-[#E2E8E5] text-xs text-[#101820] focus:outline-hidden focus:border-[#123B5D]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-[#123B5D] mb-1">Adresse E-mail</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="email@domaine.com"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#F5F7F6] border border-[#E2E8E5] text-xs text-[#101820] focus:outline-hidden focus:border-[#123B5D]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#123B5D] mb-1">Sujet</label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Partenariat entreprise, mentorat, presse..."
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F5F7F6] border border-[#E2E8E5] text-xs text-[#101820] focus:outline-hidden focus:border-[#123B5D]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#123B5D] mb-1">Votre Message</label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Écrivez votre message..."
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F5F7F6] border border-[#E2E8E5] text-xs text-[#101820] focus:outline-hidden focus:border-[#123B5D]"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-[#123B5D] hover:bg-[#101820] text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    <Send className="w-4 h-4 text-[#C8F169]" />
                    <span>{submitted ? 'Transmission...' : 'Envoyer mon message'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
