import React, { useRef, useState } from 'react';
import { UserCertificate } from '../types/learning';
import { FaIcon } from './FaIcon';
import { 
  faCertificate, 
  faShieldHalved, 
  faXmark, 
  faCopy, 
  faCheck,
  faCalendarDay,
  faPrint,
  faArrowUpRightFromSquare
} from '@fortawesome/free-solid-svg-icons';

interface CertificateModalProps {
  certificate: UserCertificate | null;
  isOpen: boolean;
  onClose: () => void;
  onNavigateToVerification?: (certId: string) => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  certificate,
  isOpen,
  onClose,
  onNavigateToVerification
}) => {
  const [copied, setCopied] = useState(false);
  const certRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !certificate) return null;

  const handleCopyLink = () => {
    const url = `${window.location.origin}/#verify?cert=${certificate.id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cert-modal-title"
    >
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-8">
        
        {/* Top Control Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#123B5D] text-white border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#59B83E]/20 flex items-center justify-center text-[#59B83E]">
              <FaIcon icon={faCertificate} className="text-base" />
            </div>
            <div>
              <h2 id="cert-modal-title" className="text-sm font-bold tracking-tight">
                Certificat Officiel SkillBridge
              </h2>
              <span className="text-[10px] font-mono text-[#59B83E] tracking-wider uppercase">
                ID: {certificate.id}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors text-xs flex items-center gap-1.5 px-3 cursor-pointer"
              title="Imprimer ou enregistrer en PDF"
            >
              <FaIcon icon={faPrint} />
              <span className="hidden sm:inline">Imprimer</span>
            </button>

            <button
              type="button"
              onClick={handleCopyLink}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors text-xs flex items-center gap-1.5 px-3 cursor-pointer"
              title="Copier le lien public de vérification"
            >
              <FaIcon icon={copied ? faCheck : faCopy} className={copied ? 'text-[#59B83E]' : ''} />
              <span className="hidden sm:inline">{copied ? 'Copié !' : 'Partager'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              aria-label="Fermer"
            >
              <FaIcon icon={faXmark} className="text-base" />
            </button>
          </div>
        </div>

        {/* Certificate Printable Canvas */}
        <div className="p-6 sm:p-10 bg-[#FAFCFB]" ref={certRef}>
          <div className="relative bg-white border-8 border-double border-[#123B5D]/20 rounded-2xl p-8 sm:p-12 shadow-sm text-center space-y-6 overflow-hidden">
            
            {/* Background Security Watermark Pattern */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none flex items-center justify-center">
              <FaIcon icon={faShieldHalved} className="text-[400px] text-[#123B5D]" />
            </div>

            {/* Header / Seal */}
            <div className="flex flex-col items-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-[#123B5D] flex items-center justify-center text-white shadow-md">
                <FaIcon icon={faShieldHalved} className="text-2xl text-[#59B83E]" />
              </div>
              <div className="font-heading font-black text-xl tracking-tight text-[#123B5D]">
                Skill<span className="text-[#59B83E]">Bridge</span>
              </div>
              <div className="text-[10px] font-mono tracking-widest uppercase text-stone-400 font-bold">
                ACADÉMIE & COMMISSION DE CERTIFICATION SOUVERAINE
              </div>
            </div>

            {/* Main Statement */}
            <div className="space-y-1">
              <p className="text-xs font-mono uppercase tracking-widest text-[#123B5D]/80">
                Certificat d'Excellence & de Maîtrise Technique
              </p>
              <p className="text-xs text-stone-500 italic">
                Ce document atteste formellement que
              </p>
              <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#101820] py-2 border-b border-stone-100 max-w-md mx-auto">
                {certificate.userName}
              </h1>
            </div>

            {/* Achievement details */}
            <div className="space-y-2 max-w-xl mx-auto">
              <p className="text-xs text-stone-600 leading-relaxed">
                a complété avec succès et satisfait aux exigences d'évaluation rigoureuses du programme :
              </p>
              <div className="p-4 rounded-xl bg-[#F5F7F6] border border-[#E2E8E5] text-sm sm:text-base font-bold text-[#123B5D]">
                {certificate.contentTitle}
              </div>
            </div>

            {/* Validated Skills Pills */}
            <div className="space-y-2">
              <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-stone-400">
                Compétences Validées & Auditées
              </div>
              <div className="flex flex-wrap justify-center gap-1.5 max-w-lg mx-auto">
                {certificate.skillsValidated.map((skill) => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 rounded-md bg-white border border-[#E2E8E5] text-[11px] font-mono font-bold text-[#123B5D] shadow-2xs"
                  >
                    ✓ {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Meta & Signatures */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-stone-200 text-left">
              
              {/* Issue Date & Score */}
              <div className="space-y-1 text-xs">
                <div className="text-[10px] font-mono uppercase tracking-wider text-stone-400">
                  Délivré le
                </div>
                <div className="font-bold text-stone-800 flex items-center gap-1">
                  <FaIcon icon={faCalendarDay} className="text-stone-400 text-[10px]" />
                  <span>{certificate.issueDate}</span>
                </div>
                <div className="text-[11px] font-mono text-[#59B83E] font-bold">
                  Score d'examen : {certificate.scorePercent}%
                </div>
              </div>

              {/* Signature / Authority */}
              <div className="space-y-1 text-xs text-center sm:text-left">
                <div className="text-[10px] font-mono uppercase tracking-wider text-stone-400">
                  Autorité Émettrice
                </div>
                <div className="font-bold text-[#123B5D]">
                  {certificate.signatureAuthority}
                </div>
                <div className="text-[10px] text-stone-400">
                  {certificate.issuer}
                </div>
              </div>

              {/* Unique ID & Verification */}
              <div className="space-y-1 text-xs text-right sm:text-right">
                <div className="text-[10px] font-mono uppercase tracking-wider text-stone-400">
                  Identifiant Registre
                </div>
                <div className="font-mono font-bold text-[#123B5D]">
                  {certificate.id}
                </div>
                <div className="text-[9px] font-mono text-stone-400 truncate max-w-[180px] ml-auto">
                  {certificate.credentialFingerprint}
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="px-6 py-4 bg-white border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-stone-500">
            <FaIcon icon={faShieldHalved} className="text-[#59B83E]" />
            <span>Enregistré dans le registre public officiel de SkillBridge.</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {onNavigateToVerification && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onNavigateToVerification(certificate.id);
                }}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#123B5D] text-white text-xs font-bold hover:bg-[#0A2338] transition-colors cursor-pointer"
              >
                <FaIcon icon={faArrowUpRightFromSquare} />
                <span>Tester la vérification publique</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-colors cursor-pointer"
            >
              Fermer
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
