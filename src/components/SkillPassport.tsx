import React from 'react';
import QRCode from 'react-qr-code';
import { 
  ShieldCheck, 
  MapPin, 
  Briefcase, 
  UserCircle2, 
  Code,
  Trophy,
  Award,
  FileCheck2,
  Users,
  Medal,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { SkillBridgeLogo } from './SkillBridgeLogo';
import { PassportSkill, SkillPassportData } from '../types/platform';

interface SkillPassportProps {
  user: any; // User object from AuthContext
  passport: SkillPassportData | null;
}

export const SkillPassport: React.FC<SkillPassportProps> = ({ user, passport }) => {
  if (!user) return null;

  const getInitials = () => {
    const first = user.first_name || '';
    const last = user.last_name || '';
    return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase() || 'U';
  };

  const getStatusColor = (status: PassportSkill['status']) => {
    switch (status) {
      case 'CERTIFIÉ':
      case 'VÉRIFIÉ': return 'text-[#59B83E]';
      case 'EN COURS DE VÉRIFICATION': return 'text-amber-500';
      case 'NON VÉRIFIÉ': return 'text-stone-400';
      default: return 'text-stone-400';
    }
  };

  const getStatusIcon = (status: PassportSkill['status']) => {
    switch (status) {
      case 'CERTIFIÉ':
      case 'VÉRIFIÉ': return <CheckCircle2 className="w-4 h-4 text-[#59B83E]" />;
      case 'EN COURS DE VÉRIFICATION': return <AlertCircle className="w-4 h-4 text-amber-500" />;
      case 'NON VÉRIFIÉ': return <div className="w-4 h-4 rounded-full border-2 border-stone-300" />;
      default: return <div className="w-4 h-4 rounded-full border-2 border-stone-300" />;
    }
  };

  const sbid = passport?.passportId || `SB-XX-XX-XXXXXX`;
  const verificationUrl = `https://skillbridge.africa/passport/${sbid}`;

  // Mapping level to color
  const getLevelColor = (level: string) => {
    if (level === 'EXPERT' || level === 'AVANCÉ') return 'text-[#59B83E]';
    if (level === 'INTERMÉDIAIRE') return 'text-[#123B5D]';
    return 'text-stone-500';
  };

  return (
    <div className="w-full max-w-[1050px] mx-auto bg-white rounded-3xl overflow-hidden shadow-2xl relative border border-stone-200 font-sans print:shadow-none print:border-none">
      
      {/* Top Right Ribbon */}
      <div className="absolute top-0 right-10 w-16 h-24 bg-[#0A2338] rounded-b-[32px] flex flex-col items-center justify-end pb-5 z-20 shadow-lg">
        <ShieldCheck className="text-[#C8F169] w-8 h-8" />
      </div>

      {/* Background Watermark (Subtle bridge pattern or gradient) */}
      <div className="absolute inset-0 opacity-5 pointer-events-none" style={{
        backgroundImage: 'radial-gradient(circle at 50% 30%, #123B5D 0%, transparent 60%)'
      }} />

      <div className="relative z-10 p-8 sm:p-12 pb-8 flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="w-48">
            <SkillBridgeLogo isDark={false} withTagline={true} />
          </div>
          <div className="pr-20 text-right">
            <h2 className="text-[#123B5D] text-3xl font-black tracking-widest font-heading uppercase">Skill Passport</h2>
            <p className="text-[#59B83E] text-xs font-bold tracking-[0.2em] uppercase mt-1">Verified Skills & Experience</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* LEFT COLUMN: Identity */}
          <div className="lg:col-span-4 flex flex-col relative">
            {/* Dotted border line on left */}
            <div className="absolute -left-6 top-0 bottom-0 w-px border-l-2 border-dotted border-stone-200" />
            
            {/* Photo */}
            <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-2xl overflow-hidden bg-gradient-to-br from-[#123B5D] to-[#59B83E] mb-6 flex items-center justify-center shadow-md">
              {user.avatar_url ? (
                <img src={user.avatar_url} alt="Profile" className="w-full h-full object-cover" crossOrigin="anonymous" />
              ) : (
                <span className="text-5xl font-black text-white">{getInitials()}</span>
              )}
            </div>

            {/* Name */}
            <div className="flex items-start justify-between mb-2">
              <h1 className="text-3xl sm:text-4xl font-black text-[#123B5D] uppercase leading-none font-heading">
                {user.first_name || 'NO'}<br />{user.last_name || 'NAME'}
              </h1>
              {passport?.status === 'ACTIVE' && (
                <div className="bg-[#59B83E] rounded-full p-1.5 ml-2">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
              )}
            </div>

            {/* SBID */}
            <div className="flex items-center gap-2 mb-6">
              <span className="text-[#59B83E] font-bold text-sm tracking-wider">SBID</span>
              <span className="text-stone-700 font-mono text-sm tracking-wider">{sbid}</span>
            </div>

            {/* Title */}
            <div className="flex items-start gap-3 mb-4">
              <div className="w-7 h-7 rounded-full bg-[#123B5D] text-white flex items-center justify-center shrink-0 mt-0.5">
                <Briefcase className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#101820] uppercase">{user.headline || 'MEMBRE SKILLBRIDGE'}</p>
                <p className="text-xs text-stone-500">{user.role === 'mentor' ? 'Mentor' : 'Talent'}</p>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-start gap-3 mb-4">
              <div className="w-7 h-7 rounded-full bg-stone-100 text-[#123B5D] flex items-center justify-center shrink-0 mt-0.5">
                <MapPin className="w-4 h-4" />
              </div>
              <p className="text-sm font-bold text-[#101820] uppercase mt-1">
                {(user.location || user.country) ? `${user.location ? user.location + ', ' : ''}${user.country || ''}` : 'LOCALISATION NON DÉFINIE'}
              </p>
            </div>

            {/* Status */}
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-[#123B5D] text-white flex items-center justify-center shrink-0 mt-0.5">
                <UserCircle2 className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#59B83E] uppercase">{passport?.status === 'ACTIVE' ? 'MEMBRE ACTIF' : (passport?.status || 'NON CRÉÉ')}</p>
                <p className="text-xs text-stone-500">
                  Depuis {new Date(user.created_at || Date.now()).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Skills & Proof */}
          <div className="lg:col-span-8 flex flex-col">
            
            {/* Skills Header */}
            <div className="flex items-center mb-6 bg-stone-50 rounded-r-2xl pr-4 relative">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#59B83E] rounded-full flex items-center justify-center z-10 text-white">
                <Code className="w-5 h-5" />
              </div>
              <div className="ml-5 bg-[#123B5D] text-white text-xs font-bold tracking-widest uppercase py-2 pl-8 pr-6 rounded-r-xl">
                Compétences Clés
              </div>
            </div>

            {/* Skills List */}
            <div className="flex flex-col gap-0 mb-8 min-h-[220px]">
              {passport?.skills && passport.skills.length > 0 ? (
                passport.skills.slice(0, 6).map((skill, index) => (
                  <div key={index} className="flex items-center py-2.5 border-b border-dashed border-stone-200 group">
                    <div className="w-8 h-8 rounded-full bg-[#123B5D] text-white flex items-center justify-center shrink-0 mr-4 font-mono text-xs shadow-sm">
                      {skill.name.substring(0, 2).toUpperCase()}
                    </div>
                    <span className="flex-1 font-bold text-xs sm:text-sm text-[#101820] uppercase tracking-wide truncate">
                      {skill.name}
                    </span>
                    <span className={`w-32 text-right text-[10px] sm:text-xs font-bold uppercase tracking-wider ${getLevelColor(skill.level)} pr-4`}>
                      {skill.level}
                    </span>
                    <span className={`w-32 flex items-center justify-end gap-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider ${getStatusColor(skill.status)}`}>
                      {getStatusIcon(skill.status)} {skill.status}
                    </span>
                  </div>
                ))
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-stone-400 py-8 text-sm">
                  <p>Aucune compétence vérifiée pour le moment.</p>
                </div>
              )}
            </div>

            {/* Proof of Skill and QR Row */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mt-auto">
              
              {/* Proof of Skill Stats */}
              <div className="md:col-span-8 flex flex-col">
                <div className="flex items-center mb-6">
                  <div className="bg-[#123B5D] text-white text-[10px] font-bold tracking-widest uppercase py-1.5 px-4 rounded-full flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#59B83E]" />
                    Proof of Skill
                  </div>
                </div>
                
                <div className="grid grid-cols-5 gap-2">
                  <div className="flex flex-col items-center text-center">
                    <Trophy className="w-6 h-6 text-stone-700 mb-2 stroke-1" />
                    <span className="text-2xl sm:text-3xl font-black text-[#59B83E] leading-none mb-1">{String(passport?.metrics.projects || 0).padStart(2, '0')}</span>
                    <span className="text-[9px] font-bold text-stone-600 uppercase tracking-tight leading-tight">Projets<br/>Réalisés</span>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <Award className="w-6 h-6 text-stone-700 mb-2 stroke-1" />
                    <span className="text-2xl sm:text-3xl font-black text-[#59B83E] leading-none mb-1">{String(passport?.metrics.challenges || 0).padStart(2, '0')}</span>
                    <span className="text-[9px] font-bold text-stone-600 uppercase tracking-tight leading-tight">Challenges<br/>Réussis</span>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <FileCheck2 className="w-6 h-6 text-stone-700 mb-2 stroke-1" />
                    <span className="text-2xl sm:text-3xl font-black text-[#59B83E] leading-none mb-1">{String(passport?.metrics.evaluations || 0).padStart(2, '0')}</span>
                    <span className="text-[9px] font-bold text-stone-600 uppercase tracking-tight leading-tight">Évaluations<br/>Réussies</span>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <Users className="w-6 h-6 text-stone-700 mb-2 stroke-1" />
                    <span className="text-2xl sm:text-3xl font-black text-[#59B83E] leading-none mb-1">{String(passport?.metrics.validations || 0).padStart(2, '0')}</span>
                    <span className="text-[9px] font-bold text-stone-600 uppercase tracking-tight leading-tight">Validations<br/>Mentor</span>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <Medal className="w-6 h-6 text-stone-700 mb-2 stroke-1" />
                    <span className="text-2xl sm:text-3xl font-black text-[#59B83E] leading-none mb-1">{String(passport?.metrics.certifications || 0).padStart(2, '0')}</span>
                    <span className="text-[9px] font-bold text-stone-600 uppercase tracking-tight leading-tight">Certifications<br/>Obtenues</span>
                  </div>
                </div>
              </div>

              {/* QR Code */}
              <div className="md:col-span-4 flex flex-col relative">
                {/* Dotted border line on left of QR */}
                <div className="hidden md:block absolute -left-4 top-0 bottom-0 w-px border-l-2 border-dotted border-stone-200" />
                
                <h4 className="text-[10px] font-bold text-[#101820] tracking-widest uppercase mb-4 text-center md:text-left">
                  Verify Skill Passport
                </h4>
                
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 shrink-0 bg-white p-1.5 rounded-xl border border-[#E2E8E5] shadow-xs flex items-center justify-center">
                    <QRCode value={verificationUrl} size={84} level="Q" className="w-full h-full" />
                  </div>
                  <div className="flex flex-col justify-center gap-2">
                    <p className="text-[8px] sm:text-[9px] text-stone-600 font-bold uppercase leading-snug">
                      Scannez pour vérifier ce passeport et consulter les compétences actualisées.
                    </p>
                    <div className="flex items-center gap-1 text-[#59B83E] bg-[#59B83E]/10 px-2 py-1 rounded w-max">
                      <ShieldCheck className="w-3 h-3 shrink-0" />
                      <span className="text-[8px] font-bold uppercase tracking-wider">Authentifié<br/>Par SkillBridge</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-[#0A192F] text-white px-8 sm:px-12 py-5 grid grid-cols-2 md:grid-cols-4 gap-6 items-center">
        {/* Chip */}
        <div className="flex items-center">
          <svg width="40" height="32" viewBox="0 0 40 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="40" height="32" rx="6" fill="#D4AF37"/>
            <path d="M12 0v32m16-32v32M0 12h40M0 20h40" stroke="#0A192F" strokeWidth="1.5" opacity="0.3"/>
            <rect x="8" y="8" width="24" height="16" rx="2" stroke="#0A192F" strokeWidth="1.5" opacity="0.5"/>
          </svg>
        </div>

        {/* Dates */}
        <div className="flex flex-col gap-1">
          <span className="text-[#D4AF37] text-[9px] font-bold uppercase tracking-widest">Date d'émission</span>
          <span className="text-xs font-mono font-medium">{passport?.issuedAt ? new Date(passport.issuedAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }).toUpperCase() : 'NON ÉMIS'}</span>
        </div>

        {/* Expiration or Signature */}
        <div className="flex flex-col gap-1">
          {passport?.expiresAt ? (
            <>
              <span className="text-[#D4AF37] text-[9px] font-bold uppercase tracking-widest">Date d'expiration</span>
              <span className="text-xs font-mono font-medium">{new Date(passport.expiresAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }).toUpperCase()}</span>
            </>
          ) : (
            <>
              <span className="text-[#D4AF37] text-[9px] font-bold uppercase tracking-widest">Signature Numérique</span>
              {/* Mock signature path */}
              <svg width="80" height="20" viewBox="0 0 100 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mt-1 opacity-80">
                <path d="M2 18C15.5 13.5 22 21 28 17C34 13 41 8 49 14C57 20 62 10 70 12C78 14 85 22 92 16" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </>
          )}
        </div>

        {/* Branding & SBID Bottom Right */}
        <div className="flex flex-col items-end gap-1 text-right">
          <div className="flex items-center gap-1.5 text-white/90">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
            <span className="text-xs font-medium tracking-wide">skillbridge.africa</span>
          </div>
          <span className="text-[9px] text-white/50 font-mono tracking-widest">SBID: {sbid}</span>
        </div>
      </div>
    </div>
  );
};
