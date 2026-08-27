import React, { useState, useEffect } from 'react';
import { ViewType } from '../types/platform';
import { SkillExchange, ExchangeStatus } from '../types';
import { useAuth } from '../context/AuthContext';
import { SkillExchangeService, ExchangeMatch } from '../services/skillExchangeService';
import { FaIcon } from '../components/FaIcon';
import { faRetweet, faPlus, faCheck, faTimes, faPaperPlane, faGraduationCap, faChalkboardTeacher } from '@fortawesome/free-solid-svg-icons';
import { UserAvatar } from '../components/UserAvatar';

export const SkillExchangeView: React.FC<{ onNavigate: (view: ViewType) => void }> = ({ onNavigate }) => {
  const { user, profile } = useAuth();
  const [activeTab, setActiveTab] = useState<'suggestions' | 'exchanges'>('suggestions');
  const [matches, setMatches] = useState<ExchangeMatch[]>([]);
  const [exchanges, setExchanges] = useState<SkillExchange[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<ExchangeMatch | null>(null);
  const [offerSkill, setOfferSkill] = useState('');
  const [requestSkill, setRequestSkill] = useState('');
  const [exchangeMsg, setExchangeMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const loadData = async () => {
    if (!user) return;
    setIsLoading(true);
    const [matchesRes, exchangesRes] = await Promise.all([
      SkillExchangeService.findMatches(user.id),
      SkillExchangeService.getMyExchanges(user.id),
    ]);
    setMatches(matchesRes.data || []);
    setExchanges(exchangesRes.data || []);
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleOpenProposeModal = (match?: ExchangeMatch) => {
    if (match) {
      setSelectedPartner(match);
      setOfferSkill(match.wantsToLearn[0] || '');
      setRequestSkill(match.canTeach[0] || '');
    } else {
      setSelectedPartner(null);
      setOfferSkill('');
      setRequestSkill('');
    }
    setExchangeMsg('');
    setIsModalOpen(true);
  };

  const handleProposeExchange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profile || !selectedPartner) return;
    if (!offerSkill || !requestSkill) return;

    setIsSubmitting(true);
    const res = await SkillExchangeService.createExchange(
      user.id,
      profile.id,
      selectedPartner.partnerProfile.id,
      offerSkill,
      requestSkill,
      exchangeMsg
    );
    setIsSubmitting(false);

    if (res.data) {
      setIsModalOpen(false);
      setNotification('Proposition d’échange envoyée avec succès !');
      loadData();
      setTimeout(() => setNotification(null), 4000);
    }
  };

  const handleUpdateStatus = async (exchangeId: string, newStatus: ExchangeStatus) => {
    const res = await SkillExchangeService.updateStatus(exchangeId, newStatus);
    if (res.data) {
      loadData();
    }
  };

  return (
    <div className="flex-1 w-full min-h-screen bg-[#F5F7F6] py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-heading font-bold text-[#101820]">Skill Exchange</h1>
            <p className="text-sm text-stone-500 mt-1">Échangez vos compétences directement entre pairs de manière bilatérale.</p>
          </div>
          {matches.length > 0 && (
            <button 
              onClick={() => handleOpenProposeModal(matches[0])}
              className="px-5 py-2.5 rounded-xl bg-[#123B5D] text-white text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#0A2338] transition-colors shadow-sm"
            >
              <FaIcon icon={faPlus} />
              Nouvel échange
            </button>
          )}
        </div>

        {notification && (
          <div className="p-4 rounded-2xl bg-[#ECFDF5] border border-[#59B83E]/20 text-[#59B83E] text-sm font-medium flex items-center gap-2">
            <FaIcon icon={faCheck} />
            {notification}
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b border-[#E2E8E5]">
          <button 
            onClick={() => setActiveTab('suggestions')}
            className={`py-3 px-4 font-medium text-sm transition-colors border-b-2 ${activeTab === 'suggestions' ? 'border-[#59B83E] text-[#123B5D]' : 'border-transparent text-stone-500 hover:text-stone-700'}`}
          >
            Suggestions de Match ({matches.length})
          </button>
          <button 
            onClick={() => setActiveTab('exchanges')}
            className={`py-3 px-4 font-medium text-sm transition-colors border-b-2 ${activeTab === 'exchanges' ? 'border-[#59B83E] text-[#123B5D]' : 'border-transparent text-stone-500 hover:text-stone-700'}`}
          >
            Mes Échanges en cours ({exchanges.length})
          </button>
        </div>

        {isLoading ? (
          <div className="py-12 text-center text-stone-400">Chargement des opportunités d’échange...</div>
        ) : activeTab === 'suggestions' ? (
          matches.length === 0 ? (
            <div className="bg-white rounded-3xl border border-[#E2E8E5] p-12 text-center shadow-xs">
              <div className="w-16 h-16 rounded-2xl bg-stone-50 border border-stone-100 flex items-center justify-center mx-auto mb-4 text-[#123B5D] text-2xl">
                <FaIcon icon={faRetweet} />
              </div>
              <h3 className="text-lg font-heading font-bold text-[#101820] mb-2">
                Aucune correspondance automatique pour l'instant
              </h3>
              <p className="text-sm text-stone-500 max-w-md mx-auto">
                Pour recevoir des correspondances d'échange, indiquez dans vos compétences celles que vous pouvez enseigner (<span className="text-[#59B83E] font-medium">I CAN TEACH</span>) et celles que vous souhaitez apprendre (<span className="text-[#3B82F6] font-medium">WANT TO LEARN</span>).
              </p>
              <button 
                onClick={() => onNavigate('dashboard-talent')}
                className="mt-6 px-6 py-2.5 rounded-xl bg-[#123B5D] text-white font-bold text-sm hover:bg-[#0A2338] transition-colors"
              >
                Gérer mes compétences
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {matches.map((match, idx) => (
                <div key={idx} className="bg-white rounded-2xl border border-[#E2E8E5] p-6 shadow-xs flex flex-col justify-between hover:border-[#123B5D]/30 transition-all">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <UserAvatar 
                        avatarUrl={match.partnerProfile.avatar_url}
                        name={`${match.partnerProfile.first_name} ${match.partnerProfile.last_name}`}
                        size="md"
                      />
                      <div>
                        <h4 className="font-bold text-sm text-[#101820]">{match.partnerProfile.first_name} {match.partnerProfile.last_name}</h4>
                        <p className="text-xs text-stone-400">{match.partnerProfile.headline || match.partnerProfile.location || 'Membre SkillBridge'}</p>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-stone-50 border border-stone-100 space-y-2 text-xs">
                      {match.canTeach.length > 0 && (
                        <div className="flex items-start gap-2">
                          <FaIcon icon={faChalkboardTeacher} className="text-[#59B83E] mt-0.5" />
                          <div>
                            <span className="font-semibold text-stone-700">Peut vous enseigner : </span>
                            <span className="text-[#123B5D] font-bold">{match.canTeach.join(', ')}</span>
                          </div>
                        </div>
                      )}
                      {match.wantsToLearn.length > 0 && (
                        <div className="flex items-start gap-2">
                          <FaIcon icon={faGraduationCap} className="text-[#3B82F6] mt-0.5" />
                          <div>
                            <span className="font-semibold text-stone-700">Souhaite apprendre de vous : </span>
                            <span className="text-[#123B5D] font-bold">{match.wantsToLearn.join(', ')}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => handleOpenProposeModal(match)}
                    className="mt-4 w-full py-2 rounded-xl bg-[#123B5D] text-white text-xs font-bold hover:bg-[#0A2338] transition-colors flex items-center justify-center gap-2"
                  >
                    <FaIcon icon={faRetweet} />
                    Proposer un échange
                  </button>
                </div>
              ))}
            </div>
          )
        ) : (
          /* Exchanges Tab */
          exchanges.length === 0 ? (
            <div className="bg-white rounded-3xl border border-[#E2E8E5] p-12 text-center shadow-xs">
              <p className="text-sm text-stone-500">Vous n'avez aucun échange en cours.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {exchanges.map((ex) => {
                const isRequester = ex.requester_user_id === user?.id;
                const other = isRequester ? ex.responder : ex.requester;

                return (
                  <div key={ex.id} className="bg-white rounded-2xl border border-[#E2E8E5] p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <UserAvatar 
                        avatarUrl={other?.avatar_url}
                        name={`${other?.first_name || ''} ${other?.last_name || ''}`}
                        size="md"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-[#101820]">{other?.first_name} {other?.last_name}</h4>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            ex.status === 'accepted' ? 'bg-[#ECFDF5] text-[#59B83E]' :
                            ex.status === 'pending' ? 'bg-amber-50 text-amber-600' :
                            ex.status === 'declined' ? 'bg-rose-50 text-rose-600' : 'bg-stone-100 text-stone-600'
                          }`}>
                            {ex.status.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-xs text-stone-500 mt-1">
                          Offre : <strong className="text-[#123B5D]">{ex.offer_skill_name}</strong> ↔ Demande : <strong className="text-[#123B5D]">{ex.request_skill_name}</strong>
                        </p>
                        {ex.message && <p className="text-xs text-stone-400 italic mt-1">"{ex.message}"</p>}
                      </div>
                    </div>

                    {!isRequester && ex.status === 'pending' && (
                      <div className="flex items-center gap-2 w-full md:w-auto">
                        <button
                          onClick={() => handleUpdateStatus(ex.id, 'accepted')}
                          className="px-4 py-1.5 rounded-lg bg-[#59B83E] text-white text-xs font-bold hover:bg-[#489932] flex items-center gap-1.5"
                        >
                          <FaIcon icon={faCheck} />
                          Accepter
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(ex.id, 'declined')}
                          className="px-4 py-1.5 rounded-lg bg-stone-100 text-stone-600 text-xs font-bold hover:bg-stone-200 flex items-center gap-1.5"
                        >
                          <FaIcon icon={faTimes} />
                          Décliner
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )
        )}

      </div>

      {/* Propose Modal */}
      {isModalOpen && selectedPartner && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl border border-stone-100 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold font-heading text-[#101820]">
                Proposer un échange avec {selectedPartner.partnerProfile.first_name}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-stone-600">
                <FaIcon icon={faTimes} />
              </button>
            </div>

            <form onSubmit={handleProposeExchange} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  Ce que vous proposez d'enseigner :
                </label>
                <input 
                  type="text"
                  required
                  value={offerSkill}
                  onChange={(e) => setOfferSkill(e.target.value)}
                  placeholder="Ex: React, Node.js, Design..."
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8E5] text-sm focus:border-[#123B5D] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  Ce que vous souhaitez apprendre :
                </label>
                <input 
                  type="text"
                  required
                  value={requestSkill}
                  onChange={(e) => setRequestSkill(e.target.value)}
                  placeholder="Ex: Python, Data Science, Figma..."
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8E5] text-sm focus:border-[#123B5D] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  Message de présentation :
                </label>
                <textarea 
                  rows={3}
                  value={exchangeMsg}
                  onChange={(e) => setExchangeMsg(e.target.value)}
                  placeholder="Expliquez vos disponibilités et vos objectifs d'échange..."
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8E5] text-sm focus:border-[#123B5D] focus:outline-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-stone-100 text-stone-600 font-bold text-sm hover:bg-stone-200"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 rounded-xl bg-[#123B5D] text-white font-bold text-sm hover:bg-[#0A2338] disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <FaIcon icon={faPaperPlane} />
                  {isSubmitting ? 'Envoi...' : 'Envoyer la proposition'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
