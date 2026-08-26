import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLearning } from '../context/LearningContext';
import { 
  Bell, 
  X, 
  CheckCircle2, 
  BookOpen, 
  ShieldCheck, 
  Award, 
  Sparkles, 
  ArrowRight,
  Trash2
} from 'lucide-react';
import { ViewType } from '../types/platform';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'passport' | 'learning' | 'system' | 'validation';
  date: string;
  read: boolean;
  actionView?: ViewType;
  actionLabel?: string;
}

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: ViewType) => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  onNavigate
}) => {
  const { profile } = useAuth();
  const { userEnrollments } = useLearning();

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      title: 'Bienvenue dans votre univers SkillBridge',
      message: 'Votre espace souverain est prêt. Commencez à ajouter vos compétences pour activer votre Skill Passport.',
      type: 'system',
      date: 'À l\'instant',
      read: false,
      actionView: 'passport',
      actionLabel: 'Accéder au Passport'
    },
    {
      id: 'notif-2',
      title: 'Formations & Masterclasses disponibles',
      message: 'Découvrez les parcours certifiants animés par des ingénieurs et architectes seniors du continent.',
      type: 'learning',
      date: 'Aujourd\'hui',
      read: false,
      actionView: 'learn' as const,
      actionLabel: 'Explorer les cours'
    },
    ...(profile?.skills && profile.skills.length > 0 ? [
      {
        id: 'notif-3',
        title: `${profile.skills.length} compétence(s) enregistrée(s)`,
        message: 'Vos compétences sont reliées à votre Skill Passport. Ajoutez des preuves pour passer au statut Démontrée.',
        type: 'passport' as const,
        date: 'Récemment',
        read: false,
        actionView: 'passport' as const,
        actionLabel: 'Ajouter une preuve'
      }
    ] : []),
    ...(userEnrollments && userEnrollments.length > 0 ? [
      {
        id: 'notif-4',
        title: `Vous suivez ${userEnrollments.length} formation(s)`,
        message: 'Continuez votre apprentissage pour valider vos projets et enrichir votre passeport.',
        type: 'learning' as const,
        date: 'En cours',
        read: false,
        actionView: 'learn' as const,
        actionLabel: 'Reprendre mes cours'
      }
    ] : [])
  ]);

  if (!isOpen) return null;

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleAction = (notif: NotificationItem) => {
    setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, read: true } : n));
    if (notif.actionView) {
      onNavigate(notif.actionView);
      onClose();
    }
  };

  const deleteNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'passport':
        return <ShieldCheck className="w-4 h-4 text-[#123B5D]" />;
      case 'learning':
        return <BookOpen className="w-4 h-4 text-[#59B83E]" />;
      case 'validation':
        return <Award className="w-4 h-4 text-amber-600" />;
      default:
        return <Sparkles className="w-4 h-4 text-sky-600" />;
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#123B5D]/10 flex items-center justify-center text-[#123B5D]">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-heading text-lg font-bold text-[#101820] flex items-center gap-2">
                <span>Notifications</span>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-[#59B83E] text-white text-[11px] font-mono font-bold">
                    {unreadCount}
                  </span>
                )}
              </h2>
              <p className="text-xs text-stone-500">Mises à jour de votre parcours et de votre Skill Passport</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="text-xs text-[#123B5D] hover:text-[#59B83E] font-medium transition-colors px-2 py-1"
              >
                Tout lire
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
          {notifications.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-stone-100 flex items-center justify-center text-stone-400 mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium text-stone-600">Vous êtes à jour !</p>
              <p className="text-xs text-stone-400">Aucune notification non lue.</p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => handleAction(notif)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer group flex items-start gap-3.5 ${
                  notif.read
                    ? 'bg-white border-stone-200/80 hover:border-stone-300 opacity-80'
                    : 'bg-[#F5F7F6] border-stone-200 hover:border-[#123B5D]/30 shadow-xs'
                }`}
              >
                <div className="p-2.5 rounded-xl bg-white border border-stone-200 shrink-0 shadow-2xs">
                  {getIcon(notif.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className={`text-sm font-bold truncate ${notif.read ? 'text-stone-700' : 'text-[#101820]'}`}>
                      {notif.title}
                    </h3>
                    <span className="text-[11px] font-mono text-stone-400 shrink-0">{notif.date}</span>
                  </div>

                  <p className="text-xs text-stone-600 mt-1 line-clamp-2 leading-relaxed">
                    {notif.message}
                  </p>

                  {notif.actionLabel && (
                    <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-[#123B5D] group-hover:text-[#59B83E] transition-colors">
                      <span>{notif.actionLabel}</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={(e) => deleteNotification(notif.id, e)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 text-stone-400 hover:text-red-500 rounded-lg hover:bg-stone-100 transition-all shrink-0"
                  title="Supprimer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-100 bg-stone-50/50 flex items-center justify-between text-xs text-stone-500">
          <span>SkillBridge Notifications</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#123B5D] text-white font-medium hover:bg-[#0A2338] transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
