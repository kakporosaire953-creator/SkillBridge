import React, { useState } from 'react';
import { ViewType } from '../types/platform';
import { useLearning } from '../context/LearningContext';
import { UserCertificate } from '../types/learning';
import { CertificateModal } from '../components/CertificateModal';
import { FaIcon } from '../components/FaIcon';
import { 
  faCertificate, 
  faShieldHalved, 
  faCalendarDay, 
  faGraduationCap, 
  faArrowUpRightFromSquare,
  faEye,
  faCircleCheck
} from '@fortawesome/free-solid-svg-icons';

interface CertificatesViewProps {
  onNavigate: (view: ViewType) => void;
  onVerifyCertificate?: (certId: string) => void;
}

export const CertificatesView: React.FC<CertificatesViewProps> = ({
  onNavigate,
  onVerifyCertificate
}) => {
  const { userCertificates } = useLearning();

  const [selectedCert, setSelectedCert] = useState<UserCertificate | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenCertificate = (cert: UserCertificate) => {
    setSelectedCert(cert);
    setIsModalOpen(true);
  };

  return (
    <div className="w-full bg-[#F5F7F6] min-h-screen py-8 sm:py-12 px-4 sm:px-6 lg:px-10">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Title Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#E2E8E5]">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#59B83E]/10 text-[#59B83E] text-xs font-mono font-bold">
              <FaIcon icon={faShieldHalved} />
              <span>Titres Officiels Vérifiables</span>
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#101820] tracking-tight">
              Mes Certifications SkillBridge
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 max-w-2xl">
              Consultez, partagez et téléchargez l'ensemble de vos certificats de compétences officiels émis par l'Académie SkillBridge et les mentors certifiés.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate('verify')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#E2E8E5] bg-white hover:bg-stone-50 text-xs font-bold text-stone-700 shadow-2xs transition-colors cursor-pointer"
            >
              <FaIcon icon={faShieldHalved} className="text-[#59B83E]" />
              <span>Registre Public</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('learn')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#123B5D] hover:bg-[#0A2338] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              <FaIcon icon={faGraduationCap} />
              <span>Catalogue des Formations</span>
            </button>
          </div>
        </div>

        {/* Certificates Grid */}
        {userCertificates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userCertificates.map((cert) => (
              <div
                key={cert.id}
                className="bg-white rounded-3xl border border-[#E2E8E5] p-6 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-6 group"
              >
                {/* Top Badge & ID */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="w-10 h-10 rounded-2xl bg-[#123B5D] text-white flex items-center justify-center shadow-xs">
                      <FaIcon icon={faCertificate} className="text-base text-[#59B83E]" />
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-[#59B83E]/10 text-[#59B83E] font-mono text-[10px] font-bold flex items-center gap-1">
                      <FaIcon icon={faCircleCheck} />
                      <span>{cert.status === 'valid' ? 'Valide & Auditée' : 'Révoquée'}</span>
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-stone-400">
                      {cert.issuer}
                    </span>
                    <h3 className="text-base font-bold text-[#101820] group-hover:text-[#123B5D] transition-colors mt-0.5 line-clamp-2">
                      {cert.contentTitle}
                    </h3>
                  </div>

                  {/* Skills Validated */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {cert.skillsValidated.slice(0, 3).map((s) => (
                      <span
                        key={s}
                        className="px-2 py-0.5 rounded-md bg-[#FAFCFB] border border-stone-200 text-[10px] font-mono text-stone-600"
                      >
                        ✓ {s}
                      </span>
                    ))}
                    {cert.skillsValidated.length > 3 && (
                      <span className="px-1.5 py-0.5 text-[10px] font-mono text-stone-400">
                        +{cert.skillsValidated.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                {/* Bottom Meta & Actions */}
                <div className="space-y-4 pt-4 border-t border-stone-100">
                  <div className="flex items-center justify-between text-xs text-stone-500">
                    <div className="flex items-center gap-1.5">
                      <FaIcon icon={faCalendarDay} className="text-stone-400 text-xs" />
                      <span>{cert.issueDate}</span>
                    </div>
                    <div className="font-mono text-xs font-bold text-[#59B83E]">
                      Score : {cert.scorePercent}%
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenCertificate(cert)}
                      className="flex-1 py-2.5 rounded-xl bg-[#123B5D] hover:bg-[#0A2338] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                    >
                      <FaIcon icon={faEye} />
                      <span>Afficher</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (onVerifyCertificate) {
                          onVerifyCertificate(cert.id);
                        } else {
                          onNavigate('verify');
                        }
                      }}
                      className="p-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-600 transition-colors cursor-pointer"
                      title="Vérifier sur le registre public"
                    >
                      <FaIcon icon={faArrowUpRightFromSquare} />
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-[#E2E8E5] p-10 sm:p-16 text-center space-y-6 max-w-2xl mx-auto shadow-2xs">
            <div className="w-16 h-16 rounded-3xl bg-[#123B5D]/5 text-[#123B5D] flex items-center justify-center mx-auto shadow-xs">
              <FaIcon icon={faCertificate} className="text-2xl text-[#59B83E]" />
            </div>

            <div className="space-y-2">
              <h2 className="text-lg sm:text-xl font-bold text-[#101820]">
                Aucun certificat officiel pour l'instant
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto leading-relaxed">
                Suivez les programmes certifiants officiels SkillBridge ou les cours de mentors pour obtenir vos premiers titres souverains avec identifiant unique vérifiable.
              </p>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => onNavigate('learn')}
                className="px-6 py-3 rounded-2xl bg-[#123B5D] hover:bg-[#0A2338] text-white text-xs font-bold shadow-md transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <FaIcon icon={faGraduationCap} />
                <span>Découvrir les formations officielles</span>
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Certificate Modal */}
      <CertificateModal
        certificate={selectedCert}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCert(null);
        }}
        onNavigateToVerification={onVerifyCertificate}
      />
    </div>
  );
};
