import React, { useState, useEffect, useRef } from 'react';
import { ViewType } from '../types/platform';
import { Conversation, Message } from '../types';
import { useAuth } from '../context/AuthContext';
import { MessagingService } from '../services/messagingService';
import { FaIcon } from '../components/FaIcon';
import { faSearch, faPaperPlane, faCommentDots } from '@fortawesome/free-solid-svg-icons';
import { UserAvatar } from '../components/UserAvatar';

export const MessagingView: React.FC<{ onNavigate: (view: ViewType) => void }> = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConvId, setSelectedConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load conversations
  useEffect(() => {
    const loadConversations = async () => {
      if (!user) return;
      setIsLoading(true);
      const res = await MessagingService.getConversations(user.id);
      const convList = res.data || [];
      setConversations(convList);
      if (convList.length > 0 && !selectedConvId) {
        setSelectedConvId(convList[0].id);
      }
      setIsLoading(false);
    };

    loadConversations();
  }, [user]);

  // Load messages & subscribe when conversation selected
  useEffect(() => {
    if (!selectedConvId) return;

    const loadMessages = async () => {
      const res = await MessagingService.getMessages(selectedConvId);
      setMessages(res.data || []);
      scrollToBottom();
    };

    loadMessages();

    // Realtime subscription
    const sub = MessagingService.subscribeToMessages(selectedConvId, (newMsg) => {
      setMessages((prev) => [...prev, newMsg]);
      scrollToBottom();
    });

    return () => {
      sub.unsubscribe();
    };
  }, [selectedConvId]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedConvId || !messageText.trim()) return;

    setIsSending(true);
    const content = messageText;
    setMessageText('');

    const res = await MessagingService.sendMessage(selectedConvId, user.id, content);
    setIsSending(false);

    if (res.data) {
      setMessages((prev) => [...prev, res.data!]);
      scrollToBottom();
    }
  };

  const selectedConv = conversations.find((c) => c.id === selectedConvId);
  const filteredConversations = conversations.filter((c) => {
    const name = `${c.other_participant?.first_name || ''} ${c.other_participant?.last_name || ''}`.toLowerCase();
    return !searchQuery || name.includes(searchQuery.toLowerCase());
  });

  return (
    <div className="flex-1 w-full h-[calc(100vh-80px)] lg:h-screen flex bg-white overflow-hidden">
      {/* Sidebar List */}
      <div className="w-full lg:w-80 flex-shrink-0 border-r border-[#E2E8E5] flex flex-col bg-[#F5F7F6]">
        <div className="p-4 border-b border-[#E2E8E5] bg-white">
          <h2 className="text-xl font-heading font-bold text-[#101820] mb-3">Messagerie</h2>
          <div className="relative">
            <FaIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-sm" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher une discussion..." 
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#E2E8E5] bg-[#F5F7F6] text-xs focus:outline-none focus:border-[#59B83E]"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {isLoading ? (
            <div className="text-center py-10 text-xs text-stone-400">Chargement des messages...</div>
          ) : filteredConversations.length === 0 ? (
            <div className="text-center py-12 px-4">
              <FaIcon icon={faCommentDots} className="text-3xl text-stone-300 mb-2" />
              <p className="text-xs text-stone-500 font-medium">Aucune conversation trouvée.</p>
              <p className="text-[11px] text-stone-400 mt-1">Contactez un talent ou un mentor depuis l'Explorer pour démarrer.</p>
            </div>
          ) : (
            filteredConversations.map((conv) => {
              const other = conv.other_participant;
              const isSelected = conv.id === selectedConvId;

              return (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConvId(conv.id)}
                  className={`w-full p-3 rounded-xl flex items-center gap-3 text-left transition-colors ${
                    isSelected ? 'bg-white border border-[#E2E8E5] shadow-2xs' : 'hover:bg-white/60'
                  }`}
                >
                  <UserAvatar 
                    avatarUrl={other?.avatar_url}
                    name={`${other?.first_name || ''} ${other?.last_name || ''}`}
                    size="md"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-xs text-[#101820] truncate">
                        {other?.first_name} {other?.last_name}
                      </h4>
                      {conv.unread_count && conv.unread_count > 0 ? (
                        <span className="w-4 h-4 rounded-full bg-[#59B83E] text-white text-[9px] font-bold flex items-center justify-center">
                          {conv.unread_count}
                        </span>
                      ) : null}
                    </div>
                    <p className="text-[11px] text-stone-400 truncate mt-0.5">
                      {conv.last_message?.content || 'Nouvelle conversation'}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>
      
      {/* Main Chat Area */}
      <div className="hidden lg:flex flex-1 flex-col bg-white">
        {selectedConv ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-[#E2E8E5] flex items-center gap-3 bg-white">
              <UserAvatar 
                avatarUrl={selectedConv.other_participant?.avatar_url}
                name={`${selectedConv.other_participant?.first_name || ''} ${selectedConv.other_participant?.last_name || ''}`}
                size="md"
              />
              <div>
                <h3 className="font-bold text-sm text-[#101820]">
                  {selectedConv.other_participant?.first_name} {selectedConv.other_participant?.last_name}
                </h3>
                <p className="text-[10px] text-[#59B83E] font-medium">En ligne</p>
              </div>
            </div>

            {/* Messages Stream */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#F5F7F6]">
              {messages.map((msg) => {
                const isMe = msg.sender_id === user?.id;

                return (
                  <div
                    key={msg.id}
                    className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-md px-4 py-2.5 rounded-2xl text-xs ${
                        isMe
                          ? 'bg-[#123B5D] text-white rounded-br-none'
                          : 'bg-white text-stone-800 border border-[#E2E8E5] rounded-bl-none shadow-2xs'
                      }`}
                    >
                      <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                      <span className={`block text-[9px] mt-1 text-right ${isMe ? 'text-white/60' : 'text-stone-400'}`}>
                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Footer */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-[#E2E8E5] bg-white flex gap-2">
              <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Écrivez votre message..."
                className="flex-1 px-4 py-2.5 rounded-xl border border-[#E2E8E5] text-xs focus:border-[#123B5D] focus:outline-none"
              />
              <button
                type="submit"
                disabled={isSending || !messageText.trim()}
                className="px-5 py-2.5 rounded-xl bg-[#123B5D] text-white text-xs font-bold hover:bg-[#0A2338] disabled:opacity-40 transition-colors flex items-center gap-1.5"
              >
                <FaIcon icon={faPaperPlane} />
                <span>Envoyer</span>
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <div className="w-16 h-16 rounded-full bg-stone-50 border border-stone-100 flex items-center justify-center mb-4 text-stone-300 text-2xl">
              <FaIcon icon={faPaperPlane} />
            </div>
            <h3 className="text-lg font-heading font-bold text-[#101820]">Vos messages</h3>
            <p className="text-sm text-stone-500 max-w-sm mt-2">
              Sélectionnez une conversation dans la liste pour commencer à échanger en direct.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
