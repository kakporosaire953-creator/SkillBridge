import React, { useState, useRef, useEffect } from 'react';
import { SKILL_STAGE_LABELS, SkillStage, UserSkillItem, UserProjectItem, UserCertificationItem } from '../types/platform';
import { Profile } from '../types';
import { 
  ShieldCheck, 
  ExternalLink, 
  Award, 
  Sparkles, 
  MapPin, 
  Copy,
  Check,
  Camera,
  Layers,
  FileCode2
} from 'lucide-react';

interface OfficialSkillPassportProps {
  profile: Profile;
  isOwner?: boolean;
  onUploadAvatar?: (file: File) => void;
  onNavigateToVerify?: (passportId: string) => void;
}

export const OfficialSkillPassport: React.FC<OfficialSkillPassportProps> = ({
  profile,
  isOwner = false,
  onUploadAvatar,
  onNavigateToVerify
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState<number>(0);
  const [rotateY, setRotateY] = useState<number>(0);
  const [glarePos, setGlarePos] = useState<{ x: number; y: number; opacity: number }>({ x: 50, y: 50, opacity: 0 });
  const [copied, setCopied] = useState<boolean>(false);
  const [isReducedMotion, setIsReducedMotion] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isReducedMotion || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Smooth, gentle tilt: max 6 degrees
    const rX = ((y - centerY) / centerY) * -6;
    const rY = ((x - centerX) / centerX) * 6;
    
    setRotateX(rX);
    setRotateY(rY);
    setGlarePos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.15
    });
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setGlarePos(prev => ({ ...prev, opacity: 0 }));
  };

  const handleCopyVerificationLink = () => {
    const url = `${window.location.origin}/verify/${profile.passport_id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && onUploadAvatar) {
      onUploadAvatar(e.target.files[0]);
    }
  };

  const passportScore = profile.passport_score || 85;

  // Format Machine Readable Zone strings
  const mrzName = `${(profile.last_name || 'TALENT').toUpperCase()}<<${(profile.first_name || 'AFRICA').toUpperCase()}`.padEnd(30, '<').slice(0, 30);
  const mrzDoc = `P<AFR${mrzName}`;
  const mrzId = `${(profile.passport_id || 'SB-2026-00000').replace(/[^a-zA-Z0-9]/g, '')}<<<<<8SEN<<<<<<<<<<<1`.padEnd(36, '<').slice(0, 36);

  return (
    <div className="w-full flex flex-col items-center select-none">
      
      {/* 3D Container Wrapper with perspective */}
      <div 
        className="w-full max-w-4xl py-2 px-1 sm:px-4"
        style={{ perspective: 1200 }}
      >
        <div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            transform: isReducedMotion ? 'none' : `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
            transition: 'transform 0.15s ease-out, box-shadow 0.25s ease',
            transformStyle: 'preserve-3d'
          }}
          className="relative w-full bg-[#101820] text-white rounded-3xl border-2 border-[#123B5D]/80 shadow-2xl overflow-hidden transition-all duration-300"
        >
          
          {/* Subtle Glare Layer */}
          <div 
            className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-30"
            style={{
              background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(200, 241, 105, ${glarePos.opacity}) 0%, rgba(89, 184, 62, ${glarePos.opacity * 0.5}) 25%, transparent 60%)`
            }}
          />

          {/* Architectural Background Watermark Grid */}
          <div className="absolute inset-0 opacity-[0.06] bg-[radial-gradient(#C8F169_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
          
          {/* Top Holographic Security Header */}
          <div className="relative z-10 bg-linear-to-r from-[#123B5D] via-[#102a43] to-[#123B5D] px-6 sm:px-10 py-5 border-b border-[#59B83E]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#59B83E]/20 border border-[#59B83E]/60 flex items-center justify-center text-[#C8F169] shadow-inner">
                <ShieldCheck className="w-5 h-5 text-[#C8F169]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-widest text-[#C8F169]">
                    SKILLBRIDGE SOVEREIGN LEDGER
                  </span>
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#59B83E] animate-pulse" />
                </div>
                <h2 className="font-heading text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
                  <span>OFFICIAL SKILL PASSPORT</span>
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-[10px] font-mono text-stone-400 block uppercase">PASSPORT ID</span>
                <span className="text-xs sm:text-sm font-mono font-bold text-[#C8F169] tracking-wider">
                  {profile.passport_id || 'SB-2026-882910'}
                </span>
              </div>
              <div className="px-3 py-1 rounded-full bg-[#59B83E]/15 border border-[#59B83E]/40 text-[#59B83E] text-[11px] font-mono font-bold">
                ✓ ACTIF
              </div>
            </div>
          </div>

          {/* Card Core Content */}
          <div className="relative z-10 p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Photo, Biometrics, QR Code & Score */}
            <div className="lg:col-span-4 flex flex-col items-center sm:items-start space-y-6">
              
              {/* Profile Photo Area */}
              <div className="relative group">
                <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-2xl bg-stone-900 border-2 border-[#59B83E]/50 overflow-hidden shadow-lg flex items-center justify-center text-white relative">
                  {profile.avatar_url ? (
                    <img 
                      src={profile.avatar_url} 
                      alt={`${profile.first_name} ${profile.last_name}`}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-linear-to-br from-[#123B5D] to-[#0c1f30]">
                      <span className="text-3xl font-extrabold font-heading text-[#C8F169]">
                        {(profile.first_name?.[0] || 'T') + (profile.last_name?.[0] || 'K')}
                      </span>
                      <span className="text-[10px] font-mono text-stone-400 mt-1">PROFIL CERTIFIÉ</span>
                    </div>
                  )}

                  {/* Holographic watermark on photo */}
                  <div className="absolute top-2 right-2 text-[8px] font-mono text-[#C8F169]/80 font-bold px-1 rounded-sm bg-black/40 border border-[#C8F169]/30">
                    SB·AFR
                  </div>

                  {/* Owner photo upload trigger */}
                  {isOwner && (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-xs font-bold gap-1 cursor-pointer"
                      title="Changer ma photo"
                    >
                      <Camera className="w-5 h-5 text-[#C8F169]" />
                      <span>Modifier photo</span>
                    </button>
                  )}
                </div>

                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept="image/*" 
                  className="hidden" 
                />
              </div>

              {/* Verified Score & Index */}
              <div className="w-full bg-[#123B5D]/40 border border-[#123B5D] rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono uppercase text-stone-300 font-bold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#C8F169]" />
                    <span>INDICE PASSPORT</span>
                  </span>
                  <span className="text-xl font-mono font-extrabold text-[#C8F169]">
                    {passportScore}<span className="text-xs text-stone-400 font-normal">/100</span>
                  </span>
                </div>
                <div className="w-full h-2 bg-stone-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-linear-to-r from-[#59B83E] to-[#C8F169] transition-all duration-500"
                    style={{ width: `${passportScore}%` }}
                  />
                </div>
                <span className="text-[10px] text-stone-400 font-mono block">
                  Calculé sur {profile.skills?.length || 0} compétences et {profile.projects?.length || 0} projets
                </span>
              </div>

              {/* Dynamic QR Code Box */}
              <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-3.5">
                <div className="w-14 h-14 bg-white rounded-xl p-1.5 flex items-center justify-center shrink-0 shadow-xs">
                  {/* Stylized QR Code SVG */}
                  <svg viewBox="0 0 100 100" className="w-full h-full text-[#101820]">
                    <rect x="0" y="0" width="30" height="30" fill="currentColor" />
                    <rect x="5" y="5" width="20" height="20" fill="white" />
                    <rect x="10" y="10" width="10" height="10" fill="currentColor" />
                    
                    <rect x="70" y="0" width="30" height="30" fill="currentColor" />
                    <rect x="75" y="5" width="20" height="20" fill="white" />
                    <rect x="80" y="10" width="10" height="10" fill="currentColor" />

                    <rect x="0" y="70" width="30" height="30" fill="currentColor" />
                    <rect x="5" y="75" width="20" height="20" fill="white" />
                    <rect x="10" y="80" width="10" height="10" fill="currentColor" />

                    <rect x="40" y="10" width="10" height="10" fill="currentColor" />
                    <rect x="50" y="20" width="10" height="10" fill="currentColor" />
                    <rect x="35" y="40" width="15" height="15" fill="currentColor" />
                    <rect x="60" y="45" width="10" height="15" fill="currentColor" />
                    <rect x="80" y="60" width="15" height="10" fill="currentColor" />
                    <rect x="40" y="70" width="15" height="15" fill="currentColor" />
                    <rect x="65" y="75" width="15" height="15" fill="currentColor" />
                  </svg>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-[#C8F169] font-bold block uppercase tracking-wider">
                    SCAN VERIFY QR
                  </span>
                  <p className="text-[11px] text-stone-300 font-light leading-tight">
                    Vérification instantanée de l'authenticité sur le registre officiel.
                  </p>
                  {onNavigateToVerify && (
                    <button
                      type="button"
                      onClick={() => onNavigateToVerify(profile.passport_id || '')}
                      className="text-[11px] text-[#59B83E] hover:underline font-mono font-bold flex items-center gap-1 cursor-pointer pt-0.5"
                    >
                      <span>Vérifier en ligne</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

            </div>

            {/* Right Column: Identity, Dynamic Skills Stages, Projects & Proofs */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Holder Name & Headline */}
              <div className="border-b border-white/10 pb-5 space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-mono uppercase text-[#C8F169] tracking-widest font-bold">
                    TITULAIRE DU PASSEPORT
                  </span>
                  <span className="text-xs text-stone-400">·</span>
                  <span className="text-xs text-stone-300 flex items-center gap-1 font-mono">
                    <MapPin className="w-3 h-3 text-[#59B83E]" />
                    {profile.location || 'Dakar'}, {profile.country || 'Sénégal'}
                  </span>
                </div>

                <h1 className="font-heading text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                  {profile.first_name || 'Aïcha'} {profile.last_name || 'Konaté'}
                </h1>

                <p className="text-sm sm:text-base text-stone-300 font-light">
                  {profile.headline || 'Architecte Logiciel & Ingénieur Systèmes'}
                </p>

                {profile.bio && (
                  <p className="text-xs text-stone-400 font-light leading-relaxed pt-1">
                    {profile.bio}
                  </p>
                )}
              </div>

              {/* Verified Dynamic Skills with Stages */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#C8F169] flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5" />
                    <span>COMPÉTENCES & NIVEAUX D'ÉVOLUTION</span>
                  </span>
                  <span className="text-[11px] font-mono text-stone-400">
                    {profile.skills?.length || 0} enregistrée(s)
                  </span>
                </div>

                {profile.skills && profile.skills.length > 0 ? (
                  <div className="space-y-2.5">
                    {profile.skills.map((skill: UserSkillItem) => {
                      const stageKey = (skill.stage || 'declared') as SkillStage;
                      const stageConfig = SKILL_STAGE_LABELS[stageKey] || SKILL_STAGE_LABELS.declared;
                      return (
                        <div 
                          key={skill.id || skill.name}
                          className="bg-white/5 hover:bg-white/[0.08] border border-white/10 rounded-xl p-3 space-y-1.5 transition-colors"
                        >
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-white tracking-wide">
                              {skill.name}
                            </span>
                            <div className="flex items-center gap-2">
                              <span 
                                className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold border"
                                style={{
                                  color: stageConfig.color,
                                  backgroundColor: `${stageConfig.color}15`,
                                  borderColor: `${stageConfig.color}40`
                                }}
                              >
                                {stageConfig.label}
                              </span>
                              <span className="font-mono text-stone-400 text-[11px]">
                                {skill.level}%
                              </span>
                            </div>
                          </div>

                          {/* Skill Level Progress bar */}
                          <div className="w-full h-1 bg-stone-800 rounded-full overflow-hidden">
                            <div 
                              className="h-full rounded-full transition-all duration-300"
                              style={{ 
                                width: `${skill.level}%`,
                                backgroundColor: stageConfig.color 
                              }}
                            />
                          </div>

                          {/* Associated proofs preview */}
                          {skill.proofs && skill.proofs.length > 0 && (
                            <div className="flex items-center gap-1 text-[10px] text-stone-400 font-mono pt-0.5">
                              <FileCode2 className="w-3 h-3 text-[#59B83E]" />
                              <span>Preuve : {skill.proofs[0].title}</span>
                              {skill.proofs[0].verified && (
                                <span className="text-[#59B83E] font-bold">✓ Validée</span>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-4 rounded-xl border border-dashed border-stone-700 bg-white/5 text-center text-xs text-stone-400 font-mono">
                    Aucune compétence enregistrée pour le moment.
                  </div>
                )}
              </div>

              {/* Projects & Tangible Proofs */}
              {profile.projects && profile.projects.length > 0 && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#C8F169] flex items-center gap-1.5">
                      <FileCode2 className="w-3.5 h-3.5" />
                      <span>RÉALISATIONS & PROJETS VÉRIFIÉS</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {profile.projects.map((proj: UserProjectItem) => (
                      <div 
                        key={proj.id || proj.title}
                        className="bg-white/5 border border-white/10 rounded-xl p-3 space-y-1.5 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white truncate max-w-[180px]">
                            {proj.title}
                          </span>
                          <span className="text-[10px] font-mono text-[#59B83E] font-bold">
                            ✓ VÉRIFIÉ
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-400 font-light line-clamp-2 leading-relaxed">
                          {proj.description}
                        </p>
                        {proj.tech && (
                          <div className="flex flex-wrap gap-1 pt-1">
                            {proj.tech.slice(0, 3).map((t: string) => (
                              <span key={t} className="px-1.5 py-0.5 rounded-sm bg-stone-800 text-[10px] font-mono text-stone-300">
                                {t}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Certifications & Mentor Validations */}
              {profile.certifications && profile.certifications.length > 0 && (
                <div className="space-y-2 pt-2">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#C8F169] flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5" />
                    <span>CERTIFICATIONS OFFICIELLES</span>
                  </span>
                  <div className="space-y-2">
                    {profile.certifications.map((c: UserCertificationItem) => (
                      <div key={c.id || c.title} className="flex items-center justify-between text-xs bg-white/5 border border-white/10 rounded-xl p-2.5">
                        <div>
                          <span className="font-bold text-white block">{c.title}</span>
                          <span className="text-[10px] text-stone-400 font-mono">{c.issuer} · {c.date}</span>
                        </div>
                        <span className="text-[10px] font-mono text-[#59B83E] font-bold px-2 py-0.5 rounded-md bg-[#59B83E]/10 border border-[#59B83E]/30">
                          CERTIFIÉ
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

          </div>

          {/* Machine Readable Bottom Security Strip (MRZ) */}
          <div className="relative z-10 bg-black/60 border-t border-white/10 px-6 sm:px-10 py-4 font-mono text-[10px] sm:text-xs text-[#C8F169]/80 tracking-widest leading-loose select-all overflow-x-auto">
            <div className="whitespace-nowrap">{mrzDoc}</div>
            <div className="whitespace-nowrap">{mrzId}</div>
          </div>

        </div>
      </div>

      {/* Passport Action Toolbar */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={handleCopyVerificationLink}
          className="px-5 py-2.5 rounded-xl bg-white hover:bg-stone-50 border border-[#E2E8E5] text-[#123B5D] text-xs font-mono font-bold flex items-center gap-2 shadow-xs transition-all cursor-pointer"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-[#59B83E]" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Lien de vérification copié !' : 'Partager le lien public'}</span>
        </button>

        {onNavigateToVerify && (
          <button
            type="button"
            onClick={() => onNavigateToVerify(profile.passport_id || '')}
            className="px-5 py-2.5 rounded-xl bg-[#123B5D] hover:bg-[#101820] text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-sm"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#C8F169]" />
            <span>Tester la page de vérification</span>
          </button>
        )}
      </div>

    </div>
  );
};
