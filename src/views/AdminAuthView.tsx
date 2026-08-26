import React, { useState } from 'react';
import { ViewType } from '../types/platform';
import { FaIcon } from '../components/FaIcon';
import { faShieldHalved, faLock, faUser, faArrowRight } from '@fortawesome/free-solid-svg-icons';

export const AdminAuthView: React.FC<{onNavigate: (view: ViewType) => void}> = ({ onNavigate }) => {
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate secure network auth
    setTimeout(() => {
      setLoading(false);
      onNavigate('admin-dashboard');
    }, 1200);
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
            <h1 className="text-2xl font-heading font-bold text-white">Central Auth</h1>
            <p className="text-xs text-stone-400 mt-1 uppercase tracking-widest font-mono">Accès Restreint</p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-mono font-semibold text-stone-400 uppercase">Identifiant Administrateur</label>
            <div className="relative">
              <FaIcon icon={faUser} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500" />
              <input 
                type="text" 
                required
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-stone-700 bg-[#101820] text-white focus:outline-none focus:border-[#59B83E] transition-colors font-mono text-sm"
                placeholder="admin@skillbridge.co"
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
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-stone-700 bg-[#101820] text-white focus:outline-none focus:border-[#59B83E] transition-colors font-mono text-sm tracking-widest"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-3.5 mt-2 rounded-xl bg-[#59B83E] hover:bg-[#4ea834] text-white font-bold transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(89,184,62,0.3)]"
          >
            {loading ? (
              <span className="animate-pulse">Vérification serveur...</span>
            ) : (
              <>
                <span>Autoriser l'accès</span>
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
