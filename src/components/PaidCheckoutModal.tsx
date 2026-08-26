import React, { useState } from 'react';
import { LearningItem } from '../types/learning';
import { FaIcon } from './FaIcon';
import { 
  faShieldHalved, 
  faXmark, 
  faLock,
  faCircleNotch,
  faGraduationCap,
  faTriangleExclamation
} from '@fortawesome/free-solid-svg-icons';

interface PaidCheckoutModalProps {
  item: LearningItem | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmEnroll: (paymentSimulated: boolean) => Promise<void>;
}

export const PaidCheckoutModal: React.FC<PaidCheckoutModalProps> = ({
  item,
  isOpen,
  onClose,
  onConfirmEnroll
}) => {
  const [selectedMethod, setSelectedMethod] = useState<'card' | 'mobile_money' | 'sandbox'>('sandbox');
  const [isProcessing, setIsProcessing] = useState(false);
  const [acceptedDisclaimer, setAcceptedDisclaimer] = useState(false);

  if (!isOpen || !item) return null;

  const priceAmount = item.price 
    ? `${item.price.toLocaleString('fr-FR')} ${item.currency || 'FCFA'}`
    : 'Payant';

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptedDisclaimer) return;

    setIsProcessing(true);
    try {
      // Simulate transaction processing with explicit transparency disclaimer
      await new Promise((resolve) => setTimeout(resolve, 800));
      await onConfirmEnroll(true);
      onClose();
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-modal-title"
    >
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#123B5D] text-white">
          <div className="flex items-center gap-2">
            <FaIcon icon={faShieldHalved} className="text-[#59B83E]" />
            <h2 id="checkout-modal-title" className="text-sm font-bold">
              Inscription à la formation officielle
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Fermer"
          >
            <FaIcon icon={faXmark} />
          </button>
        </div>

        {/* Item Recap */}
        <div className="p-6 space-y-6">
          <div className="p-4 rounded-2xl bg-[#FAFCFB] border border-[#E2E8E5] flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-[#123B5D] text-white flex items-center justify-center shrink-0">
              <FaIcon icon={faGraduationCap} className="text-lg text-[#59B83E]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-stone-400">
                  {item.isOfficialSkillBridge ? 'SkillBridge Officiel' : 'Cours Mentor'}
                </span>
                {item.isCertifying && (
                  <span className="px-2 py-0.5 rounded-full bg-[#59B83E]/10 text-[#59B83E] text-[10px] font-mono font-bold">
                    Certifiant
                  </span>
                )}
              </div>
              <h3 className="text-sm font-bold text-[#101820] truncate">
                {item.title}
              </h3>
              <div className="text-xs text-stone-500 mt-0.5">
                Accès illimité + Évaluations + Certificat de compétence
              </div>
            </div>
            <div className="text-right">
              <div className="text-base font-extrabold text-[#123B5D]">
                {priceAmount}
              </div>
              <div className="text-[10px] text-stone-400 font-mono">TTC</div>
            </div>
          </div>

          {/* Explicit Transparency Notice */}
          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-amber-800">
              <FaIcon icon={faTriangleExclamation} />
              <span>Environnement de Démonstration & Souveraineté</span>
            </div>
            <p className="text-[11px] leading-relaxed text-amber-800/90">
              Conformément à notre charte de transparence, aucune somme réelle n'est prélevée sur votre compte bancaire. L'inscription s'active instantanément en mode bancaire sécurisé d'évaluation.
            </p>
          </div>

          {/* Payment Method Selection */}
          <div className="space-y-2">
            <label className="text-xs font-mono font-bold uppercase tracking-wider text-stone-500">
              Mode de confirmation
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSelectedMethod('sandbox')}
                className={`p-3 rounded-xl border text-center transition-all text-xs cursor-pointer ${
                  selectedMethod === 'sandbox'
                    ? 'border-[#123B5D] bg-[#123B5D]/5 font-bold text-[#123B5D]'
                    : 'border-stone-200 hover:bg-stone-50 text-stone-600'
                }`}
              >
                <div className="font-mono text-[10px] text-[#59B83E] font-bold">RECOMMANDÉ</div>
                <span>Validation Directe</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMethod('card')}
                className={`p-3 rounded-xl border text-center transition-all text-xs cursor-pointer ${
                  selectedMethod === 'card'
                    ? 'border-[#123B5D] bg-[#123B5D]/5 font-bold text-[#123B5D]'
                    : 'border-stone-200 hover:bg-stone-50 text-stone-600'
                }`}
              >
                <div className="text-[10px] text-stone-400">Visa / Mastercard</div>
                <span>Carte Bancaire</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMethod('mobile_money')}
                className={`p-3 rounded-xl border text-center transition-all text-xs cursor-pointer ${
                  selectedMethod === 'mobile_money'
                    ? 'border-[#123B5D] bg-[#123B5D]/5 font-bold text-[#123B5D]'
                    : 'border-stone-200 hover:bg-stone-50 text-stone-600'
                }`}
              >
                <div className="text-[10px] text-stone-400">Orange / MTN / Wave</div>
                <span>Mobile Money</span>
              </button>
            </div>
          </div>

          {/* Disclaimer Checkbox */}
          <form onSubmit={handleCheckout} className="space-y-4">
            <label className="flex items-start gap-2.5 text-xs text-stone-600 cursor-pointer select-none">
              <input
                type="checkbox"
                required
                checked={acceptedDisclaimer}
                onChange={(e) => setAcceptedDisclaimer(e.target.checked)}
                className="mt-0.5 rounded border-stone-300 text-[#123B5D] focus:ring-[#123B5D]"
              />
              <span>
                J'accepte d'activer mon inscription à ce programme et d'enregistrer mes preuves d'apprentissage sur mon Passeport de compétences.
              </span>
            </label>

            {/* Submit Action */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs transition-colors cursor-pointer"
              >
                Annuler
              </button>

              <button
                type="submit"
                disabled={!acceptedDisclaimer || isProcessing}
                className="flex-2 py-3 rounded-xl bg-[#123B5D] hover:bg-[#0A2338] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all"
              >
                {isProcessing ? (
                  <>
                    <FaIcon icon={faCircleNotch} spin />
                    <span>Activation en cours...</span>
                  </>
                ) : (
                  <>
                    <FaIcon icon={faLock} className="text-[#59B83E]" />
                    <span>Confirmer l'accès ({priceAmount})</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};
