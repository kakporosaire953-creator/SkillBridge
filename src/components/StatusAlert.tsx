import React from 'react';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';

interface StatusAlertProps {
  type?: 'error' | 'success' | 'info';
  message: string;
  onClose?: () => void;
  className?: string;
}

export const StatusAlert: React.FC<StatusAlertProps> = ({
  type = 'error',
  message,
  onClose,
  className = '',
}) => {
  if (!message) return null;

  const styles = {
    error: 'bg-rose-950/60 border-rose-800/80 text-rose-200',
    success: 'bg-emerald-950/60 border-emerald-800/80 text-emerald-200',
    info: 'bg-stone-900/80 border-stone-700 text-stone-200',
  };

  const icons = {
    error: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />,
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />,
    info: <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />,
  };

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-xl border backdrop-blur-sm transition-all duration-200 ${styles[type]} ${className}`}
      role="alert"
    >
      {icons[type]}
      <div className="flex-1 text-sm leading-relaxed font-medium">
        {message}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          type="button"
          className="text-stone-400 hover:text-stone-100 transition-colors p-1 -mr-1 -mt-1 rounded-lg"
          aria-label="Fermer l'alerte"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
