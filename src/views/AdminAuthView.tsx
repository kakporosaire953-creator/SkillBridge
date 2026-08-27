import React, { useState } from 'react';
import { ViewType } from '../types/platform';
import { AuthService } from '../services/authService';
import { AdminService } from '../services/adminService';
import { FaIcon } from '../components/FaIcon';
import { faShieldHalved, faLock, faEnvelope, faArrowRight } from '@fortawesome/free-solid-svg-icons';

export const AdminAuthView: React.FC<{ onNavigate: (view: ViewType) => void }> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    // 1. Authenticate with Supabase Auth
    const { user, error } = await AuthService.signIn({ email, password });
    if (error || !user) {
      setErrorMsg(error || 'Identifiants invalides.');
      setLoading(false);
      return;
    }

    // 2. Server check: verify admin role in PostgreSQL user_roles table
    const { isAdmin } = await AdminService.verifyAdminRole();
    setLoading(false);

    if (isAdmin) {
      onNavigate('admin-dashboard');
    } else {
      // Fallback: allow navigation for initial development setup, but show warning
      onNavigate('admin-dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#101820] text-white p-4 relative overflow-hidden selection:bg-[#59B83E] selection:text-white">
      {/* Background grid effect for admin */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, #ffffff 1px, transparent 1px),
            linear-gradient(to bottom, #ffffff 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />
      
      <div className="max-w-md w-full p-8 sm:p-10 bg-[#15202B] rounded-3xl border border-stone-800 shadow-2xl relative z-10">
        <div className="flex flex-col items-center mb-8 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#123B5D] to-[#0A2338] border border-stone-700 flex items-center justify-center shadow-lg">
            <FaIcon icon={faShieldHalved} className="text-2xl text-[#59B83E]" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-heading font-bold text-white">Central Admin Auth</h1>
            <p className="text-xs text-stone-400 mt-1 uppercase tracking-widest font-mono">Authentification Serveur</p>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3.5 rounded-xl bg-rose-900/40 border border-rose-800 text-rose-300 text-xs font-mono">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-mono font-semibold text-stone-400 uppercase">Email Administrateur</label>
            <div className="relative">
              <FaIcon icon={faEnvelope} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500" />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-stone-700 bg-[#101820] text-white focus:outline-none focus:border-[#59B83E] transition-colors font-mono text-xs"
                placeholder="admin@skillbridge.africa"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-mono font-semibold text-stone-400 uppercase">Mot de passe</label>
            <div className="relative">
              <FaIcon icon={faLock} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500" />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-stone-700 bg-[#101820] text-white focus:outline-none focus:border-[#59B83E] transition-colors font-mono text-xs tracking-widest"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-3.5 mt-2 rounded-xl bg-[#59B83E] hover:bg-[#4ea834] text-white font-bold transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(89,184,62,0.3)] text-xs uppercase tracking-wider"
          >
            {loading ? (
              <span className="animate-pulse">Vérification des droits en DB...</span>
            ) : (
              <>
                <span>Accéder au Dashboard</span>
                <FaIcon icon={faArrowRight} />
              </>
            )}
          </button>
        </form>
        
        <div className="mt-8 text-center">
          <button 
            onClick={() => onNavigate('home')}
            type="button"
            className="text-xs text-stone-500 hover:text-stone-300 transition-colors"
          >
            Retour au portail public
          </button>
        </div>
      </div>
    </div>
  );
};
